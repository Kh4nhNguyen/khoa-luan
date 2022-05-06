const mongoose = require("../../common/database")();

const categorySchema = mongoose.Schema({
    description:{
        type:String,
        default:null
        //default thích thì nhập k thì thôi
    },
    title:{
        type:String,
        required:true
        //required bắt nuộc phải nhập giá trị
    },

    //Slug biến tiêu đề thành chuối k dấu có dấu " - ", để làm đường dẫn
    slug:{
        type:String,
        required:true
        //required bắt nuộc phải nhập giá trị
    }
    // createdAt:Date,
    // updatedAt:Date
},{
    timestamps:true,
    //tham số thứ 2 tạo schema tự động tạo 2 trường createdAt và updateAt
})

const CategoryModel = mongoose.model("Category",categorySchema,"categories");

module.exports = CategoryModel;