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



// module.exports = () => {
//     mongoose.connect('mongodb+srv://khoa_luan:HuhIl1Jmhrki53J6@cluster0.r6lgc.mongodb.net/?retryWrites=true&w=majority',
//         { useNewUrlParser: true, useNewUrlParser: true, useUnifiedTopology: true });
//     var db = mongoose.connection;
//     //Bắt sự kiện error
//     db.on('error', function (err) {
//         if (err) console.log(err)
//     });
//     //Bắt sự kiện open
//     db.once('open', function () {
//         console.log("Kết nối thành công !");
//     });

//     return mongoose
// }