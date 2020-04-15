let express = require('express');
let router = express.Router();
let auth = require('../../middleware/auth.middleware');
let Group = require('../../models/group_model');
let user_collection = require('../../../configs/mongodb').collections.user_collection;

/**
 * require id_group or name of group
 * return group_info
 */
router.get('/find-group', auth.isAuth, (req, res) => {
  let query = req.query.query.trim();

});

/**
 * require id_group, [password_group]
 * response true or false
 */
router.get('/join-group', auth.isAuth, (req, res) => {
  let query = req.query.query.trim();


});

/**
 * require array(user_id)
 */
router.get('/create-group', auth.isAuth, (req, res) => {
  let query = req.query.query.trim();


});

router.get('/add-to-group', auth.isAuth, (req, res) => {
  let query = req.query.query.trim();

});

router.get('/share-group', auth.isAuth, (req, res) => {
  let query = req.query.query.trim();
  res.status(200).json("A link which to other members can join this group ")
});

router.get('/rename-group', auth.isAuth, (req, res) => {
  let query = req.query.query.trim();


});

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
        name: group.display_name,
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