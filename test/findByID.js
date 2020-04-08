let User = require('../apps/models/user_model');

let user = User.findById("5e789a7ec273cf5dd6322b30".trim())
  .exec()
  .catch(err => {
    console.error(err);
  });

console.log(user.t);
