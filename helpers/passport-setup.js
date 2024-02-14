const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20")
const authController = require("../controllers/authController.js")

//this values are gotten in google cloud developer console
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/users/googlecloud-webhook"

}, authController.passportCallback))



passport.serializeUser(authController.passportSerialiseUserCB)

passport.deserializeUser(authController.passportDeserialiseUserCB)

