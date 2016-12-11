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
  io.emit('user connected', 'a user connected');
  socket.on('disconnect', function () {
    io.emit('user disconnected', 'a user disconnected');
  });
  socket.on('setName', function (name) {
    socket.name = name;
  });
  socket.on('chat message', function (msg) {
    io.emit('chat message', socket.name + ': ' + msg);
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});
