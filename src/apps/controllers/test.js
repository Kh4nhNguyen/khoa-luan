const UserModel = require("../models/user");
const CategoryModel = require("../models/category");
const ProductModel = require("../models/product");
const slug = require("slug");//slug chuyển tất cả thành viết thường k dấu tạo đường dẫn thân thiện cho bên font-end

// const test = (req, res) => {
//     //res.render("test.ejs", { data: { a: 1000 } });
//     /* render cho phep gọi views vào,
//     tham số 1 là "views" bắt buộc ( bởì vì app.set("views",..))tự hiểu không viết vào ),
//     tham số 2 là render ra 1 views và đây là tên của views.ejs,
//     tham số 3 là muốn truyền cái gì đó sang views
//     trong bài ta truyền đối tượng data sang file test
//     res.redirect("/admin/login")
//     chuyển hướng đến router mong muốn */

//     /*UserModel.find({}, (err, docs) => {
//         console.log(docs);
//     })*/

//     /*Thêm data
//     const UserInsert = new UserModel({
//         full_name: "Nguyen QUoc Khanh",
//         email: "nguyen.quoc.khanh.531@gmail.com",
//         password: "alanchou1",
//         role: "admin"
//     }, { versionKey: false })
//     UserInsert.save();//Lưu lại dữ liệu lên Robo3T
//     */

//     /*SỬa data
//     UserModel.updateOne({ _id: "606c60898a02522f28b0a2f4" }, {
//         password: "99999999"
//     }).exec((err, docs) => {
//         console.log(err);
//         console.log(docs);
//     });
//     //exec là phương thức thực thi truy vấn
    

//     const categories = CategoryModel.find({},(err,docs)=>{
//         console.log(docs);
//     })
    
//     const product = ProductModel.find({},(err,docs)=>{
//         console.log(docs);
//     })
    
//     */
//     const product = ProductModel.find().populate({path:"cat_id"}).exec((err,docs)=>{
//         console.log(docs[0].cat_id.title);
//     })

//Thực ra k cần khai báo const product

//     ProductModel.find().populate({path:"cat_id"}).exec((err,docs)=>{
//         console.log(docs[0].cat_id.title);
//     })

//     /*
//     lấy dữ liệu cả của bảng product với cat_id tương ứng của từng đối tượng
//     console.log(docs[0].cat_id.title); lấy về title của cat_id thuộc đối tượng 0
//     */
// }

//Xử lý đồng bộ,khi kết quả cần sử dụng nhiều lần, cần kết quả trong đây thực hiện cho 1 func khác
// const test = async(req,res)=>{
//     const product = await ProductModel.find().populate({path:"cat_id"});
//     console.log(product);
// }

const test =(req,res)=>{
    /* req.session.session_name = value;
    req.session cú pháp mặc định,session_name tên mình đặt,value giá trị mình gán
    req.session.data = "session defined";
    res.send("test")
    const title = "Điện thoại IP giá rẻ !!!";
    console.log(title);
    console.log(slug(title,{lower:true}));
    slug(title) mặc định không lower bằng true */
}


const test2 =(req,res)=>{
    if(req.session.data){
        res.send(req.session.data)
    }else{
        res.send("session not define")
    }
}

const test3 =(req,res)=>{
    req.session.destroy();
}

const fs = require("fs");//module xử lý đọc file
const path = require("path");//module quản lý các đường dẫn

const formUpload = (req,res)=>{
    res.send(`
        <form method="post" enctype="multipart/form-data">
            <input type="file" name="file_upload"/>
            <button type="submit">Upload</button>
        </form>
    `);/*Nếu muốn upload thì phải có enctype="multipart/form-data"
        bởi vì dữ liệu up load file or ảnh là dạng nhị phân or binary
        (dữ liệu tính toán theo dung lương) */
}

const fileUpload = (req,res)=>{
    const file = req.file;
    fs.renameSync(file.path,"src/public/images/products/" + file.originalname);
    /*
    Nhận vào 2 tham số 
    tham số 1 file đang ở đâu 
    tham số 2 file muốn đến đâu 
    file.path là đường dẫn vừa upload lên
    */
    // fs.renameSync(file.path,
    //     path.resolve("src/public/images/products",file.originalname));//truy cập giống cd vào từng cấp,tính từ thư mục gốc
    console.log("file_upload");
}

module.exports = {
    testKey: test,
    testKey2: test2,
    testKey3: test3,
    formUpload:formUpload,
    fileUpload:fileUpload
}