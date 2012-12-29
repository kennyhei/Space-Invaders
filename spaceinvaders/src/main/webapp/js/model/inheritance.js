// "superclass" for Player, Tile, Missile & Invader
function Drawable(x,y, width, height, column, row) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.column = column;
    this.row = row;
}

Drawable.prototype.move = function(dx, dy) {
    this.x += dx;
    this.y += dy;
}

Drawable.prototype.getX = function() {
    return this.x;
}

Drawable.prototype.getY = function() {
    return this.y;
}

Drawable.prototype.getWidth = function() {
    return this.width;
}

Drawable.prototype.getHeight = function() {
    return this.height;
}

Drawable.prototype.getColumn = function() {
    return this.column;
}

Drawable.prototype.getRow = function() {
    return this.row;
}

Drawable.prototype.doesCollide = function(object) {
    if (intersects(this.x,this.y,this.width,this.height, object.getX(), object.getY(), object.getWidth(), object.getHeight()))
        return true;
    else
        return false;
}
    
function intersects(x1, y1, w1, h1, x2, y2, w2, h2) {
    w2 += x2;
    w1 += x1;
    if (x2 > w1 || x1 > w2) return false;
    h2 += y2;
    h1 += y1;
    if (y2 > h1 || y1 > h2) return false;
    return true;
}

Movable.prototype = new Drawable();
Movable.prototype.constructor = Movable;

function Movable(x,y,width,height,column,row) {
    
    Drawable.call(this,x,y,width,height,column,row);
    
    Movable.prototype.shoot = function() {
        soundManager.missileSound();
        
        if (this.column != null)
            return new Missile(this.x+10, this.y+15, this.column); // if Movable has column, it is invader
        else
            return new Missile(this.x+10, this.y+5, this.column);
    }
    
    Movable.prototype.collidesWithEdge = function() {
        if (this.x > 514 || this.x < 0)
            return true;
        
        return false;
    }
}
