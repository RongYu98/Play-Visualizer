/* global $, navigator */

// Initialization
var c = document.getElementById("field");
var ctx = c.getContext("2d");

// Initialize Bootstrap Toggle Switch
$("[name='change']").bootstrapSwitch();
$("[name='stopping']").bootstrapSwitch();
$("[name='field-size']").bootstrapSwitch();


//Initialize Bootstrap Slider
var mySlider = $("#speed").slider();

var field = $('<img>');
field.attr('src', 'static/field.jpg');
field.on('load', resize);

$("[name='field-size']").on('switchChange.bootstrapSwitch', function(event, state){
    this.i = 0;
    this.n = 0;
    this.x = 0;
    for( this.i=0; this.i< totalCreated; this.i++){
	if (PATHS[this.i] != null){ //i.e. theres stuff there
	    for (this.x = 0; this.x < PATHS[this.i][0].length; this.x++ ){
		PATHS[this.i][0][this.x] /= c.width;
		PATHS[this.i][1][this.x] /= c.height;		
		this.n = PATHS[this.i][0][this.x];
		PATHS[this.i][0][this.x] = PATHS[this.i][1][this.x];
		PATHS[this.i][1][this.x] = this.n;
		
		//divide by the width and height to get the thing
	    }
	}
    }
    this.toHalf = false;
    if(!state){
	field.attr('src', 'static/halffield.jpg');
	this.toHalf = true;
    }else{
	field.attr('src', 'static/field.jpg');
    }
    
    for( this.i=0; this.i< totalCreated; this.i++){
	if (PATHS[this.i] != null){ //i.e. theres stuff there
	    for (this.x = 0; this.x < PATHS[this.i][0].length; this.x++ ){
		//divide by the width and height to get the thing
		if (this.toHalf){
	  	    PATHS[this.i][0][this.x] = 1 - PATHS[this.i][0][this.x];
		    console.log(PATHS[this.i][0][this.x]);
		} else {
		    PATHS[this.i][1][this.x] = 1 - PATHS[this.i][1][this.x];
		}
		PATHS[this.i][0][this.x] *= c.width;
		PATHS[this.i][1][this.x] *= c.height;
		if (this.toHalf){
		    PATHS[this.i][1][this.x] *= 2;
		} else {
		    PATHS[this.i][0][this.x] /= 2;
		}
	    }
	}
    }
    reset();
});

var help = $('#help');

var requestID;

var drawingBall = false;
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
var nonSelectColor;
var nonSelectSpeed;
var BALL;

var selecting = false;
var select = -1;

var deleting = false;

var totalCreated = 0;

var player, playerRatio;
var winHeight, winWidth;
var imgHeight, imgWidth;
var currentHeight, currentWidth;
var leftBound = -1;
var rightBound = -1;
var name = "";

var FORMATION1 = {
    'players': [
	{
	    'id': 0,
	    'team': true,
	    'speed': 30
	},
	{
	    'id': 1,
	    'team': true,
	    'speed': 30
	},
	{
	    'id': 2,
	    'team': true,
	    'speed': 30
	},
	{
	    'id': 3,
	    'team': true,
	    'speed': 30
	},
	{
	    'id': 4,
	    'team': true,
	    'speed': 30
	},
	{
	    'id': 5,
	    'team': true,
	    'speed': 30
	},
	{
	    'id': 6,
	    'team': true,
	    'speed': 30
	},
	{
	    'id': 7,
	    'team': true,
	    'speed': 30
	},
	{
	    'id': 8,
	    'team': true,
	    'speed': 30
	},
	{
	    'id': 9,
	    'team': true,
	    'speed': 30
	},
	{
	    'id': 10,
	    'team': true,
	    'speed': 30
	},
	{
	    'id': 11,
	    'team': false,
	    'ball': true,
	    'speed': 20
	}
    ],
    'paths': {
	0: [
	    [0.09, 0.13],
	    [0.5, 0.5]
	],
	1: [
	    [0.23, 0.27],
	    [0.37, 0.37]
	],
	2: [
	    [0.23, 0.27],
	    [0.63, 0.63]
	],
	3: [
	    [0.27, 0.31],
	    [0.17, 0.17]
	],
	4: [
	    [0.27, 0.31],
	    [0.83, 0.83]
	],
	5: [
	    [0.51, 0.55],
	    [0.41, 0.41]
	],
	6: [
	    [0.51, 0.55],
	    [0.59, 0.59]
	],
	7: [
	    [0.55, 0.59],
	    [0.2, 0.2]
	],
	8: [
	    [0.55, 0.59],
	    [0.8, 0.8]
	],
	9: [
	    [0.85, 0.89],
	    [0.36, 0.36]
	],
	10: [
	    [0.85, 0.89],
	    [0.64, 0.64]
	],
	11: [
	    [0.5, 0.5],
	    [0.5, 0.5]
	]
    }
};

var FORMATION2 = {
    'players': [
	{
	    'id': 0,
	    'team': true,
	    'speed': 30
	},
	{
	    'id': 1,
	    'team': true,
	    'speed': 30
	},
	{
	    'id': 2,
	    'team': true,
	    'speed': 30
	},
	{
	    'id': 3,
	    'team': true,
	    'speed': 30
	},
	{
	    'id': 4,
	    'team': true,
	    'speed': 30
	},
	{
	    'id': 5,
	    'team': true,
	    'speed': 30
	},
	{
	    'id': 6,
	    'team': true,
	    'speed': 30
	},
	{
	    'id': 7,
	    'team': true,
	    'speed': 30
	},
	{
	    'id': 8,
	    'team': true,
	    'speed': 30
	},
	{
	    'id': 9,
	    'team': true,
	    'speed': 30
	},
	{
	    'id': 10,
	    'team': true,
	    'speed': 30
	},
	{
	    'id': 11,
	    'team': false,
	    'speed': 30
	},
	{
	    'id': 12,
	    'team': false,
	    'speed': 30
	},
	{
	    'id': 13,
	    'team': false,
	    'speed': 30
	},
	{
	    'id': 14,
	    'team': false,
	    'speed': 30
	},
	{
	    'id': 15,
	    'team': false,
	    'speed': 30
	},
	{
	    'id': 16,
	    'team': false,
	    'speed': 30
	},
	{
	    'id': 17,
	    'team': false,
	    'speed': 30
	},
	{
	    'id': 18,
	    'team': false,
	    'speed': 30
	},
	{
	    'id': 19,
	    'team': false,
	    'speed': 30
	},
	{
	    'id': 20,
	    'team': false,
	    'speed': 30
	},
	{
	    'id': 21,
	    'team': false,
	    'speed': 30
	},
	{
	    'id': 22,
	    'team': false,
	    'ball': true,
	    'speed': 30
	}
    ],
    'paths': {
	0: [
	    [0.09, 0.13],
	    [0.5, 0.5]
	],
	1: [
	    [0.23, 0.27],
	    [0.37, 0.37]
	],
	2: [
	    [0.23, 0.27],
	    [0.63, 0.63]
	],
	3: [
	    [0.27, 0.31],
	    [0.17, 0.17]
	],
	4: [
	    [0.27, 0.31],
	    [0.83, 0.83]
	],
	5: [
	    [0.51, 0.55],
	    [0.41, 0.41]
	],
	6: [
	    [0.51, 0.55],
	    [0.59, 0.59]
	],
	7: [
	    [0.55, 0.59],
	    [0.2, 0.2]
	],
	8: [
	    [0.55, 0.59],
	    [0.8, 0.8]
	],
	9: [
	    [0.85, 0.89],
	    [0.36, 0.36]
	],
	10: [
	    [0.85, 0.89],
	    [0.64, 0.64]
	],
	11: [
	    [0.91, 0.87],
	    [0.5, 0.5]
	],
	12: [
	    [0.77, 0.73],
	    [0.37, 0.37]
	],
	13: [
	    [0.77, 0.73],
	    [0.63, 0.63]
	],
	14: [
	    [0.73, 0.69],
	    [0.17, 0.17]
	],
	15: [
	    [0.73, 0.69],
	    [0.83, 0.83]
	],
	16: [
	    [0.49, 0.45],
	    [0.41, 0.41]
	],
	17: [
	    [0.49, 0.45],
	    [0.59, 0.59]
	],
	18: [
	    [0.45, 0.41],
	    [0.2, 0.2]
	],
	19: [
	    [0.45, 0.41],
	    [0.8, 0.8]
	],
	20: [
	    [0.15, 0.11],
	    [0.36, 0.36]
	],
	21: [
	    [0.15, 0.11],
	    [0.64, 0.64]
	],
	22: [
	    [0.5, 0.5],
	    [0.5, 0.5]
	    ]
    }
	  
};

// Field Resize Function
function resize() {
    //console.log("RESIZED");
    winHeight = $(window).height();
    winWidth = $(window).width();
    imgHeight;
    imgWidth;
    playerRatio;
    leftBound = -1;
    rightBound = -1;

    if(field.attr('src') == "static/field.jpg"){
	imgHeight = 768;
	imgWidth = 1024;
	playerRatio = $("canvas").attr("width")/1024;
    }else{
	imgHeight = 512
	imgWidth = 768;
	playerRatio = $("canvas").attr("width")/768;
    }

    var i = 0;
    var a = 0;

    //console.log("The totalCreated is: "+totalCreated);

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
    for (var i = 0; i < PLAYERS.length; i++) {
        var current = PLAYERS[i];
        current.draw();
        drawPath(PATHS[current.ID][0], PATHS[current.ID][1], current.team, current.ball);
    }
}



// Player creation function
function makePlayer(playerID, team) {
    this.ID = playerID;
    this.onPos = -1;
    this.undone = true;
    this.team = team;
    var path;
    var initialSpeed = mySlider.slider('getValue');
    var speed = initialSpeed;
    this.name = this.speed.toString();
    this.named = false;

    // var angle = 0;    
    this.ball = false;

    var setSpeed = function(newSpeed) {
	this.initialSpeed = newSpeed;
	speed = newSpeed;
	drawSetup();
	this.draw();
    }

    var redo = function() {
        this.onPos = 0;
        this.x = PATHS[this.ID][0][this.onPos];
        this.y = PATHS[this.ID][1][this.onPos];
        //console.log("redo done, onPos: "+this.onPos);
    };
    
    var draw = function() {
        if (this == PLAYERS[select]) {
            ctx.strokeStyle = "yellow";
            ctx.lineWidth = Math.round(10 * playerRatio);
        } else {
            ctx.lineWidth = 1;
	    if (this.ball) {
		ctx.strokeStyle = "black";
	    } else if (this.team) {
                ctx.strokeStyle = "red";
            } else {
                ctx.strokeStyle = "blue";
            }
        }

	if (this.ball){
	    ctx.fillStyle = "black";
	} else if (this.team){
	    ctx.fillStyle = "red";
	} else {
	    ctx.fillStyle = "blue";
	}
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10 * playerRatio, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
	this.size = 25*playerRatio
	this.size.toString();
        ctx.font = this.size+"px Arial";
	if (this.ball){
	    ctx.fillText("BALL",this.x - 30*playerRatio,this.y + 30*playerRatio);
	} else {
	    ctx.fillText(speed,this.x - 15*playerRatio,this.y + 30*playerRatio);
	}
    };
    
    var save = function() {
        return JSON.stringify({
           'id': this.ID,
           'team': this.team,
           'speed': speed,
	   'ball': this.ball,
	   'name': this.name
        });
    };
    
    var move = function() {
        path = PATHS[this.ID];
        this.speed = speed * playerRatio;
        
        if (this.onPos < 0 ) {
            this.onPos = 0;
            this.x = path[0][this.onPos];
            this.y = path[1][this.onPos];
            //console.log("This was onPos = -1, so setted it");
        }
        
        //console.log(path);
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
            } //else {
                //console.log("need "+(this.x-path[0][this.onPos])+" more for x");
            //}
            
            if (this.onPos > path[0].length-1) {
                this.onPos = path[0].length-1;
                this.undone = false;
            }
        }
    };
    
    return {
        draw: draw,
        move: move,
	setSpeed: setSpeed,
        undone: this.undone,
        onPos: this.onPos,
        ID: this.ID,
        x: this.x,
        y: this.y,
        speed: speed,
	initialSpeed: initialSpeed,
        team: this.team,
        redo: redo,
        save: save,
	name: this.name,
    };
}

// Path Drawing Functions
function drawSetup() {
    resize();
    /* for (var i = 0; i < PLAYERS.length; i++) {
        var current = PLAYERS[i];
        current.draw();
        drawPath(PATHS[current.ID][0], PATHS[current.ID][1], current.team);
    } */
}

function drawPath(arrayX, arrayY, team, ball) {
    //console.log(team);
    if (team) {
        ctx.strokeStyle = "red";
    } else {
        ctx.strokeStyle = "blue";
    }
    if (ball){
	ctx.strokeStyle = "black";
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
    //console.log("Mouse_Down is: "+mouse_Down+" DrawingPath is: "+drawingPath);
    
    if ( mouse_Down && drawingPath  && (!selecting || selected) && !deleting ) {
	
        cursorX = e.offsetX;
        cursorY = e.offsetY;
	if (leftBound == -1){
	    leftBound = e.pageX - cursorX;
	}
	if (rightBound == -1){
	    rightBound = leftBound + currentWidth;
	}
        
        if ((Xs.length == 0 || Math.abs(cursorX - Xs[Xs.length - 1]) >= 0.02 * currentWidth || 
            Math.abs(cursorY - Ys[Ys.length - 1]) >= 0.02 * currentWidth) &&
            e.pageX >= leftBound &&
            e.pageX <= rightBound &&
            e.pageY > 0 && e.pageY <= currentHeight
        ) {
            Xs.push( cursorX );
            Ys.push( cursorY );
            if (Xs.length > 0) {
                drawSetup();
                drawPath(Xs, Ys, creatingTeam1, drawingBall);
            }
        }
        //console.log(cursorX, cursorY);
    }
    if (mouse_Down && select > -1) {
            //console.log("selected");
    }
});

var selected = false;
var selectedPlayer;
$(window).on('mousedown', function(e) {

    // if you're within boundaries
    if (e.offsetX < c.width && e.offsetY < c.height && drawingPath){
        mouse_Down = true;
    }
    
    if ( ( selecting && !selected) || deleting) { // this will find the player
        this.xcor = e.offsetX;
        this.ycor = e.offsetY;
        
        //console.log("finding players at: " + this.xcor + " " + this.ycor);
        for (this.i = 0; this.i < PLAYERS.length; this.i++) {
            
            if (
                (PLAYERS[this.i].x - this.xcor) * (PLAYERS[this.i].x - this.xcor) +
                (PLAYERS[this.i].y - this.ycor) * (PLAYERS[this.i].y - this.ycor) <
                (10 * playerRatio) * (10 * playerRatio)
            ) {
                select = this.i;
                selectedPlayer = PLAYERS[select];
                //console.log("Selected Player is: " + select + " "); // + PLAYERS[select]);
                //console.log("Selected Player's team1 is: " + selectedPlayer.team);
                if (deleting) {
                    PLAYERS.splice(PLAYERS.indexOf(selectedPlayer), 1);
                    delete PATHS[selectedPlayer.ID];
                    select = -1;
                    drawSetup();
                } else {
                    creatingTeam1 = selectedPlayer.team;
		    nonSelectSpeed = mySlider.slider('getValue');
		    mySlider.slider('setValue', selectedPlayer.initialSpeed);
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
    
    if (Xs.length > 1) {
       mouse_Down = false;
    }

    if (drawingPath && select == -1 && Xs.length > 1) { // not selecting, so adding
        //console.log(  PLAYERS[ PLAYERS.length -1] );
        //player = makePlayer(PLAYERS.length, PLAYERS[ PLAYERS.length - 1].team );
        PATHS[player.ID] = [Xs, Ys];
        player.onPos = -1;
        player.undone = true;
        if (drawingBall){
	    player.ball = true;
	    drawingBall = false;
        }
        PLAYERS.push(player);

    } else if (select > -1 && !deleting && !selected) {

	selected = true;

    } else if (selected){
	if (Xs.length > 1){
            PATHS[PLAYERS[select].ID] = [Xs, Ys];
	}
        PLAYERS[select].redo();
        PLAYERS[select].undone = true;
        select = -1;
	selected = false;
    }
 
    drawSetup();
    //drawingPath = false;
    //add( lastTeam );
    add( creatingTeam1 );
    Xs = new Array();
    Ys = new Array();
    //help.text('');
    //console.log("WENT UP");
});



/* The following functions are for mobile devices,
*  or anything that does not use the mouse, and 
*  therefore, does not support mouse functions
**/
var offsetX = $(window).width() - c.width;
var offsetX2 = screen.width - c.width - 2*offsetX;
console.log("screen: "+screen.width);
//console.log(currentWidth);
//console.log("WindWidth: " +  $(window).width());
//console.log("Canvas Width: "+c.width);
//console.log("offSet is: "+offsetX);
//console.log("OffsetX2 is: "+offsetX2);

$(window).on('touchstart', function(e) {
    console.log("touchStarted: Mouse_Down is: " + mouse_Down); // fix this by onyl allowing a boundary check first, then prevent
    var touch = e.originalEvent.touches[0];

    //console.log("C offsetLeft: "+c.offsetLeft);
    //console.log("C.offsettop: "+c.offsetTop);
    
    this.xcor = touch.pageX + offsetX2/2;
    this.ycor = touch.pageY - c.offsetTop;

    //console.log("THIS IS canvasOffSet: "+c.offsetLeft);

    console.log("ycor: "+this.ycor);
    console.log("c.height "+c.height);
    //console.log("xcor: "+this.xcor);
    //console.log("width: " + c.width);
    // if you're within boundaries
    if (this.xcor < c.width && this.ycor < c.height && drawingPath){
        mouse_Down = true;
	console.log("MOUSE_DOWN "+mouse_Down);
	//e.preventDefault() ensures that the screen does not move
	e.preventDefault();
    }

    if (selecting || deleting) { // this will find the player
        
        //console.log("finding players at: " + this.xcor + " " + this.ycor);
        for (this.i = 0; this.i < PLAYERS.length; this.i++) {
            
            if (
                (PLAYERS[this.i].x - this.xcor) * (PLAYERS[this.i].x - this.xcor) +
                (PLAYERS[this.i].y - this.ycor) * (PLAYERS[this.i].y - this.ycor) <
                (10 * playerRatio) * (10 * playerRatio) * 64
            ) {
                select = this.i;
                var selectedPlayer = PLAYERS[select];
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
        player.x = this.xcor;
        player.y = this.ycor;
    }

});

$(window).on('touchmove', function(e) {
    //Because this is jquery, this isn't the original event, we need to do e.originalEvent
    //e.preventDefault();
    var E = e.originalEvent.touches;
    //console.log("TouchMove: Mouse_Down is: "+mouse_Down+" DrawingPath is: "+drawingPath);

    // console.log("OffsetX: "+e.offsetX);
    //console.log("PAGE: "+e.pageX);

    var touch = e.originalEvent.touches[0];
    // the following is random math using scaled numbers that will yield a somewhat accurate canvas border
    this.xcor = touch.pageX + offsetX2/2;
    this.ycor = touch.pageY - c.offsetTop;

    //console.log("movex: "+ this.xcor);
    //console.log("movey: "+ this.ycor);
    
    //console.log("Mouse: "+mouse_Down+" DrawingPath: "+drawingPath);
    console.log("In touchmove, mouse_Down"+mouse_Down);

    if ( mouse_Down && drawingPath && (!selecting || selected) && !deleting) {
	console.log("Adding");
	cursorX = touch.pageX + offsetX2/2;
        cursorY = touch.pageY;
        //console.log("Not in: "+cursorX);
	//console.log(E.pageX);
        if ((Xs.length == 0 || Math.abs(cursorX - Xs[Xs.length - 1]) >= 0.02 * currentWidth || 
            Math.abs(cursorY - Ys[Ys.length - 1]) >= 0.02 * currentWidth) &&
            cursorX >= (winWidth - currentWidth) / 2 &&
            cursorX <= (winWidth + currentWidth) / 2 && // cursorX != offsetX, may bring problems
            cursorY > 0 && cursorY <= currentHeight
        ) {
	    //console.log("GOT HERE");
	    //add the coords into an array that will be a players path
	    Xs.push( cursorX );
            Ys.push( cursorY );
            if (Xs.length > 0) { //draws out the path itself before player's made
                drawSetup();
                drawPath(Xs, Ys, creatingTeam1, drawingBall);
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
    console.log("TOUCH ENDED");
   
    if (Xs.length > 2) {
        mouse_Down = false;
        console.log("FALSE, ended touch");
    }
    
    if (drawingPath && select == -1 && Xs.length > 1) {

        //console.log(  PLAYERS[ PLAYERS.length -1] );
        //player = makePlayer(PLAYERS.length, PLAYERS[ PLAYERS.length - 1].team );
        PATHS[player.ID] = [Xs, Ys];
        player.onPos = -1;
        player.undone = true;
        if (drawingBall){
	    player.ball = true;
	    drawingBall = false;
        }
        PLAYERS.push(player);
    } else if (select > -1 && !deleting && !selected) {
	selected = true;
    } else if (selected){
	if (Xs.length > 1){
            PATHS[PLAYERS[select].ID] = [Xs, Ys];
	}
        PLAYERS[select].redo();
        PLAYERS[select].undone = true;
        select = -1;
	selected = false;
    }

    drawSetup();
    //add( lastTeam );
    add( creatingTeam1 );
    //drawingPath = false;
    Xs = new Array();
    Ys = new Array();
    //help.text('');    
});

$(window).resize(resize);

$(window).scroll(function() {
    leftBound = -1;
    rightBound = -1;
});

var lastTeam;
// Button handler assignment
var add = function(team1) {
    mouse_Down = false;
    player = makePlayer(totalCreated, team1);
    totalCreated++;
    drawingPath = true;
    if (!drawingBall){
	creatingTeam1 = team1;
    }
    if (drawingBall){
	help.text("Click and drag to add a ball");
    } else if (selecting){
	help.text("Selecting...");
    } else if (deleting){
	help.text("Deleting...");
    } else {
	help.text("Click and drag to create a player and a path");
    }
};
var changeColor = function(){
    if (selecting){
	nonSelectColor = !nonSelectColor;
    } else {
	creatingTeam1 = !creatingTeam1;
    }
    add( creatingTeam1 );
};

//$('#add').click(function() { add(true); });
//$('#add2').click(function() { add(false); });
add(true);
//$('#changeColor').click(function() { changeColor(); });

$("[name='change']").on('switchChange.bootstrapSwitch', function(event, state){
    changeColor();
});


/*
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

*/

$("[name='stopping']").on('switchChange.bootstrapSwitch', function(event, state){
    if(!state){
	main();
    }else{
	window.cancelAnimationFrame(requestID);
    }
});

$('#ball').click(function() {
    drawingBall = true;
    add( false );
});

$('#reset').click(function() {
    reset();
});

var reset = function(){
    for (var i = 0; i < PLAYERS.length; i++) {
        var current = PLAYERS[i];
        current.undone = true;
        current.onPos = 0;
        current.x = PATHS[current.ID][0][0];
        current.y = PATHS[current.ID][1][0];
    }
    drawSetup();
};


$('#select').click(function() {
    selecting = !selecting;
    drawingPath = false;
    if (selecting) {
        deleting = false;
	nonSelectColor = creatingTeam1;
	help.text("Selecting...");
    } else {
	drawingPath = true;
	creatingTeam1 = nonSelectColor;
	mySlider.slider('setValue', nonSelectSpeed);
	add(creatingTeam1);
	help.text("Click and drag to create a player and a path");
    }
});

$('#delete').click(function() {
    drawingPath = false;
    deleting = !deleting;
    if (deleting) {
        selecting = false;
        select = -1;
	help.text("Deleting...");
    } else {
	drawingPath = true;
	help.text("Click and drag to create a player and a path");
    }
});

$('#deleteAll').click(function() {
    deleteAll();
});

function deleteAll() {
    drawingPath = false;
    PLAYERS = new Array();
    PATHS = {};
    Xs = new Array();
    Ys = new Array();
    mouse_Down = false;
    drawingPath = true;
    running = false;
    creatingTeam1 = true;
    selecting = false;
    select = -1;
    deleting = false;
    totalCreated = 0;
    add( creatingTeam1 );
    drawSetup();
}

/* $('#name').click(function(){
   
   this.str = document.getElementById("text").value;
   if (this.str.length > 0){
      name = this.str;
   }
   if ( selected > -1){
      PLAYERS[selected].name = this.str;
   }
   document.getElementById("text").value = "";
}
*/


$('#formations').change(function() {
    var option = $('#formations option:selected').val();
    if (option == 'option1'){
	deleteAll();
	loadFormation(FORMATION1);
    } else if (option == 'option2'){
	deleteAll();
	loadFormation(FORMATION2);
    }
});

$('#speed').change(function() {
    if (selected){
	selectedPlayer.setSpeed(mySlider.slider('getValue'));
    }
});

function loadFormation(formation) {
    for (var i = 0; i < formation['players'].length; i++) {
        var onPlayer = formation['players'][i];
        var newPlayer = makePlayer(onPlayer['id'], onPlayer['team']);
        newPlayer.speed = onPlayer['speed'];
        var onPath = formation['paths'][onPlayer['id']];
        newPlayer.x = onPath[0][0] * currentWidth;
        newPlayer.y = onPath[1][0] * currentHeight;
        if ( onPlayer['ball'] == true ) {
            newPlayer.ball = true;
        }
	if ( onPlayer['name'] != null ){
	    newPlayer.name = onPlayer['name'];
	}
        PLAYERS.push(newPlayer);
        totalCreated++;
    }
    for (var id in formation['paths']) {
        var onPath = formation['paths'][id];
        for (var i = 0; i < onPath[0].length; i++) {
            onPath[0][i] *= currentWidth;
            onPath[1][i] *= currentHeight;
        }
        PATHS[id] = onPath;
    }
}

function saveFormation() {
    var psuedoPaths = new Array(), path;
    for (var i in PATHS) {
        path = JSON.parse(JSON.stringify(PATHS[i]));
        for (var i = 0; i < path[0].length; i++) {
            path[0][i] /= currentWidth;
            path[1][i] /= currentHeight;
        }
        psuedoPaths.push(path);
    }
    return {
        'players': JSON.stringify(PLAYERS, ['id', 'team', 'speed', 'ball']),
        'paths': JSON.stringify(psuedoPaths),
    };
}


// Main Animation Function
function main() {
    for (var i = 0; i < PLAYERS.length; i++) {
        if (PLAYERS[i].undone){
            PLAYERS[i].move();
	    PLAYERS[i].draw();
            drawPath(Xs, Ys, creatingTeam1, drawingBall);
        }
    }
    drawSetup();
    requestID = window.requestAnimationFrame(main);
}



// prevents one from moving the screen
//function BlockMove(event) {
    // Tell Safari not to move the window.
  //  event.preventDefault();
//}

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
