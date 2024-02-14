const axios = require("axios")
const SubscriptionModel = require("../models/SubscriptionModel.js")
const ProductModel = require("../models/ProductModel.js")

exports.createOrder = async (request, response, next) => {
    try {
        let cOrderRes = null;
        try {
            let baseUrl = null;

            if (process.env.NODE_ENV === "development") {
                baseUrl = process.env.PAYPAL_SANDBOX_BASE_URL

            }
            else if (process.env.NODE_ENV === "production") {
                baseUrl = process.env.PAYPAL_LIVE_BASE_URL
            }


            const productData = await ProductModel.find({ name: request.body.productName })

            const url = `${baseUrl}/v2/checkout/orders`
            const tokenObj = await generateAccessToken()

            cOrderRes = await axios({
                url: url,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tokenObj.access_token}`
                },

                data: JSON.stringify({
                    intent: "CAPTURE",
                    purchase_units: [
                        {
                            amount: {
                                currency_code: "USD",
                                value: `${productData[0].price}`,
                            }
                        }
                    ],

                })

            })

            response.status(200).json({
                message: "createOrder success",
                data: cOrderRes.data
            })

        } catch (error) {
            console.log("createOrder failed");
            response.status(400).json({
                message: "createOrder fail",
                data: cOrderRes.data
            })
        }

    } catch (error) {
        response.status(400).json({ message: "createOrder fail" })
    }
}

exports.capturePayment = async (request, response, next) => {
    try {
        let baseUrl = null;

        if (process.env.NODE_ENV === "development") {
            baseUrl = process.env.PAYPAL_SANDBOX_BASE_URL

        }
        else if (process.env.NODE_ENV === "production") {
            baseUrl = process.env.PAYPAL_LIVE_BASE_URL
        }

        const orderId = request.params.orderID;

        const tokenObj = await generateAccessToken()
        const url = `${baseUrl}/v2/checkout/orders/${orderId}/capture`;

        const cPaymentObj = await axios({
            url: url,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenObj.access_token}`
            }
        })

        if (!cPaymentObj) return response.status(400).json({ message: "could not capture payment. Try again later" })

        //create subscription in db. To be replaced with webhooks later
        const name = request.body.productName
        let endDate = null
        const productData = await ProductModel.find({ name: name })

        Date.prototype.addDays = function (days) {
            let date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        }

        let date = new Date();

        if (name === "basic") {
            endDate = date.addDays(31);

        }
        else if (name === "premium") {
            endDate = date.addDays(186);

        }

        else if (name === "platinum") {
            endDate = date.addDays(365);

        }

        const subscriptionDoc = await SubscriptionModel.create({
            product: productData[0].id,
            user: request.user.id,
            price: productData[0].price,
            paymentCycle: productData[0].paymentCycle,
            paypayCaptureId: cPaymentObj.data.id,
            endDate: endDate

        })

        response.status(200).json({
            message: "capture payment success",
            data: cPaymentObj.data
        })

    } catch (error) {
        console.log(error);
        response.status(400).json({ message: "capturePayment fail" })
    }
}


async function generateAccessToken() {
    try {

        let clientId = null;
        let clientSecret = null;
        let baseUrl = null;

        if (process.env.NODE_ENV === "development") {
            baseUrl = process.env.PAYPAL_SANDBOX_BASE_URL
            clientId = process.env.PAYPAL_SANDBOX_CLIENT_ID
            clientSecret = process.env.PAYPAL_SANDBOX_CLIENT_SECRET
        }
        else if (process.env.NODE_ENV === "production") {
            baseUrl = process.env.PAYPAL_LIVE_BASE_URL
            clientId = process.env.PAYPAL_LIVE_CLIENT_ID
            clientSecret = process.env.PAYPAL_LIVE_CLIENT_SECRET
        }

        const response = await axios({
            url: `${baseUrl}/v1/oauth2/token`,
            method: "POST",
            data: "grant_type=client_credentials",
            auth: {
                username: clientId,
                password: clientSecret
            }
        })

        return response.data
    } catch (error) {
        console.log("generateAccessToken failed");
    }


}