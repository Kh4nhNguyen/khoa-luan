const mongoose = require("../../common/database")();

const slidesSchema = mongoose.Schema({
    description: {
        type: String,
        default: null
    },
    thumbnail: {
        type: String,
        default: null
    },
}, {
    timestamps: true,
})

const SlidesBarModel = mongoose.model("Slides", slidesSchema, "slides");

module.exports = SlidesBarModel;