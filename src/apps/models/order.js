const mongoose = require("../../common/database")();

const productSchema = mongoose.Schema({
    cat_id:{
        type:mongoose.Types.ObjectId,
        ref:"Category",
        /*ref: gọi tới bí danh của bảng mà product được liên kiết
        Chẳng hạn Category<bí danh trong model> có Iphone thì trong Product có nhưng sản phẩm iphone nào thì lấy cat_id của Iphone rồi nhóm chung lại
        */
        required:true,
    },
    name:{
        type:String,
        required:true,
        //required:true không được để trống
        text:true,//kích hoạt text search
    },
    slug:{
        type:String,
        required:true,
    },
    description:{//Mô tả sản phẩm
        type:String,
        default:null
    },
    thumbnail:{//ảnh mô tả sp
        type:String,
        default:null
    },
    price:{//giá
        type:Number,
        default:0
    },
    status:{//trạng thái,tình trạng hàng mới hay không
        type:String,
        default:null,
    },
    featured:{//sản phẩm nổi bật
        type:Boolean,
        default:false
    },
    promotion:{//Khuyến mãi
        type:String,
        default:null
    },
    warranty:{//Bảo hành
        type:String,
        default:null
    },
    accessories:{//phụ kiện
        type:String,
        default:null
    },
    is_stock:{//CÒn hàng hay không
        type:Boolean,
        default:true
    },
    
    // createdAt:Date,
    // updateedAt:Date
},{
    timestamps:true,
    //tham số thứ 2 tạo schema tự động tạo 2 trường createdAt và updateAt
})

const OrdertModel = mongoose.model("Orders",productSchema,"orders");

module.exports = OrderModel;