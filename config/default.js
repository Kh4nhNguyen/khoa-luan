module.exports = {
    //config cho file app
    app: {
        port: 3000,
        views_folder: __dirname + "./../src/apps/views",
        /* __dirname là đường dẫn đang ở đây(file config)
        để nhảy ra ngoài và tìm tới file /../src/apps/views
        */
        view_engine: "ejs",
        static_folder: __dirname + "./../src/public",
        session_key: "khanhPro",
        session_secure: false,
        temp: __dirname + "./../temp",
    },
    mail: {
        host: "smtp.gmail.com",
        post: 587,
        secure: false,
        auth: {
            user: "nqkhanh.sphinxsoftware@gmail.com",
            pass: "kiylmteewzsbcfmy",
        }
    },

}