let mgs = require("mongoose");
let user_schema = require("../schemas/user_schema");

let user_model = mgs.model("users", user_schema);

module.exports = user_model;