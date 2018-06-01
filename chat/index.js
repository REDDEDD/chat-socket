var app = require('express')();
var http = require('http').Server(app);
var socket = require('socket.io')(http);
var people = {};

//le enviamos el index
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

socket.on('connection', function(client){
    client.on("join", function(name){
        people[client.id] = name;
    });

    client.on("update", function(name){
    	client.emit("update", "You have connected to the server.");
		socket.sockets.emit("update", name + " has joined the server.");
		socket.sockets.emit("update-people", people);
    });

    client.on("send", function(msg){
        socket.sockets.emit("chat", people[client.id], msg);
    });
});

//puerto al que escucha
http.listen(3000, function(){
  console.log('listening on *:3000');
});