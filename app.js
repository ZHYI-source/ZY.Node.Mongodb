const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const logger = require('morgan');
const cors = require('cors');
const mount = require('mount-routes')
const apiResponse = require('./helper/apiResponse')
// https://www.npmjs.com/package/chalk
const chalk = require('chalk');
const isDev = process.env.NODE_ENV === 'development'
//访问不同的 .env文件
require('dotenv').config({path: isDev ? './.env.development' : './.env.production'})
// 数据库连接
require('./db/index')
const app = express();

//处理post参数解析
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
//解决跨域
app.use(cors())

// 设置跨域和相应数据格式
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, token')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Authorization')
    res.header('Content-Type', 'application/json;charset=UTF-8')
    res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With')
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    if (req.method === 'OPTIONS') res.send(200)
    /*让options请求快速返回*/
    else next()
})
// 获取系统环境变量 返回值是对象
if (isDev) {
    console.log(chalk.bold.yellow('当前是开发环境'))
    // 在开发环境中 将客户端发送到服务器端的请求信息打印到控制台中
    app.use(logger('dev'))
} else {
    console.log(chalk.bold.yellow('当前是生产环境'))
}
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 使用swagger API 文档
// https://www.npmjs.com/package/express-swagger-generator
const expressSwagger = require('express-swagger-generator')(app)
const options = require('./config/swagger.config') //配置信息
expressSwagger(options)

// 带路径的用法并且可以打印出路由表  true 代表展示路由表在打印台
mount(app, path.join(process.cwd(), '/routes'), isDev)


// throw 404 if URL not found
app.all("*", function (req, res) {
    return apiResponse.notFoundResponse(res, "404 --- Page not found");
});

app.use((err, req, res) => {
    if (err.name === "UnauthorizedError") {
        return apiResponse.unauthorizedResponse(res, err.message);
    }
});









app.listen(process.env.PORT, () => {
    console.log(chalk.hex('#8e44ad').bold(`
 .----------------.  .----------------.  .----------------.  .----------------.  .----------------.  .----------------. 
| .--------------. || .--------------. || .--------------. || .--------------. || .--------------. || .--------------. |
| |   ________   | || |  ____  ____  | || |    ___       | || |      __      | || |   ______     | || |     _____    | |
| |  |  __   _|  | || | |_  _||_  _| | || |  .' _ '.     | || |     /  \\     | || |  |_   __ \\   | || |    |_   _|   | |
| |  |_/  / /    | || |   \\ \\  / /   | || |  | (_) '___  | || |    / /\\ \\    | || |    | |__) |  | || |      | |     | |
| |     .'.' _   | || |    \\ \\/ /    | || |  .\`___'/ _/  | || |   / ____ \\   | || |    |  ___/   | || |      | |     | |
| |   _/ /__/ |  | || |    _|  |_    | || | | (___)  \\_  | || | _/ /    \\ \\_ | || |   _| |_      | || |     _| |_    | |
| |  |________|  | || |   |______|   | || | \`._____.\\__| | || ||____|  |____|| || |  |_____|     | || |    |_____|   | |
| |              | || |              | || |              | || |              | || |              | || |              | |
| '--------------' || '--------------' || '--------------' || '--------------' || '--------------' || '--------------' |
 '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  '----------------' 
`))
    console.log(chalk.bold.green(`项目启动成功: ${process.env.URL}:${process.env.PORT}`));
    console.log(chalk.bold.green(`接口文档地址: ${process.env.URL}:${process.env.PORT}/swagger`));
});

module.exports = app;
