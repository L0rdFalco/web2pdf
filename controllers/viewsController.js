const ProductModel = require("../models/ProductModel.js")
const SubscriptionModel = require("../models/SubscriptionModel.js")

exports.getTestPage = (request, response, next) => {
    try {

        response.status(200).render("test")

    } catch (error) {
        console.log(error);
        response.status(400).json({ message: "getTestPage failed" })
    }

}

exports.getOffloadingPage = (request, response, next) => {
    try {

        response.status(200).render("offloading")

    } catch (error) {
        console.log(error);
        response.status(400).json({ message: "getTestPage failed" })
    }

}
exports.getHomePage = (request, response, next) => {
    try {

        response.status(200).render("home")

    } catch (error) {
        console.log(error);
        response.status(400).json({ message: "getHomePage failed" })
    }

}

exports.getLoginPage = (request, response, next) => {
    try {
        response.status(200).render("login")

    } catch (error) {
        response.status(400).json({ message: "getLoginPage failed" })
    }

}

exports.getSignupPage = (request, response, next) => {
    try {
        response.status(200).render("signup")

    } catch (error) {
        response.status(400).json({ message: "getSingupPage failed" })
    }

}

exports.getPricingPage = (request, response, next) => {
    try {
        response.status(200).render("pricing")

    } catch (error) {
        response.status(400).json({ message: "getPricingPage failed" })
    }

}

exports.getDashboardPage = (request, response, next) => {
    try {
        response.status(200).render("dashboard")


    } catch (error) {
        response.status(400).json({ message: "getDashboardPage failed" })
    }

}

exports.getActiveSubscriptionsPage = async (request, response, next) => {
    try {


        const subscriptionDocs = await SubscriptionModel.find({ user: request.user.id })

        response.status(200).render("subscriptions", {
            data: subscriptionDocs
        }


        )

    } catch (error) {
        response.status(400).json({ message: "getActiveSubscriptionsPage failed" })
    }

}

exports.getSavedImagesPage = (request, response, next) => {
    try {
        response.status(200).render("saved-images")

    } catch (error) {
        response.status(400).json({ message: "getSavedImagesPage failed" })
    }

}

exports.getOrderPage = async (request, response, next) => {
    try {
        const name = request.params.productName;

        const singleProduct = await ProductModel.findOne({ name: name })


        response.status(200).render("orderpage", {
            data: singleProduct
        })

    } catch (error) {
        console.log(error);
        response.status(400).json({ message: "getOrderPage failed" })
    }

}

exports.getForgotPasswordPage = (request, response, next) => {
    try {
        response.status(200).render("forgot-password")

    } catch (error) {
        response.status(400).json({ message: "getProfilePage failed" })
    }

}

exports.getResetPasswordPage = (request, response, next) => {
    try {
        response.status(200).render("reset-password")

    } catch (error) {
        response.status(400).json({ message: "getProfilePage failed" })
    }

}