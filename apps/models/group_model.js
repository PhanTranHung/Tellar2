let mgs = require("mongoose");
let group_schema = require("../schemas/group_schema");

let group_model = mgs.model("groups", group_schema);

module.exports = group_model;