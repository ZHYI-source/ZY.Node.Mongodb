/**
 *@author ZY
 *@date 2023/4/4
 *@Description:权限相关的接口
*/

const express = require('express');
const router = express.Router();
const AuthController = require('../../controllers/AuthController')

/**
 * 用户信息查询
 * @route get /users
 * @group 用户管理 - Operations users-admin
 * @returns {object} 200 - An array of about info
 * @returns {object} 605 - 请求失败
 * @returns {Error}  default - Unexpected error
 */

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.get('/verifyConfirm', AuthController.verifyConfirm);
router.get('/resendConfirmCode', AuthController.resendConfirmCode);


module.exports = router;
