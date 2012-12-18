Player.prototype = new Drawable();
Player.prototype.constructor = Player;

function Player() {
    
    Drawable.call(this,260,500,25,25);
    this.lives = 3;
    
    this.img = new Image();
    this.img.src = "img/ships2.png";

    Player.prototype.piirra = function(context, srcX) {
        context.drawImage(this.img,srcX,12,80,72, this.x,this.y,this.width, this.height);
    }
    
    Player.prototype.tormaakoSeinaan = function() {
        if (this.x > 514 || this.x < 0)
            return true;
        
        return false;
    }
    
    Player.prototype.ammu = function() {
        return new Ohjus(this.x+10, this.y+5);
    }
    
    Player.prototype.getImg = function() {
        return this.img;
    }
}