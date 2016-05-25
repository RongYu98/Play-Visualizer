var c = document.getElementById("field");
var ctx = c.getContext("2d");
var field = new Image();
field.src = "static/field.jpg";

var requestID;

var PLAYERS = new Array();
var PATHS = new Array();
var cursorX;
var cursorY;
var Xs = new Array();
var Ys = new Array();
var mouse_Down = false;
var uninitiated = true;
var drawingPath = false;
var running = false;
var creatingTeam1;

var selected = false;
var select = -1;

var player;
var playerRatio;

var winHeight;
var winWidth;
var imgHeight;
var imgWidth;

field.onload = function(){
    resize();
};

var resize = function(){
    winHeight = $(window).height();
    winWidth = $(window).width();
    imgHeight = 768;
    imgWidth = 1024;
    playerRatio = $("canvas").attr("width")/1024;
    //console.log(playerRatio);

    if( winWidth/imgWidth <= winHeight/imgHeight ){
	$("canvas").attr("width", winWidth);
	$("canvas").attr("height", imgHeight * (winWidth/imgWidth));
	ctx.drawImage(field,0,0,winWidth,imgHeight * (winWidth/imgWidth));
    } else {
	$("canvas").attr("width", imgWidth * (winHeight/imgHeight));
	$("canvas").attr("height", winHeight);
	ctx.drawImage(field,0,0,imgWidth * (winHeight/imgHeight),winHeight);
    }
};
function iOS() {

  var iDevices = [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ];

  if (!!navigator.platform) {
    while (iDevices.length) {
      if (navigator.platform === iDevices.pop()){ return true; }
    }
  }

  return false;
}
var ios = iOS();

var makePlayer = function(playerID, team){

    var ID;
    this.ID = playerID;
    var x;
    var y; 
    var path;
    var onPos;
    this.onPos = 0;
    var undone;
    this.undone = true;
    var speed = 30 * playerRatio;
    var angle = 0;
    var team;
    this.team = team;

    var redo = function(){
	this.onPos = 0;
	this.x = PATHS[this.ID][0][this.onPos];
	this.y = PATHS[this.ID][1][this.onPos];
	console.log("redo done, onPos: "+this.onPos);
   }
   //console.log(this.team1);
    

    var draw = function(){
	if(this.team){
	    ctx.fillStyle = "red";
	}else{
	    ctx.fillStyle = "blue";
	}
	ctx.lineWidth = "1";
	ctx.beginPath();
	ctx.arc(this.x, this.y, 10 * playerRatio, 0, Math.PI * 2);
	ctx.stroke();
	ctx.fill();
    };

    
    var move = function(){

	path = PATHS[this.ID];
			
	this.speed = 30 * playerRatio;

	if ( this.onPos <= 1){
	    this.x = path[0][this.onPos];
	    this.y = path[1][this.onPos];
	}

	var imove = 0;
	for ( imove = 0; imove < speed; imove++ ){	
	if ( Math.abs( this.x - path[0][this.onPos] ) < .1 ){
	    this.x = path[0][this.onPos];
	} else {
	    if ( this.x - path[0][this.onPos] < 0 ){ 
		this.angle = Math.atan( ( this.y - path[1][this.onPos] )  / ( this.x - path[0][this.onPos]) );
		this.x += Math.cos(this.angle)*.1;
	    } else {
 		this.angle = Math.atan( ( this.y - path[1][this.onPos] )  / ( this.x - path[0][this.onPos]) );
		this.x += -1*Math.cos(this.angle)*.1;
	    }

	}
 	if ( Math.abs( this.y - path[1][this.onPos] ) < .1 ){
	    this.y = path[1][this.onPos];
	}  else {
	    if ( this.x - path[0][this.onPos] < 0 ){ 
		this.angle = Math.atan( ( this.y - path[1][this.onPos] )  / ( this.x - path[0][this.onPos]) );
		this.y += Math.sin(this.angle)*.1;
	    } else {
 		this.angle = Math.atan( ( this.y - path[1][this.onPos] )  / ( this.x - path[0][this.onPos]) );
		this.y += -1*Math.sin(this.angle)*.1;
	    }
	}
	//console.log(x, path[0][this.onPos], onPos);

	if (this.x == path[0][this.onPos] && this.y == path[1][this.onPos]){
	    this.onPos+=1;
	}

	if (this.onPos > path[0].length-1){
	    this.onPos = path[0].length-1;
	    this.undone = false;
	}
	//console.log(this.xpositions);

	}	

	//ctx.clearRect(0,0,1024,786);
	drawSetup();
    };

    return {
	draw: draw,
	move: move,
	undone: this.undone,
	onPos: this.onPos,
	ID: this.ID,
	x: this.x,
	y: this.y,
	speed: this.speed,
	team: this.team,
	redo: redo
    };
};

var drawSetup = function(){
    //ctx.drawImage(field,0,0,winWidth,field.height * (winWidth/field.width));
    resize();
    for (var i = 0; i < PLAYERS.length; i++){
	PLAYERS[i].draw();
    }
    for (var i = 0; i < PATHS.length; i++){
	drawPath(PATHS[i][0], PATHS[i][1], PLAYERS[i].team);
    }
};

var drawPath = function(arrayX, arrayY, team){
    if (team){
	ctx.strokeStyle = "red";
    }else{
	ctx.strokeStyle = "blue";
    }
    ctx.lineWidth = "5" * playerRatio;
    for (var i = 1; i < arrayX.length; i++){
	ctx.beginPath();
	ctx.moveTo(arrayX[i - 1], arrayY[i - 1]);
	ctx.lineTo(arrayX[i], arrayY[i]);
	ctx.stroke();
    }
    var xDiff = arrayX[arrayX.length - 1] - arrayX[arrayX.length - 2];
    var yDiff = arrayY[arrayY.length - 1] - arrayY[arrayY.length - 2];
    var slope = 9999;
    if (xDiff != 0){
	slope = yDiff / xDiff;
    }
    var angle = Math.atan(slope);
    var angleA = angle + 3 * Math.PI / 4;
    var angleB = angle - 3 * Math.PI / 4;
    if (xDiff < 0 || (xDiff == 0 && yDiff < 0)){
	angleA += Math.PI;
	angleB += Math.PI;
    }
    ctx.beginPath();
    ctx.moveTo(arrayX[arrayX.length - 1], arrayY[arrayY.length - 1]);
    ctx.lineTo(arrayX[arrayX.length - 1] + Math.round(Math.cos(angleA) * 20 * playerRatio), arrayY[arrayY.length - 1] + Math.round(Math.sin(angleA) * 20 * playerRatio));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(arrayX[arrayX.length - 1], arrayY[arrayY.length - 1]);
    ctx.lineTo(arrayX[arrayX.length - 1] + Math.round(Math.cos(angleB) * 20 * playerRatio), arrayY[arrayY.length - 1] + Math.round(Math.sin(angleB) * 20 * playerRatio));
    ctx.stroke();
};

var add = function(){  
    player = makePlayer(PLAYERS.length, true);
    drawingPath = true; ///////
    //drawingPath = !drawingPath;
    creatingTeam1 = true;
    help.innerHTML = "Click and drag to create a player and a path";
};

var add2 = function(){  
    player = makePlayer(PLAYERS.length, false);
    drawingPath = true;
    creatingTeam1 = false;
    help.innerHTML = "Click and drag to create a player and a path";
};


var run = function(){
    if (!running){
	running = true;
	main();
    }
};

var main = function(){
    for (var i = 0; i < PLAYERS.length; i++){
	if (PLAYERS[i].undone){
	    PLAYERS[i].move();
	    drawPath(Xs, Ys);
	}
    }
    requestID = window.requestAnimationFrame(main);
};

var stop = function(){
    window.cancelAnimationFrame(requestID);
    running = false;
};

var reset = function(){
    for (var i = 0; i < PLAYERS.length; i++){
	PLAYERS[i].undone = true;
	PLAYERS[i].onPos = 0;
	PLAYERS[i].x = PATHS[i][0][0];
	PLAYERS[i].y = PATHS[i][1][0];
    }
    drawSetup();
};


//pressing the buttons is mouse, touching the canvas is onTouchMove
window.onmousemove = function(e){
    //console.log(mouse_Down);
    if ( (mouse_Down && drawingPath) || select > -1 ){
	cursorX = e.offsetX;
	cursorY = e.offsetY;
	if (Xs.length == 0 || Math.abs(cursorX - Xs[Xs.length - 1]) >= 20 || Math.abs(cursorY - Ys[Ys.length - 1]) >= 20){
	    Xs.push( cursorX );
	    Ys.push( cursorY );
	    if (Xs.length > 0){
		drawSetup();
		drawPath(Xs, Ys, creatingTeam1);
	    }
	}
	//console.log(cursorX, cursorY);
	//record stuff onto something
    }
    if (mouse_Down && select > -1){
	console.log("selected");
    }
}
window.addEventListener("ontouchmove", function(e){
    e.preventDefault();
    //console.log(e.pageX);
    console.log("touchmove: "+drawingPath);
    if (drawingPath){
	cursorX = e.offsetX;
	cursorY = e.offsetY;
	if (Xs.length == 0 || Math.abs(cursorX - Xs[Xs.length - 1]) >= 20 || Math.abs(cursorY - Ys[Ys.length - 1]) >= 20){
	    Xs.push( cursorX );
	    Ys.push( cursorY );
	    if (Xs.length > 0){
		drawSetup();
		drawPath(Xs, Ys, creatingTeam1);
	    }
	}
	//console.log(cursorX, cursorY);
	//record stuff onto something
    }
});

window.addEventListener("mousedown", function(e){
    console.log("mouseDown");
    if (e.offsetX < c.width && e.offsetY < c.height && drawingPath){
	mouse_Down = true;
	//console.log("True");
    }

    if (selected){ 
	var xcor;
	this.xcor = e.offsetX;
	var ycor;
	this.ycor = e.offsetY;
	var i = 0;
	console.log("finding players at: "+this.xcor+" "+this.ycor);
	//console.log( PLAYERS.length);
	for (this.i = 0;this.i < PLAYERS.length; this.i++){
	    console.log( "mouse x,y: "+e.offsetX + " " + e.offsetY);
	    //console.log( "COORDS: "+e.pageX + " " + e.pageY);
	    console.log("Distance is: " +( PLAYERS[this.i].x - this.xcor )*( PLAYERS[this.i].x - this.xcor ));
	    console.log( "Compare with playerRatio of: "+playerRatio);
	    if ( ( PLAYERS[i].x - this.xcor )*( PLAYERS[this.i].x - this.xcor ) +
		 ( PLAYERS[this.i].y - this.ycor )*( PLAYERS[this.i].y - this.ycor ) <
		 ( (10 * playerRatio) * (10 * playerRatio) ) ){
		select = this.i;
		console.log("Selected Player is: "+select+" "); //+PLAYERS[select]);
		console.log("Selected Player's team1 is: "+ PLAYERS[select].team);
		creatingTeam1 = PLAYERS[select].team;
		break;
	    };
	}
	//selected = false;
    }
    if (drawingPath){
	player.x = e.offsetX;
	player.y = e.offsetY;
    }
});
window.addEventListener("ontouchstart", function(e){
    //console.log(e.pageX);
    //console.log("DOWN!!!!!!!!!!!");
    console.log("Started");
    console.log("Mouse_Down is: "+mouse_Down);

    mouse_Down = true;
    if (drawingPath){
	player.x = e.offsetX;
	player.y = e.offsetY;
    }
});

window.addEventListener("mouseup", function(e){
    console.log("mouseup");

    //console.log("Ended");
    if (Xs.length > 5){
       mouse_Down = false;
       console.log("Mouse_Down has been changed to false")
    }
    if (drawingPath && select == -1){
	//console.log(  PLAYERS[ PLAYERS.length -1] );
	//player = makePlayer(PLAYERS.length, PLAYERS[ PLAYERS.length - 1].team );
	PATHS[player.ID] = [Xs, Ys];
	player.onPos = 0;
	player.undone = true;
	PLAYERS.push(player);
	drawSetup(); ////////
	drawingPath = false;
	Xs = new Array();
	Ys = new Array();
	help.innerHTML = "";
    } else if ( select > -1){
	//console.log("got to else if");
	console.log(Xs);
	PATHS[ PLAYERS[select].ID] = [Xs, Ys];
	PLAYERS[select].redo();
	PLAYERS[select].undone = true;
	drawSetup();
	drawingPath = false;
	select = -1;
	Xs = new Array();
	Ys = new Array();
	help.innerHTML = "";
    }
    //console.log("WENT UP");
});

///THIS doesn't work...... need to fix
window.addEventListener("ontouchend", function(e){
    console.log("ENDED");
    if ( Xs.length > 3 ){
       mouse_Down = false;
       console.log("FALSE, ended touch");
    }
    if (drawingPath){
	PATHS[player.ID] = [Xs, Ys];
	player.onPos = 0;
	player.undone = true;
	PLAYERS.push(player);
	drawSetup();
	drawingPath = false;
	Xs = new Array();
	Ys = new Array();
	help.innerHTML = "";
    }
});

var selectButton = document.getElementById("select");
selectButton.addEventListener("click", function(e){
    selected = !selected;
    
});


window.addEventListener("resize", resize);

var addButton = document.getElementById("add");
addButton.addEventListener("click", add);
var addButton2 = document.getElementById("add2");
addButton2.addEventListener("click", add2);
var runButton = document.getElementById("run");
runButton.addEventListener("click", run);
var stopButton = document.getElementById("stop");
stopButton.addEventListener("click", stop);
var resetButton = document.getElementById("reset");
resetButton.addEventListener("click", reset);

var help = document.getElementById("help");
//1
