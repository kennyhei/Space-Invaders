// invader coordinates per row
var invaderData = [
    
    // x-coordinate, y-coordinate, row, column
    
    // 1st row   
    [60, 135,0,0], // 0
    [100, 135,0,1],
    [140, 135,0,2],
    [180, 135,0,3],
    [220, 135,0,4],
    [260, 135,0,5],
    [300, 135,0,6],
    [340, 135,0,7],
    [380, 135,0,8],
    [420, 135,0,9],
    [460, 135,0,10],

    // 2nd row
    [60, 160,1,0], // 11
    [100, 160,1,1],
    [140, 160,1,2],
    [180, 160,1,3],
    [220, 160,1,4],
    [260, 160,1,5],
    [300, 160,1,6],
    [340, 160,1,7],
    [380, 160,1,8],
    [420, 160,1,9],
    [460, 160,1,10],

    // 3rd row
    [60, 185,2,0], // 22
    [100, 185,2,1],
    [140, 185,2,2],
    [180, 185,2,3],
    [220, 185,2,4],
    [260, 185,2,5],
    [300, 185,2,6],
    [340, 185,2,7],
    [380, 185,2,8],
    [420, 185,2,9],
    [460, 185,2,10],

    // 4th row
    [60, 210,3,0], // 33
    [100, 210,3,1],
    [140, 210,3,2],
    [180, 210,3,3],
    [220, 210,3,4],
    [260, 210,3,5],
    [300, 210,3,6],
    [340, 210,3,7],
    [380, 210,3,8],
    [420, 210,3,9],
    [460, 210,3,10],

    // 5th row
    [60, 235,4,0], // 44
    [100, 235,4,1],
    [140, 235,4,2],
    [180, 235,4,3],
    [220, 235,4,4],
    [260, 235,4,5],
    [300, 235,4,6],
    [340, 235,4,7],
    [380, 235,4,8],
    [420, 235,4,9],
    [460, 235,4,10]
];

// 11 different columns, only 1 invader from 1 column can shoot 1 missile until it has hit something or is out of the game screen
var invaderColumnShot = [
    [false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false]
];

function InvaderManager() {
    var invaders = [];
    var numOfInvaders = 55;
    var invaderMissiles = [];
    var invadersSpeed = 3;
    var chanceOfShooting = 0.01;
    
    var directionRight = true;
    
    // invaders are grouped into 11 different columns (every column has 5 invaders in it)
    $.each(invaderData, function(index, data) {
        var invader = new Invader(data[0], data[1], data[2], data[3]);
        var realIndex = (index % 11);
        
        if (!invaders[realIndex])
            invaders[realIndex] = [];
        
        var sprite = spritemanager.getSprite(data[2]);
        invader.createAnimation(sprite);
        invaders[realIndex].push(invader);
    });
    
    function update(walls) {
        collidesWithWall(walls);
        
        // invaders touch wall => change direction and go one row lower
        if (collidesWithEdge()) {
            if (directionRight)
                move(-1-(invadersSpeed),25);
            else
                move(1+(invadersSpeed),25);
            
            directionRight = !directionRight;
        }
        // move only if sprite changes
        if (spritemanager.changeSprite(invaders)) {
            if (directionRight)
                move(invadersSpeed,0);
            else
                move(-invadersSpeed,0);
        }
    }
    
    function move(x,y) {
        $.each(invaders, function(index, invader) {
            for (var i=0; i < invader.length; ++i) {
                invader[i].move(x,y);
            }
        });
    }
    
    function draw(context) {
        for (var i=0; i < invaders.length; ++i) {
            for (var j=0; j < invaders[i].length; ++j) {
                invaders[i][j].draw(context);
            }
        }
    }
    
    // if invader is hit by a missile, change its sprite to explosion
    function doesCollide(missile, score) {
        for (var column=0; column < invaders.length; ++column) {
            for (var row=0; row < invaders[column].length; ++row) {
                
                var invader = invaders[column][row];
                // check collision only if invader hasn't already collided
                if (!invader.hasCollided() && invader.doesCollide(missile)) {
                    
                    score.raiseScore(invader.getRow());
                    invader.explode();
                    deleteInvaderAfterExplosion(column,row);
                    
                    return true;
                }
            }
        }
        return false;
    }
    
    function collidesWithWall(walls) {
        for (var column=0; column < invaders.length; ++column) {
            for (var row=0; row < invaders[column].length; ++row) {
                
                var invader = invaders[column][row];
                
                // check collision only if invader hasn't already collided
                if (!invader.hasCollided() && walls.doesCollide(invader)) {
                    invader.explode();
                    deleteInvaderAfterExplosion(column,row);
                }
            }
        }
    }
    
    // after invader has been hit, he is allowed to explode (& live) for 100 milliseconds
    function deleteInvaderAfterExplosion(column, row) {
        setTimeout(function() {
            increaseSpeed();
            removeInvader(column,row);
            --numOfInvaders;
        }, 100);
    }
    
    function shootLogic() {
        for (var column = 0; column < invaders.length; ++column) {
            if (!invaderColumnShot[column]) {
                if (shoot(invaders[column]))
                    invaderColumnShot[column] = true;
            }
        }
        
        return invaderMissiles;
    }
    
    function shoot(column) {
        // if the whole column is destroyed, return
        if (column.length > 0) {
            if (Math.random() < chanceOfShooting) {
                invaderMissiles.push(column[column.length-1].shoot());
                return true;
            }
        }
        
        return false;
    }
    
    function getNumOfInvaders() {
        return numOfInvaders;
    }
    
    function getInvaders() {
        return invaders;
    }

    function collidesWithEdge() {
        for (var i=0; i < invaders.length; ++i) {
            for (var j=0; j < invaders[i].length; ++j) {
            if (invaders[i][j].collidesWithEdge())
                return true;
            }
        }
    
        return false;
    }
    
    function removeInvader(row, column) {
        invaders[row].splice(column, 1);
    }
    
    function increaseSpeed() {
        invadersSpeed += 0.06;
        spritemanager.decreaseFrametime();
    }
    
    function setSpeed(speed) {
        invadersSpeed = speed;
    }

    function setChanceOfShooting(chance) {
        chanceOfShooting = chance;
    }

    return {
        draw: draw,
        doesCollide: doesCollide,
        getNumOfInvaders: getNumOfInvaders,
        shootLogic: shootLogic,
        update: update,
        getInvaders: getInvaders,
        setSpeed: setSpeed,
        setChance: setChanceOfShooting
    };
}

Invader.prototype = new Movable();
Invader.prototype.constructor = Invader;

function Invader(x,y,row,column) {
    
    Drawable.call(this,x,y,25,20,column,row);

    this.sprite = [];
    this.collision = false;
    
    this.animation = {};
    
    Invader.prototype.draw = function(context) {
        this.animation.draw(context, this.x, this.y, this.width, this.height)
    }
    
    Invader.prototype.createAnimation = function(invaderSprite) {
        this.sprite = invaderSprite;
        this.animation = new Animation($("#invaders")[0], this.sprite[0], this.sprite[1], this.sprite[2], this.sprite[3], 32);
    }
    
    Invader.prototype.animate = function() {
        this.animation.next();
    }
    
    Invader.prototype.hasCollided = function() {
        return this.collision;
    }
    
    Invader.prototype.explode = function() {
        this.animation = new Animation($("#kaboom")[0], 0,0,34,23, 0);
        this.collision = true;
    }
}

BonusInvader.prototype = new Movable();
BonusInvader.prototype.constructor = BonusInvader;

function BonusInvader() {
    
    Drawable.call(this, 10, 80, 30, 20);
    
    this.img = new Image();
    this.img.src = "img/bonus.png";
    
    this.directionRight = true;
    
    BonusInvader.prototype.draw = function(context) {
        context.drawImage(this.img,0,0,52,27, this.x,this.y,this.width, this.height);
    }
}