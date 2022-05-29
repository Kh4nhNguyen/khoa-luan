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
    // console.log(LatestProducts);
    // console.log(FeaturedProducts);
    res.render("site/index", {
        LatestProducts: LatestProducts,
        FeaturedProducts: FeaturedProducts,
    });
}

const category = async (req, res) => {
    const id = req.params.id;
    const slug = req.params.slug;

    // console.log(slug);
    // console.log(id);
    const category = await CategoryModel.findById({
        _id: id
    })
    const title = category.title;
    const products_1 = await ProductModel.find({
        cat_id: id,
    }).sort({ _id: -1 })
    const totals = products_1.length;//Tong product

    //Phan trang
    const page = parseInt(req.query.page) || 1;//query truy vấn trên link
    const limit = 12;
    const skip = page * limit - limit;
    const total = await ProductModel.find({ cat_id: id }).countDocuments();//đếm số cột
    const totalPage = Math.ceil(total / limit);//làm tròn lên
    // console.log(page);

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

    // if(comments.length === 0){
    //     comments = ({
    //         full_name:"Admin",
    //         createAt: new Date(),
    //         body:"Hiện chưa có bình luận nào cho sản phẩm này"
    //     })
    // }

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

    // res.redirect("/product-"+slug+"."+id);
    // res.redirect("back");
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
    let items = req.session.cart;//middlewares/cart

    let isUpdate = false;
    //Mua lại sản phẩm cũ
    items.map((item) => {
        if (item.id === body.id) {
            isUpdate = true;
            item.qty += parseInt(body.id);
            /*cần ép kiểu do khi dùng form thì tất cả
            dữ liệu gửi đi đều là string nên cần ép kiểu */
        }
        return item;
    })
    /*vong lap map duyet tung phan tu va sua dc du lieu ben trong
    */

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

    // console.log(products);
    res.render("site/cart", {
        products: products,
        totalPrice: 0
    });
}

const updateCart = (req, res) => {
    const items = req.session.cart;
    const products = req.body.products;

    // console.log(items)
    // console.log(products)
    items.map((item) => {
        if (products[item.id]) {
            // console.log(products[item.id]["qty"])
            // console.log(products[item.id])
            item.qty = parseInt(products[item.id]["qty"]);
        }
    })
    /*products[item.id]["qty"] mảng 2 chiều prodcuts[key1][key2] 
    console.log(products) sẽ xuất ra dạng {
        "dãy số id":{qty:"number"}
    }k xd được tên đối tượng key1
    console.log(products[item.id]) so sánh luôn giá trị [key1] với item.id truy cập lấy luôn dư liệu [key2] = { qty: '4' }
    console.log(products[item.id]["qty"]) như bên trên nhưng truy cập vào [key2] với đối tượng "qty" thì chỉ lấy value = 4
    if(products[item.id]) so sánh chéo kiểm tra products[key] so sánh luôn giá trị key với item.id xem có bằng nhau không
    */
    // console.log(items)
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
    const items = req.session.cart;
    const body = req.body;

    const orderCartId = items[0].id
    const orderCart = await ProductModel.findById(orderCartId)

    const prodcut = ({
        prd_id: orderCart._id,
        name: orderCart.name,
        description: orderCart.description,
        thumbnail: orderCart.thumbnail,
        price: orderCart.price,
        status: orderCart.status,
        is_complete: false
    })
    new OrderModel(prodcut).save();

    const viewPath = req.app.get("views");
    /*đường dẫn tuyệt đối tới thư mục views
    path.join(viewPath,"site/email-order.ejs") nối đường dẫn ở tham số 2 vào sau tham số 1
    */
    const html = await ejs.renderFile(
        path.join(viewPath, "site/email-order.ejs"),
        {
            name: body.name,
            phone: body.phone,
            add: body.add,
            totalPrice: 0,
            items,
        }//truyen du lieu sang email-order.ejs
    );

    await transporter.sendMail({
        to: body.mail,
        from: "QK Shop",
        subject: "Xác nhận đơn hàng từ QK Shop",
        html,
    });

    req.session.cart = [];
    res.redirect("/success");
}

const success = (req, res) => {
    res.render("site/success");
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
    order: order
}