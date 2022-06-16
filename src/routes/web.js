const express = require("express");
const router = express.Router();

//require controler
const TestController = require("../apps/controllers/test");
const AuthController = require("../apps/controllers/auth");
const DashboardController = require("../apps/controllers/admin");
const ProductController = require("../apps/controllers/product");
const UserController = require("../apps/controllers/user");
const CategoryController = require("../apps/controllers/category");
const SiteController = require("../apps/controllers/site");
const CommentController = require('../apps/controllers/comment');
const SideBarsController = require('../apps/controllers/sideBar')
const SlidesController = require('../apps/controllers/slides')
const OrderController = require('../apps/controllers/order')


//require middleware
const AuthMiddleware = require("../apps/middlewares/auth");
const UploadMiddleware = require("../apps/middlewares/upload");

//test
router.get("/test",
    // (req, res, next) => {
    //     const a = 10;
    //     if (a > 0) {
    //         return res.redirect("/admin/login");
    //     }
    //     next();//Cần đứng sau hàm kiểm tra, nếu đứng trước thì chạy lệnh next luôn.
    // },
    TestController.testKey);
/* TestController = đối tượng mudule.export
    TestController tên ngẫu nhiên tùy ý
    TestController.test gọi tới key test trong mudule.export
*/

router.get("/test2", TestController.testKey2);
router.get("/test3", TestController.testKey3);

//test-upload

const multer = require("multer");
const upload = multer({
    dest: __dirname + "./../../temp",
});// tạo đường dẫn tuyệt đối cần __dirname

router.get("/upload", TestController.formUpload);
router.post("/upload", upload.single("file_upload"), TestController.fileUpload);
/* khi chạy client có form trong TestController.formUpload có input upload name="file_upload"
    tại đây bắt đầu chuyển dữ liệu vừa up từ input có name="file_upload" sang temp với đường dẫn dest: ...
    temp là thư muc tạm thời khi up dữ liệu được chuyển từ form qua để lưu trữ tạm thời chứ k up thẳng lên server
*/

//ex về lấy dữ liệu
router.get("/form", (req, res) => {
    res.send(`
        <form method=post>
            <input type=text name=mail />
            <input type=text name=pass />
            <input type=submit name=sbm value=Submit />
        </form>
    `)
})
router.post("/form", (req, res) => {
    const mail = req.body.mail;
    const pass = req.body.pass;
    res.send(`${mail} + "-" + ${pass}`);
    /* phải có urlencoded thì mới nhận đc dữ liệu từ form bên trên
    req.body là đọc trong body form,dữ liệu cần lấy thì lấy với tên tương ứng
    req.body.name
    */
})

// admin
router.get("/admin/login",
    AuthMiddleware.checkLogin,
    AuthController.loginKey
)

router.post("/admin/login",
    AuthMiddleware.checkLogin,
    AuthController.postLoginKey
)

router.get("/admin/logout",
    AuthMiddleware.checkAdmin,
    DashboardController.logoutKey
)

router.get("/admin",
    AuthMiddleware.checkAdmin,
    DashboardController.dashboardKey,
)

// admin/products
router.get("/admin/products",
    AuthMiddleware.checkAdmin,
    ProductController.index
)

router.get("/admin/products/create",
    AuthMiddleware.checkAdmin,
    ProductController.create
)

router.post("/admin/products/store",
    UploadMiddleware.single("thumbnail"),
    AuthMiddleware.checkAdmin,
    ProductController.store
)
//UploadMiddleware.single("thumbnail"),thumbnail tên của trường upload

router.get("/admin/products/edit/:id",
    AuthMiddleware.checkAdmin,
    ProductController.edit
)

router.post("/admin/products/update/:id",
    UploadMiddleware.single("thumbnail"),
    AuthMiddleware.checkAdmin,
    ProductController.update
)

router.get("/admin/products/delete/:id",
    AuthMiddleware.checkAdmin,
    ProductController.delete
)

//admin/categories
router.get("/admin/categories",
    AuthMiddleware.checkAdmin,
    CategoryController.index)

router.get("/admin/categories/create",
    AuthMiddleware.checkAdmin,
    CategoryController.create
)

router.post("/admin/categories/store",
    AuthMiddleware.checkAdmin,
    CategoryController.store
)

router.post("/admin/categories/update/:id",
    AuthMiddleware.checkAdmin,
    CategoryController.update
)

router.get("/admin/categories/edit/:id",
    AuthMiddleware.checkAdmin,
    CategoryController.edit
)

router.get("/admin/categories/delete/:id",
    AuthMiddleware.checkAdmin,
    CategoryController.delete
)

//admin/users
router.get("/admin/users",
    AuthMiddleware.checkAdmin,
    UserController.index
)

router.get("/admin/users/create",
    AuthMiddleware.checkAdmin,
    UserController.create
)

router.post("/admin/users/store",
    AuthMiddleware.checkAdmin,
    UserController.handleCreate
)

router.get("/admin/users/delete/:id",
    AuthMiddleware.checkAdmin,
    UserController.delete
)

//amdin/comments
router.get("/admin/comments",
    AuthMiddleware.checkAdmin,
    CommentController.comment
)

router.get("/admin/comments/show/:id",
    AuthMiddleware.checkAdmin,
    CommentController.show
)

router.get("/admin/comments/delete/:id",
    AuthMiddleware.checkAdmin,
    CommentController.deleteComment
)

//admin/sideBar
router.get("/admin/sidebars",
    AuthMiddleware.checkAdmin,
    SideBarsController.index
)

router.get("/admin/sidebars/create",
    AuthMiddleware.checkAdmin,
    SideBarsController.create
)

router.post("/admin/sidebars/store",
    UploadMiddleware.single("thumbnail"),
    AuthMiddleware.checkAdmin,
    SideBarsController.store
)

router.get("/admin/sidebars/delete/:id",
    AuthMiddleware.checkAdmin,
    SideBarsController.del
)

//admin/slides
router.get("/admin/slides",
    AuthMiddleware.checkAdmin,
    SlidesController.index
)

router.get("/admin/slides/create",
    AuthMiddleware.checkAdmin,
    SlidesController.create
)

router.post("/admin/slides/store",
    UploadMiddleware.single("thumbnail"),
    AuthMiddleware.checkAdmin,
    SlidesController.store
)

router.get("/admin/slides/delete/:id",
    AuthMiddleware.checkAdmin,
    SlidesController.del
)

////admin/orderCart
router.get("/admin/order",
    AuthMiddleware.checkAdmin,
    OrderController.index
)

router.get("/admin/order/complete/:id",
    AuthMiddleware.checkAdmin,
    OrderController.complete
)

// router.get("/admin/:adminID", (req, res) => {
//     let text = req.params.adminID;
//     console.log(text);
//     res.send("Welcome to " + text + " page")
// })

// router.get("/admin/:adminID/:funcID", (req, res) => {
//     let text = req.params.adminID;
//     console.log(text);
//     res.send("Welcome to " + text + " page")
// })

//routerSite(fontend)
router.get("/", SiteController.home);
router.get("/category-:slug.:id", SiteController.category);
router.get("/product-:slug.:id", SiteController.product);
router.post("/product-:slug.:id", SiteController.comment);
router.get("/search", SiteController.search);
router.get("/cart", SiteController.cart);
router.post("/add-to-cart", SiteController.addToCart);
router.post("/update-cart", SiteController.updateCart);
router.get("/del-cart-:id", SiteController.delCart);
router.post("/order", SiteController.order);
router.get("/success", SiteController.success);
router.get("/sort-:slug-:id-:condision", SiteController.querryCondision)

/*phương thức get là có truyền dữ liệu qua url (vd :id query string...) 
    post bảo mật hơn truyền qua HTTP header
*/

module.exports = router;