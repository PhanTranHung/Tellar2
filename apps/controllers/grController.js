let mongoose = require('mongoose');
let Group = require('../models/group_model');
let User = require('../models/user_model');

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

      let group = new Group({
        _id: _id,
        display_name: makePrettyName(data),
        members: members,
        type_of: members.length > 2,
        admin: [members[members.length - 1]]
      });

      resolve(group.save());

    } catch (e) {
      reject(e);
    }
  });
};


module.exports = {
  findGroupById: findGroupById,
  findGroupByName: findGroupByName,
  createGroup: createGroup
};