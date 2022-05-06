const UserModel = require('../models/user');
const paginate = require("../../common/paginate");


const indexU = async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    skip = page * limit - limit;

    const total = await UserModel.find().countDocuments();
    const totalPages = Math.ceil(total / limit);

    paginate(page, totalPages);
    const user = await UserModel.find()
        .skip(skip)
        .limit(limit);
    // console.log(user);

    res.render("admin/user/index",
        {
            user: user,
            pages: paginate(page, totalPages),
            page: page,
            totalPages: totalPages,
            skip: skip
        });
}
const createU = (req, res) => {

    res.render("admin/user/add_user")
}
const editU = (req, res) => {

    res.render("admin/user/edit_user")
}
const deleteU = (req, res) => {

    res.render("Welcome to delete users " + text + " page")
}
module.exports = {
    indexUKey: indexU,
    createUKey: createU,
    editUKey: editU,
    deleteUKey: deleteU
}
