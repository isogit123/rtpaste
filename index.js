const express = require('express')
const multer = require('multer')
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const helmet = require('helmet')
const { uuid } = require('uuidv4');

app.use(helmet())
app.use(express.static('wwwroot'))

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/wwwroot/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, uuid() + '_' + file.originalname)
  }
})

const upload = multer({ storage: storage })
app.post('/upload', upload.array('files'), function (req, res, next) {
  let filenames = req.files.map((file => file.filename))
res.send(filenames)

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