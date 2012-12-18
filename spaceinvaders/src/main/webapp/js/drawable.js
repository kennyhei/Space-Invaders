// "superclass" for Player, Tiili, Missile & Invader
function Drawable(x,y, width, height, column, row) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.column = column;
    this.row = row;
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

Drawable.prototype.getColumn = function() {
    return this.column;
}

Drawable.prototype.getRow = function() {
    return this.row;
}
