const CategoryModel = require("../models/category");
const SiderBarModel = require("../models/sidebar");
const SliderModel = require("../models/slides");


module.exports = async (req, res, next) => {
    res.locals.checkExist = false;
    res.locals.sideBars = await SiderBarModel.find();
    res.locals.slides = await SliderModel.find();
    res.locals.categories = await CategoryModel.find();
    res.locals.totalCartItems = req.session.cart.reduce((total, prd) => {
        return total + prd.qty;
    }, 0)
    next();//để thoát khỏi middleware
}
/*res.locals tạo biến toàn cục,lấy ở bất cứ views nào đều tồn tại categories
    để sử dụng bên app,tác dụng khi chạy bất kì /.. nào đó đều tạo 1 tk categories
    sử dụng cho menu site
*/
//gọi CategoryModel vào export 