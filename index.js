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
var mouseDown = false;
var uninitiated = true;
var drawingPath = false;
var running = false;

var player;

var winHeight = $(window).height();
var winWidth = $(window).width();
var imgHeight = 768;
var imgWidth = 1024;

field.onload = function(){
    resize();
};

var resize = function(){
    winHeight = $(window).height();
    winWidth = $(window).width();
    imgHeight = 768;
    imgWidth = 1024;

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

var makePlayer = function(playerID){

    var ID;
    this.ID = playerID;
    var x;
    var y; 
    var path;
    var onPos;
    this.onPos = 0;
    var undone;
    this.undone = true;
    var speed = 30;
    var angle = 0;

    var draw = function(){
	ctx.fillStyle = "red";
	ctx.lineWidth = "1";
	ctx.beginPath();
	ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
	ctx.stroke();
	ctx.fill();
    };
    
    var move = function(){

	path = PATHS[this.ID];
			
	if ( this.onPos <= 1){
	    this.x = path[0][this.onPos];
	    this.y = path[1][this.onPos];
	}

	var imove = 0;
	for ( imove = 0; imove < speed; imove++ ){
	
	if ( Math.abs( this.x - path[0][this.onPos] ) < .1 ){
	    this.x = path[0][this.onPos];
	} else if ( Math.abs( this.x - path[0][this.onPos] ) >= 
	 	    Math.abs( this.y - path[1][this.onPos] ) ){
	    if (this.x > path[0][this.onPos]){
		this.x -= .1;
	    } else {
		this.x += .1;
	    }
	}
	if ( Math.abs( this.y - path[1][this.onPos] ) < .1 ){
	    this.y = path[1][this.onPos];
	} else if ( Math.abs( this.x - path[0][this.onPos] ) < 
	 	    Math.abs( this.y - path[1][this.onPos] ) ){
	    //console.log("moved y");
	    if (this.y > path[1][this.onPos]){
		this.y -= .1;
	    } else {
		this.y += .1;
	    }
	}		
	

	/*
	if ( Math.abs( this.x - path[0][this.onPos] ) < .1 ){
	    this.x = path[0][this.onPos];
	} else {
	    if ( this	
 	    this.x += Math.cos(this.angle)*this.v;
	    this.y += Math.sin(this.angle)*this.v;
	}
 	if ( Math.abs( this.y - path[1][this.onPos] ) < .1 ){
	    this.y = path[1][this.onPos];
	} else {
	    if (this.y > path[1][this.onPos]){
		this.y -= .1;
	    } else {
		this.y += .1;
	    }
	}	
	*/	
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
	//onPos = xpositions.length-1;
	//console.log(this.x);
	//console.log(this.y);
	
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
	speed: this.speed
    };
};

var drawSetup = function(){
    //ctx.drawImage(field,0,0,winWidth,field.height * (winWidth/field.width));
    resize();
    for (var i = 0; i < PLAYERS.length; i++){
	PLAYERS[i].draw();
    }
    for (var i = 0; i < PATHS.length; i++){
	drawPath(PATHS[i][0], PATHS[i][1]);
    }
};

var drawPath = function(arrayX, arrayY){
    ctx.strokeStyle = "red";
    ctx.lineWidth = "5";
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
    ctx.lineTo(arrayX[arrayX.length - 1] + Math.round(Math.cos(angleA) * 20), arrayY[arrayY.length - 1] + Math.round(Math.sin(angleA) * 20));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(arrayX[arrayX.length - 1], arrayY[arrayY.length - 1]);
    ctx.lineTo(arrayX[arrayX.length - 1] + Math.round(Math.cos(angleB) * 20), arrayY[arrayY.length - 1] + Math.round(Math.sin(angleB) * 20));
    ctx.stroke();
};

var add = function(){  
    player = makePlayer(PLAYERS.length);
    drawingPath = true;
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

window.onmousemove = function(e){
    if (mouseDown && drawingPath){
	cursorX = e.pageX;
	cursorY = e.pageY;
	if (Xs.length == 0 || Math.abs(cursorX - Xs[Xs.length - 1]) >= 20 || Math.abs(cursorY - Ys[Ys.length - 1]) >= 20){
	    Xs.push( cursorX );
	    Ys.push( cursorY );
	    if (Xs.length > 0){
		drawSetup();
		drawPath(Xs, Ys);
	    }
	}
	//console.log(cursorX, cursorY);
	//record stuff onto something
    }
}
window.ontouchmove = function(e){
    console.log(e.pageX);
    console.log(mouseDown);
    if (mouseDown && drawingPath){
	cursorX = e.pageX;
	cursorY = e.pageY;
	if (Xs.length == 0 || Math.abs(cursorX - Xs[Xs.length - 1]) >= 20 || Math.abs(cursorY - Ys[Ys.length - 1]) >= 20){
	    Xs.push( cursorX );
	    Ys.push( cursorY );
	    if (Xs.length > 0){
		drawSetup();
		drawPath(Xs, Ys);
	    }
	}
	//console.log(cursorX, cursorY);
	//record stuff onto something
    }
}

window.addEventListener("mousedown", function(e){
    console.log(e.pageX);
    mouseDown = true;
    console.log(mouseDown);
    if (drawingPath){
	player.x = e.pageX;
	player.y = e.pageY;
    }
});
window.addEventListener("ontouchstart", function(e){
    console.log(e.pageX);
    console.log("DOWN!!!!!!!!!!!");
    mouseDown = true;
    if (drawingPath){
	player.x = e.pageX;
	player.y = e.pageY;
    }
});

window.addEventListener("mouseup", function(e){
    mouseDown = false;
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
window.addEventListener("ontouchend", function(e){
    console.log("ENDED");
    if ( Xs.length > 3 ){
       mouseDown = false;
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


window.addEventListener("resize", resize);

var addButton = document.getElementById("add");
addButton.addEventListener("click", add);
var runButton = document.getElementById("run");
runButton.addEventListener("click", run);
var stopButton = document.getElementById("stop");
stopButton.addEventListener("click", stop);
var resetButton = document.getElementById("reset");
resetButton.addEventListener("click", reset);

var help = document.getElementById("help");
