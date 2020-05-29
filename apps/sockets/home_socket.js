const cookieParser = require('cookie-parser');
const socketCookieParser = require('socket.io-cookie-parser');
const auth = require('../middleware/auth.middleware');
let UserController = require('../controllers/userController');
const redisAdapter = require('socket.io-redis');

const io = require('socket.io')({
  path: '/socket-api',
  cookie: false,
});

// io.adapter(redisAdapter({ host: process.env.REDIS_ADAPTER_HOST, port: process.env.REDIS_PORT }));

io.use(socketCookieParser());
io.use(auth.authSocket);
console.log(io.path());

let chatRoom = io.of('/chat-room')
  // .use(auth.authSocket)
  .on('connection', socket => {
    // socket.use(auth.authSocket);

    let userId = socket.request.userInfo.data._id.trim();
    if (userId) {
      UserController.setUserStatus(userId, true);
      socket.join(userId, () => {
        // chatRoom.to(userId).emit('server_send_chat_msg', {message: 'a new user has joined the room', type: 'all'});
      });

      socket.on('disconnect', () => {
        console.log("client disconnected");
        UserController.setUserStatus(userId, false);
      });
    } else {

    }
  });


module.exports = io;