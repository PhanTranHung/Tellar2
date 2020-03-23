let mgs = require("mongoose");
let default_user = require('../../configs/default_attr');

console.log(default_user.DEFAULT_COVER_PHOTO);
let schema_group = "groups";
let Schema = mgs.Schema;

let user = mgs.Schema({
  _id: mgs.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
    min: [5, "Too few character"],
    max: [30, 'Too many characters'],
    lowercase: false,
    trim: true

  },
  user_name: {
    type: String,
    required: true,
    min: [5, "Too few character"],
    max: [30, 'Too many characters'],
    lowercase: true,
    trim: true
  },
  pass: {
    type: String,
    required: [true, "Password not null"],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        let re = '[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?';
        return String(v).toLowerCase().match(re);
      },
      message: 'Email invalid'
    }
  },
  sdt: {
    type: String,
    required: [true, "Phone number must be not null"],
    trim: true
  },
  birth_day: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    trim: true,
    lowercase: true
  },
  gender: {
    type: Boolean,
    trim: true,
    required: true
  },
  last_active: {
    type: String,
    trim: true,
    lowercase: true,
    default: Date
  },
  is_activate: {
    type: Boolean,
    default: false
  },
  joined_group: [{
    type: mgs.Schema.Types.ObjectId,
    ref: schema_group
  }],
  cover_photo: {
    type: String,
    default: null,
    get: v => {
      return (v) ? v : default_user.DEFAULT_COVER_PHOTO;
    }
  },
  token: {
    type: String,
    default: null
  },
  other: {}
}, {
  toJSON: {getters: true},
  timestamps: {
    createAt: "create_at",
    updateAt: "update_at"
  }
});

module.exports = user;

