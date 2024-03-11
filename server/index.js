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

const users = []; // {id:..., username:...  }
io.on('connection', (socket) => {
  console.log('a user connected');
  users.push({id: socket.id, name: ''});
  console.log({ users });
  socket.emit('newMessage', {message: "Bienvenue dans le chat!", name: "server"});

  socket.on('message', (data) => {
    console.log('Message reçu du client:', data);
    console.log({ soketId: socket.id });
    io.emit('newMessage', data);
  });

  // Gérez la déconnexion des clients
  socket.on('setName', (username) => {
    const user = users.find(u => u.id == socket.id);
    if (user !== -1) {
        user.name = username
      users.splice(index, 1);
    }
    console.log('Un client s\'est déconnecté');
  });
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
