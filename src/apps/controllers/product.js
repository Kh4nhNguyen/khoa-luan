const CategoryModel = require("../models/category");//cần require vào vì bên dưới có populate lấy dữ liệu chậm k load lại client đc
const ProductModel = require("../models/product");
const paginate = require("../../common/paginate");
const fs = require("fs");
const path = require("path");
const slug = require("slug");

const indexP = async (req, res) => {
    //đoẠN Code xử lý phân trang
    const page = parseInt(req.query.page) || 1;//parseInt() ép kiểu về dạng số nguyên
    //Toán tử 3 ngôi page = A||B nếu k có a thì bằng b
    const limit = 5;
    skip = page * limit - limit;

    //ĐOạn code xử lý thanh phân trang phải viết dưới code phân trang vì cần page để sử dụng
    const total = await ProductModel.find().countDocuments();//countDocuments() tổng sô document trong collection products
    //càn tách ra 2 lần Pro..find() bởi vì cần lấy giá trị tính toán count trước nên k lồng xuống bên dưới được
    const totalPages = Math.ceil(total / limit);//Math.ceil hàm làm tròn lên

    paginate(page, totalPages);

    const products = await ProductModel.find()
        .populate({ path: "cat_id" })
        .skip(skip)
        .limit(limit)
        .sort({ "_id": -1 })//sắp xếp kết quả trả về theo trường _id,1 là tăng dần,-1 giảm dần
        ;

    res.render("admin/product/index",
        {
            products: products,
            pages: paginate(page, totalPages),
            page: page,
            totalPages: totalPages,
            skip: skip,
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
    //req là lấy dữ liệu lên
    //id lấy ở đường dẫn.

    await ProductModel.deleteOne({ _id: id });

    res.redirect("/admin/products");
}
module.exports = {
    index: indexP,
    create: createP,
    store: store,
    edit: editP,
    delete: deleteP,
    update: updateP
}
