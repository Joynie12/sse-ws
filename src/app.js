const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 }); // Порт на котором работает WebSocket-сервер

const users = new Set();

server.on('connection', (socket) => {
  socket.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.type === 'join') {
      users.add(socket);
      broadcastUserList();
    } else if (data.type === 'message') {
      broadcastMessage(data);
    }
  });

  socket.on('close', () => {
    users.delete(socket);
    broadcastUserList();
  });
});

function broadcastUserList() {
  const userListMessage = JSON.stringify({
    type: 'userList',
    users: Array.from(users).map((socket) => socket.nickname),
  });
  users.forEach((socket) => {
    socket.send(userListMessage);
  });
}

function broadcastMessage(message) {
  const messageData = JSON.stringify({
    type: 'message',
    sender: message.nickname,
    text: message.text,
  });
  users.forEach((socket) => {
    socket.send(messageData);
  });
}
