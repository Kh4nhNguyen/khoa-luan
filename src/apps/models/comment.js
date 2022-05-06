const mongoose = require("../../common/database")();

const commentSchema = mongoose.Schema({
    prd_id:{
        type:mongoose.Types.ObjectId,
        ref:"Products",
    },
    email:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    full_name:{
        type:String,
        required:true
    }
    // createdAt:Date,
    // updatedAt:Date,
},{
    timestamps:true,
    //tham số thứ 2 tạo schema tự động tạo 2 trường createdAt và updateAt
})

const CommentModel = mongoose.model("Comments",commentSchema,"comments");

module.exports = CommentModel;