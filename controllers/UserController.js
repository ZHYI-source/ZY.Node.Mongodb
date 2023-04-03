const {userModel} = require('../models')
const mongoose = require('mongoose')
const {query, validationResult} = require('express-validator');
const authenticate = require('../middlewares/jwt')
const apiResponse = require('../helper/apiResponse')
const log = require('../utils/utils.logger')

/**
 * User list.
 *
 * @returns {Object}
 */
exports.userlist = [
    authenticate,
    async (req, res) => {
        console.log(req.auth)
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array())
            }
            let result = await userModel.find({})
            let total = await userModel.find({}).count()
            return apiResponse.successResponseWithData(res, "Operation Success.", result.length > 0 ? {
                result,
                total
            } : {result: [], total});
        } catch (err) {
            log.error('用户查询失败')
            return apiResponse.ErrorResponse(res, err);
        }
    }]

/**
 * User Create.
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.userCreate = [
    authenticate,
    query("name", "name must not be empty.").isLength({min: 1}).trim().custom((value, {req}) => {
        return userModel.findOne({name: value}).then(book => {
            if (book) {
                return Promise.reject("name already exist with this ISBN no.");
            }
        });
    }),
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
            } else {
                //Save user.
                let array = [{
                    name: req.query.name || '王五33',
                    age: 22,
                    address: '贵州省贵阳市',
                    hobbies: ['你好啊', '前端']
                }];
                const addInfo = await userModel.create(array)
                if (addInfo) {
                    return apiResponse.successResponseWithData(res, "user add Success.", addInfo);
                }
            }
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
    async (req, res) => {
        if (!mongoose.Types.ObjectId.isValid(req.query.id)) {
            return apiResponse.validationErrorWithData(res, "Invalid Error.", "参数id错误");
        }
        try {
            userModel.findByIdAndDelete(req.query.id).then((user) => {
                if (!user) {
                    return apiResponse.notFoundResponse(res, '该条数据不存在或已被删除');
                }
                apiResponse.successResponse(res, '删除成功')
            })
        } catch (err) {
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
    async (req, res) => {
        if (!mongoose.Types.ObjectId.isValid(req.query.id)) {
            return apiResponse.validationErrorWithData(res, "Invalid Error.", "参数id错误");
        }
        try {
            const userInfo = await userModel.findById(req.query.id)
            if (!userInfo) return apiResponse.notFoundResponse(res, "该ID下的数据不存在或被删除");
            //update userData.
            const userData = await userModel.findByIdAndUpdate(req.query.id, req.query)
            if (userData) return apiResponse.successResponse(res, "用户更新成功.", userData);
        } catch (err) {
            //throw error in json response with status 500.
            return apiResponse.ErrorResponse(res, err);
        }
    }
]
