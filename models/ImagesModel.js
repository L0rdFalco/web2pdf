const mongoose = require("mongoose")

const ImagesSchema = mongoose.Schema(
    {

    },
    {
        //allows virtual fields to show up in responses
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

const ImagesModel = mongoose.model("Image", ImagesSchema)

module.exports = ImagesModel