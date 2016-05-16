var c = document.getElementById("field");
var ctx = c.getContext("2d");
var field = new Image();
field.src = "static/field.jpg";

field.onload = function(){
    ctx.drawImage(field,0,0,1000,500);
};
