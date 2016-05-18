var c = document.getElementById("field");
var ctx = c.getContext("2d");
var field = new Image();
field.src = "static/field.jpg";

var PLAYERS = new Array();
var PATHS = new Array();
var cursorX;
var cursorY;
var Xs = new Array();
var Ys = new Array();
var mouseDown = false;

field.onload = function(){
    ctx.drawImage(field,0,0,1024,768);
};

//Takes the initial x and y as parameters for testing purposes
var makePlayer = function(playerID){

    var ID = playerID;
    var path;
    var onPos;
    var x = 0;
    var y = 0; 
    this.onPos = 0;
    var undone;
    this.undone = true;

    var move = function(){

	path = PATHS[ID];
		
	if ( this.onPos <= 1){
	    this.x = path[0][this.onPos];
	    this.y = path[1][this.onPos];
	}
	
	if ( Math.abs( this.x - path[0][this.onPos] ) < 5 ){
	    this.x = path[0][this.onPos];
	} else {
	    if (this.x > path[0][this.onPos]){
		this.x -= 5;
	    } else {
		this.x += 5;
	    }
	}

 	if ( Math.abs( this.y - path[1][this.onPos] ) < 5 ){
	    this.y = path[1][this.onPos];
	} else {
	    if (this.y > path[1][this.onPos]){
		this.y -= 5;
	    } else {
		this.y += 5;
	    }
	}	
	//console.log(x, path[0][this.onPos], onPos);
	//console.log(this.onPos + " here1");

	if (this.x == path[0][this.onPos] && this.y == path[1][this.onPos]){
	    this.onPos+=1;
	}
	//console.log(this.onPos + " here2");

	if (this.onPos > path[0].length-1){
	    this.onPos = path[0].length-1;
	    this.undone = false;
	}
	//console.log(this.xpositions);
	//console.log(this.onPos + " here3");
	
	//onPos = xpositions.length-1;
	//console.log(this.x);
	//console.log(this.y);
	
	//ctx.clearRect(0,0,1024,786);
	ctx.drawImage(field,0,0,1024,768);
	drawArrow(path[0], path[1]);
	ctx.fillStyle = "red";
	ctx.lineWidth = "1";
	ctx.beginPath();
	ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
	ctx.stroke();
	ctx.fill();
    };

    return {
	move: move,
	undone: this.undone
    };
};

//Creates a test player at (100, 50) on the field
var player1 = makePlayer(PLAYERS.length);
PLAYERS.push(player1);

var add = function(){
    // Assuming this will be called when "Add Player" is pressed
    
    //Create a new player that may be added.
    var player = makePlayer(0, 0);
    
    var creation = function(){
	/*
	  If mouse is clicked, added mouseX and mouseY to the player's 
	  2 arrays..., figure out how to get the eventListener here...
	*/
    };
    
    // if add is pressed again, add the character with those the positions?
    PLAYERS.push(player);
};

// "run"button should call main() 
// windows.addEventListener(
var main = function(){
    var i=0;
    for (i = 0; i<PLAYERS.length; i++){
	if (PLAYERS[i].undone){
	    PLAYERS[i].move();
	}
    }
    var requestID = window.requestAnimationFrame( main );
};

//Call main() to draw initial players
//main();

var drawArrow = function(arrayX, arrayY){
    ctx.strokeStyle = "red";
    ctx.lineWidth = "5";
    for (var i = 1; i < arrayX.length; i++){
	ctx.beginPath();
	ctx.moveTo(arrayX[i - 1], arrayY[i - 1]);
	ctx.lineTo(arrayX[i], arrayY[i]);
	ctx.stroke();
    }
};

window.onmousemove = function(e){
    if ( mouseDown ){
	cursorX = e.pageX;
	cursorY = e.pageY;
	Xs.push( cursorX );
	Ys.push( cursorY );
	if (Xs.length > 0 && Ys.length > 0){
	    drawArrow(Xs, Ys);
	}
	//console.log(cursorX, cursorY);
	//record stuff onto something
    }
}

window.addEventListener("mousedown", function(e){
    mouseDown = true;
});
var main2 = function(){
    
    var i;
    if (player1.undone){
	player1.move();
    }
    var requestID = window.requestAnimationFrame( main );
};
window.addEventListener("mouseup", function(e){
    mouseDown = false;
    PATHS[0] = [Xs, Ys];
    //player1.xpositions = Xs;
    //player1.ypositions = Ys;
    //console.log(Xs);
    //console.log(Ys);
    //console.log(PLAYERS[0]);
    PLAYERS[0] = player1
    PLAYERS[0].xpositions = Xs;
    PLAYERS[0].ypositions = Ys;
    PLAYERS[0].onPos = 1;
    PLAYERS[0].undone = true;
    //console.log(PLAYERS[0].xpositions);
    //console.log(player1);
    Xs = new Array();
    Ys = new Array();
    main();
    //player1.onPos = 1;
    //main2();
});
