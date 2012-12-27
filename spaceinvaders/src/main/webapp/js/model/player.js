Player.prototype = new Drawable();
Player.prototype.constructor = Player;

function Player() {
    
    Drawable.call(this,260,500,25,25);
    this.lives = 3;
    
    this.img = new Image();
    this.img.src = "img/ships2.png";

    Player.prototype.draw = function(context, srcX) {
        context.drawImage(this.img,srcX,12,80,72, this.x,this.y,this.width, this.height);
    }
    
    Player.prototype.collidesWithWall = function() {
        if (this.x > 514 || this.x < 0)
            return true;
        
        return false;
    }
    
    Player.prototype.shoot = function() {
        return new Missile(this.x+10, this.y+5);
    }
}