var c = document.getElementById("field");
var ctx = c.getContext("2d");

var PLAYERS = new Array();
var cursorX;
var cursorY;
var Xs = new Array();
var Ys = new Array();
var mouseDown = false;

//Takes the initial x and y as parameters for testing purposes
var makePlayer = function(startX, startY){
    
    var xpositions = new Array();
    xpositions.push(startX);
    var ypositions = new Array();
    ypositions.push(startY);
    var onPos = 0;
    var x = 0;
    var y = 0; 

    var move = function(){
	
	x = xpositions[onPos];
	y = ypositions[onPos];
	if (onPos > xpositions.length){
	    onPos += 1;
	}

	ctx.fillStyle = "red";
	ctx.beginPath();
	ctx.arc(x, y, 10, 0, Math.PI * 2);
	ctx.stroke();
	ctx.fill();
    };

    return {
	move: move
    };
};

//Creates a test player at (100, 50) on the field
var player1 = makePlayer(100, 50);
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
    
    var i;
    for (i = 0; i<PLAYERS.length; i++){
	PLAYERS[i].move();
    }
    var requestID = window.requestAnimationFrame( main );
};

//Call main() to draw initial players
main();

window.onmousemove = function(e){
    if ( mouseDown ){
	cursorX = e.pageX;
	cursorY = e.pageY;
	Xs.push( cursorX );
	Ys.push( cursorY );
	console.log(cursorX, cursorY);
	//record stuff onto something
    }
}

window.addEventListener("mousedown", function(e){
    mouseDown = true;
});
window.addEventListener("mouseup", function(e){
    mouseDown = false;
});
