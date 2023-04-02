// const jwt = require("express-jwt");
// const secret = process.env.SIGN_KEY;

// const authenticate = jwt({
//     secret: secret
// });
const authenticate = (req,res,next)=>{
    // console.log(req)
    console.log('需要校验')
    next()
}
module.exports = authenticate;
