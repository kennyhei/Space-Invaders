Missile.prototype = new Drawable();
Missile.prototype.constructor = Missile;

// missiles of player & invaders
function Missile(x,y,column) {
    
    Drawable.call(this,x,y,3,5,column); 
    
    Missile.prototype.draw = function(context) {
        context.fillStyle = "rgb(255,255,255)";
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}