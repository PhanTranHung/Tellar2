let mgs = require("mongoose");
let cvs = require('../models/detail_convese_model');
// let default_user = require('../../configs/default_attr')

let schema_user = "users";
let default_user = require('../../configs/default_attr');

let schema = mgs.Schema({
  _id: mgs.Schema.Types.ObjectId,
  display_name: {
    type: String,
    required: true,
    trim: true
  },
  members: [{
    type: [mgs.Schema.Types.ObjectId],
    ref: schema_user,
    required: true,
    default: []
  }],
  type_of: Boolean,
  isPublic: {
    type: Boolean,
    default: true,
    required: this.type_of
  },
  admin: {
    required: this.type_of,
    type: [mgs.Schema.Types.ObjectId],
    ref: schema_user,
    min: 1
  },
  detail_converse: {
    type: String,
    required: true,
    min: 5,
    trim: true
  },
  cover_group: {
    type: String,
    required: true,
    default: null,
    get: () => {
      return (this.cover_group) ? this.cover_group : default_user.DEFAULT_COVER_GROUP;
    }
  },
  password: String
}, {
  toJSON: {getters: true},
  timestamps: {
    createAt: "create_at",
    updateAt: "update_at"
  }
});

module.exports = schema;