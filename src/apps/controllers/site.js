const ProductModel = require("../models/product");
const CategoryModel = require("../models/category");
const CommentModel = require("../models/comment");
const OrderModel = require("../models/order");

const paginate = require("../../common/paginate");
const transporter = require("./../../common/transporter");
const config = require("config");
const ejs = require("ejs");
const path = require("path");


const home = async (req, res) => {
    const LatestProducts = await ProductModel.find({
        is_stock: true,
    }).sort({ _id: -1 }).limit(6);

    const FeaturedProducts = await ProductModel.find({
        is_stock: true,
        featured: true,
    }).limit(6);

    res.render("site/index", {
        LatestProducts: LatestProducts,
        FeaturedProducts: FeaturedProducts,
    });
}

const category = async (req, res) => {
    const id = req.params.id;
    const slug = req.params.slug;
    const filter = ""

    const category = await CategoryModel.findById({
        _id: id
    })
    const title = category.title;
    const products_1 = await ProductModel.find({
        cat_id: id,
    }).sort({ _id: -1 })
    const totals = products_1.length;

    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const skip = page * limit - limit;
    const total = await ProductModel.find({ cat_id: id }).countDocuments();
    const totalPage = Math.ceil(total / limit);

    paginate(page, totalPage);
    const products = await ProductModel.find({
        cat_id: id,
    }).sort({ _id: -1 }).skip(skip).limit(12)

    res.render("site/category", {
        products: products,
        title: title,
        totals: totals,
        category: category,
        pages: paginate(page, totalPage),
        totalPage: totalPage,
        page: page,
        filter: filter
    });
}

const product = async (req, res) => {
    const id = req.params.id;
    const slug = req.params.slug;

    const product = await ProductModel.findById({
        _id: id,
    })

    const comments = await CommentModel.find({
        prd_id: id
    })

    res.render("site/product", {
        product: product,
        comments: comments
    });
}
const comment = async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const slug = req.params.slug;

    const comment = {
        full_name: body.full_name,
        email: body.email,
        body: body.body,
        prd_id: id
    }
    await new CommentModel(comment).save();

    res.redirect(req.path);
}

const search = async (req, res) => {
    const key_word = req.query.key_word || "";
    const filter = {};
    if (key_word) {
        filter.$text = { $search: key_word }
    }
    const products = await ProductModel.find(filter)

    res.render("site/search", {
        products: products,
        key_word: key_word
    });
}

const addToCart = async (req, res) => {
    const body = req.body;
    let items = req.session.cart;

    let isUpdate = false;

    items.map((item) => {
        if (item.id === body.id) {
            isUpdate = true;
            item.qty += parseInt(body.qty);
        }
        return item;
    })

    //Mua thêm sp mới
    if (!isUpdate) {
        const product = await ProductModel.findById(body.id);
        items.push({
            id: product.id,
            name: product.name,
            price: product.price,
            img: product.thumbnail,
            qty: parseInt(body.qty)
        })
    }

    req.session.cart = items;

    res.redirect("/cart");
}

const cart = (req, res) => {
    const products = req.session.cart;
    
    res.render("site/cart", {
        products: products,
        totalPrice: 0
    });
}

const updateCart = (req, res) => {
    const items = req.session.cart;
    const products = req.body.products;

    items.map((item) => {
        if (products[item.id]) {
            item.qty = parseInt(products[item.id]["qty"]);
        }
    })
    req.session.cart = items;
    res.redirect("/cart");
}

const delCart = (req, res) => {
    const id = req.params.id;
    const items = req.session.cart;

    items.map((item, key) => {
        if (item.id === id) {
            items.splice(key, 1);
        }
    })
    req.session.cart = items;
    res.redirect("/cart");
}

const order = async (req, res) => {
    let status = "order"
    const items = req.session.cart;
    const body = req.body;

    const prodcut = ({
        name: body.name,
        phone: body.phone,
        address: body.add,
        email: body.mail,
        prd: items.map(item => item)
    })
    console.log(prodcut)
    new OrderModel(prodcut).save();

    const viewPath = req.app.get("views");

    let totalPrice = 0
    items.map(product => {
        totalPrice += product.qty * product.price
        return totalPrice
    })

    const html = await ejs.renderFile(
        path.join(viewPath, "site/email-order.ejs"),
        {
            name: body.name,
            phone: body.phone,
            add: body.add,
            totalPrice: totalPrice,
            items,
            status: status
        }
    );

    await transporter.sendMail({
        to: body.mail,
        from: "QK Shop",
        subject: "Thông tin đơn hàng từ QK Shop",
        html,
    });

    req.session.cart = [];
    res.redirect("/success");
}

const success = (req, res) => {
    res.render("site/success");
}

const sort = async (req, res) => {
    const id = req.params.id
    const slug = req.params.slug
    const filter = req.params.filter

    if (filter === 'outstanding') {
        const category = await CategoryModel.findById({
            _id: id
        })

        const title = category.title;
        const products_1 = await ProductModel.find({
            cat_id: id, featured: true
        }).sort({ _id: -1 })

        const totals = products_1.length;

        const page = parseInt(req.query.page) || 1;
        const limit = 12;
        const skip = page * limit - limit;
        const total = await ProductModel.find({ cat_id: id }).countDocuments();
        const totalPage = Math.ceil(total / limit);
        

        paginate(page, totalPage);
        const products = await ProductModel.find({
            cat_id: id, featured: true
        }).sort({ _id: -1 }).skip(skip).limit(12)

        res.render("site/category", {
            products: products,
            title: title,
            totals: totals,
            category: category,
            pages: paginate(page, totalPage),
            totalPage: totalPage,
            page: page,
            filter: filter
        });
    } else if (filter === 'cheap') {
        const category = await CategoryModel.findById({
            _id: id
        })

        const title = category.title;
        const products_1 = await ProductModel.find({
            cat_id: id,
        }).sort({ price: 1 })

        const totals = products_1.length;

        const page = parseInt(req.query.page) || 1;
        const limit = 12;
        const skip = page * limit - limit;
        const total = await ProductModel.find({ cat_id: id }).countDocuments();
        const totalPage = Math.ceil(total / limit);
        

        paginate(page, totalPage);
        const products = await ProductModel.find({
            cat_id: id,
        }).sort({ price: 1 }).skip(skip).limit(12)

        res.render("site/category", {
            products: products,
            title: title,
            totals: totals,
            category: category,
            pages: paginate(page, totalPage),
            totalPage: totalPage,
            page: page,
            filter: filter
        });
    } else {
        const category = await CategoryModel.findById({
            _id: id
        })

        const title = category.title;
        const products_1 = await ProductModel.find({
            cat_id: id,
        }).sort({ price: -1 })

        const totals = products_1.length;

        const page = parseInt(req.query.page) || 1;
        const limit = 12;
        const skip = page * limit - limit;
        const total = await ProductModel.find({ cat_id: id }).countDocuments();
        const totalPage = Math.ceil(total / limit);
        

        paginate(page, totalPage);
        const products = await ProductModel.find({
            cat_id: id,
        }).sort({ price: -1 }).skip(skip).limit(12)

        res.render("site/category", {
            products: products,
            title: title,
            totals: totals,
            category: category,
            pages: paginate(page, totalPage),
            totalPage: totalPage,
            page: page,
            filter: filter
        });
    }

}

module.exports = {
    home: home,
    category: category,
    product: product,
    search: search,
    cart: cart,
    success: success,
    comment: comment,
    addToCart: addToCart,
    updateCart: updateCart,
    delCart: delCart,
    order: order,
    sort: sort
}