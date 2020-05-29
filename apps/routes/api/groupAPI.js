let express = require('express');
let router = express.Router();
let auth = require('../../middleware/auth.middleware');
let user_collection = require('../../../configs/mongodb').collections.user_collection;
let GroupController = require('../../controllers/grController');
let client = require('../../helpers/client.helper');



module.exports = function (io) {
  /**
   * path /api/group
   */

  /**
   * Members send message to group
   * require string group id(to), message
   */
  router.post('/send', auth.isAuth, async (req, res) => {
    let group_id = req.body.to.trim();
    if (!group_id) client.renderError(res, {error: true, message: "Group id is required"});
    // console.log(req.body.to + " "  + req.body.message);

    else {
      try {
        let group = await GroupController.findGroupById(group_id);
        if (!group) {
          client.renderError(res, {error: true, msg: "Group not exist"})
        } else {
          let detailMessage = await GroupController.putMessage(group.detail_converse, req.userInfo.data._id.trim(), req.body.message.trim());
          //  notification to all members in group

          let packed = {
            detail: detailMessage,
            type: 'only',
            to: group_id
          };
          for (let index in group.members){
            io.of('/chat-room').to(group.members[index].toString()).emit('server_send_chat_msg', packed);
          }

          res.status(200).end();
        }
      } catch (e) {
        client.renderError(res, {error: true, message: "Can't save message"}, e);
      }
    }
  });


  /**
   *  require group id
   */
  router.get("/load-message/:group_id", auth.isAuth, async (req, res) => {
    let group_id = req.params.group_id.trim();
    if (!group_id) client.renderError(res, {error: true, message: "Group id is required"});
    else {
      let query = req.query;
      if (!query.from || !query.to || !query.from.trim() || !query.to.trim()) {
        query.from = 0;
        query.to = query.from + 30;
      }
      try {
        let group = await GroupController.findGroupById(group_id);
        if (!group)
          client.renderError(res, {error: true, msg: "Group not exist"});
        else {
          let listMessage = await GroupController.loadMessage(group.detail_converse, query.from, query.to);
          res.status(200).json(listMessage);
        }
      } catch (e) {
        client.renderError(res, {error: true, message: "Can't load message"}, e);
      }
    }
  });

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
   * require array(user_id): members
   */
  router.post('/create-group', auth.isAuth, async (req, res) => {
    let members = req.body.members.split(",");
    if (!members) {
      client.renderError(res, "Members not null");
      return;
    }
    members.push(req.userInfo.data._id.trim());

    GroupController.createGroup(members)
      .then(data => res.status(200).json({refresh: true}))
      .catch(err => client.renderError(res, "An error occurred", err))
  });

  router.get('/add-to-group', auth.isAuth, (req, res) => {
    let query = req.query.query.trim();

  });

  router.get('/share-group', auth.isAuth, (req, res) => {
    let query = req.query.query.trim();
    res.status(200).json("A link which to other members can join this group ")
  });

  /**
   * The options can be: rename, public, change cover photo ....
   */
  router.get('/options', auth.isAuth, (req, res) => {
    let query = req.query.query.trim();


  });

  router.get('/', auth.isAuth, async function (req, res, next) {
    let group_id = req.query.group_id.trim();

    let populate = {
      path: 'members',
      select: 'name last_active is_activate cover_photo',
      model: user_collection
    };

    GroupController.findGroupById(group_id, {}, populate)
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

  });

  return router;
};