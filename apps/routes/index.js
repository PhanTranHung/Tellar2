let express = require('express');
let router = express.Router();
let auth = require('../middleware/auth.middleware');

/* GET home page. */
router.get('/', auth.authGUI ,function(req, res, next) {
  res.render('index', { username: 'Cuhungahihi' });
});

module.exports = router;
