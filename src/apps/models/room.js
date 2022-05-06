const mongoose = require("../../common/database")();

const roomSchema = mongoose.Schema({
    name:{
        default: null
    },
    type:String,
    createdAt:Date,
    updatedAt:Date,
    users:Array
});

const RoomModel = mongoose.model("rooms",roomSchema,"rooms");

module.exports = RoomModel;