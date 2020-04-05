let mgs = require("mongoose");
let Schema = mgs.Schema;

let user_collection = require('../../configs/mongodb').collections.user_collection;

let schema = new Schema({
  _id: Schema.Types.ObjectId,
  sender_id: {
    type: Schema.Types.ObjectId,
    ref: user_collection,
    required: true
  },
  content: {
    type: String,
    min: 1,
    required: true,
    trim: true
  }
}, {
  timestamps: {
    createAt: "create_at",
    updateAt: "update_at"
  }
});

module.exports = schema;