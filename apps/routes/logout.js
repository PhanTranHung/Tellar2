let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.setHeader("set-cookie", "accessToken=guest");
  res.status(200).json({
    redirect:'/sign-in'
  });

});

module.exports = router;