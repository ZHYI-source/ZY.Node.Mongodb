const mongoose = require('mongoose')
let UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true,},
    status: {type: Boolean, required: true, default: 1},
    isConfirmed: {type: Boolean, required: true, default: 0},
    confirmOTP: {type: String, required:false},
    otpTries: {type: Number, required:false, default: 0},
}, {
    timestamps: true,
    versionKey: false, // 设置不需要version  _V:0
});
// schema_student
//     .virtual("fullName")
//     .get(function () {
//         return this.name + " " + this.sex;
//     });
module.exports = mongoose.model('User', UserSchema);
