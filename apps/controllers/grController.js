let mongoose = require('mongoose');
let Group = require('../models/group_model');
let User = require('../models/user_model');
let Conversation = require('../models/detail_convese_model');
let md5 = require('md5');

let makePrettyName = function (listUsers) {
  return listUsers
    .slice(0, 3)
    .map(user => {
      let name = user.name.split(' ');
      return name[name.length - 1];
    })
    .join(', ');
};

let findGroupById = function (id, selectFields, populate) {
  return Group.findById(id)
    .select(selectFields)
    .populate(populate)
    .exec()
    .catch(err => console.error(err));
};

let findGroupByName = function (name, selectFields, filter={}, limit = 100) {

  filter.display_name = new RegExp(name, 'i');

  return Group.find(filter)
    .select(selectFields)
    .limit(limit)
    .exec()
    .catch(err => console.error(err));
};

/**
 * require array id_user: members
 * @param members
 * @returns {Promise<unknown>}
 */
let createGroup = function (members) {

  return new Promise(async function (resolve, reject) {
    try {
      let _id = new mongoose.Types.ObjectId;

      let data = await Promise.all(members.map(async id => {
        let user = await User.findById(id).exec();

        if (!user) reject('User not found');
        else {
          user.joined_group.push(_id);
          return await user.save();
        }
      }));

      let groupName = makePrettyName(data);
      let group = new Group({
        _id: _id,
        display_name: groupName,
        members: members,
        type_of: members.length > 2,
        admin: [members[members.length - 1]],
        detail_converse: md5(groupName + Date.now().toString())
      });

      resolve(group.save());

    } catch (e) {
      reject(e);
    }
  });
};

let putMessage = function(collectionName, sender_id, message, attachment= {}){
  return new Promise(function (resolve, reject) {
    try {
      let conversation = new Conversation(collectionName)({
        _id: new mongoose.Types.ObjectId,
        sender_id: sender_id,
        content: message,
        attachment: attachment,
        viewers: [sender_id]
      });
      resolve(conversation.save())
    } catch (e) {
      reject(e)
    }
  })
};

let loadMessage = function(collectionName, from, to) {
  return new Promise(function (resolve, reject) {
    try{
      let conversation = Conversation(collectionName);
      conversation
        .find({})
        .exec()
        .catch(e => reject(e))
        .then(list => resolve(list));
    } catch (e) {
      reject(e)
    }
  })
};

module.exports = {
  findGroupById: findGroupById,
  findGroupByName: findGroupByName,
  createGroup: createGroup,
  putMessage: putMessage,
  loadMessage: loadMessage,

};