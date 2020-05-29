$(document).ready(function () {
  let chatRoom = io('/chat-room', {
    path: '/socket-api'
  });

  chatRoom.on('server_send_chat_msg', function (data) {
    console.log(data);

    addNewMessage(data.detail.content, data.detail.sender_id, data.to);
  });
});


