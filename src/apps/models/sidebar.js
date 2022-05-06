const mongoose = require("../../common/database")();

const sideBarSchema = mongoose.Schema({
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

const SiderBarModel = mongoose.model("SideBars", sideBarSchema, "sideBars");

module.exports = SiderBarModel;