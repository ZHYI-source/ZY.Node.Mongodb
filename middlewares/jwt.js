const {expressjwt: jwt} = require("express-jwt");
const secret = process.env.SIGN_KEY;
const authenticate = jwt({
    secret: secret,
    algorithms: ['HS256'],
    credentialsRequired: true, //对没有携带token的 接口也抛出错误
    getToken: function fromHeaderOrQuerystring(req,res) {
        if (
            req.headers.authorization &&
            req.headers.authorization.split(" ")[0] === "Bearer"
        ) {
            return req.headers.authorization.split(" ")[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null
    },
});
module.exports = authenticate;
