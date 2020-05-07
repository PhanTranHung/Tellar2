function renderError(res, message, error = null, cookies = null) {
  if (cookies) res.cookie('accessToken', cookies);
  res.status(200).json(message);
  if (error) console.log(error);
}

function missingParameter(res){
  renderError(res, "Parameter is required", )
}

let errors = {
  missingParameter: missingParameter
};

module.exports = {
  renderError: renderError,
  errors: errors
};