const mongoose = require("../../common/database")();
const userSchema = mongoose.Schema({
    full_name: {
        type: String,
        default: null,       
        text:true
    },
    email: {
        type: String,
        unique: true,       
    },
    password: {
        type: String,
        default: null       
    },
    role: {
        type: String,
        enum: ["member", "admin"],
        default: "member"       
    },
   
}, {
    timestamps: true,
});

const UserModel = mongoose.model("Users", userSchema, "users");
module.exports = UserModel;