const mongoose = require('mongoose');
const config = require('../config/db.config');
mongoose.connect(config.url);
mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.once('open', () => {
    console.log('连接数据库成功' + db.name)
})

db.on('error', function (error) {
    console.error('Error in MongoDb connection: ' + error);
    mongoose.disconnect();
});

db.on('close', function () {
    console.log('数据库断开，重新连接数据库');
    mongoose.connect(config.url);
});

module.exports = db;
