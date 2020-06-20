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
      .withMessage("Your name must be bettwen 5 to 30 characters"),
    body("user_name")
      .trim()
      .isLength({min: 5, max: 30})
      .withMessage("User name must be between 5 and 30 characters and cannot use spaces"),
    body('email')
      .trim()
      .isEmail()
      .withMessage("Email is not valid"),
    body('pass')
      .trim()
      .custom((value, { req }) => {
        if (value.trim() !== req.body.confirmPass.trim()) {
          throw new Error('Password confirmation does not match');
        } else return true;
      }),
    body('phone')
      .trim()
      .isMobilePhone(['vi-VN'])
      .withMessage("Mobile phone is not valid"),
    body("gender")
      .trim()
      .toBoolean()
      // .withMessage("Gender is not valid"),
  ],
  function (req, res, next) {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(401).json({
        error: true,
        error_array_messgase: errors.array(),
        message: "Some information is not valid"
      });
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
      res.status(200).json({
        success: true,
        message: "Sign-up successsfully. Log in now",
        redirect: true,
        path: "/",
      });
    }).catch(err => {
      res.status(401).json({
        error: true,
        message: "Sorry, an error occurred when registering for you, try again later!!"
      });
      console.log(err);
    });

  });
module.exports = router;