let mgs = require("mongoose");
let group_schema = require("../schemas/group_schema");
let group_collection = require('../../configs/mongodb').collections.group_collection;

let group_model = mgs.model(group_collection, group_schema);

module.exports = group_model;