const jwtHelper = require("../helpers/jwt.helper");
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const clientHelper = require('../helpers/client.helper');


let getTokenFromRequest = (req) => {
  return req.cookies.accessToken || req.headers["x-access-token"] || req.query.token || req.body.token || "";
};

/**
 * Middleware: Authorization user by Token
 * @param {*} req
 */
let authentication = async (req) => {
  // Lấy token được gửi lên từ phía client, thông thường tốt nhất là các bạn nên truyền token vào header
  return new Promise(async (resolve, reject) => {
    const tokenFromClient = getTokenFromRequest(req).trim();
    if (tokenFromClient) {
      try {
        let userInfo = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
        resolve(userInfo);
      } catch (error) {
        let {message, error_for_log, cookies} = clientHelper.getErrorMessage.tokenExpired();
        reject(message)
      }
    } else {
      let {message, error_for_log, cookies} = clientHelper.getErrorMessage.noTokenProvided();
      reject(message)
    }
  })
};

let authGUI = async (req, res, next) => {
  authentication(req)
    .then(userInfo => {
      req.userInfo = userInfo;
      next();
    })
    .catch(message => res.redirect('/sign-in'));
};

let authAPIs = async (req, res, next) => {
  authentication(req)
    .then(userInfo => {
        req.userInfo = userInfo;
        next();
      }
    )
    .catch(message =>
      clientHelper.renderError(res, message)
    );
};

let authSocket = async function (socket, next) {
  let tokenFromClient = socket.request.cookies.accessToken;

  if (tokenFromClient && tokenFromClient.trim()) {
    try {
      socket.request.userInfo = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
      next();
    } catch (error) {
      let {message, error_for_log} = clientHelper.getErrorMessage.tokenExpired();
      next(message);
    }
  } else {
    let {message, error_for_log} = clientHelper.getErrorMessage.noTokenProvided();
    next(message);
  }
};

let verifySignedIn = async (req, res, next) => {
  const tokenFromClient = getTokenFromRequest(req);

  if (tokenFromClient && tokenFromClient.trim()) {
    try {
      req.userInfo = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
      res.redirect('/');
    } catch (err) {
      next();
    }
  } else next();
};


module.exports = {
  authAPIs: authAPIs,
  authGUI: authGUI,
  verifyToken: verifySignedIn,
  authSocket: authSocket,
};