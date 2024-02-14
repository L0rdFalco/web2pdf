const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const passport = require("passport")
const { promisify } = require("util")
const UsersModel = require("../models/UsersModel")
const SocialUsersModel = require("../models/SocialUsersModel")

function cookieOptions() {
    let cookieOptions =
    {
        expires: new Date(Date.now() + (process.env.EXP_IN * 24 * 60 * 60 * 1000)),
        secure: false,
        httpOnly: true
    }
    if (process.env.NODE_ENV === "production") cookieOptions.secure = true

    return cookieOptions
}

exports.protect = async (request, response, next) => {
    try {

        let token = null;

        const authHeader = request.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer")) token = authHeader.split(" ")[1]
        else if (request.cookies?.Auth_Cookie) token = request.cookies.Auth_Cookie

        if (!token) return response.status(400).json({ message: "please log in or create an account!" })


        let verifyPromise = new Promise(function (resolve, reject) {
            return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) reject(err)
                else if (decoded) resolve(decoded)
            })
        })


        let decoded = await verifyPromise



        let currentUser = await UsersModel.findById(decoded.id)

        if (!currentUser) currentUser = await SocialUsersModel.findById(request.user.id)

        if (!currentUser) return response.status(400).json({ message: "sorry but user does not exist in db" })

        //4.
        if (currentUser === "manual" && currentUser.passwordChangedAfter(decoded.iat)) return response.status(401).json({ message: "sorry! password mismatch!" })

        //5.
        request.user = currentUser

        response.locals.user = currentUser

        next()

    } catch (error) {
        response.status(400).json({ message: "protect failed" })
    }
}

exports.isLoggedIn = async (request, response, next) => {
    try {
        let token = null;

        const authHeader = request.headers.authrization

        if (authHeader && authHeader.startsWith("Bearer")) token = authHeader.split(" ")[1]
        else if (request.cookies?.Auth_Cookie) token = request.cookies.Auth_Cookie


        if (token) {

            let decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET)


            let currentUser = await UsersModel.findById(decodedToken.id)

            if (!currentUser) next()
            if (currentUser.passwordChangedAfter(decodedToken.iat)) return next()
            response.locals.user = currentUser;

            return next()
        }

        next()


    } catch (error) {
        console.log(error);
        response.status(400).json({ message: "isLoggedIn failed" })
    }
}

exports.restrictTo = (...roles) => {
    return (request, response, next) => {
        try {

            if (!roles.includes(request.user.role)) return response.status(400).json({ message: "inadequate permissions" })

            next()


        } catch (error) {
            console.log("restrictTo failed");
            response.status(400).json({
                message: "restrictTo fail",

            })
        }
    }
}


exports.signup = async (request, response, next) => {
    try {
        /**
         1. extract all required fields from requet.body
         2. use userModel.create to create a user donc in the db
         3. set special fields to null that the dont appear in the response
         4. generate a jwt encoded with the id id the returned user
         5. automatically log in user by returning said JWT in the response   
         */

        const name = request.body.name;
        const email = request.body.email;
        const password = request.body.password;
        const passwordConfirm = request.body.passwordConfirm

        if (!name || !email || !password || !passwordConfirm) return response.status(400).json({ message: "please provide required information!" });


        //1.
        const userData = {
            name: request.body.name,
            email: request.body.email,
            password: request.body.password,
            passwordConfirm: request.body.passwordConfirm
        }

        //2.
        const newUser = await UsersModel.create(userData)

        //3.~
        newUser.password = undefined
        newUser.role = undefined
        newUser.isActive = undefined
        newUser.__v = undefined

        //4.
        let authToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.EXP_IN + "d" })

        //5.

        response.cookie(process.env.COOKIE_NAME, authToken, cookieOptions())

        response.status(200).json({
            message: "signup success",
            token: authToken,
            payload: {
                userData: newUser
            }

        })

    } catch (error) {
        response.status(400).json({ message: "signup failed" })
    }
}

exports.login = async (request, response, next) => {
    try {

        const email = request.body.email;
        const password = request.body.password;

        if (!email || !password) return response.status(400).json({ message: "please provide required information!" });

        const queriedUser = await UsersModel.findOne({ email: email }).select("+password");

        if (!queriedUser) return response.status(400).json({ message: "no user with those credentials" })

        const matches = await queriedUser.doPasswordsMatch(password, queriedUser.password);

        if (!matches) return response.status(400).json({ message: "please enter correct password" });

        let authToken = jwt.sign({ id: queriedUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.EXP_IN + "d" });

        response.cookie(process.env.COOKIE_NAME, authToken, cookieOptions());

        response.status(200).json({
            message: "login success",
            token: authToken,
            payload: {
                userData: queriedUser
            }

        })


    } catch (error) {
        console.log(error);
        response.status(400).json({ message: "login failed" })
    }
}

exports.logout = (request, response, next) => {
    try {

        response.cookie(process.env.COOKIE_NAME, "no_token", {
            expires: new Date(Date.now() + (1 * 1000)),
            secure: false,
            httpOnly: true
        })

        //strips out the important parts in the session cookies sent by passport
        request.logout()

        response.redirect("/offload")


    } catch (error) {
        console.log(error);
        response.status(400).json({ message: "logout failed" })
    }
}

exports.forgotPassword = async (request, response, next) => {
    try {
        console.log("forgotpw body: ", request.body);

        const email = request.body.email
        if (!email) return response.status(400).json({ message: "please enter valid email" })

        const queriedUser = await UsersModel.findOne({ email: email }).select("+password")

        if (!queriedUser) return response.status(400).json({ message: "please enter valid email" });

        //configure nodemailer to send email to the queried users email

    } catch (error) {
        response.status(400).json({ message: "forgotPassword failed" })
    }
}

exports.resetPassword = async (request, response, next) => {
    try {
        console.log("resetpw body: ", request.body);

    } catch (error) {
        response.status(400).json({ message: "resetPassword failed" })
    }
}

exports.updatePassword = (request, response, next) => {
    try {

    } catch (error) {
        response.status(400).json({ message: "updatePassword failed" })
    }
}

////PASSPORT.JS CALLBACKS/////

//this callback pops out the consent screen
exports.gplusAuth = passport.authenticate("google", {
    scope: ["profile", "email"]
})

//first called when a user picks an account as FIRST callback in middleware stack
exports.passportCallback = async function (accessToken, refreshToken, profile, done) {

    try {

        let socialUserDoc = null;

        const socialUserObj = {
            gplus_id: profile._json.sub,
            name: profile._json.name,
            given_name: profile._json.given_name,
            family_name: profile._json.family_name,
            provider: profile.provider,
            picture: profile._json.picture,
            email: profile._json.email,
            email_verified: profile._json.email_verified,
            locale: profile._json.locale,
            metadata: {
            }

        }

        socialUserDoc = await SocialUsersModel.findOne({ gplus_id: profile.id })

        if (!socialUserDoc) socialUserDoc = await SocialUsersModel.create(socialUserObj)

        done(null, socialUserDoc)

    } catch (error) {
        console.log(error);
    }

}

//first called when a user picks an account as SECOND callback in middleware stack
exports.googleCloudWebhookCB = async (request, response, next) => {

    try {

        //sign a jwt and render the dashboard
        const currentUser = request.user

        let authToken = jwt.sign({ id: currentUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.EXP_IN + "d" })

        response.cookie(process.env.COOKIE_NAME, authToken, cookieOptions());
        response.redirect("/dashboard")
    } catch (error) {
        console.log(error);
    }



}

exports.passportSerialiseUserCB = (user, done) => {
    done(null, user.id)
}

//used with browser requests on protected routes
exports.passportDeserialiseUserCB = async (id, done) => {
    try {

        const socialUser = await SocialUsersModel.findById(id)

        if (socialUser) done(null, socialUser)

    } catch (error) {
        console.log(error);
    }

}