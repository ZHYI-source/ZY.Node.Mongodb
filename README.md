# ZY.Node.Mongodb

- 这是基于 Node.js、Express 和 MongoDB 进行 REST API 开发的样板。对于为Android，iOS或JavaScript Frameworks（Vue，React等）等前端平台构建纯净的Web API非常有用。

- 该项目使用mongoDB作为数据库在nodejs上运行。尝试做出轻松维护代码结构的项目样板，因为任何初学者也可以采用该流程并开始构建API。 项目开放，可以提出建议，错误报告和提取请求进一步优化。

## 作者

---

- [@ZY_GITEE](https://gitee.com/Z568_568)
- [@ZY_GITHUB](https://github.com/ZHYI-source)

## 项目特点

---

- 轻量级Node.js项目提供Restful API
- 数据库采用 Mongodb, 通过Mongoose驱动。
- MVC结构
- CRUD操作示例
- 跨域处理
- 日志管理
- 具有恰当的状态代码的预定义响应结构
- 全局错误处理
- 增加express-validator请求参数校验
- jwt验证 用户权限中间件分离
- 基本身份验证（采用bcrypt单向Hash加密算法加密密码进行注册/登录）
- Token生成和校验请求头的authorization 
- 集成swagger-ui
- 增加邮件验证码通知
- session 验证码校验


## 启动安装

---
```bash
  git clone https://gitee.com/Z568_568/node.mongodb.git
  cd node.mongodb
  npm i
  **************************************************
  开发环境：npm run dev  基于 nodemon 热更新
  生产环境：npm run start
```

## 环境参考

---

- Node.js 14.18.1+
- MongoDB 5.1+

## 项目结构

---

```sh
.
├── app.js                  //入口文件
├── package.json            //依赖配置文件
├── .env.development        //开发环境配置
├── .env.production         //生产环境配置
├── config                  //项目配置
│   ├── db.config.js
│   ├── swagger.config.js
│   └── ...
├── controllers             //控制模块（业务处理）
│   └── v1
│       ├── UserController.js
│       └── ...
├── models                  //模型模块（建表）
│   └── v1
│       ├── index.js        /模型统一导出
│       └── mapping
│           ├──UserModel.js
│           └── ...
├── routes                  //路由（配置实际API地址路径）
│     └── v1
│         ├── index.js
│         ├── user.js
│         └── ...
├── db                      //mongodb数据库连接
│   ├── index.js              
│   └── ...
├── middlewares             //中间件
│   ├── jwt.js
│   ├── permissions.js
│   ├── session.js
│   └── ...
├── logs                    //日志
│   ├── info.log
│   ├── error.log
│   └── ...
└── utils                   //辅助工具
    ├── utils.apiResponse.js
    ├── utils.mailer.js.js
    └── ...
```

## License

---

[MIT](https://choosealicense.com/licenses/mit/)


 
