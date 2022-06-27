const express = require("express");
const app = express();
const router = require("../routes/web");
const config = require("config");
const session = require("express-session");

app.set("views", config.get("app").views_folder)
app.set("view engine", config.get("app").view_engine)

app.use("/static", express.static(config.get("app").static_folder))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.set('trust proxy', 1)
app.use(session({
  secret: config.get("app").session_key,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: config.get("app").session_secure }
}))

app.use(require('../apps/middlewares/cart.js'));

app.use(require("./middlewares/share"));


app.use(router);
module.exports = app;