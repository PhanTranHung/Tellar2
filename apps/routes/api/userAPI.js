let express = require('express');
let router = express.Router();
let auth = require('../../middleware/auth.middleware');
let User = require('../../models/user_model');
let collections = require('../../../configs/mongodb').collections;

/* GET home page. */
router.get('/userinfo', auth.isAuth, function (req, res, next) {
  let userInfo = req.userInfo.data;
  User.findById(userInfo._id)
    .select('name joined_group cover_photo')
    .populate({
      path: 'joined_group',
      select: 'members cover_group display_name type_of isPublic',
      model: collections.group_collection,
      populate: {
        path: 'groups.members',
        select: 'cover_photo name is_activate last_active',
        model: collections.user_collection
      }
    })
    .exec()
    .then(user => {
      let response = {
        id: user._id,
        name: user.name,
        cover_photo: user.cover_photo,
        joined_group: user.joined_group.map(elem =>{
          return {
            group_id: elem._id,
            group_name: elem.display_name,
            cover_group: elem.cover_group
          }
        }),

      };
      res.status(200).json(user);
    }).catch(err => {
    console.error(err);
  })
});

module.exports = router;
