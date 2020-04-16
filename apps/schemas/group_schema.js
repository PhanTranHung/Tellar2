let mgs = require("mongoose");
let Schema = mgs.Schema;

let user_collection = require('../../configs/mongodb').collections.user_collection;
let default_attr= require('../../configs/default_attr');

let schema = new Schema({
  _id: Schema.Types.ObjectId,
  display_name: {
    type: String,
    required: false,
    default: null,
    trim: true
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: user_collection,
    required: true,
    default: []
  }],
  type_of: Boolean,
  isPublic: {
    type: Boolean,
    default: true,
    required: this.type_of
  },
  admin: [{
    required: this.type_of,
    type: Schema.Types.ObjectId,
    ref: user_collection,
    min: 1
  }],
  detail_converse: {
    type: String,
    required: true,
    min: 5,
    default: 'Conversation',
    trim: true
  },
  cover_group: {
    type: String,
    required: false,
    default: null,
    get: (v) => {
      return (v) ? v : default_attr.DEFAULT_COVER_GROUP;
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