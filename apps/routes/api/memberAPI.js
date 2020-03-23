let express = require('express');
let router = express.Router();
let auth = require('../../middleware/auth.middleware');
let Group = require('../../models/group_model');

router.get('/', auth.isAuth, function (req, res, next) {
  let group_id = req.query.group_id.trim();

  Group.find({_id: group_id})
    .populate({
      path: 'members',
      select: 'name last_active is_activate cover_photo',
      model: 'users'
    })
    .exec()
    .then(group => {
      res.status(200).json(group)
    })

});

module.exports = router;