const CategoryModel = require("../models/category");//cần require vào vì bên dưới có populate lấy dữ liệu chậm k load lại client đc
const ProductModel = require("../models/product");
const paginate = require("../../common/paginate");
const fs = require("fs");
const path = require("path");
const slug = require("slug");

const indexP = async (req, res) => {
    const hrefPage = 'products?'
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    skip = page * limit - limit;

    const total = await ProductModel.find().countDocuments();
    const totalPages = Math.ceil(total / limit);

    paginate(page, totalPages);

    const products = await ProductModel.find()
        .populate({ path: "cat_id" })
        .skip(skip)
        .limit(limit)
        .sort({ "_id": -1 })

    const categories = await CategoryModel.find()
    res.render("admin/product/index",
        {
            products: products,
            pages: paginate(page, totalPages),
            page: page,
            totalPages: totalPages,
            skip: skip,
            categories: categories,
            hrefPage: hrefPage
        });
}

const createP = async (req, res) => {

    const categories = await CategoryModel.find();
    // console.log(categories);

    res.render("admin/product/add_product", {
        categories: categories,
    })
}

const store = (req, res) => {
    /**
    req.body lúc này là của multer chứ k phải của body-parser vì dùng 
    enctype=”multipart/form-data” trong form upload
    khi dùng multer thì k dùng đc body-parser
     */
    const body = req.body//Lấy data ở dạng form<các thành phần trong form>
    const file = req.file//Láy data ở dạng upload<các thành phần file>

    //console.log(body.name);//Tên mình nhập ở form
    //console.log(file.originalname);//Tên file khi nhập
    const product = ({
        name: body.name,
        price: body.price,
        warranty: body.warranty,
        accessories: body.accessories,
        promotion: body.promotion,
        status: body.status,
        cat_id: body.cat_id,
        is_stock: body.is_stock,
        featured: body.featured === "on",
        description: body.description,
        slug: slug(body.name),//Chuyển thành slug<liên quan đến SEO>
        /* thumbnail<img> chưa thêm vào luôn 
        bởi vì chưa chắc đã thêm ảnh nên cần xử lý file */
    })

    if (file) {
        const thumbnail = "products/" + file.originalname;
        product["thumbnail"] = thumbnail;
        /*Thêm 1 đối tượng vào object
        có câu lệnh object["từ khóa"] = giá trị;
                    object.từ khóa = giá trị
        */

        //Di chuyển file
        fs.renameSync(file.path, path.resolve("src/public/images/", thumbnail));
        /* path.resolve nối đường dẫn - đường dẫn tương đối 
            truy nhập từ đưỡng dẫn tạm vào đường dẫn thực
        */
    }

    /*
    const data = ProductModel(product)
    data.save(); */

    new ProductModel(product).save();//Lưu lại dữ liệu
    res.redirect("/admin/products");
}

const editP = async (req, res) => {

    const id = req.params.id;
    const product = await ProductModel.findById(id);
    const categories = await CategoryModel.find();

    console.log(product);
    res.render("admin/product/edit_product", {
        product: product,
        categories: categories,
    })
}

const updateP = async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const file = req.file;

    const product = ({
        name: body.name,
        price: body.price,
        warranty: body.warranty,
        accessories: body.accessories,
        promotion: body.promotion,
        status: body.status,
        cat_id: slug(body.cat_id),
        is_stock: body.is_stock,
        featured: body.featured === "on",
        description: body.description,
        slug: slug(body.name),//Chuyển thành slug<liên quan đến SEO>
        /* thumbnail<img> chưa thêm vào luôn 
        bởi vì chưa chắc đã thêm ảnh nên cần xử lý file */
    })
    if (file) {
        const thumbnail = "products/" + file.originalname;
        product["thumbnail"] = thumbnail;
        /*Thêm 1 đối tượng vào object
        có câu lệnh object["từ khóa"] = giá trị;
        */

        //Di chuyển file
        fs.renameSync(file.path, path.resolve("src/public/images/", thumbnail));
        /* path.resolve nối đường dẫn - đường dẫn tương đối 
            truy nhập từ đưỡng dẫn tạm vào đường dẫn thực
        */
    }
    await ProductModel.updateOne({ _id: id }, { $set: product });
    res.redirect("/admin/products");
}

const deleteP = async (req, res) => {
    const id = req.params.id;

    await ProductModel.deleteOne({ _id: id });

    res.redirect("/admin/products");
}

const search = async (req, res) => {
    const key_word = req.query.key_word || "";
    const pageQuerry = req.query.page
    const hrefPage = `products/search?key_word=${key_word}&`

    const filter = {};
    if (key_word) {
        filter.$text = { $search: key_word }
    }

    const page = parseInt(pageQuerry) || 1

    const limit = 5;
    skip = page * limit - limit;

    const total = await ProductModel.find(filter).countDocuments();
    const totalPages = Math.ceil(total / limit);

    paginate(page, totalPages);

    const products = await ProductModel.find(filter)
        .populate({ path: "cat_id" })
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

const sort = async (req, res) => {
    const cat_id = req.query.category
    const featured = true ? req.query.featured === "true" : false
    const price = parseInt(req.query.price)
    const pageQuerry = req.query.page
    const hrefPage = `products/sort?category=${cat_id}&featured=${featured}&price=${price}&`

    const categories = await CategoryModel.find()
    const page = parseInt(pageQuerry) || 1;
    const limit = 5;
    skip = page * limit - limit;

    if (featured) {
        var total = await ProductModel.find({
            cat_id: cat_id, featured: featured
        }).countDocuments();

        if (price) {
            var products = await ProductModel.find({
                cat_id: cat_id, featured: featured
            }).skip(skip).limit(limit).sort({ price: price })
        } else {
            var products = await ProductModel.find({
                cat_id: cat_id, featured: featured
            }).skip(skip).limit(limit).sort({ "_id": -1 })
        }

    } else {
        var total = await ProductModel.find({
            cat_id: cat_id,
        }).countDocuments();
        if (price) {
            var products = await ProductModel.find({
                cat_id: cat_id
            }).skip(skip).limit(limit).sort({ price: price })
        } else {
            var products = await ProductModel.find({
                cat_id: cat_id
            }).skip(skip).limit(limit).sort({ "_id": -1 })
        }
    }

    const totalPages = Math.ceil(total / limit);
    paginate(page, totalPages);

    res.render("admin/product/index",
        {
            products: products,
            pages: paginate(page, totalPages),
            page: page,
            totalPages: totalPages,
            skip: skip,
            categories: categories,
            hrefPage: hrefPage
        });

}

const statistical = async (req, res) => {
    const date_start = req.query.date_start
    const date_end = req.query.date_end
    const pageQuerry = req.query.page
    const hrefPage = `products/statistical?date_start=${date_start}&date_end=${date_end}&`

    const start = new Date(date_start).toISOString()
    const end = new Date(new Date(date_end).setHours(23, 59, 59, 999)).toISOString()

    const page = parseInt(pageQuerry) || 1;
    const limit = 5;
    skip = page * limit - limit;

    const total = await ProductModel.find({
        createdAt: {
            $gte: start,
            $lt: end
        }
    }).countDocuments();

    const totalPages = Math.ceil(total / limit);

    paginate(page, totalPages);

    const products = await ProductModel.find({
        createdAt: {
            $gte: start,
            $lt: end
        }
    }).skip(skip).limit(limit).sort({ "_id": -1 })

    const categories = await CategoryModel.find()
    res.render("admin/product/index",
        {
            products: products,
            pages: paginate(page, totalPages),
            page: page,
            totalPages: totalPages,
            skip: skip,
            categories: categories,
            hrefPage: hrefPage
        });
}

module.exports = {
    index: indexP,
    create: createP,
    store: store,
    edit: editP,
    delete: deleteP,
    update: updateP,
    search: search,
    sort: sort,
    statistical: statistical
}
