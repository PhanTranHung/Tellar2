let User = require('../models/user_model');
let Group = require('../models/group_model');

let findUserById = function (id_user, selectFields) {
  return User.findById(id_user)
    .select(selectFields)
    .exec()
    .catch(err => console.error(err));
};

let findSomeOneByName = function (str, selectFields) {
  return User.find({name: new RegExp(str, 'i')})
    .select(selectFields)
    .exec()
    .catch(err => console.error(err));
};

module.exports = {
  findSomeOneByName: findSomeOneByName,
  findUserById: findUserById
};