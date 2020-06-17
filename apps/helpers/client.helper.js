function renderError(response, message = {}, error = null, cookies = null) {
  if (cookies) response.cookie('accessToken', cookies);
  response.status(200).json(message);
  if (error) console.log(error);
}

function missingParameter(res) {
  let message = {
      message: "Parameter is required",
      error: true,
      error_code: "missing-parameter"
    },
    error_for_log = "missing-parameter",
    cookies = "guest";

  if (arguments.length <= 0)
    return {
      message: message,
      error_for_log: error_for_log,
      cookies: cookies
    };
  renderError(res, message, error_for_log, cookies);
}

function tokenExpired(res, error) {
  let message = {
      message: "your token is expired, you need resigning",
      error: true,
      redirect: true,
      error_code: "token-expired",
      path: "/sign-in"
    },
    error_for_log = "token-expired",
    cookies = "guest";

  if (arguments.length <= 0)
    return {
      message: message,
      error_for_log: error_for_log,
      cookies: cookies
    };
  renderError(res, message, error_for_log, cookies);
}

function noTokenProvided(res, rerror) {
  let message = {
      message: "we couldn't find your access token",
      error: true,
      redirect: true,
      error_code: "no-token",
      path: "/sign-in"
    },
    error_for_log = "no-token",
    cookies = "guest";

  if (arguments.length <= 0)
    return {
      message: message,
      error_for_log: error_for_log,
      cookies: cookies
    };
  renderError(res, message, error_for_log, cookies);
}

let sendError = {
  missingParameter: missingParameter,
  tokenExpired: tokenExpired,
  noTokenProvided: noTokenProvided
};

let getErrorMessage = {
  missingParameter: missingParameter,
  tokenExpired: tokenExpired,
  noTokenProvided: noTokenProvided
};

module.exports = {
  renderError: renderError,
  sendError: sendError,
  getErrorMessage: getErrorMessage
};