//var c = document.getElementById("playground");
//var ctx = c.getContext("2d");

var PLAYERS = new Array();
var cursorX;
var cursorY;
var Xs = new Array();
var Ys = new Array();
var mouseDown = false;

function PLAYER(){
    
    var xpositions = new Array();
    var ypositions = new Array(); 
    var onPos = 0;
    var x = 0;
    var y = 0; 
    var move = true;

    this.move = function(){

	x = xpositions[onPos];
	y = ypositions[onPos];
	if (onPos > xpositions.length){
	    onPos += 1;
	}

	// draw
	// ............
    };
}

var add = function(){
    // Assuming this will be called when "Add Player" is pressed
    
    //Create a new player that may be added.
    var player = PLAYER();
    
    var creation = function(){
	/*
	  If mouse is clicked, added mouseX and mouseY to the player's 
	  2 arrays..., figure out how to get the eventListener here...
	*/
    };
    
    // if add is pressed again, add the character with those the positions?
    PLAYERS.push(PLAYER);
}

// "run"button should call main() 
// windows.addEventListener(
function main(){
    
    var i;
    for (i = 0; i<PLAYERS.length; i++){
	PLAYERS[i].move();
    }
    var requestID = window.requestAnimationFrame( main );
}

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
