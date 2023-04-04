const express = require('express');
const router = express.Router();
const apiResponse = require('../../helper/apiResponse')
router.get('/', function (req, res) {
    apiResponse.successResponse(res, '欢迎来到我的服务')
});

module.exports = router;
