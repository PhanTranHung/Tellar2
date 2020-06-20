let express = require('express');
let router = express.Router();
let auth = require('../../middleware/auth.middleware');
let GroupController = require('../../controllers/grController');


module.exports = function (io) {

  router.use('/', auth.authAPIs, (req, res, next) => {
    req.io = io.of('/chat-room');
    next();
  });

  /**
   * path /api/group
   *
   * Members send message to group
   * require string group id(to), message
   */
  router.post('/send', GroupController.clientSentMessageToGroup);


  /**
   *  require group id
   */
  router.get("/load-message/:group_id", GroupController.clientLoadMessageInGroup);

  /**
   * require id_group or name of group
   * return group_info
   */
  router.get('/find-group', (req, res) => {
    let query = req.query.query.trim();

  });

  /**
   * require id_group, [password_group]
   * response true or false
   */
  router.get('/join-group', (req, res) => {
    let query = req.query.query.trim();


  });

  /**
   * require array(user_id): members
   */
  router.post('/create-group', GroupController.createGroup);

  router.get('/add-to-group', (req, res) => {
    let query = req.query.query.trim();

  });

  router.get('/share-group', (req, res) => {
    let query = req.query.query.trim();
    res.status(200).json("A link which to other members can join this group ")
  });

  /**
   * The options can be: rename, public, change cover photo ....
   */
  router.get('/options', (req, res) => {
    let query = req.query.query.trim();
  });

  router.get('/', GroupController.loadHome);
  return router;
};