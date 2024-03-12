const { createServer } = require('http');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://127.0.0.1:5500', // Autorise les requêtes depuis ce domaine
    methods: ['GET', 'POST'] // Autorise les méthodes GET et POST
  }
});

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

//const users = []; // {id:..., username:...  }
const users =[
  // {"id": 1, "username": "Alice"},
  // {"id": 2, "username": "Bob"},
  // {"id": 3, "username": "Charlie"},
  // {"id": 4, "username": "David"},
  // {"id": 5, "username": "Eve"},
  // {"id": 6, "username": "Frank"},
  // {"id": 7, "username": "Grace"},
  // {"id": 8, "username": "Hannah"},
  // {"id": 9, "username": "Ivy"},
  // {"id": 10, "username": "Jack"}
]

// let name = ""
// users.map((user)=>{
//   name = user.name
// })

let name = ""
console.log(name);
io.on('connection', (socket) => {
  console.log('a user connected');
  // users.push({id: socket.id, name: ""});
  // console.log({ users });
  socket.emit('newMessage', {message: "Bienvenue dans le chat!", name: "serveur"});


  // Envoyer le nombre d'utilisateurs connectés au client
  io.emit('userCount', users.length);
  io.emit('users', users.filter(user => user.name != ''));

  socket.on('message', (data) => {
    console.log('Message reçu du client:', data);
    const { senderId, message} = data
    console.log({ senderId });
    let user = users.find(u => u.sockedId === senderId)
    data = {...data, user}
   
    io.to([senderId]).emit('newMessage', data);

    user = users.find(u => u.sockedId === socket.id)
    data = {...data, user}
    io.to([socket.id]).emit('newMessage', data);
  });



  
  socket.on('newUser', (name)=> {
    users.push({sockedId: socket.id, name})
    socket.join(socket.id)
    io.emit('users', users)
  })
 
  socket.on('disconnect', () => {
    const index = users.indexOf(socket.id);
    if (index !== -1) {
      users.splice(index, 1);
    }
    console.log('Un client s\'est déconnecté');
  });

});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
