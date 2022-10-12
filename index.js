const express = require('express')
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static('wwwroot'))

app.get('/axios.min.js', function (req, res) {
  res.sendFile(__dirname + '/node_modules/axios/dist/axios.min.js')
})
app.get('/uuidv4.js', function (req, res) {
  res.sendFile(__dirname + '/node_modules/uuidv4/dist/uuidv4.js')
})

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
        socket.broadcast.emit(broad.ev, { type: broad.type, msg: broad.msg, files: broad.files });
    }
    catch { }
  });
});

server.listen(process.env.PORT || 3000, () => {

});