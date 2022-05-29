const mongoose = require("../../common/database")();

const slidesSchema = mongoose.Schema({
    description: {//Mô tả sản phẩm
        type: String,
        default: null
    },
    thumbnail: {//ảnh mô tả sideBar
        type: String,
        default: null
    },
}, {
    timestamps: true,
    //tham số thứ 2 tạo schema tự động tạo 2 trường createdAt và updateAt
})

const SlidesBarModel = mongoose.model("Slides", slidesSchema, "slides");

module.exports = SlidesBarModel;