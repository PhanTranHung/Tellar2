let mgs = require("mongoose");
let Schema  = mgs.Schema;
let User_model = require("../apps/models/user_model");
let Group_model = require("../apps/models/group_model");
let Detail_model = require("../apps/models/detail_convese_model");

let user = new User_model({
  _id: new mgs.Types.ObjectId,
  name: "Cu Hung",
  user_name: "CuHung",
  pass: "696969",
  email: "master@gmail.com",
  sdt: "0388939534",
  gender: true,
  birth_day: new Date()
});

user.save().then(user_saved => {
  console.log(user_saved);
}).catch(err => {
  console.error(err)
});

let group = new Group_model({
  _id: new mgs.Types.ObjectId,
  display_name: "HungPhan",
  members: ['5e77b7bad87444428fc256e9', '5e781a53d10a371b9941595f'],
  type_of: false,
  detail_converse: 'converses'
});

group.save().then(group_saved => {
  console.log(group_saved);
}).catch(err => {
  console.error(err)
});


let detail_converse = Detail_model("converses")({
  _id: new mgs.Types.ObjectId,
  sender_id: '5e77b7bad87444428fc256e9',
  content: 'hahaha'
});

detail_converse.save().then(detail_saved => {
  console.log(detail_saved);
}).catch(err => {
  console.error(err)
});
