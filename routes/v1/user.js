/**
 *@author ZY
 *@date 2023/4/4
 *@Description:用户相关的接口
 */

const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/v1/UserController')

/****************************************************************************/

/**
 * 用户列表查询
 * @route POST /v1/user/list
 * @group 用户管理 - 用户相关
 * @param {string} email 邮箱
 * @param {string} password 密码
 * @security JWT   需要token
 * @returns {object} 200 - {"status": 1,"message": "登录成功.","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */

router.post('/list', UserController.userlist);

/**
 * 用户创建
 * @route POST /v1/user/create
 * @group 用户管理 - 用户相关
 * @param {string} email 邮箱
 * @param {string} password 密码
 * @security JWT   需要token
 * @returns {object} 200 - {"status": 1,"message": "....","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.post('/create', UserController.userCreate);


/**
 * 用户删除
 * @route POST /v1/user/delete
 * @group 用户管理 - 用户相关
 * @param {string} id 用户id
 * @security JWT   需要token
 * @returns {object} 200 - {"status": 1,"message": "....","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.post('/delete', UserController.userDelete);

/**
 * 用户更新
 * @route POST /v1/user/update
 * @group 用户管理 - 用户相关
 * @param {string} email 邮箱
 * @param {string} password 密码
 * @param {string} id ID
 * @security JWT   需要token
 * @returns {object} 200 - {"status": 1,"message": "....","data": {...},"time": 1680598858753}
 * @returns {Error}  default - Unexpected error
 */
router.post('/update', UserController.userUpdate);

module.exports = router;
