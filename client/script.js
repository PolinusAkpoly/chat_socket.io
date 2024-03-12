document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const username = document.getElementById('user-name');
    const sendBtn = document.getElementById('send-btn');
    const saveBtn = document.getElementById('save-username');
    const messages = []
    let users = []
    let senderId = null


    const socket = io("http://localhost:3000");




    const selectUser = ({sockedId}) => {
      senderId = sockedId
      console.log({sockedId});
      // socket.emit('data', {id, name, senderId});
    }
    saveBtn.onclick = (eventt)=>{
      const name = username.value
      socket.emit("newUser",name)
    }
    
    const updateUsers = (users) => {
      users = users
      const usersList = document.getElementById('users');
      usersList.innerHTML = ''; // Effacez la liste précédente pour éviter les doublons
    
      users.forEach((user, index) => {
        const li = document.createElement('li'); // Créez un nouvel élément li
        li.className = 'list-group-item';
        li.textContent = user.name;
        li.id = `${user.socketId}`; // Attribuez un ID unique à chaque élément li
        li.onclick = () => selectUser(user);
        usersList.appendChild(li); // Ajoutez l'élément li à la liste
        // console.log(li);
      });
    };
    
    // const changeUser = (users) => {
    //   const userName = document.getElementById('user-name');
    //   const randomIndex = Math.floor(Math.random() * users.length); 
    //   userName.value = users[randomIndex].username; 
    // };
    

    socket.on('initialMessages', (messages) => {
      messages.forEach((message) => {
        appendMessage(message, 'bot-message');
      });
    });

    socket.on('users', (users) => {
      console.log(users);
      const usersNumber = document.getElementById('usersNumber'); 
      usersNumber.textContent = users.length;
        updateUsers(users);
        // changeUser(users)
    });
   
    // socket.on('userCount', (usersLength) => {
    //   const usersNumber = document.getElementById('usersNumber'); 
    //   usersNumber.textContent = usersLength; 
    // });
 
  
    sendBtn.addEventListener('click', function() {
      if(senderId){
        sendMessage();
      }
     
    });
  
    function sendMessage() {
      const message = userInput.value.trim();
      const name = username.value.trim();

      if (message !== '') {
        // appendMessage('You', message);
        socket.emit('message', {message,  senderId});
        userInput.value = '';
        // Here you can add your logic for processing user message and generating bot response
      }
    }
  
    socket.on('newMessage', ({senderId, user, message}) => {
        console.log({message});
        console.log({user});
        appendMessage(user?.name , message);
      // const user = users.find(u => u.sockedId === senderId)
      // console.log({user});
      // if(user){
        
      // }
     
    });


    function appendMessage(sender, message) {
      const messageElement = document.createElement('div');
      messageElement.classList.add('message');
      messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
      chatBox.appendChild(messageElement);
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  });
  


