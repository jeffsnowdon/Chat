var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// serve file requests within the public directory
app.use(express.static('public'))

// requests to /lib will be redirected to /node_modules
app.use('/lib', express.static(__dirname + '/node_modules'));

// set homepage
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {

  socket.on('handshake-username', function (username) {
    socket.name = username;
    io.emit('userConnected', socket.name + ' connected.');
    socket.on('disconnect', function () {
      io.emit('userDisconnected', socket.name + ' disconnected.');
    });
    socket.on('set-username', function (name) {
      socket.name = name;
    });
    socket.on('message', function (msg) {
      io.emit('message', socket.name + ': ' + msg);
    });
  })

  socket.emit('handshake-username');

});



http.listen(3000, function () {
  console.log('listening on *:3000');
});
