let GroupController = require('../BO/groupBO');
let client = require('../helpers/client.helper');
let user_collection = require('../../configs/mongodb').collections.user_collection;
const mongooseHelper = require ('../helpers/mongoose.helper');
const nodemon = require('nodemon');

let clientSentMessageToGroup = function (req, res) {

  let group_id = (req.body.to || "").trim(),
    message = (req.body.message || "").trim();
  if (!message) {
    res.status(200).end();
    return;
  }
  else if (!group_id) client.renderError(res, {error: true, message: "Group id is required"});
  else if (!mongooseHelper.validateObjectID(group_id)){
    res.status(401).json({
      error: true,
      message: "group id is not valid",
      error_code: "group-id-not-valid"
    });
    return;
  }
    
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
  let group_id = (req.params.group_id || "").trim();

  if (!group_id) client.renderError(res, {error: true, message: "Group id is required"});
  else if (!mongooseHelper.validateObjectID(group_id))
    res.status(401).json({
      error: true,
      message: "group id is not valid",
      error_code: "group-id-not-valid"
    });
  else {
    let query = req.query;
    if (!query.from || !query.to || !query.from.trim() || !query.to.trim()) {
      query.from = 0;
      query.to = query.from + 30;
    }
    try {
      let group = await GroupController.findGroupById(group_id);
      if (!group)
        client.renderError(res, {error: true, message: "Group does not exist"});
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
  let members = (req.body.members || "").toString().trim().split(" ").join("").split(",");


  if (members.length <= 0) {
    client.renderError(res, {
      error: true,
      message: "Members not null"
    });
    return;
  }

  let validateId = members.reduce(
    (acc, cur) => {
      if (acc.hashTable[cur]){
        acc.hasError = true;
        acc.type_error.duplicate = "id-duplicated";
      } else if (!mongooseHelper.validateObjectID(cur)){
        acc.hasError = true;
        acc.type_error.wrong_id = "id-not-valid";
      } else {
        acc.hashTable[cur] = true
      }
      return acc;
  }, {hashTable:{}, type_error: []})

  if (validateId.hasError){
    res.status(401).json({
      error: true,
      error_code: Object.values(validateId.type_error),
      message: 'members is not valid'
    });
    return;
  }

  members.push(req.userInfo.data._id.trim());

  GroupController.createGroup(members)
    .then(data => res.status(200).json({
      refresh: true,
      success: true,

    }))
    .catch(err => client.renderError(res, {
      error: true,
      message: "An error occurred"
    }, err))
};

let addUserToGroup = function (req, res) {

};

let createLinkShareGroup = function (req, res) {

};

let loadHome = async function (req, res) {

  let group_id = (req.query.group_id || "").toString().trim();
  if (group_id.length <= 0){
    res.status(401).json({
      error: true,
      message: "id is not provided"
    });
    return;
  }
    
  else if (!mongooseHelper.validateObjectID(group_id)){
    res.status(401).json({
      error: true,
      message: "id is not valid"
    });
    return;
  }

  let populate = {
    path: 'members',
    select: 'name last_active is_activate cover_photo',
    model: user_collection
  };

  GroupController.findGroupById(group_id, {}, populate)
    .then(group => {
      if (group) {
        let response = {
          success: true,
          group_id: group._id,
          name: group.display_name,
          cover_group: group.cover_group,
          members: group.members,
          last_message: {}
        };
        res.status(200).json(response)
      } else {
        res.status(401).json({
          error: true,
          message: "Can't find this group or are not joined this group"
        })
      }
      
    })
    .catch(error => {
      console.log(error);
      res.status(401).json({
        error: true,
        message: "An error was occurred",
      })
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