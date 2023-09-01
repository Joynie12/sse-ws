// Получение ссылок на элементы DOM
const userList = document.getElementById('user-list');
const messages = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// WebSocket подключение
const socket = new WebSocket('ws://localhost:8080/ws'); // Измените порт по необходимости

// Обработчик открытия соединения WebSocket
socket.addEventListener('open', (event) => {
  const nickname = prompt('Enter your nickname:');
  socket.send(JSON.stringify({ type: 'join', nickname }));
});

// Обработчик получения сообщения от сервера
socket.addEventListener('message', (event) => {
  console.log('Received message:', event.data);
  const message = JSON.parse(event.data);
  console.log(message);
  if (message.type === 'userList') {
    updateUsers(message.users);
  } else if (message.type === 'message') {
    const isOwn = message.sender === 'You';
    displayMessage({ sender: message.sender, text: message.text, isOwn });
  }
});

// Обработчик клика по кнопке "Отправить"
sendButton.addEventListener('click', () => {
  const text = messageInput.value.trim();
  if (text !== '') {
    const isOwn = true;
    displayMessage({ sender: 'You', text, isOwn });
    socket.send(JSON.stringify({ type: 'message', text }));
    messageInput.value = '';
  }
});

// Обновление списка пользователей
function updateUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const userItem = document.createElement('li');
    userItem.textContent = user;
    userList.appendChild(userItem);
  });
}

// Отображение сообщения
function displayMessage(message) {
  console.log('Displaying message:', message);
  const messageItem = document.createElement('div');
  messageItem.className = 'message';
  if (message.isOwn) {
    messageItem.classList.add('own-message');
  } else {
    messageItem.classList.add('other-message');
  }
  messageItem.textContent = `${message.sender}: ${message.text}`;
  messages.appendChild(messageItem);
}
