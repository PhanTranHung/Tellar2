let express = require('express');
let router = express.Router();
let auth = require('../../middleware/auth.middleware');
let UserController = require('../../controllers/userController');

router.use('/', auth.authAPIs);

/**
 * discovery more friend or any public group
 * require a short string: name
 *
 * no function to find friends
 */
router.get('/discovery', UserController.discoverFriend);

router.get('/setting', (req, res) => {
  let query = req.query.query.trim();
  let message = req.message;
});

// router.get('/audio-call', auth.isAuth, (req, res) => {
//   let query = req.query.query.trim();
//
//
// });
//
// router.get('/video-call', auth.isAuth, (req, res) => {
//   let query = req.query.query.trim();
//
// });

/* GET home page. */
router.get('/user-info', UserController.getUserInformation);

module.exports = router;
