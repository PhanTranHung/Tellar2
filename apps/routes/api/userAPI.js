let express = require('express');
let router = express.Router();
let auth = require('../../middleware/auth.middleware');
let User = require('../../models/user_model');

/* GET home page. */
router.get('/userinfo', auth.isAuth, function (req, res, next) {
  let userInfo = req.userInfo.data;
  User.findById(userInfo._id.trim())
    .select('name joined_group cover_photo')
    .exec()
    .then(user => {
      let response = {
        id: user._id,
        name: user.name,
        cover_photo: user.cover_photo,
        joined_group: user.joined_group
      };
      res.status(200).json(response);
    })
    .catch(err => {
    console.error(err);
  })
});

module.exports = router;
