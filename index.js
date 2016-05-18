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
    var onPos;
    var x = 0;
    var y = 0; 
    this.onPos = 1;
    var undone = true;
    this.undone = true;

    var move = function(){
	
	this.x = this.xpositions[this.onPos];
	this.y = this.ypositions[this.onPos];
	//console.log(x, xpositions[onPos], onPos);
	//console.log(this.onPos + " here1");
	this.onPos+=1;
	//console.log(this.onPos + " here2");

	if (this.onPos > this.xpositions.length-1){
	    this.onPos = this.xpositions.length-1;
	    this.undone = false;
	}
	//console.log(this.xpositions);
	//console.log(this.onPos + " here3");
	
	//onPos = xpositions.length-1;
	console.log(this.x);
	console.log(this.y);
	
	//ctx.clearRect(0,0,1024,786);
	ctx.fillStyle = "red";
	ctx.beginPath();
	ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
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
//main();

window.onmousemove = function(e){
    if ( mouseDown ){
	cursorX = e.pageX;
	cursorY = e.pageY;
	Xs.push( cursorX );
	Ys.push( cursorY );
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
    player1.xpositions = Xs;
    player1.ypositions = Ys;
    //console.log(Xs);
    //console.log(Ys);
    //console.log(PLAYERS[0]);
    //PLAYERS[0].xpositions = Xs;
    //PLAYERS[0].ypositions = Ys;
    //console.log(PLAYERS[0].xpositions);
    //console.log(player1);
    Xs = new Array();
    Ys = new Array();
    //main();
    player1.onPos = 1;
    main2();
});
