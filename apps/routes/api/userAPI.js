let express = require('express');
let router = express.Router();
let auth = require('../../middleware/auth.middleware');
let User = require('../../models/user_model');
let Group = require('../../models/group_model');
let UserController = require('../../controllers/userController');

/**
 * discovery more friend or any public group
 * require a short string: name
 */
router.get('/discovery', auth.isAuth, async (req, res) => {
  let name = req.query.name.trim();
  let filler = "name cover_photo";

  let listUser = await UserController.findSomeOneByString(name, filler);
  // let listJoinedGroup = await
  res.status(200).json(listUser);

});

router.get('/setting', auth.isAuth, (req, res) => {
  let query = req.query.query.trim();


});

// router.get('/audio-call', auth.isAuth, (req, res) => {
//   let query = req.query.query.trim();
//
//
// });
//
// router.get('/video-call', auth.isAuth, (req, res) => {
//   let query = req.query.query.trim();
//
// });

/* GET home page. */
router.get('/userinfo', auth.isAuth, function (req, res, next) {
  let filler = 'name joined_group cover_photo';
  let id_user = req.userInfo.data._id.trim();

  UserController.findUserById(id_user, filler)
    .then(user => {
      let response = {
        id: user._id,
        name: user.name,
        cover_photo: user.cover_photo,
        joined_group: user.joined_group
      };
      res.status(200).json(response);
    });
});

module.exports = router;
