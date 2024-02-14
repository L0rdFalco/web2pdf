const express = require("express")
const purchasesController = require("../controllers/purchasesController.js")
const authController = require("../controllers/authController.js")

const PurchasesRouter = express.Router()

PurchasesRouter.route("/").post(authController.protect, purchasesController.createOrder)
PurchasesRouter.route("/:orderID/capture/").post(authController.protect, purchasesController.capturePayment)


module.exports = PurchasesRouter