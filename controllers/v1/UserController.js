const mongoose = require('mongoose')
const {body, validationResult} = require('express-validator');
const {UserModel} = require('../../models/v1')
const authenticate = require('../../middlewares/jwt')
const apiResponse = require('../../utils/utils.apiResponse')
const permissions = require('../../middlewares/permissions')

/**
 * User list.
 *
 * @returns {Object}
 */
exports.userlist = [
    authenticate,
    permissions,
    async (req, res) => {
        // console.log(req.auth)
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array())

            let query = {
                current: 1,
                pageSize: 20,
                params: {},
            }
            let result = await UserModel.find(query.params).skip((Number(query.current) - 1) * Number(query.pageSize)).limit(Number(query.pageSize)).sort('-id')
            let total = await UserModel.find({}).count()
            return apiResponse.successResponseWithData(res, "Success.", result.length > 0 ? {
                result,
                current: 1,
                pageSize: 20,
                total
            } : {result: [], total});
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }]

/**
 * User Create. 提供给超级管理员添加用户的接口-可无需注册 直接登录
 *
 * @returns {Object}
 */
exports.userCreate = [
    authenticate,
    permissions,
    //必填参数验证
    [
        body("username").isLength({min: 1}).trim().withMessage('昵称不能为空.'),
        body("password").isLength({min: 6}).trim().withMessage('密码不能小于6位.').isInt().withMessage('密码必须为整数.'),
        body('email').isLength({min: 1}).trim().withMessage('邮箱不能为空.').isEmail().normalizeEmail().withMessage('邮箱格式不正确.').custom((value, {req}) => {
            return UserModel.findOne({email: value}).then(user => {
                if (user) {
                    return Promise.reject(`邮箱:${user.email}已被注册,请更换其他邮箱或前往登录.`);
                }
            });
        }),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array()[0].msg);

            //Save user.
            let newUser = {
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                isConfirmed: true, // 默认已进行校验
            };
            await UserModel.create(newUser)
            delete newUser.password //不将密码响应出去
            return apiResponse.successResponseWithData(res, "添加用户成功.", newUser);
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }
]

/**
 * User Delete.
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.userDelete = [
    authenticate,
    permissions,
    async (req, res) => {

        if (!mongoose.Types.ObjectId.isValid(req.body.id)) return apiResponse.validationErrorWithData(res, "Invalid Error.", "参数id错误");

        try {
            UserModel.findByIdAndDelete(req.body.id).then((user) => {
                if (!user) {
                    return apiResponse.notFoundResponse(res, '该用户不存在或已被删除');
                }
                apiResponse.successResponse(res, '删除用户成功')
            })
        } catch (err) {
            console.log(err)
            return apiResponse.ErrorResponse(res, err);
        }
    }

]

/**
 * User Update.
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.userUpdate = [
    authenticate,
    permissions,
    [
        body("username").isLength({min: 1}).trim().withMessage('昵称不能为空.'),
        body("password").isLength({min: 6}).trim().withMessage('密码不能小于6位.').isInt().withMessage('密码必须为整数.'),
        body('email').isLength({min: 1}).trim().withMessage('邮箱不能为空.').isEmail().normalizeEmail().withMessage('邮箱格式不正确.'),
    ],
    async (req, res) => {
        if (!mongoose.Types.ObjectId.isValid(req.body.id)) return apiResponse.validationErrorWithData(res, "Invalid Error.", "参数id错误");

        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array()[0].msg);

            const userInfo = await UserModel.findById(req.body.id)
            if (!userInfo) return apiResponse.notFoundResponse(res, "该用户不存在");
            //更新用户数据.
            let updateData = {...req.body}
            await UserModel.findByIdAndUpdate(req.body.id, updateData)
            return apiResponse.successResponse(res, "用户更新成功.");
        } catch (err) {
            console.log(err)
            return apiResponse.ErrorResponse(res, err);
        }
    }
]
