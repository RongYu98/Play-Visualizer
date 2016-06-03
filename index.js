/* global $, navigator */

// Initialization
var c = document.getElementById("field");
var ctx = c.getContext("2d");

var field = $('<img>');
field.attr('src', 'static/field.jpg');
field.on('load', resize);

var help = $('#help');

var requestID;

var PLAYERS = new Array();
var PATHS = {};
var cursorX;
var cursorY;
var Xs = new Array();
var Ys = new Array();
var mouse_Down = false;
var drawingPath = false;
var running = false;
var creatingTeam1 = true;

var selecting = false;
var select = -1;

var deleting = false;

var totalCreated = 0;

var player, playerRatio;
var winHeight, winWidth;
var imgHeight, imgWidth;
var currentHeight, currentWidth;



// Field Resize Function
function resize() {
    //console.log("RESIZED");
    winHeight = $(window).height();
    winWidth = $(window).width();
    imgHeight = 768;
    imgWidth = 1024;
    playerRatio = $("canvas").attr("width")/1024;

    var i = 0;
    var a = 0;

    //console.log("The totalCreated is: "+totalCreated);
    //console.log("Length "+PATHS.length);//undefined

    
    //if (totalCreated > 1){
	//console.log("XY Before: "+PATHS[0][0][0]+" "+PATHS[0][1][0]);
    //}

    for (i=0; i<totalCreated-1; i++){// this not linear, sometimes wrong
	if (PATHS[i]!=null){
	    for (a=0; a<PATHS[i][0].length; a++){
		PATHS[i][0][a] = PATHS[i][0][a] / currentWidth;
		PATHS[i][1][a] = PATHS[i][1][a] / currentHeight;
	    }
	}
    }
    for (i=0; i<PLAYERS.length;i++){
	PLAYERS[i].x = PLAYERS[i].x / currentWidth;
	PLAYERS[i].y = PLAYERS[i].y / currentHeight;
    }

    //if (totalCreated > 1){
        //console.log("XY Empirical: "+PATHS[0][0][0]+" "+PATHS[0][1][0]);
    //}

    if (winWidth/imgWidth <= winHeight/imgHeight) {
        currentWidth = winWidth;
        currentHeight = imgHeight * (winWidth/imgWidth);
	for (i=0; i<totalCreated-1; i++){
	    if (PATHS[i]!=null){
		for (a=0; a<PATHS[i][0].length; a++){
		    PATHS[i][0][a] = PATHS[i][0][a] * currentWidth;
		    PATHS[i][1][a] = PATHS[i][1][a] * currentHeight;
		}
	    }
	}
	for (i=0; i<PLAYERS.length;i++){
	    PLAYERS[i].x = PLAYERS[i].x * currentWidth;
	    PLAYERS[i].y = PLAYERS[i].y * currentHeight;
	}
    } else {
        currentWidth = imgWidth * (winHeight/imgHeight);
        currentHeight = winHeight;
	for (i=0; i<totalCreated-1; i++){
	    if (PATHS[i]!=null){
		for (a=0; a<PATHS[i][0].length; a++){
		    PATHS[i][0][a] = PATHS[i][0][a] * currentWidth;
		    PATHS[i][1][a] = PATHS[i][1][a] * currentHeight;
		}
	    }
	}
	for (i=0; i<PLAYERS.length;i++){
	    PLAYERS[i].x = PLAYERS[i].x * currentWidth;
	    PLAYERS[i].y = PLAYERS[i].y * currentHeight;
	}
    }   
    //if (totalCreated > 1){
	//console.log("XY After: "+PATHS[0][0][0]+" "+PATHS[0][1][0]);
    //}
    $("canvas").attr("width", currentWidth);
    $("canvas").attr("height", currentHeight);
    ctx.drawImage(field.get(0), 0, 0, currentWidth, currentHeight);
}



// Player creation function
function makePlayer(playerID, team) {
    this.ID = playerID;
    this.onPos = -1;
    this.undone = true;
    this.team = team;
    var path;
    var speed = 30;
    // var angle = 0;
    
    var redo = function() {
        this.onPos = 0;
        this.x = PATHS[this.ID][0][this.onPos];
        this.y = PATHS[this.ID][1][this.onPos];
        console.log("redo done, onPos: "+this.onPos);
    };
    
    var draw = function() {
        if (this == PLAYERS[select]) {
            ctx.strokeStyle = "yellow";
            ctx.lineWidth = Math.round(10 * playerRatio);
        } else {
            ctx.lineWidth = 1;
            if (this.team) {
                ctx.strokeStyle = "red";
            } else {
                ctx.strokeStyle = "blue";
            }
        }
        
        if (this.team) {
            ctx.fillStyle = "red";
        } else {
            ctx.fillStyle = "blue";
        }
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10 * playerRatio, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
    };
    
    var move = function() {
        path = PATHS[this.ID];
        this.speed = speed * playerRatio;
        
        if (this.onPos < 0 ) {
	    this.onPos = 0;
            this.x = path[0][this.onPos];
            this.y = path[1][this.onPos];
	    console.log("This was onPos = -1, so setted it");
        }
    
    var save = function() {
        return JSON.stringify({
           
        });
    };
        
	console.log(path);
        for (this.imove = 0; this.imove < this.speed; this.imove++) {	
            
	    //console.log("This is now on: "+this.x+" "+this.y);
	    //console.log(path);
            if (Math.abs( this.x - path[0][this.onPos] ) < .1) {
                this.x = path[0][this.onPos];
            } else {
                if (this.x - path[0][this.onPos] < 0) {
                    this.angle = Math.atan( ( this.y - path[1][this.onPos] )  / ( this.x - path[0][this.onPos]) );
                    this.x += Math.cos(this.angle)*.1;
                } else {
                    this.angle = Math.atan( ( this.y - path[1][this.onPos] )  / ( this.x - path[0][this.onPos]) );
                    this.x += -1*Math.cos(this.angle)*.1;
                }
            }
            
            if ( Math.abs( this.y - path[1][this.onPos] ) < .1 ) {
                this.y = path[1][this.onPos];
            } else {
                if ( this.x - path[0][this.onPos] < 0 ) {
                    this.angle = Math.atan( ( this.y - path[1][this.onPos] )  / ( this.x - path[0][this.onPos]) );
                    this.y += Math.sin(this.angle)*.1;
                } else {
                    this.angle = Math.atan( ( this.y - path[1][this.onPos] )  / ( this.x - path[0][this.onPos]) );
                    this.y += -1*Math.sin(this.angle)*.1;
                }
            }
            
            if (this.x == path[0][this.onPos] && this.y == path[1][this.onPos]) {
                this.onPos+=1;
            } else {
		console.log("need "+this.x-path[0][this.onPos]+" more for x");
	    }
            
            if (this.onPos > path[0].length-1) {
                this.onPos = path[0].length-1;
                this.undone = false;
            }
        }
	console.log("DONE WITH LOOP");
	console.log("This is it's speed: "+this.speed);
        console.log("This is imove: "+this.imove);
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
}



// Path Drawing Functions
function drawSetup() {
    resize();
    for (var i = 0; i < PLAYERS.length; i++) {
        var current = PLAYERS[i];
        current.draw();
        drawPath(PATHS[current.ID][0], PATHS[current.ID][1], current.team);
    }
}

function drawPath(arrayX, arrayY, team) {
    if (team) {
        ctx.strokeStyle = "red";
    } else {
        ctx.strokeStyle = "blue";
    }
    
    ctx.lineWidth = "5" * playerRatio;
    
    for (var i = 1; i < arrayX.length; i++) {
        ctx.beginPath();
        ctx.moveTo(arrayX[i - 1], arrayY[i - 1]);
        ctx.lineTo(arrayX[i], arrayY[i]);
        ctx.stroke();
    }

    var xDiff = arrayX[arrayX.length - 1] - arrayX[arrayX.length - 2];
    var yDiff = arrayY[arrayY.length - 1] - arrayY[arrayY.length - 2];
    var slope = 9999;
    
    if (xDiff != 0) {
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
}



// Window Event Handler Assignment
//     (pressing the buttons is mouse, touching the canvas is onTouchMove)
$(window).on('mousemove', function(e) {
    console.log("Mouse_Down is: "+mouse_Down+" DrawingPath is: "+drawingPath);

    if ((mouse_Down && drawingPath) || select > -1 ) {
    //if ( mouse_Down || select > -1){
        cursorX = e.offsetX;
        cursorY = e.offsetY;
        
        if ((Xs.length == 0 || Math.abs(cursorX - Xs[Xs.length - 1]) >= 20 || 
            Math.abs(cursorY - Ys[Ys.length - 1]) >= 20) &&
            e.pageX >= (winWidth - currentWidth) / 2 &&
            e.pageX <= (winWidth + currentWidth) / 2 &&
            e.pageY > 0 && e.pageY <= currentHeight
        ) {
            Xs.push( cursorX );
            Ys.push( cursorY );
            if (Xs.length > 0) {
                drawSetup();
                drawPath(Xs, Ys, creatingTeam1);
            }
        }
        //console.log(cursorX, cursorY);
        //record stuff onto something
    }
    if (mouse_Down && select > -1) {
            console.log("selected");
    }
});

$(window).on('mousedown', function(e) {
    //console.log("mouseDown");
    // if you're within boundaries
    if (e.offsetX < c.width && e.offsetY < c.height && drawingPath){
        mouse_Down = true;
    }
    
    if (selecting || deleting) { // this will find the player
        this.xcor = e.offsetX;
        this.ycor = e.offsetY;
        
        console.log("finding players at: " + this.xcor + " " + this.ycor);
        for (this.i = 0; this.i < PLAYERS.length; this.i++) {
            console.log("mouse x,y: " + e.offsetX + " " + e.offsetY);
            console.log("Distance is: " + (PLAYERS[this.i].x - this.xcor));
            console.log("Compare with playerRatio of: " + playerRatio);
            
            if (
                (PLAYERS[this.i].x - this.xcor) * (PLAYERS[this.i].x - this.xcor) +
                (PLAYERS[this.i].y - this.ycor) * (PLAYERS[this.i].y - this.ycor) <
                (10 * playerRatio) * (10 * playerRatio)
            ) {
                select = this.i;
                var selectedPlayer = PLAYERS[select];
                console.log(select);
                console.log("Selected Player is: " + select + " "); // + PLAYERS[select]);
                console.log("Selected Player's team1 is: " + selectedPlayer.team);
                if (deleting) {
                    PLAYERS.splice(PLAYERS.indexOf(selectedPlayer), 1);
                    delete PATHS[selectedPlayer.ID];
                    select = -1;
                    drawSetup();
                } else {
                    creatingTeam1 = selectedPlayer.team;
                }
                break;
            }
        }
    }
    
    if (drawingPath) {
        player.x = e.offsetX;
        player.y = e.offsetY;
    }
});

$(window).mouseup(function() {
    //console.log(select);
    //console.log(selecting);
    if (Xs.length > 1) {
       mouse_Down = false;
       console.log("Mouse_Down has been changed to false");
    }
    //console.log(Xs.length);
    if (drawingPath && select == -1 && Xs.length > 1) { // not selecting, so adding
        //console.log(  PLAYERS[ PLAYERS.length -1] );
        //player = makePlayer(PLAYERS.length, PLAYERS[ PLAYERS.length - 1].team );
        PATHS[player.ID] = [Xs, Ys];
        player.onPos = -1;
        player.undone = true;
        PLAYERS.push(player);

	/*
	  if (selectedPlayer != null ){
	  PATHS[selectedPlayer.ID] = [Xs, Ys];
          selectedPlayer.onPos = 0;
	  selectedPlayer.undone = true;
	  //should not need to push, it is apart of it already
	  */
    } else if (select > -1 && !deleting) {
        //console.log("got to else if");
        //console.log(Xs);
	
	//selecting = true

        PATHS[PLAYERS[select].ID] = [Xs, Ys];
        PLAYERS[select].redo();
        PLAYERS[select].undone = true;
        select = -1;
    }
    drawSetup();
    //drawingPath = false;
    //add( lastTeam );
    add( creatingTeam1 );
    Xs = new Array();
    Ys = new Array();
    help.text('');
    //console.log("WENT UP");
});

/* The following functions are for mobile devices,
*  or anything that does not use the mouse, and 
*  therefore, does not support mouse functions
**/

$(window).on('touchstart', function(e) {
    console.log("touchStarted: Mouse_Down is: " + mouse_Down);
    var E = e.originalEvent.touches[0];
    
    // if you're within boundaries
    //console.log("ClientX: +"+E.clientX);
    if (E.pageX < c.width && E.pageY < c.height && drawingPath){
        mouse_Down = true;
	//console.log("MOUSE_DOWN "+mouse_Down);
    }

    if (selecting || deleting) { // this will find the player
        this.xcor = e.pageX;
        this.ycor = e.pageY;
        
        console.log("finding players at: " + this.xcor + " " + this.ycor);
        for (this.i = 0; this.i < PLAYERS.length; this.i++) {
            //console.log("mouse x,y: " + e.pageX + " " + e.pageY);
            //console.log("Distance is: " + (PLAYERS[this.i].x - this.xcor));
            //console.log("Compare with playerRatio of: " + playerRatio);
            
            if (
                (PLAYERS[this.i].x - this.xcor) * (PLAYERS[this.i].x - this.xcor) +
                (PLAYERS[this.i].y - this.ycor) * (PLAYERS[this.i].y - this.ycor) <
                (10 * playerRatio) * (10 * playerRatio) * 64
            ) {
                select = this.i;
                var selectedPlayer = PLAYERS[select];
                console.log(select);
                console.log("Selected Player is: " + select + " "); // + PLAYERS[select]);
                console.log("Selected Player's team1 is: " + selectedPlayer.team);
                if (deleting) {
                    PLAYERS.splice(PLAYERS.indexOf(selectedPlayer), 1);
                    delete PATHS[selectedPlayer.ID];
                    select = -1;
                    drawSetup();
                } else {
                    creatingTeam1 = selectedPlayer.team;
                }
                break;
            }
        }
    }
    
    if (drawingPath) {
        player.x = e.offsetX;
        player.y = e.offsetY;
    }
});

$(window).on('touchmove', function(e) {
    //Because this is jquery, this isn't the original event
    e.preventDefault();
    var E = e.originalEvent.touches;
    //console.log("TouchMove: Mouse_Down is: "+mouse_Down+" DrawingPath is: "+drawingPath);

   // console.log("OffsetX: "+e.offsetX);
    //console.log("PAGE: "+e.pageX);

    var touch = e.originalEvent.touches[0];
    
    console.log(touch);
/*
    if (drawingPath) {
        this.cursorX = touch.clientX;
        this.cursorY = touch.clientY;
        Xs.push( this.cursorX );
        Ys.push( this.cursorY );
        drawSetup();
        drawPath(Xs, Ys, creatingTeam1);
    }
*/
    console.log("Mouse: "+mouse_Down+" DrawingPath: "+drawingPath);
    if ((mouse_Down && drawingPath) || select > -1 ) {
        cursorX = touch.pageX;
        cursorY = touch.pageY;
        //console.log("Not in: "+cursorX);
	//console.log(E.pageX);
        if ((Xs.length == 0 || Math.abs(cursorX - Xs[Xs.length - 1]) >= 20 || 
            Math.abs(cursorY - Ys[Ys.length - 1]) >= 20) &&
            cursorX >= (winWidth - currentWidth) / 2 &&
            cursorX <= (winWidth + currentWidth) / 2 &&
            cursorY > 0 && cursorY <= currentHeight
        ) {
	    console.log("GOT HERE");
	    Xs.push( cursorX );
            Ys.push( cursorY );
            if (Xs.length > 0) {
                drawSetup();
                drawPath(Xs, Ys, creatingTeam1);
            }
	    console.log( cursorX );
        }
        //console.log(cursorX, cursorY);
    }
    if (mouse_Down && select > -1) {
            console.log("selected");
    }

});

$(window).on('touchend', function(e) {
    console.log("ENDED");
    
    if (Xs.length > 2) {
        mouse_Down = false;
        console.log("FALSE, ended touch");
    }
    
    if (drawingPath && select == -1 && Xs.length > 1) {
        //console.log(  PLAYERS[ PLAYERS.length -1] );
        //player = makePlayer(PLAYERS.length, PLAYERS[ PLAYERS.length - 1].team );
        //console.log("Xs: "+Xs);
        //console.log("Ys: "+Ys);
        PATHS[player.ID] = [Xs, Ys];
        player.onPos = 0;
        player.undone = true;
        PLAYERS.push(player);
    } else if (select > -1 && !deleting) {
        //console.log("got to else if");
        //console.log(Xs);
        PATHS[PLAYERS[select].ID] = [Xs, Ys];
        PLAYERS[select].redo();
        PLAYERS[select].undone = true;
        select = -1;
    }

    drawSetup();
    //add( lastTeam );
    add( creatingTeam1 );
    //drawingPath = false;
    Xs = new Array();
    Ys = new Array();
    help.text('');
    
});

$(window).resize(resize);

var lastTeam;
// Button handler assignment
var add = function(team1) {
    mouse_Down = false;
    player = makePlayer(totalCreated, team1);
    totalCreated++;
    //lastTeam = team1;
    creatingTeam1 = team1;
    drawingPath = true;
    creatingTeam1 = team1;
    help.text("Click and drag to create a player and a path");
};
var changeColor = function(){
    creatingTeam1 = !creatingTeam1;
    add( creatingTeam1 );
};

//$('#add').click(function() { add(true); });
//$('#add2').click(function() { add(false); });
add(true);
$('#changeColor').click(function() { changeColor(); });

$('#run').click(function() {
    if (!running) {
        running = true;
        main();
    }
});

$('#stop').click(function() {
    window.cancelAnimationFrame(requestID);
    running = false;
});

$('#reset').click(function() {
    for (var i = 0; i < PLAYERS.length; i++) {
        var current = PLAYERS[i];
        current.undone = true;
        current.onPos = 0;
        current.x = PATHS[current.ID][0][0];
        current.y = PATHS[current.ID][1][0];
    }
    drawSetup();
});

$('#select').click(function() {
    selecting = !selecting;
    drawingPath = false;
    if (selecting) {
        deleting = false;
    }
});

$('#delete').click(function() {
    drawingPath = false;
    deleting = !deleting;
    if (deleting) {
        selecting = false;
        select = -1;
    }
});

$('#deleteAll').click(function() {
    drawingPath = false;
    PLAYERS = new Array();
    PATHS = {};
    Xs = new Array();
    Ys = new Array();
    mouse_Down = false;
    drawingPath = false;
    running = false;
    creatingTeam1 = true;
    selecting = false;
    select = -1;
    deleting = false;
    totalCreated = 0;
    drawSetup();
});

$('#formations').change(function() {
    var option = $('#formations option:selected').val();
    if (option == 'option1'){
	console.log('load formation 1');
    }
});


// Main Animation Function
function main() {
    for (var i = 0; i < PLAYERS.length; i++) {
        if (PLAYERS[i].undone){
            PLAYERS[i].move();
            drawPath(Xs, Ys);
        }
    }
    requestID = window.requestAnimationFrame(main);
}



// Compatibility functions (I assume...)
function BlockMove(event) {
    // Tell Safari not to move the window.
    event.preventDefault();
}

function iOS() {
    var iDevices = [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod',
    ];
    
    if (!!navigator.platform) {
        while (iDevices.length) {
            if (navigator.platform === iDevices.pop()) { return true; }
        }
    }
    return false;
} var ios = iOS();
