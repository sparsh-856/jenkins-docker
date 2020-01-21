var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.send('<h1>Bingo!</h1>');
});

io.on('connection', function(socket){
  console.log('a new connection made');
});

http.listen(3000, function(){
  console.log('Server running on *:3000');
});