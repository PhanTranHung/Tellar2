function renderError(res, message, error) {
  res.status(200).json({message: message});
  console.log(error);
}

module.exports = {
  renderError: renderError
};