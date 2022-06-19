const mongoose = require("../../common/database")();

const orderSchema = mongoose.Schema({
    prd_id: {
        type: mongoose.Types.ObjectId,
        ref: "Products",
        required: true,
    },
    name: {
        type: String,
        required: true,
        //required:true không được để trống
        text: true,//kích hoạt text search,
    },
    description: {//Mô tả sản phẩm
        type: String,
        default: null
    },
    thumbnail: {//ảnh mô tả sp
        type: String,
        default: null
    },
    price: {//giá
        type: Number,
        default: 0
    },
    status: {//trạng thái,tình trạng hàng mới hay không
        type: String,
        default: null,
    },
    status_order:{
        type:String,
        enum:["order","deliveryConfirmation","transport","accomplished","cancel"],
        default:"order",
    }
    // createdAt:Date,
    // updateedAt:Date
}, {
    timestamps: true,
    //tham số thứ 2 tạo schema tự động tạo 2 trường createdAt và updateAt
})

const OrderModel = mongoose.model("Orders", orderSchema, "orders");

module.exports = OrderModel;