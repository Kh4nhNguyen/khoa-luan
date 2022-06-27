const CategoryModel = require("../models/category");
const SiderBarModel = require("../models/sidebar");
const SliderModel = require("../models/slides");


module.exports = async (req, res, next) => {
    res.locals.sideBars = await SiderBarModel.find();
    res.locals.slides = await SliderModel.find();
    res.locals.categories = await CategoryModel.find();
    res.locals.totalCartItems = req.session.cart.reduce((total, prd) => {
        return total + prd.qty;
    }, 0)
    next();
}
