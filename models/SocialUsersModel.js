const mongoose = require("mongoose")
const crypto = require("crypto")
const validator = require("validator")
const bcrypt = require("bcryptjs")


const SocialUsersSchema = mongoose.Schema(
    {
        gplus_id: {
            type: String,
            required: [true, "social user must have a sub"]
        },
        name: {
            type: String,
            required: [true, "social user must have a name"]
        },
        given_name: {
            type: String,
            required: [true, "social user must have a given name"]
        },
        family_name: {
            type: String,
            required: [true, "social user must have a sub"]
        },
        provider: {
            type: String,
            required: [true, "social user must have a provider"]
        },
        picture: {
            type: String,
            default: "default.jpg"
        },
        isActive: {
            type: Boolean,
            default: true,
            select: false
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            required: [true, "social user must hava an email address"],
            validate: [validator.isEmail, "please profive a valid email address for social user"]
        },
        email_verified: {
            type: Boolean,
            required: [true, "social user email must have a given verification state"]
        },
        locale: {
            type: String,
            required: [true, "social user must have a given locale"]
        },
        role: {
            type: String,
            default: "user",
            enum: ["user", "admin", "guide", "lead-guide"]

        }
    },
    {
        //allows virtual fields to show up in responses
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

//query middleware that extracts only active users
SocialUsersSchema.pre(/^find/, function (next) {

    this.find({ isActive: true })

    next()
})
const SocialUsersModel = mongoose.model("SocialUser", SocialUsersSchema)

module.exports = SocialUsersModel