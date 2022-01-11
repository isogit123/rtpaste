const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const helmet = require('helmet')
app.use(helmet())
app.use(express.static('wwwroot'))
io.on('connection', (socket) => {
  //New user connected
  socket.on('joinroom', (room) => {
    socket.join(room)
  })
  socket.on('broadcast', (broad) => {
    try {
      //Broadcast is blocked if more than two users are in a room for security purposes.
      if (io.sockets.adapter.rooms.get(broad.ev).size > 2)
        socket.broadcast.emit(broad.ev, { type: -1 });
      else
        socket.broadcast.emit(broad.ev, { type: broad.type, msg: broad.msg });
    }
    catch { }
  });
});

server.listen(process.env.PORT || 3000, () => {
  
});