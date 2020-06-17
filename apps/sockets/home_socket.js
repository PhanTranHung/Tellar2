const socketCookieParser = require('socket.io-cookie-parser');
const auth = require('../middleware/auth.middleware');
let UserBO = require('../BO/userBO');

const io = require('socket.io')({
  path: '/socket-api',
  cookie: false,
});

// io.adapter(redisAdapter({ host: process.env.REDIS_ADAPTER_HOST, port: process.env.REDIS_PORT }));

io.use(socketCookieParser());
io.use(auth.authSocket);
// io.use(socketErrorHandler);

console.log(io.path());

let chatRoom = io.of('/chat-room')
  // .use(auth.authSocket)
  .on('connection', socket => {
    // socket.use(auth.authSocket);

    let userId = socket.request.userInfo.data._id.trim();
    if (userId) {
      UserBO.setUserStatus(userId, true);
      socket.join(userId, () => {
        // chatRoom.to(userId).emit('server_send_chat_msg', {message: 'a new user has joined the room', type: 'all'});
      });

      socket.on('disconnect', () => {
        console.log("client disconnected");
        UserBO.setUserStatus(userId, false);
      });
    } else {

    }
  });


function socketErrorHandler (socket, next){
  // if (error) socket.emit("error", error);
  return socket.disconnect();
}

module.exports = io;