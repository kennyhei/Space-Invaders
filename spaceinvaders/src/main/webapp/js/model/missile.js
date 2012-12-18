Ohjus.prototype = new Drawable();
Ohjus.prototype.constructor = Ohjus;

// pelaajan tai muukalaisten ampumat ohjukset
function Ohjus(x,y,column) {
    
    Drawable.call(this,x,y,3,5,column); 
    
    Ohjus.prototype.piirra = function(context) {
        context.fillStyle = "rgb(255,255,255)";
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}