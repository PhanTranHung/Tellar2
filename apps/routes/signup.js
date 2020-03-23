let express = require('express');
let router = express.Router();
let auth = require('../middleware/auth.middleware');
let User = require("../models/user_model");
let mgs = require('mongoose');
let md5 = require('md5');
const {body, validationResult} = require('express-validator');

/* GET home page. */
router.get('/', auth.verifyToken, function (req, res, next) {
  res.render('sign_up');
});

router.post('/',
  [
    body('name')
      .trim()
      .isLength({min: 5, max: 30})
      .withMessage("Your name too long or short"),
    body("user_name")
      .trim()
      .isLength({min: 5, max: 30})
      .withMessage("Username is not valid"),
    body('email')
      .trim()
      .isEmail()
      .withMessage("Email is not valid"),
    body('pass')
      .trim()
      .custom((value, { req }) => {
        if (value.trim() !== req.body.confirmPass.trim()) {
          throw new Error('Password confirmation is incorrect');
        } else return true;
      }),
    body('phone')
      .trim()
      .isMobilePhone(['vi-VN'])
      .withMessage("Mobile phone is not valid"),
    body("gender")
      .trim()
      .toBoolean()
  ],
  function (req, res, next) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(422).json({ errors: errors.array() });
    }

    let data = req.body;

    let user = new User({
      _id: new mgs.Types.ObjectId,
      name: data.name,
      user_name: data.user_name,
      pass: md5(data.pass),
      email: data.email,
      sdt: data.phone,
      gender: data.gender,
      birth_day: new Date(data.birth)
    });

    user.save().then(user_saved => {
      res.redirect("/sign-in");
    }).catch(err => {
      res.status(401).json({err: err});
      console.log(err);
    });

  });
module.exports = router;