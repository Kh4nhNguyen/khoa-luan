const UserModel = require("../models/user");

//Đăng nhập đăng xuất phân quyền
const login = (req, res) => {
    res.render("admin/login", { data: {} })
}
const postLogin = async (req, res) => {
    const mail = req.body.mail;
    const pass = req.body.pass;
    let error;//biến thay đổi nên khai báo bằng let

    const users = await UserModel.find({ email: mail, password: pass });

    if (mail == "" || pass == "") {
        error = "Thông tin không được để trống!!!"
    } else if (users.length > 0) {
        req.session.mail = mail;//Khởi tạo session
        req.session.pass = pass;

        return res.redirect("/admin");
    } else {
        error = "Tài khoản không hợp lệ"
    }
    res.render("admin/login", { data: { error: error } });
}

module.exports = {
    loginKey: login,
    postLoginKey: postLogin,
}