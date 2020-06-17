const UserBO =  require('../BO/userBO');
const GroupBO = require('../BO/groupBO');
const client = require('../helpers/client.helper');

let discoverFriend = async function (req, res) {
  let userId = req.userInfo.data._id.trim();
  let name = req.query.name.trim();
  if (!name) {
    client.sendError.missingParameter(res);
    return;
  }

  let selectFields = "name cover_photo";
  let listUser = await UserBO.findSomeOneByName(name, selectFields);
  listUser = listUser.map(function (elem) {
    elem._doc.categories = "user";
    console.log(elem);
    return elem;
  });

  selectFields = "display_name members cover_group";
  let filter = {
    $or: [{
      members: {$in: [userId]}
    }, {
      type_of: true,
      isPublic: true,
      members: {$nin: [userId]}
    }]
  };

  let limit = 10;
  let listGroup = await GroupBO.findGroupByName(name, selectFields, filter, limit);
  listGroup = listGroup.map(function (elem) {
    elem._doc.categories = "group";
    elem._doc.name = elem.display_name;
    return elem;
  });


  let response = listUser.concat(listGroup);

  res.status(200).json(response);
};

let getUserInformation =  async function (req, res) {
  let selectFields = 'name joined_group cover_photo';
  let id_user = req.userInfo.data._id.trim();

  UserBO.findUserById(id_user, selectFields)
    .then(user => {
      if (!user) {
        let error_msg = "User does not exist";
        client.renderError(res, {
          message: error_msg,
          redirect: "/sign-in"
        }, error_msg, "16549");
      }
      else {
        let response = {
          id: user._id,
          name: user.name,
          cover_photo: user.cover_photo,
          joined_group: user.joined_group
        };
        res.status(200).json(response);
      }
    });
};

module.exports = {
  discoverFriend: discoverFriend,
  getUserInformation:getUserInformation
};