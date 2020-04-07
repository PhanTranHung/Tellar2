let express = require('express');
let router = express.Router();
let auth = require('../../middleware/auth.middleware');
let Group = require('../../models/group_model');
let user_collection = require('../../../configs/mongodb').collections.user_collection;

router.get('/', auth.isAuth, function (req, res, next) {
  let group_id = req.query.group_id.trim();

  Group.findById(group_id)
    .populate({
      path: 'members',
      select: 'name last_active is_activate cover_photo',
      model: user_collection
    })
    .exec()
    .then(group => {
      let response = {
        group_id: group._id,
        cover_group: group.cover_group,
        members: group.members,
        last_message: {}
      };
      res.status(200).json(response)
    })
    .catch(err => {
      res.status(200).data(err);
      console.error(err)
    });

});

module.exports = router;