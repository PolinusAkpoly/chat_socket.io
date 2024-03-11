document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const username = document.getElementById('name');
    const sendBtn = document.getElementById('send-btn');
    const messages = []

    const socket = io("http://localhost:3000");

    socket.on('initialMessages', (messages) => {
      messages.forEach((message) => {
        appendMessage(message, 'bot-message');
      });
    });
   
  

  
    sendBtn.addEventListener('click', function() {
      sendMessage();
    });
  
    function sendMessage() {
      const message = userInput.value.trim();
      const name = username.value.trim();

      if (message !== '') {
        // appendMessage('You', message);
        socket.emit('message', {message, name});
        userInput.value = '';
        // Here you can add your logic for processing user message and generating bot response
      }
    }
  
    socket.on('newMessage', ({name, message}) => {
        console.log({message});
      appendMessage(name, message);
    });


    function appendMessage(sender, message) {
      const messageElement = document.createElement('div');
      messageElement.classList.add('message');
      messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
      chatBox.appendChild(messageElement);
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  });
  


