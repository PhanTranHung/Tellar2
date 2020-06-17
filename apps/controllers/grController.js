let GroupController = require('../BO/groupBO');
let client = require('../helpers/client.helper');
let user_collection = require('../../configs/mongodb').collections.user_collection;

let clientSentMessageToGroup = function (req, res) {

  let group_id = (req.body.to || "").trim(),
    message = (req.body.message || "").trim();
  if (!message) return;

  let promise = new Promise(async (resolve, reject) => {

    if (group_id) {
      try {
        let group = await GroupController.findGroupById(group_id),
          user_id = req.userInfo.data._id.trim();

        if (group) {
          let detailMessage = await GroupController.putMessage(group.detail_converse, user_id, message);
          //  notification to all members in group
          resolve([detailMessage, group]);
        // detailMessage: detailMessage, group:group
        } else reject("Group not exist", "group-not-exits");
      } catch (e) {
        console.error(e)
      }
    } else reject("Group id is required", "missing-parameter");
  });

  promise
    .then(data => {
      let [detailMessage, group] = data;
      let packed = {
        detail: detailMessage,
        type: 'only',
        to: group_id
      };
      for (let index in group.members) {
        req.io.to(group.members[index].toString()).emit('server_send_chat_msg', packed);
      }
      res.status(200).json({success: true});
    })
    .catch((message, error_code) => {
      client.renderError(res,
        {
          message: message,
          error: true,
          error_code: error_code
        })
    });
};

let clientLoadMessageInGroup = async function (req, res) {
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
};

let clientWantToFindGroup = function (req, res) {

};

let clientWantToJoinGroup = function (req, res) {

};

let createGroup = async function (req, res) {
  let members = req.body.members.split(",");
  if (!members) {
    client.renderError(res, "Members not null");
    return;
  }
  members.push(req.userInfo.data._id.trim());

  GroupController.createGroup(members)
    .then(data => res.status(200).json({refresh: true}))
    .catch(err => client.renderError(res, "An error occurred", err))
};

let addUserToGroup = function (req, res) {

};

let createLinkShareGroup = function (req, res) {

};

let loadHome = async function (req, res) {
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
};


module.exports = {
  clientSentMessageToGroup: clientSentMessageToGroup,
  clientLoadMessageInGroup: clientLoadMessageInGroup,
  createGroup: createGroup,
  clientWantToFindGroup: clientWantToFindGroup,
  clientWantToJoinGroup: clientWantToJoinGroup,
  loadHome: loadHome,

};