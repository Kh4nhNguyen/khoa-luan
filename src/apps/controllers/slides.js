const SlidesrModel = require('../models/slides');
const fs = require("fs");
const path = require("path");

const index = async (req, res) => {
    const slides = await SlidesrModel.find();

    res.render("admin/slides/index", {
        slides: slides
    })
}

const create = (req, res) => {
    res.render("admin/slides/add_slides")
}

const store = (req, res) => {
    const body = req.body;
    const file = req.file

    const sidebar = ({
        description: body.description
    })

    if (file) {
        const thumbnail = "slides/" + file.originalname;
        sidebar["thumbnail"] = thumbnail;

        fs.renameSync(file.path, path.resolve("src/public/images/", thumbnail));
    }

    new SlidesrModel(sidebar).save();
    res.redirect("/admin/slides")
}

const del = async (req, res) => {
    const id = req.params.id;

    await SlidesrModel.deleteOne({ _id: id })
    res.redirect("/admin/slides")
}
module.exports = {
    index: index,
    create: create,
    store: store,
    del: del
}