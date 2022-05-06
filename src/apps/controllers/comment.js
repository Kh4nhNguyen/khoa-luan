const CommentModel = require("../models/comment");
const CategoryModel = require("../models/category");
const ProductModel = require("../models/product");

const paginate = require("../../common/paginate");

const comment = async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    skip = page * limit - limit;

    const total = await CommentModel.find().countDocuments();//đếm sô document trong collection
    const totalPages = Math.ceil(total / limit);//Tinh tong so trang

    paginate(page, totalPages);

    const comment = await CommentModel.find()
        .skip(skip)
        .limit(limit)

    res.render("admin/comment/index", {
        comment: comment,
        pages: paginate(page, totalPages),
        totalPages: totalPages,
        page: page,
        skip: skip,
    })
}

const show = async (req, res) => {
    const id = req.params.id;
    const product = await ProductModel.find({ _id: id })

    res.redirect(`/product-${product[0].slug}.${product[0]._id}`)
}

const deleteComment = async (req, res) => {
    const id = req.params.id;
    await CommentModel.deleteOne({ _id: id })

    res.redirect("/admin/comments");
}


module.exports = {
    comment: comment,
    show: show,
    deleteComment: deleteComment
};