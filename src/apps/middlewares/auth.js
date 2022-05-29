const checkLogin = (req, res, next) => {
    if (req.session.mail && req.session.pass) {
        /*session được khởi tạo từ bên auth controller 
        và đã gán giá trị bên đây chỉ kiểm tra tính tồn tại */
        return res.redirect("/")
    }
    next();
}

const checkAdmin = (req, res, next) => {
    if (!req.session.mail || !req.session.pass) {
        return res.redirect("/admin/login");
    }
    next();
}

module.exports = {
    checkLogin: checkLogin,
    checkAdmin: checkAdmin,
}