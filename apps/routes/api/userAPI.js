let express = require('express');
let router = express.Router();
let auth = require('../../middleware/auth.middleware');
let User = require('../../models/user_model');
let Group = require('../../models/group_model');
let UserController = require('../../controllers/userController');
let GroupController = require('../../controllers/grController');

/**
 * discovery more friend or any public group
 * require a short string: name
 *
 * no function to find friends
 */
router.get('/discovery', auth.isAuth, async (req, res) => {

  let userId = req.userInfo.data._id.trim();
  let name = req.query.name.trim();

  let selectFields = "name cover_photo";
  let listUser = await UserController.findSomeOneByName(name, selectFields);

  selectFields = "display_name members cover_group";
  let filter = {
    $or: [{
      members: {$in: [userId]}
    }, {
      type_of: true,
      isPublic: true,
      members: {$nin: [userId]}
    }]
  };

  let limit = 10;
  let listGroup = await GroupController.findGroupByName(name, selectFields, filter);

  let response = {
    people: listUser,
    group: listGroup
  };

  res.status(200).json(response);

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

  let selectFields = 'name joined_group cover_photo';
  let id_user = req.userInfo.data._id.trim();

  UserController.findUserById(id_user, selectFields)
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
