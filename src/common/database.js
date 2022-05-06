const mongoose = require("mongoose");//đối tượng mongoose

module.exports = () => {
    mongoose.connect('mongodb://localhost/vietpro_mongodb', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
    return mongoose;//khai báo để lấy đối tượng mongoose
    //Bới vì chỉ export mỗi kết nối nếu muốn dùng thì cần khai báo lại đối tượng mongoose nên return để k cần khai báo (require) lại
}