const SiderBarModel = require('../models/sidebar');
const fs = require("fs");
const path = require("path");

const index = async (req, res) => {
    const sideBar = await SiderBarModel.find();

    res.render("admin/sideBar/index", {
        sideBar: sideBar
    })
}

const create = (req, res) => {
    res.render("admin/sideBar/add_sideBar")
}

const store = (req, res) => {
    const body = req.body;
    const file = req.file

    const sidebar = ({
        description: body.description
    })

    if (file) {
        const thumbnail = "sidebars/" + file.originalname;
        sidebar["thumbnail"] = thumbnail;

        fs.renameSync(file.path, path.resolve("src/public/images/", thumbnail));
    }

    new SiderBarModel(sidebar).save();
    res.redirect("/admin/sidebars")
}

const del = async (req, res) => {
    const id = req.params.id;

    await SiderBarModel.deleteOne({ _id: id })
    res.redirect("/admin/sidebars")
}
module.exports = {
    index: index,
    create: create,
    store: store,
    del: del
}