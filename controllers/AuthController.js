const {UserModel} = require('../models')
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken");
const {body, query, validationResult} = require('express-validator');
const authenticate = require('../middlewares/jwt')
const apiResponse = require('../helper/apiResponse')
const mailer = require('../helper/mailer')
const permissions = require('../middlewares/permissions')
const log = require('../utils/utils.logger')
const {randomNumber} = require('../utils/utils.others')

/**
 * TODO:
 *   express-validator : https://express-validator.github.io/docs/
 *   参数校验方法查询（基于validator.js库）: https://github.com/validatorjs/validator.js#Validators
 *   eg:isLength isEmail trim ...
 * */
/******************************************************************************************/



/**
 * User register 用户注册.邮件通知
 * @param {string}  username 用户名
 * @param {string}  password 密码
 * @param {string}  email  邮箱
 * @returns {Object}
 */
exports.register = [
    //必填参数验证
    [
        body("username").isLength({min: 1}).trim().withMessage('昵称不能为空.'),
        body("password").isLength({min: 6}).trim().withMessage('密码不能小于6位.').isInt().withMessage('密码必须为整数.'),
        body('email').isLength({min: 1}).trim().withMessage('邮箱不能为空.').isEmail().normalizeEmail().withMessage('邮箱格式不正确.').custom((value, {req}) => {
            return UserModel.findOne({email: value}).then(user => {
                if (user) {
                    return Promise.reject(`用户名:${user.email}已经注册,请更换其他邮箱.`);
                }
            });
        }),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // console.error('****validationError*****: '+errors.array()[0].msg)
                return apiResponse.validationErrorWithData(res, errors.array()[0].msg);
            } else {
                // 生成4位随机验证码
                let code = randomNumber(4);
                //Save user.
                let newUser = {
                    username: req.body.username,
                    password: req.body.password,
                    email: req.body.email,
                    confirmOTP: code,
                };
                const addInfo = await UserModel.create(newUser)
                if (addInfo) {
                    //发送邮件: 含有验证码、点击确认操作
                    await mailer.send(req.body.email, `恭喜您已注册成功🎈 感谢您的支持！✨验证码：${code}`)
                    return apiResponse.successResponseWithData(res, "注册成功,请注意您的邮箱信息,请进行账号确认.", addInfo);
                }
            }
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }
]


/**
 * User login 登录.
 * @param {string}  username 用户名
 * @param {string}  password 密码
 * @returns {Object}
 */
exports.login = [
    //参数验证
    [
        body("email").isLength({min: 1}).trim().withMessage("邮箱不能为空.").isEmail().normalizeEmail().withMessage("邮箱格式不正确."),
        body("password").isLength({min: 6}).trim().withMessage('密码不能为空且不小于6位.').isInt().withMessage('密码必须为整数.'),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // console.error('****validationError*****: '+errors.array()[0].msg)
                return apiResponse.validationErrorWithData(res, errors.array()[0].msg);
            } else {
                const userWithEmail = await UserModel.findOne({email: req.body.email})
                if (!userWithEmail) return apiResponse.unauthorizedResponse(res, "用户名错误.");
                if (userWithEmail.password !== req.body.password) return apiResponse.unauthorizedResponse(res, "密码错误.");
                if (!userWithEmail.isConfirmed) return apiResponse.unauthorizedResponse(res, "当前账户未验证,请前往验证您的账户.");
                if (!userWithEmail.status) return apiResponse.unauthorizedResponse(res, "当前账户已被禁用,请联系管理员.");

                let userData = {
                    _id: userWithEmail._id,
                    username: userWithEmail.username,
                    email: userWithEmail.email,
                };
                userData.token = 'Bearer ' + jwt.sign(
                    userData,
                    process.env.SIGN_KEY,
                    {
                        expiresIn: 3600 * 24 * 3 // token 3天有效期
                    }
                )
                return apiResponse.successResponseWithData(res, "登录成功.", userData);
            }
        } catch (err) {
            console.log(err);
            return apiResponse.ErrorResponse(res, err);
        }
    }
]


/**
 * User Verify Confirm code 用户账号邮件验证码确认
 * @param {string}  email  邮箱
 * @param {string}  opt    验证码
 * @returns {Object}
 */
exports.verifyConfirm = [
    //必填参数验证
    [
        query("email").isLength({min: 1}).trim().withMessage("邮箱不能为空.").isEmail().normalizeEmail().withMessage("邮箱格式不正确."),
        query("code").isLength({min: 1}).trim().withMessage("验证码不能为空."),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // console.error('****validationError*****: '+errors.array()[0].msg)
                return apiResponse.validationErrorWithData(res, errors.array()[0].msg);
            } else {
                //
                let query = {email: req.query.email};
                const userInfo = await UserModel.findOne(query)
                if (!userInfo) return apiResponse.unauthorizedResponse(res, "邮箱号码不存在.");

                if (userInfo.confirmOTP === req.query.code) {
                    UserModel.findOneAndUpdate(query, {
                        isConfirmed: 1,
                        confirmOTP: null //置空验证码
                    }).catch(err => {
                        return apiResponse.ErrorResponse(res, err);
                    });
                    return apiResponse.successResponse(res, "账户验证成功！可进行登录.");
                } else {
                    // 暂时不做验证码过期处理
                    return apiResponse.unauthorizedResponse(res, "验证码错误");
                }
            }
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }
]


/**
 * Resend Confirm code. 重发验证码
 * @param {string}  email  邮箱
 * @returns {Object}
 */
exports.resendConfirmCode = [
    //必填参数验证
    [query("email").isLength({min: 1}).trim().withMessage("邮箱不能为空.").isEmail().normalizeEmail().withMessage("邮箱格式不正确.")],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // console.error('****validationError*****: '+errors.array()[0].msg)
                return apiResponse.validationErrorWithData(res, errors.array()[0].msg);
            } else {
                //
                let query = {email: req.query.email};
                const userInfo = await UserModel.findOne(query)
                if (!userInfo) return apiResponse.unauthorizedResponse(res, "邮箱号码不存在.");
                if (userInfo.isConfirmed) return apiResponse.unauthorizedResponse(res, "账户已经验证.");

                // 生成新验证码
                let newCode = randomNumber(4);
                // 更新用户验证状态 验证码
                await UserModel.findOneAndUpdate(query, {isConfirmed: 0, confirmOTP: newCode}).catch(err => {
                    return apiResponse.ErrorResponse(res, err);
                })
                // 发送验证码
                await mailer.send(req.query.email, `✨您的验证码：${newCode}`)

                return apiResponse.successResponse(res, "验证码发送成功！.");

            }
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }
]






