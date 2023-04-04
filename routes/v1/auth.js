/**
 *@author ZY
 *@date 2023/4/4
 *@Description:权限相关的接口
 */

const express = require('express');
const router = express.Router();
const AuthController = require('../../controllers/AuthController')

/****************************************************************************/

/*
* TODO: 注册登录逻辑：
*       1.用户注册 - 用户信息入库 - 发送验证码 - 校验验证码
*                                   |
*                           验证码发送失败、验证码失效或者校验失败 - 重新发送或输入验证码 - 校验验证码
*   *
*       2.用户登录 -（账号、密码、验证状态都校验通过）- 发Token
*                       |
*                 验证状态不通过 - 重新校验验证码/重发验证码 - 校验验证码 - 发Token
* */

/**
 * 登录
 * @route POST /v1/auth/login
 * @group 权限验证 - 登录注册相关
 * @param {string} email 邮箱
 * @param {string} password 密码
 * @returns {object} 200 - {"status": 1,"message": "登录成功.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */

router.post('/login', AuthController.login);

/**
 * 注册
 * @route POST /v1/auth/register
 * @group 权限验证 - 登录注册相关
 * @param {string} email 邮箱
 * @param {string} password 密码
 * @param {string} username 昵称
 * @returns {object} 200 - {"status": 1,"message": "...","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.post('/register', AuthController.register);

/**
 * 检验验证码
 * @route GET /v1/auth/verifyConfirm
 * @group 权限验证 - 登录注册相关
 * @param {string} email 邮箱
 * @param {string} code 验证码
 * @returns {object} 200 - {"status": 1,"message": "...","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.get('/verifyConfirm', AuthController.verifyConfirm);

/**
 * 重发验证码
 * @route GET /v1/auth/resendConfirmCode
 * @group 权限验证 - 登录注册相关
 * @param {string} email 邮箱
 * @returns {object} 200 - {"status": 1,"message": "...","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.get('/resendConfirmCode', AuthController.resendConfirmCode);


module.exports = router;
