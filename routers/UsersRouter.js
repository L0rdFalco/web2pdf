const express = require("express")
const passport = require("passport")

const usersController = require("../controllers/usersController.js")
const authController = require("../controllers/authController.js")

const UsersRouter = express.Router();

UsersRouter.route("/gplus-auth").get(authController.gplusAuth)//pops out the consent screen
UsersRouter.route("/googlecloud-webhook").get(passport.authenticate("google"), authController.googleCloudWebhookCB)//called by google when user cchooses an account and appends profile info
UsersRouter.route("/signup").post(authController.signup)
UsersRouter.route("/login").post(authController.login)
UsersRouter.route("/logout").get(authController.protect, authController.logout)
UsersRouter.route("/forgotpw").post(authController.forgotPassword)
UsersRouter.route("/resetpw").post(authController.resetPassword)
UsersRouter.route("/updatepw").post(authController.protect, authController.updatePassword)


module.exports = UsersRouter;