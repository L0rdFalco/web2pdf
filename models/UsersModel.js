const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");
const bcrypt = require("bcryptjs")

const UsersSchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, "a user must have a name"],
            minLength: [5, "username must be at least 5 characters"],
            maxLength: [15, "username must be at most 55 characters"]
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            required: [true, "user must have an email"],
            validate: [validator.isEmail, "please provide a valid email address"]
        },
        password: {
            type: String,
            required: [true, "you must specify a password for a user"],
            minLength: [15, "password must be at least 15 characters"],
            select: false //prevents password being sent in query
        },
        passwordConfirm: {
            type: String,
            required: [true, "please repeat password"],
            validate: {
                validator: function (el) {
                    return this.password === el
                },
                message: "passwords do not match"
            }
        },
        role: {
            type: String,
            default: "user",
            enum: ["user", "admin", "super-admin"]
        },
        isActive: {
            type: Boolean,
            default: true,
            select: false
        },
        provider: {
            type: String,
            default: "manual"
        },
        passwordChangedAt: Date,
        encrResetToken: String,
        resetTokenExpires: Date,


    },
    {
        //allows virtual fields to show up in responses
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

UsersSchema.pre("save", async function (next) {

    //skip hashing if password isn't being modified e.g when updating user metadata
    if (!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 12)

    this.passwordConfirm = undefined;


    next()

})

//query middleware that extracts only active users
UsersSchema.pre(/^find/, function (next) {

    this.find({ isActive: true })

    next()
})

UsersSchema.methods.doPasswordsMatch = async function (inputtedPW, savedPW) {

    return await bcrypt.compare(inputtedPW, savedPW)
}


UsersSchema.methods.createPasswordResetToken = function () {
    const plainResetToken = crypto.randomBytes(32).toString("hex");
    this.encrResetToken = crypto.createHash("sha256").update(plainResetToken).digest("hex")
    this.resetTokenExpires = Date.now() + 600000

    return plainResetToken
}

//instance method used for verification in protected routes
UsersSchema.methods.passwordChangedAfter = function (tokenIssueDate) {

    //return true if token was issued after password was changed
    if (this.passwordChangedAt) return parseInt(this.passwordChangedAt.getTime() / 1000, 10) > tokenIssueDate

    //returning false means that the password was never changed because the field doesn't exist
    return false;

}


const UsersModel = mongoose.model("User", UsersSchema)

module.exports = UsersModel