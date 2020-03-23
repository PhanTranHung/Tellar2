let mgs = require("mongoose");
let Schema = mgs.Schema;

let schema_user = "users";

let schema = Schema({
  _id: Schema.Types.ObjectId,
  sender_id: {
    type: Schema.Types.ObjectId,
    ref: schema_user,
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