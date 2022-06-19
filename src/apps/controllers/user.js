const UserModel = require('../models/user');
const paginate = require("../../common/paginate");
const slug = require("slug");

const indexU = async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    skip = page * limit - limit;

    const total = await UserModel.find().countDocuments();
    const totalPages = Math.ceil(total / limit);

    paginate(page, totalPages);
    const user = await UserModel.find()
        .skip(skip)
        .limit(limit);
    // console.log(user);

    res.render("admin/user/index",
        {
            user: user,
            pages: paginate(page, totalPages),
            page: page,
            totalPages: totalPages,
            skip: skip
        });
}
const createU = (req, res) => {
    res.render("admin/user/add_user", {
        data: {}
    })
}

const handleCreate = async (req, res) => {
    const body = req.body
    let error;

    const user = ({
        full_name: body.user_full,
        email: body.user_mail,
        password: body.user_pass,
    })

    const users = await UserModel.find({email:user.email})
    if(users.length>0){
        error = "Email đăng ký đã tồn tại"
    } else if(body.user_pass !== body.user_re_pass){
        error = "Mật khẩu không trùng khớp"
    } else {
        if(body.user_pass.length <6){
            error = "Mật khẩu phải dài hơn 6 kí tự"
        }else{
            error = "Đăng ký thành công"
            res.redirect("/admin/users")
        }        
    }

    new UserModel(user).save()
    res.render("admin/user/add_user", {
        data: {error:error}
    })
}

const deleteU = async (req, res) => {
    const id = req.params.id
   
    await UserModel.deleteOne({_id:id})

    res.redirect("/admin/users");
}

const search = async (req,res) => {
    const key_word = req.query.key_word || ""

    //search
    const filter = {};
    if (key_word) {
        filter.$text = { $search: key_word }
    }
    
    //total
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    skip = page * limit - limit;

    const total = await UserModel.find(filter).countDocuments();
    const totalPages = Math.ceil(total / limit);

    paginate(page, totalPages);
    const user = await UserModel.find(filter)
        .skip(skip)
        .limit(limit);
    // console.log(user);

    res.render("admin/user/index",
        {
            user: user,
            pages: paginate(page, totalPages),
            page: page,
            totalPages: totalPages,
            skip: skip
        });
}

module.exports = {
    search:search,
    index: indexU,
    create: createU,
    delete: deleteU,
    handleCreate:handleCreate
}
