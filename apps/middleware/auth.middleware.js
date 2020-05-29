const jwtHelper = require("../helpers/jwt.helper");
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;



let getTokenFromRequest = (req) => {
  return req.cookies.accessToken || req.headers["x-access-token"] || req.query.token || req.body.token;
};

/**
 * Middleware: Authorization user by Token
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
let isAuth = async (req, res, next) => {
  // Lấy token được gửi lên từ phía client, thông thường tốt nhất là các bạn nên truyền token vào header
  try {
    const tokenFromClient = getTokenFromRequest(req).trim();
    if (tokenFromClient) {
      try {
        req.userInfo = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
        next();
      } catch (error) {
        console.log(error);
        return res.redirect('/sign-in');
      }
    } else {
      //message: 'No token provided.
      return res.redirect('/sign-in');
    }
  } catch (e) {
    return res.redirect('/sign-in');
  }
};

let authSocket = async function(socket, next){
  let tokenFromClient = socket.request.cookies.accessToken;

  if (tokenFromClient && tokenFromClient.trim()) {
    try {
      socket.request.userInfo = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
      next();
    } catch (error) {
      return socket.disconnect();
    }
  } else {
    //message: 'No token provided.
    return socket.disconnect(true);
  }

  next();
};

let verifySignedIn = async (req, res, next) => {
  const tokenFromClient = getTokenFromRequest(req);

  if (tokenFromClient && tokenFromClient.trim()){
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
  verifyToken: verifySignedIn,
  authSocket: authSocket,
}