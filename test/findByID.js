let User = require('../apps/models/user_model');

User.findById("5e789a7ec273cf5dd6322b30".trim())
  .exec()
  .then(mem => {
    console.log(mem)
  })
  .catch(err => {
    console.error(err);
  });

