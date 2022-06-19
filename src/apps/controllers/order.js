const OrderModel = require("../models/order");//cần require vào vì bên dưới có populate lấy dữ liệu chậm k load lại client đc
const paginate = require("../../common/paginate");
const fs = require("fs");
const path = require("path");
const slug = require("slug");

const index = async (req, res) => {
    const hrefPage = 'order?'
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    skip = page * limit - limit;

    const total = await OrderModel.find().countDocuments();
    const totalPages = Math.ceil(total / limit);

    paginate(page, totalPages);
    console.log(paginate);

    const products = await OrderModel.find()
        .skip(skip)
        .limit(limit)
        .sort({ "_id": -1 })

    const totalProductComplete = await OrderModel.find({ status_order: "accomplished" }).countDocuments()
    const productsComplete = await OrderModel.find({ status_order: "accomplished" })

    let totalProductsPrice = 0;
    productsComplete.map((product) => {
        totalProductsPrice += product.price;

        return totalProductsPrice;
    })

    res.render("admin/orderCart/index",
        {
            products: products,
            pages: paginate(page, totalPages),
            page: page,
            totalPages: totalPages,
            skip: skip,
            totalProductComplete: totalProductComplete,
            totalProductsPrice: totalProductsPrice,
            hrefPage: hrefPage
        }
    )
}

const status = async (req, res) => {
    const id = req.params.id
    const body = req.body

    const product = ({
        status_order: body.order_level
    })

    await OrderModel.updateOne({ _id: id }, { $set: product });

    res.redirect("/admin/order");
}

const search = async (req, res) => {
    const key_word = req.query.key_word || "";
    const pageQuerry = req.query.page

    const hrefPage = `order/search?key_word=${key_word}&`

    const filter = {};
    if (key_word) {
        filter.$text = { $search: key_word }
    }

    const page = parseInt(pageQuerry) || 1;
    const limit = 5;
    skip = page * limit - limit;

    const total = await OrderModel.find(filter).countDocuments();
    const totalPages = Math.ceil(total / limit);

    paginate(page, totalPages);

    const products = await OrderModel.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ "_id": -1 })

    res.render("admin/product/index",
        {
            products: products,
            pages: paginate(page, totalPages),
            page: page,
            totalPages: totalPages,
            skip: skip,
            hrefPage: hrefPage
        });
}

const statistical = async (req, res) => {
    const date_start = req.query.date_start
    const date_end = req.query.date_end
    const status = req.query.status_order
    const pageQuerry = req.query.page

    const hrefPage = `order/statistical?date_start=${date_start}&date_end=${date_end}&status_order=${status}&`

    const start = new Date(date_start).toISOString()
    const end = new Date(new Date(date_end).setHours(23, 59, 59, 999)).toISOString()

    const page = parseInt(pageQuerry) || 1;

    const limit = 5;
    skip = page * limit - limit;
    if (status === 'none') {
        var total = await OrderModel.find({
                createdAt: {
                    $gte: start,
                    $lt: end
                }
            }).countDocuments()

        var products = await OrderModel.find({
            createdAt: {
                $gte: start,
                $lt: end
            }
        }).skip(skip).limit(limit).sort({ "_id": -1 })

    } else {
        var total = await OrderModel.find({
                status_order: status,
                createdAt: {
                    $gte: start,
                    $lt: end
                }
            }).countDocuments()

        var products = await OrderModel.find({
            status_order: status,
            createdAt: {
                $gte: start,
                $lt: end
            }
        }).skip(skip).limit(limit).sort({ "_id": -1 })
    }

    const totalPages = Math.ceil(total / limit);
    paginate(page, totalPages);

    const totalProductComplete = 0;
    let totalProductsPrice = 0;

    res.render("admin/orderCart/index",
        {
            products: products,
            pages: paginate(page, totalPages),
            page: page,
            totalPages: totalPages,
            skip: skip,
            totalProductComplete: totalProductComplete,
            totalProductsPrice: totalProductsPrice,
            hrefPage: hrefPage
        })
}

module.exports = {
    index: index,
    status: status,
    statistical: statistical,
    search: search
}
