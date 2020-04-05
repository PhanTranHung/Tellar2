const jwtHelper = require("../helpers/jwt.helper");


const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

let getTokenFromRequest = (req) => {
  return req.body.token || req.query.token || req.headers["x-access-token"] || req.cookies.accessToken;
};

/**
 * Middleware: Authorization user by Token
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
let isAuth = async (req, res, next) => {
  // Lấy token được gửi lên từ phía client, thông thường tốt nhất là các bạn nên truyền token vào header
  const tokenFromClient = getTokenFromRequest(req);
  if (tokenFromClient) {

    try {

      req.userInfo = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
      next();

    } catch (error) {
      return res.redirect('/sign-in');
    }
  } else {

    // return res.status(403).send({
    //   message: 'No token provided.',
    // });
    return res.redirect('/sign-in');
  }
};

let verifyToken = async (req, res, next) =>{
  const tokenFromClient = getTokenFromRequest(req);

  if (tokenFromClient){
    try {
      req.userInfo = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
      res.redirect('/');
    } catch (err) {
      next();
    }
  } else next();
};


module.exports = {
  isAuth: isAuth,
  verifyToken: verifyToken
};