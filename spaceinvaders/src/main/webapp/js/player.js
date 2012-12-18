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
    
    Player.prototype.tormaako = function(object) {
        if (intersects(this.x,this.y,this.width,this.height, object.getX(), object.getY(), 3, 5)) {
            --this.lives;
            return true;
        } else {
            return false;
        }
    }
    
    function intersects(x1, y1, w1, h1, x2, y2, w2, h2) {
        w2 += x2-1;
        w1 += x1-1;
        if (x2 > w1 || x1 > w2) return false;
        h2 += y2-1;
        h1 += y1-1;
        if (y2 > h1 || y1 > h2) return false;
        return true;
    }
    
    Player.prototype.ammu = function() {
        return new Ohjus(this.x+10, this.y+5);
    }
    
    Player.prototype.getLives = function() {
        return this.lives;
    }
    
    Player.prototype.getImg = function() {
        return this.img;
    }
}