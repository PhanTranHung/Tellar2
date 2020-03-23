let express = require('express');
let router = express.Router();
let auth = require('../middleware/auth.middleware');
let mgs = require('mongoose');
let User = require('../models/user_model');

/* GET home page. */
router.get('/', auth.isAuth ,function(req, res, next) {
  res.render('index', { username: 'Cuhungahihi' });
});

module.exports = router;
