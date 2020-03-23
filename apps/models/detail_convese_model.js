let mgs = require("mongoose");
let group_schema = require("../schemas/detail_converse_schema");


module.exports = function (name_converse) {
  return mgs.model(name_converse, group_schema);
};