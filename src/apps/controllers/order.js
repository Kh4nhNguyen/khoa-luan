const OrderModel = require("../models/order");

const paginate = require("../../common/paginate");
const transporter = require("./../../common/transporter");
const ejs = require("ejs");
const path = require("path");

const index = async (req, res) => {
    const hrefPage = 'order?'
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    skip = page * limit - limit;

    const total = await OrderModel.find().countDocuments();
    const totalPages = Math.ceil(total / limit);

    paginate(page, totalPages);

    const products = await OrderModel.find()
        .skip(skip)
        .limit(limit)
        .sort({ "_id": -1 })

    const totalProductComplete = await OrderModel.find({ status_order: "accomplished" }).countDocuments()
    const productsComplete = await OrderModel.find({ status_order: "accomplished" })

    let totalProductsPrice = 0;
    productsComplete.map((product) => {
        product.prd.map(prd => {
            totalProductsPrice += prd.price * prd.qty;
            return totalProductsPrice
        })
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
    const status = body.order_level

    let product = ({
        status_order: status
    })
    await OrderModel.updateOne({ _id: id }, { $set: product });

    if (status !== "order") {
        //send mail
        const prd_order = await OrderModel.find({ _id: id})
        const viewPath = req.app.get("views");

        let totalPrice = 0
        prd_order.map(product => {
            product.prd.map(prd => {
                totalPrice += prd.qty * prd.price
                return totalPrice
            })
        })

        const html = await ejs.renderFile(
            path.join(viewPath, "site/email-order.ejs"),
            {
                name: prd_order[0].name,
                phone: prd_order[0].phone,
                add: prd_order[0].address,
                totalPrice: totalPrice,
                items: prd_order[0].prd,
                status: status
            }
        );
        var subject_status;
        if (status === 'cancel') {
            subject_status = "Thông báo hủy đơn hàng"
        } else if (status === "accomplished") {
            subject_status = "Thư cảm ơn"
        } else {
            subject_status = "Xác nhận đơn hàng từ QK Shop"
        }
        await transporter.sendMail({
            to: prd_order[0].email,
            from: "QK Shop",
            subject: subject_status,
            html,
        });
    }

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

    const totalProductComplete = 0
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
        }
    )
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

const sort = async (req, res) => {
    const status = req.query.status_order
    const pageQuerry = req.query.page

    const hrefPage = `order/sort?status_order=${status}&`

    const page = parseInt(pageQuerry) || 1;

    const limit = 5;
    skip = page * limit - limit;

    const total = await OrderModel.find({
        status_order: status,
    }).countDocuments()

    const products = await OrderModel.find({
        status_order: status,
    }).skip(skip).limit(limit).sort({ "_id": -1 })

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
    search: search,
    sort: sort
}
