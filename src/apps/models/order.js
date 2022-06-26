const mongoose = require("../../common/database")();

const orderSchema = mongoose.Schema({
    name: {
        type: String,
        default: null,
        text: true
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    status_order: {
        type: String,
        enum: ["order", "deliveryConfirmation", "transport", "accomplished", "cancel"],
        default: "order",
    },
    qty: {
        type: Number,
        require: true
    },
    prd: [{
        id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        img: {
            type: String,
            required: true,
        },
        qty: {
            type: Number,
            required: true,
        },
    }],

}, {
    timestamps: true,
})

orderSchema.index({ customer_name: 'text' });

const OrderModel = mongoose.model("Orders", orderSchema, "orders");

module.exports = OrderModel;