const bcrypt = require("bcrypt");

/**
 * 随机数
 * @param { number } length
 */
exports.randomNumber = function (length) {
    let text = "";
    let possible = "123456789";
    for (let i = 0; i < length; i++) {
        let sup = Math.floor(Math.random() * possible.length);
        text += i > 0 && sup === i ? "0" : possible.charAt(sup);
    }
    return Number(text);
};

/**
 * 加密数据
 * @param { number , string } value
 */
exports.encryption = function (value) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(value, 10, function (err, hash) {
            if (err) {
                return reject(err)
            }
            resolve(hash)
        });
    })

};

/**
 * 解密数据
 * @param { number , string  } value 未加密的值
 * @param { string } enValue 已加密的值
 */
exports.decryption = function (value, enValue) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(value, enValue, function (err, same) {
            if (err) {
                return reject(err)
            }
            resolve(same)
        });
    })

};


