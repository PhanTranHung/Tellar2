let User = require('../models/user_model');
let Group = require('../models/group_model');

let controller = function () {

};

let findUserById = function (id_user, filler) {
  return User.findById(id_user)
    .select(filler)
    .exec()
    .catch(err => console.error(err));
};

let findSomeOneByString = function (str, filler) {
  return User.find({name: new RegExp(str, 'i')})
    .select(filler)
    .exec()
    .catch(err => console.error(err));
};

controller.findSomeOneByString = findSomeOneByString;
controller.findUserById = findUserById;

module.exports = controller;