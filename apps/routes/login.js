let express = require('express');
let router = express.Router();
let User = require('../models/user_model');
let jwtHelper = require('../helpers/jwt.helper');
let auth = require('../middleware/auth.middleware');
let md5 = require('md5');

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;

/* GET home page. */
router.get('/', auth.verifyToken, function(req, res, next) {
  res.render('login');
});

router.post('/', function (req, res, next) {
  let user_name = req.body.username.trim();
  let pass = req.body.pass.trim();
  pass = md5(pass);

  User.findOne({'user_name': user_name})
    .exec()
    .then(async function (adventure) {
      if (adventure && pass === adventure.pass){
        const accessToken = await jwtHelper.generateToken(adventure, accessTokenSecret, accessTokenLife);
        res.setHeader("set-cookie", "accessToken=" + accessToken);
        res.status(200).json({
          accessToken: accessToken,
        });
      }
      else res.status(200).json({
        err: "Username or password is wrong"
      });
    })
    .catch(err => {
      console.error(err)
    });

});

module.exports = router;