const mongoose = require("../../common/database")();
const customerSchema = mongoose.Schema({

    full_name: {
        type: String,
        default: null
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        default: null
    },
    address: {
        type: String,
        default: null
    },
    phone: {
        type: Number,
        default: null
    },
    order_id: {
        type: mongoose.Types.ObjectId,
        ref: "Orders",
        required: true,
    },
}, {
    timestamps: true,
});


const CustomerModel = mongoose.model("Customers", customerSchema, "customers");
module.exports = CustomerModel;