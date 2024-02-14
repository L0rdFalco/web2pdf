const path = require("path")
const express = require("express")
const morgan = require("morgan")
const mongoSanitize = require("express-mongo-sanitize")
const xss = require("xss-clean")
const hpp = require("hpp")
const cookieParser = require("cookie-parser")
const cookieSession = require("cookie-session")
const passport = require("passport")
const passportSetup = require("./helpers/passport-setup.js")

const PurchasesRouter = require("./routers/PurchasesRouter.js")
const UsersRouter = require("./routers/UsersRouter.js")
const ViewsRouter = require("./routers/ViewsRouter.js")

const app = express()

app.set("view engine", "pug")
app.set("views", path.join(__dirname, "views"))

app.use(express.static(path.join(__dirname, "public")))

//global middlware for logging
app.use(morgan("dev"))

//global middleware for data sanitization against nosql query injection
app.use(mongoSanitize())

//global middleware for data sanitization against xss
app.use(xss())


//global middleware for adding body data to request object
//also called BODY PARSER
app.use(express.json({
    limit: "300kb"// limits the size of request data
}))

app.use(express.urlencoded({ extended: true, limit: '10kb' }))

//global middleware for adding cookie data to request object
app.use(cookieParser())

//this comes before passport initialisation
app.use(cookieSession({
    maxAge: 90 * 24 * 60 * 60 * 1000,
    keys: [process.env.PASSPORT_COOKIE_KEY]

}))
//initialise passport 
app.use(passport.initialize())

//use session cookies with passport when authenticating
app.use(passport.session())



app.use((request, response, next) => {
    // console.log("my custom middleware", request.originalUrl, ":", request.body, ":", request.method);
    request.reqTime = Date.now()

    next()
})



app.use("/", ViewsRouter)
app.use("/purchases", PurchasesRouter)
app.use("/users", UsersRouter)

app.all("*", (request, response, next) => {
    //one way of handling errors
    response.status(400).json({
        status: "fail",
        message: `cannot find the path: ${request.originalUrl} on this server`
    })
    next()
})

module.exports = app