const express = require("express");
const app = express();
const router = require("../routes/web");
const config = require("config");
const session = require("express-session");

//Gắn đối tượng ejs cho lõi app
app.set("views", config.get("app").views_folder)//dòng này là định nghĩa tới thư mục chứa views bằng từ khóa(đang nằm ở view)
app.set("view engine", config.get("app").view_engine)//gắn đối tượng ejs cho view engine

app.use("/static", express.static(config.get("app").static_folder));//tạo đường dẫn tĩnh /static thay thế "./../src/public" nằm trong config

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
/* cách lấy dữ liệu trả về từ phương thức post 
•	urlencoded: phương thức cho lấy dữ liệu từ Form
•	json: là phương thức cho phép lấy dữ liệu dạng JSON
*/

//config session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: config.get("app").session_key,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: config.get("app").session_secure }
}))

//Cần khai báo sau config session vì cần khởi taih session trước
app.use(require('../apps/middlewares/cart.js'));

//Share
app.use(require("./middlewares/share"));


app.use(router);//câu lệnh để sử dụng nhánh router của app
//app.use(require("../routes/web")) // dùng 1 lần thì có thể require thẳng 
module.exports = app;//từ h chạy file server là www.js - chạy file server rồi file server gọi file apps
