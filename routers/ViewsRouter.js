const express = require("express")

const authController = require("../controllers/authController.js")
const viewsController = require("../controllers/viewsController.js")

const ViewsRouter = express.Router()

ViewsRouter.route("/").get(authController.isLoggedIn, viewsController.getHomePage)
ViewsRouter.route("/test").get(viewsController.getTestPage)
ViewsRouter.route("/offload").get(viewsController.getOffloadingPage)
ViewsRouter.route("/login").get(viewsController.getLoginPage)
ViewsRouter.route("/signup").get(viewsController.getSignupPage)
ViewsRouter.route("/orderpage/:productName").get(viewsController.getOrderPage)
ViewsRouter.route("/forgotpw").get(viewsController.getForgotPasswordPage)
ViewsRouter.route("/resetpw").get(viewsController.getResetPasswordPage)

ViewsRouter.route("/pricing").get(authController.protect, viewsController.getPricingPage)
ViewsRouter.route("/dashboard").get(authController.protect, viewsController.getDashboardPage)
ViewsRouter.route("/subs").get(authController.protect, viewsController.getActiveSubscriptionsPage)
ViewsRouter.route("/myimages").get(authController.protect, viewsController.getSavedImagesPage)
module.exports = ViewsRouter;

