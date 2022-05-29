const OrderModel = require("../models/order");//cần require vào vì bên dưới có populate lấy dữ liệu chậm k load lại client đc
const paginate = require("../../common/paginate");
const fs = require("fs");
const path = require("path");
const slug = require("slug");

const index = async (req, res) => {
    //đoẠN Code xử lý phân trang
    const page = parseInt(req.query.page) || 1;//parseInt() ép kiểu về dạng số nguyên
    //Toán tử 3 ngôi page = A||B nếu k có a thì bằng b
    const limit = 10;
    skip = page * limit - limit;

    //ĐOạn code xử lý thanh phân trang phải viết dưới code phân trang vì cần page để sử dụng
    const total = await OrderModel.find().countDocuments();//countDocuments() tổng sô document trong collection products
    //càn tách ra 2 lần Pro..find() bởi vì cần lấy giá trị tính toán count trước nên k lồng xuống bên dưới được
    const totalPages = Math.ceil(total / limit);//Math.ceil hàm làm tròn lên

    paginate(page, totalPages);

    const products = await OrderModel.find()
        .skip(skip)
        .limit(limit)
        .sort({ "_id": -1 })//sắp xếp kết quả trả về theo trường _id,1 là tăng dần,-1 giảm dần
        ;

    const totalProductComplete = await OrderModel.find({ is_complete: true }).countDocuments()
    const productsComplete = await OrderModel.find({ is_complete: true })

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
            totalProductsPrice: totalProductsPrice
        }
    )
}

const complete = async (req, res) => {
    const id = req.params.id;

    const newProductOrder = ({
        is_complete: true
    })

    await OrderModel.updateOne({ _id: id }, { $set: newProductOrder })
    res.redirect("/admin");
}

module.exports = {
    index: index,
    complete: complete
}
