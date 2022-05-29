const UserModel = require('../models/user');
const ProductModel = require('../models/product');
const CommentModel = require("../models/comment");
const SiderBarModel = require("../models/sidebar");
const SlidesModel = require("../models/slides");
const OrderModel = require('../models/order');

const dashboard = async (req, res) => {

    const users = await UserModel.find();
    const totalUsers = users.length;
    const products = await ProductModel.find();
    const totalProducts = products.length;
    const comment = await CommentModel.find();
    const totalComment = comment.length;
    const sideBar = await SiderBarModel.find()
    const totalSideBar = sideBar.length;
    const slides = await SlidesModel.find()
    const totalSlides = slides.length;
    const orderCart = await OrderModel.find();
    const totalOrderCart = orderCart.length;

    res.render("admin/index",
        {
            totalUsers: totalUsers,
            totalProducts: totalProducts,
            totalComment: totalComment,
            totalSideBar: totalSideBar,
            totalSlides: totalSlides,
            totalOrderCart:totalOrderCart
        });
}

const logout = (req, res) => {
    req.session.destroy();//Xóa session
    return res.redirect("/admin/login");
}

module.exports = {
    dashboardKey: dashboard,
    logoutKey: logout,
}