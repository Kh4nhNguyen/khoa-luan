const mongoose = require("../../common/database")();

const sideBarSchema = mongoose.Schema({
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

const SiderBarModel = mongoose.model("SideBars", sideBarSchema, "sideBars");

module.exports = SiderBarModel;