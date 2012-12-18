// "superclass" for Player, Tiili, Missile & Invader
function Drawable(x,y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

Drawable.prototype.siirra = function(dx, dy) {
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