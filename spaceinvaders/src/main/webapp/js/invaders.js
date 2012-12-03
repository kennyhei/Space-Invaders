// yksittäisen muukalaisen koordinaatit per rivi
var invaderData = [
    
    // 1. rivi    
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

    // 2. rivi
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

    // 3. rivi
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

    // 4. rivi
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

    // 5. rivi
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

function InvaderList() {
    var invaders = new Array();
    var numOfInvaders = 55;
    var invaderMissiles = [];
    var invadersSpeed = 0.1;
    
    var frameTime = 2; // vaihdetaan sprite-animaatiota 1 sekunnin välein
    var lastUpdateTime = 0;
    
    // tässä invaderit on lueteltu sarakeittain
    $.each(invaderData, function(index, data) {
        var invader = new Invader(data[0], data[1], data[2], data[3]);
        var realIndex = (index % 11);
        
        if (!invaders[realIndex])
            invaders[realIndex] = [];
        
        var sprite = getSprite(data[2]);
        invader.createAnimation(sprite);
        invaders[realIndex].push(invader);
    });
    
//    // after certain time, change invaders' sprite
//    // if invader's sprite is "kaboom", delete invader
    function changeSprite() {
        var currentTime = new Date().getTime() / 1000;
        
        if ((currentTime - lastUpdateTime) > frameTime) {
            for (var i=0; i < invaders.length; ++i) {
                for (var j=0; j < invaders[i].length; ++j) {
                    
                    invaders[i][j].animate();
                    lastUpdateTime = currentTime;
                }
            }
        }
    }
    
    function siirra(x,y) {
        $.each(invaders, function(index, invader) {
            for (var i=0; i < invader.length; ++i) {
                invader[i].siirra(x,y);
            }
        });
    }
    
    function piirra(context) {
        changeSprite();
        
        for (var i=0; i < invaders.length; ++i) {
            for (var j=0; j < invaders[i].length; ++j) {
            invaders[i][j].piirra(context);
            }
        }
    }
    
    function getSprite(row) {
        if (row == 0)
            return sprite = [1,4,30,25]; // srcX, srcY, width, height
        else if (row == 1 || row == 2)
            return sprite = [70,4,30,25];
        else
            return sprite = [144,4,30,25];     
    }
    
    // jos johonkin invaderiin osuu ohjus, vaihdetaan sen sprite räjähdykseen
    function tormaako(ohjus,score) {
        for (var i=0; i < invaders.length; ++i) {
            for (var j=0; j < invaders[i].length; ++j) {

            if (invaders[i][j].tormaako(ohjus)) {
                score.raiseScore(invaders[i][j].getRow()); // tuhottiin otus, kasvatetaan siis pisteitä
                increaseSpeed();
                poistaInvader(i,j);
                --numOfInvaders;
                return true;
            }
            }
        }
        return false;
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
        
        // jos koko vihollissarake tuhottu, ei jatketa
        if (column.length > 0) {
            if (Math.random() < 0.3) {
                invaderMissiles.push(column[column.length-1].ammu());
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
    
    function tormaakoSeinaan() {
        for (var i=0; i < invaders.length; ++i) {
            for (var j=0; j < invaders[i].length; ++j) {
            if (invaders[i][j].tormaakoSeinaan())
                return true;
            }
        }
    
        return false;
    }
    
    function poistaInvader(row, column) {
        invaders[row].splice(column, 1);
    }
    
    function increaseSpeed() {
        invadersSpeed += 0.025;
        frameTime -= 0.015;
    }
    
    function getSpeed() {
        return invadersSpeed;
    }
    
    return {
        getSpeed: getSpeed,
        piirra: piirra,
        tormaako: tormaako,
        tormaakoSeinaan: tormaakoSeinaan,
        siirra: siirra,
        getInvaders: getInvaders,
        getNumOfInvaders: getNumOfInvaders,
        shootLogic: shootLogic
    };
}

// sijainti ja monennella rivillä ja sarakkeella invader on
function Invader(x,y,row,column) {
    var leveys = 25;
    var korkeus = 20;
    var sprite = [];
    
    // sprite variables
    var img = new Image();
    img.src = "img/invaders2.png";
    var animation = {};

    function siirra(dx, dy) {
        x += dx;
        y += dy;
    }
    
    function piirra(context) {
        animation.draw(context, x, y, leveys, korkeus)
//        context.drawImage(img, sprite[0], sprite[1], sprite[2], sprite[3], x,y,leveys,korkeus);
    }
    
    function tormaakoSeinaan() {
        if (x > 514 || x < 0)
            return true;
        
        return false;
    }
    
    function tormaako(ohjus) {
        if (intersects(x,y,25,25, ohjus.getX(), ohjus.getY(), 3, 5))
            return true;
        else
            return false;
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
    
    function createAnimation(invaderSprite) {
        sprite = invaderSprite;
        animation = new Animation(img, sprite[0], sprite[1], sprite[2], sprite[3]);
    }
    
    function animate() {
        animation.next(32, sprite[0]);
    }
    
    function ammu() {
        return new Ohjus(x+10, y+5, column);
    }
    
    function getX() {
        return x;
    }
    
    function getY() {
        return y;
    }
    
    function getRow() {
        return row;
    }
    
    function getColumn() {
        return column;
    }
    
    return {
        getColumn: getColumn,
        getX: getX,
        getY: getY,
        getRow: getRow,
        siirra: siirra,
        piirra: piirra,
        tormaakoSeinaan: tormaakoSeinaan,
        tormaako: tormaako,
        ammu: ammu,
        createAnimation: createAnimation,
        animate: animate
    };
}