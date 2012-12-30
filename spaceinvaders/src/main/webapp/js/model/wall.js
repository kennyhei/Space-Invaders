'use strict';

// tile coordinates for 4 walls
var wallData = [
    [[77, 455],
    [119, 455],
    [77, 435],
    [91, 435],
    [105, 435],
    [119, 435]],

    [[187, 455],
    [229, 455],
    [187, 435],
    [201, 435],
    [215, 435],
    [229, 435]],

    [[297, 455],
    [339, 455],
    [297, 435],
    [311, 435],
    [325, 435],
    [339, 435]],

    [[407, 455],
    [449, 455],
    [407, 435],
    [421, 435],
    [435, 435],
    [449, 435]]
];

// list of walls
function WallManager() {
    var walls = [];
    
    $.each(wallData, function(index, data) {
        var wall = new Wall(data);
        walls.push(wall);
    });
    
    function draw(context) {
        for (var i=0; i < walls.length; ++i) {
            walls[i].draw(context);
        }
    }
    
    function doesCollide(missile, explosions) {
        for (var i=0; i < walls.length; ++i) {
            if (walls[i].doesCollide(missile, explosions))
                return true;
        }
    
        return false;
    }
    
    return {
        draw: draw,
        doesCollide: doesCollide
    };
}

// wall protecting the player
function Wall(wallData) {
    var tiles = new Array();
    
    $.each(wallData, function(index, coordinates) {
        var tile = new Tile(coordinates[0], coordinates[1]);
        tiles.push(tile);
    });

    
    function draw(context) {
        for (var i=0; i < tiles.length; ++i) {
            tiles[i].draw(context);
        }
    }
    
    function getTiles() {
        return tiles;
    }
    
    // checks if random object hits the wall and removes single tile based on
    // where the wall was hit
    function doesCollide(object, explosions) {
        for (var i=0; i < tiles.length; ++i) {
            if (tiles[i].doesCollide(object)) {
                explosions.newExplosion(tiles[i].getX(), tiles[i].getY());
                removeTile(i);
                return true;
            }
        }
        return false;
    }
    
    function removeTile(index) {
        tiles.splice(index, 1);
    }
    
    return {
        draw: draw,
        getTiles: getTiles,
        doesCollide: doesCollide
    };
}

Tile.prototype = new Drawable();
Tile.prototype.constructor = Tile;

// wall consists of tiles
function Tile(x,y) {
    
    Drawable.call(this,x,y,14,20);
    
    Tile.prototype.draw = function(context) {
        context.fillStyle = "rgb(0,255,0)";
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}