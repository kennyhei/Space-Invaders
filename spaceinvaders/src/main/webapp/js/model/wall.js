'use strict';

// tile coordinates for 4 walls
var wallData = [
    [[77, 455],
    [119, 455],
    [91, 435],
    [105, 435]],

    [[187, 455],
    [229, 455],
    [201, 435],
    [215, 435]],

    [[297, 455],
    [339, 455],
    [311, 435],
    [325, 435]],

    [[407, 455],
    [449, 455],
    [421, 435],
    [435, 435],]
];

// rounded corners for walls
// x-coordinate, y-coordinate, is the round corner clockwise/counter-clockwise
var roundedTilesData = [
    [[77,435, false],
    [119,435, true]],

    [[187,435,false],
    [229,435, true]],

    [[297,435,false],
    [339,435, true]],

    [[407,435, false],
    [449,435, true]]
];

// list of walls
function WallManager() {
    var walls = [];
    
    for (var i=0; i < 4; ++i) {
        var wall = new Wall(wallData[i], roundedTilesData[i]);
        walls.push(wall);
    }
    
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
function Wall(wallData, roundedTilesData) {
    var tiles = new Array();
    var roundedTiles = new Array();
    var allTiles = new Array();
    
    $.each(roundedTilesData, function(index,data) {
        var roundedTile = new RoundedTile(data[0], data[1], data[2]);
        roundedTiles.push(roundedTile);
        allTiles.push(roundedTile);
    });
    
    $.each(wallData, function(index, coordinates) {
        var tile = new Tile(coordinates[0], coordinates[1]);
        tiles.push(tile);
        allTiles.push(tile);
    });
    
    function draw(context) {
        for (var i=0; i < allTiles.length; ++i) {
            allTiles[i].draw(context);
        }
    }
    
    // checks if random object hits the wall and removes single tile based on
    // where the wall was hit
    function doesCollide(object, explosions) {
        for (var i=0; i < allTiles.length; ++i) {
            if (allTiles[i].doesCollide(object)) {
                explosions.newExplosion(allTiles[i].getX(), allTiles[i].getY());
                removeTile(i);
                return true;
            }
        }
        return false;
    }
    
    function removeTile(index) {
        allTiles.splice(index, 1);
    }
    
    return {
        draw: draw,
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

RoundedTile.prototype = new Drawable();
RoundedTile.prototype.constructor = RoundedTile;

function RoundedTile(x,y,clockwise) {
    
    this.clockwise = clockwise; // is the rounded corner clockwise or counter-clockwise
    Drawable.call(this,x,y,14,20);
    
    RoundedTile.prototype.draw = function(context) {
        context.fillStyle = "rgb(0,255,0)";
        context.strokeStyle = "rgb(0,255,0)";
        context.lineWidth = 1;
        
        context.beginPath();
        
        if (!this.clockwise)
            this.drawCounterClockWise(context);
        else
            this.drawClockWise(context);
        
        context.stroke();
        context.fill();
    }
    
    RoundedTile.prototype.drawClockWise = function(context) {
        context.moveTo(this.x+0.5, this.y);
        context.lineTo(this.x+0.5, this.y+this.height-0.5);
        context.lineTo(this.x+this.width-0.5, this.y+this.height-0.5);
        context.quadraticCurveTo(this.x+this.width, this.y+0.5, this.x, this.y+0.5);
    }
    
    RoundedTile.prototype.drawCounterClockWise = function(context) {
        var startingX = this.x+this.width;
        context.moveTo(startingX-0.5, this.y);
        context.lineTo(startingX-0.5, this.y+this.height-0.5);
        context.lineTo(startingX-this.width+0.5, this.y+this.height-0.5);
        context.quadraticCurveTo(startingX-this.width, this.y+0.5, startingX, this.y+0.5);
    }
}