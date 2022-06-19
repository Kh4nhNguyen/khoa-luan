//Mô tả cấu trúc bảng user
const mongoose = require("../../common/database")();//Cần () ở cuối vì export là 1 hàm có return đói tượng mongoose để sử dụng không cần khai báo lại đối tượng mongoose

//Sử dụng Schema để mô tả collections user
//Schema là để tạo 1 lớp trong mongoose bằng data của mongodb
const userSchema = mongoose.Schema({
    // Cơ bản không chặt chẽ 
    // full_name:String,
    // email:String,
    // password:String,
    // role:String
    //full_name tên thuộc tính === trường trong data

    //Chặt chẽ lại dữ liệu bằng cách thêm các thuộc tính
    full_name: {
        type: String,
        default: null,
        //Chặt chẽ thì type <kiểu> và có được để trống không
        text:true
    },
    email: {
        type: String,
        unique: true,
        //unique: không được trùng,làm chặt chẽ dữ liệu
        text:true
    },
    password: {
        type: String,
        default: null
        //Chặt chẽ thì type <kiểu> và có được để trống không
    },
    role: {
        type: String,
        enum: ["member", "admin"],
        default: "member"
        //enum là 1 mảng ,quyết định người dùng nhập vào chọn quyền chỉ đc 1 trong 2 của mảng
    },
});

//Biến lớp userSchema thành Model
const UserModel = mongoose.model("Users", userSchema, "users");
/*tham số 1:là bí danh của userSchema khi được mô tả sang model,sau cần chọc vào model của user thì chọc vào thằng này (ref)
THam số 2 : là schema 
Tham số 3 : là collection<bên database> đang được chuyển sang model,
mongoose.model() : đối tượng mongoose có 1 hàm là model, chuyển đổi userSchema sang dạng model,*/
module.exports = UserModel;