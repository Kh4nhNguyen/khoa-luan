const UserModel = require('../models/user');
const ProductModel = require('../models/product');
const CommentModel = require("../models/comment")

const dashboard = async (req, res) => {

    const users = await UserModel.find();
    const totalUsers = users.length;
    const products = await ProductModel.find();
    const totalProducts = products.length;
    const comment = await CommentModel.find();
    const totalComment = comment.length;
    res.render("admin/index",{totalUsers:totalUsers,totalProducts:totalProducts,totalComment:totalComment});
}

const logout = (req, res) => {
    req.session.destroy();//Xóa session
    return res.redirect("/admin/login");
}

module.exports = {
    dashboardKey: dashboard,
    logoutKey: logout,
}