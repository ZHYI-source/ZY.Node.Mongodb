const mongoose = require('mongoose')
let schema_student = new mongoose.Schema({
    name: String,
    sex: String,
    age: {
        type: Number,
        required: true,
    },

    hobbies: [String],
    email: String,
    address: String,
    isVip: Boolean,
}, {
    timestamps: true,
    versionKey: false, // 设置不需要version  _V:0
});
schema_student
    .virtual("fullName")
    .get(function () {
        return this.name + " " + this.sex;
    });
// 根据表规范创建表
module.exports = mongoose.model('Student', schema_student);
