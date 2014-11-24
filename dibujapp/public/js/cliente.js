// abrimos la conexion
var socket = io.connect("http://localhost:3000"); //libreria socketio 
var canvas = $('#canvas'); //elemento canvas
var ctx = canvas[0].getContext('2d'); //contexto

// id único para la sesion
var id = Math.round($.now()*Math.random());
var dibujando = false;
var coord = {};
var cursores = {}
var usuarios = {}
var ultimoEmit = $.now();


socket.on('conexiones', function(datos){
	console.log('conectados', datos.conexiones);
});

$(document).on('mousemove', function(e){
	var movimiento = {
	        'x': e.pageX,
	        'y': e.pageY,
	        'dibujando': dibujando,
					'id' : id
	      };
	socket.emit('movermouse', movimiento);
	ultimoEmit = $.now();
});

socket.on('mover', function(datos){//recibimos el usurio y su movimiento en "datos"
	if(!(datos.id in usuarios)){
		// le damos un cursor a cada usuario
		cursores[datos.id] = $('<div class="cursor">').appendTo('#cursores');
	}
	// movemos el cursor a su posicion
    cursores[datos.id].css({
      'left' : datos.x,
      'top' : datos.y
    });
		if(datos.dibujando && usuarios[datos.id]){
		  dibujarLinea(usuarios[datos.id].x, usuarios[datos.id].y, datos.x, datos.y);
		}	
 	 // actualizamos el estado
    usuarios[datos.id] = datos;
    usuarios[datos.id].actualizado = $.now();
});


canvas.on('mousedown', function(e){
	e.preventDefault();
	dibujando = true;
	coord.x = e.pageX;
	coord.y = e.pageY;
});


$(document).bind('mouseup mouseleave',function(){
   dibujando = false;
});



function dibujarLinea(ox, oy, dx, dy){ //ox = origen en x, dx = destino en x
    ctx.beginPath(); //crea un nuevo path
    ctx.strokeStyle = "#222"; //color
    ctx.lineWidth = 3;  //grosor
    ctx.moveTo(ox, oy); //origen
    ctx.lineTo(dx, dy); //destino
    ctx.stroke(); //termina
}
 //se borran sesiones viejas
setInterval(function(){
    for(var i in usuarios){
      if($.now() - usuarios[i].actualizado > 10000){
        cursores[i].remove();
        delete usuarios[i];
        delete usuarios[i];
      }
    }
  },10000);