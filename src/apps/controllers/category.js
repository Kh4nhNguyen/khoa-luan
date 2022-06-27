const CategoryModel = require("../models/category");
const ProductModel = require("../models/product")
const paginate = require("../../common/paginate");
const slug = require("slug");


const indexC = async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    skip = page * limit - limit;

    const total = await CategoryModel.find().countDocuments();
    const totalPages = Math.ceil(total / limit);

    paginate(page, totalPages);

    const category = await CategoryModel.find()
        .skip(skip)
        .limit(limit);

    res.render("admin/category/index",
        {
            category: category,
            pages: paginate(page, totalPages),
            totalPages: totalPages,
            page: page,
            skip: skip,

        });
}

const createC = (req, res) => {
    res.render("admin/category/add_category")
}

const storeC = (req, res) => {
    const body = req.body;

    const category = ({
        title: body.cat_name,
        slug: slug(body.cat_name)
    })

    new CategoryModel(category).save();

    res.redirect("/admin/categories")
}


const editC = async (req, res) => {
    const id = req.params.id;
    const category = await CategoryModel.findById(id);

    res.render("admin/category/edit_category", {
        category: category,
    })
}

const updateC = async (req, res) => {
    const id = req.params.id;
    const title = req.body.cat_name;

    await CategoryModel.updateOne({ _id: id }, { title: title })
    res.redirect("/admin/categories")
}

const deleteC = async (req, res) => {
    const id = req.params.id;
    const product = await ProductModel.find({ cat_id: id }).countDocuments();

    if (product === 0) {
        await CategoryModel.deleteOne({ _id: id })
    } else {
        return res.render("admin/category/del_category", {
            product: product,
        })
    }

    res.redirect("/admin/categories")
}
module.exports = {
    index: indexC,
    create: createC,
    edit: editC,
    delete: deleteC,
    store: storeC,
    update: updateC,
}
