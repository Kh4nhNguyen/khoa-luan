/*file test code or các chức năng cần dùng nhiều lần nhưng chưa hiểu*/

const express = require("express");
//KHởi tạo biến app bằng chạy hàm express
const app = express()
const router = express.Router();
/*app.<...>("/...","")
tham số 1 là router, tham số 2 là hành động ở router 
app.get("/", (req, res) => {
    res.send("<h1>Welcome to NodeJs</h1>")
})
get: là phương thức truyền tải thông qua bấm vào liên kết (click chuột)
post: là phương thức truyền tải thông qua bấm vào nút(search box)
*/



//có thể tách router từ app để chỉ chuyên dùng cho router bởi vì app xử lí quá nhiều 
router.get("/", (req, res) => {
    res.send("<h1>Welcome to NodeJs</h1>")
})
router.get("/search", (req, res) => {
    res.send(`
        <form method="post" action="/ketquasearch">
            <input type="text" name="txt" />
            <input type="submit" name="stb" value="Submit" />
        </form>
    `)
})
/* form: sử dụng phương thức truyền dữ liệu khác get
method: phương thức truyền dữ liệu
action:sau khi sử dụng phương thức truyền dữ liệu action hoạt động khi cần chuyển router để trống là mặc định load lại router hiện tại
*/


router.post("/ketquasearch", (req, res) => {
    res.send("Hello!")
})
/* sau khi ấn Submit từ form(search) thì method hoạt động và chuyển sang phương thức đã khai báo từ form và để trả về giá trị cần gọi phương thức đó */


router.get("/users/:userID/products/:proID", (req, res) => {
    console.log(req.params);
    console.log(req.params.userID);
    res.send("<h1>Demo truyen tham so ID</h1>")
})
/* 
cách truyền tham số trong router bằng cách trước đó là dấu :<gía trị>,giá trị có thể thay đổi
params lấy giá trị cần
req.params lấy giá trị tham số truyền vào và trả về là 1 object gồm nhiều gía trị {
    key : value
    userID : value
}
req.params.userID lấy giá trị của tham số tương ứng với :userID
*/


/* tạo đường dẫn link tuyệt đối - bởi vì nodejs chỉ đocj đường dẫn tuyệt đối*/
app.use("/static", express.static(__dirname + "/src/public"))
/* tham số 1 hay cho 1 cái key(router) nào đó, tham số 2 hãy tạo 1 đường dẫn tuyệt đối để khi gọi tham số 1 nó sẽ chạy thẳng đến đường dẫn tuyệt đối đc khai báo trong tham số 2,
__dirname: lấy ra đường dẫn tuyệt đối với đúng tên mình cần
http://localhost:3000/static tương đương với đường dẫn 
http://localhost:3000/src/public <đường dẫn tương đối>
*/

//bơỉ vì router là 1 phần nhỏ của app, nên muốn sử dụng router thì vẫn cần gọi router thông qua app để sử dụng
app.use(router);


//tạo server
app.listen(port = 3000, () => {
    console.log("server running on port: " + port);
})
//ví dụ như port = 3000 ta gán giá trị nhưng không cần khai báo var , let ,.. là vì khi ta đưa tham sô vào 1 hàm(func) không cần khai báo