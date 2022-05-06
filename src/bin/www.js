const app = require("../apps/app")

//Gọi thư viện config vừa cài
const config = require("config")

app.listen(port = config.get("app").port, () => {
    /* config.get("key_cap1") chỉ lấy đc con cấp 1
    config.get("app").port - app là cấp 1, port là cấp 2
    "key_cap1" là 1 đối tượng,port là thuộc tính(key)
    gọi thuộc tính thì vào đối tượng chấm thuộc tính
    */
    console.log("Server running on port " + port);
})
//từ h chạy file www(file server không chạy file app)