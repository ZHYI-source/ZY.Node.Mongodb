var express = require('express');
var router = express.Router();

const usersControllers = require('../../controllers/users')

/**
 * 用户信息查询
 * @route GET /users
 * @group 用户管理 - Operations users-admin
 * @returns {object} 200 - An array of about info
 * @returns {object} 605 - 请求失败
 * @returns {Error}  default - Unexpected error
 */

router.get('/', usersControllers.userlist);

/**
 * This function comment is parsed by doctrine
 * @route GET /api
 * @group foo - Operations about user
 * @param {string} email.query.required - username or email - eg: user@domain
 * @param {string} password.query.required - user's password.
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.get('/add', usersControllers.userCreate);


router.get('/delete', usersControllers.userDelete);


router.get('/update', usersControllers.userUpdate);

module.exports = router;
