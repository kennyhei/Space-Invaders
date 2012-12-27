Player.prototype = new Movable();
Player.prototype.constructor = Player;

function Player() {
    
    Movable.call(this,260,500,25,25);
    this.lives = 3;
    
    this.img = new Image();
    this.img.src = "img/ships2.png";

    Player.prototype.draw = function(context, srcX) {
        context.drawImage(this.img,srcX,12,80,72, this.x,this.y,this.width, this.height);
    }
}