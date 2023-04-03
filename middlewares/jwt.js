const {expressjwt: jwt} = require("express-jwt");
const secret = process.env.SIGN_KEY;
const authenticate = jwt({
    secret: secret,
    algorithms: ['HS256'],
    credentialsRequired: true, //对没有携带token的 接口也抛出错误
});
// const authenticate = (req,res,next)=>{
//     // console.log(req)
//     console.log('需要校验')
//     next()
// }

/*

/!**
 * token验证函数
 *
 * @param  {[type]}   req  请求对象
 * @param  {[type]}   res  响应对象
 * @param  {Function} next 传递事件函数
 *!/
const authenticate = (req,res,next)=>{
    jwt({
        secret: process.env.SIGN_KEY,
        algorithms: ['HS256'],
        credentialsRequired: true, //对没有携带token的 接口也抛出错误
    })
    console.log('需要校验')
    next()
}
*/

module.exports = authenticate;
