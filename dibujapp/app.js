//cargamos las librerias necesarias
var express = require('express'); //expressjs web framework
var http = require('http');
var io = require('socket.io'); // libreria web sockets

var app = express();
var server = http.createServer(app);
io = io.listen(server);

var numConexiones = 0;

app.get('/', function(req, res){
  res.sendfile('public/index.html');
});

app.use(express.static(__dirname + '/public'));


// Escuchamos conexiones entrantes
io.sockets.on('connection', function (socket) {
  numConexiones++;
  console.log('conectados', numConexiones);
  socket.broadcast.emit('conexiones', {conexiones:numConexiones});

  // Detectamos eventos de mouse
  socket.on('movermouse', function (data) {
    // transmitimos el movimiento a todos los clientes conectados
    socket.broadcast.emit('mover', data);
  });

  socket.on('disconnect', function() {
    numConexiones--;
    console.log('conectados', numConexiones);
    socket.broadcast.emit('connections', {conexiones:numConexiones});
  });
});

server.listen(3000);
console.log("Servidor Iniciado en el puerto 3000");