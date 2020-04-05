let mgs = require("mongoose");
let user_schema = require("../schemas/user_schema");
let user_collection = require('../../configs/mongodb').collections.user_collection;

let user_model = mgs.model(user_collection, user_schema);

module.exports = user_model;