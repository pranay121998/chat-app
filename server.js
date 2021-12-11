const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formateMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/user');

// const location = require('location')

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = 3000 || process.env.PORT;

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log("New connection is made");
  botName = 'chat bot'

  //when user join room
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room)
    // console.log(query);
    socket.join(user.room)
    socket.emit('message', formateMessage(botName, 'Welcome new user'));

    //broadcast when user joined
    socket.broadcast.to(user.room).emit('message', formateMessage(botName, `${user.username} has joined the chat!`));
 
    //send usrs and room info
    io.to(user.room).emit("roomUsers",{
      room:user.room,
      users:getRoomUsers(user.room)
    })
  })



  //listen to the chatMessage
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formateMessage(user.username, msg));
  })

  //when user leave the room
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit('message', formateMessage(botName, `${user.username} left the room`));
   
    //send usrs and room info
    io.to(user.room).emit("roomUsers",{
      room:user.room,
      users:getRoomUsers(user.room)
    })
    }

  });

})

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
})