/**
 *@author ZY
 *@date 2023/4/4
 *@Description:角色菜单权限验证中间件
 */
const chalk = require('chalk');
const apiResponse = require('../utils/utils.apiResponse');
const log = require('../utils/utils.logger');
const permissions = (req, res, next) => {

    /*  角色权限验证具体逻辑
        ...
        console.error(chalk.red('API: ' + req.baseUrl + ' 权限验证未通过'))
        log.error('API: ' + req.baseUrl + ' 权限验证未通过')
        return apiResponse.unauthorizedResponse(res, '暂无权限');
    */

    //验证通过 继续执行下一个中间件
    next()
}
module.exports = permissions;
