// yksittäisen muukalaisen koordinaatit per rivi
var invaderData = [
    
    // 1. rivi    
    [60, 135,0], // 0
    [100, 135,0],
    [140, 135,0],
    [180, 135,0],
    [220, 135,0],
    [260, 135,0],
    [300, 135,0],
    [340, 135,0],
    [380, 135,0],
    [420, 135,0],
    [460, 135,0],

    // 2. rivi
    [60, 160,1], // 11
    [100, 160,1],
    [140, 160,1],
    [180, 160,1],
    [220, 160,1],
    [260, 160,1],
    [300, 160,1],
    [340, 160,1],
    [380, 160,1],
    [420, 160,1],
    [460, 160,1],

    // 3. rivi
    [60, 185,2], // 22
    [100, 185,2],
    [140, 185,2],
    [180, 185,2],
    [220, 185,2],
    [260, 185,2],
    [300, 185,2],
    [340, 185,2],
    [380, 185,2],
    [420, 185,2],
    [460, 185,2],

    // 4. rivi
    [60, 210,3],
    [100, 210,3],
    [140, 210,3],
    [180, 210,3],
    [220, 210,3],
    [260, 210,3],
    [300, 210,3],
    [340, 210,3],
    [380, 210,3],
    [420, 210,3],
    [460, 210,3],

    // 5. rivi
    [60, 235,4],
    [100, 235,4],
    [140, 235,4],
    [180, 235,4],
    [220, 235,4],
    [260, 235,4],
    [300, 235,4],
    [340, 235,4],
    [380, 235,4],
    [420, 235,4],
    [460, 235,4]
];

function InvaderList() {
    var invaders = new Array();
    
    var frameTime = 1; // vaihdetaan sprite-animaatiota 1 sekunnin välein
    var lastUpdateTime = 0;
    
    $.each(invaderData, function(index, data) {
        var invader = new Invader(data[0], data[1], data[2]);
        var sprite = getSprite(data[2]);
        invader.setSprite(sprite);
        invaders.push(invader);
    });
    
    // after certain time, change invaders' sprite
    // if invader's sprite is "kaboom", delete invader
    function changeSprite() {
        var currentTime = new Date().getTime() / 1000;
        
        if ((currentTime - lastUpdateTime) > frameTime) {
            for (var i=0; i < invaders.length; ++i) {
//                if (invaders[i].getImgSrc().indexOf("kaboom.png") != -1) {
//                    poistaInvader(i);
//                    continue;
//                }
                
                var sprite = invaders[i].getSprite();
            
                if (invaders[i].getChangeSprite() == true) {
                    sprite[0] -= 30;
                    invaders[i].setSprite(sprite);
                } else {
                    sprite[0] += 30;
                    invaders[i].setSprite(sprite);
                }
            
                lastUpdateTime = currentTime;
                invaders[i].setChangeSprite();
            }
        }
    }
    
    function siirra(x,y) {
        $.each(invaders, function(index, invader) {
            invader.siirra(x,y);
        });
    }
    
    function piirra(context) {
        changeSprite();
        
        for (var i=0; i < invaders.length; ++i) {
            invaders[i].piirra(context);
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

            if (invaders[i].tormaako(ohjus)) {
//                if (invaders[i].getImgSrc().indexOf("kaboom.png") != -1)
//                    continue;
//                
//                invaders[i].setImgSrc("kaboom.png");
//                var sprite = [0,0,34,23];
//                invaders[i].setSprite(sprite);
                score.raiseScore(invaders[i].getRow()); // tuhottiin otus, kasvatetaan siis pisteitä
                poistaInvader(i);
                return true;
            }
        }
    
        return false;
    }
    
    function getInvaders() {
        return invaders;
    }
    
    function tormaakoSeinaan() {
        for (var i=0; i < invaders.length; ++i) {
            if (invaders[i].tormaakoSeinaan())
                return true;
        }
    
        return false;
    }
    
    function poistaInvader(index) {
        invaders.splice(index, 1);
    }
    
    return {
        piirra: piirra,
        tormaako: tormaako,
        tormaakoSeinaan: tormaakoSeinaan,
        siirra: siirra,
        getInvaders: getInvaders
    };
}

// sijainti ja monennella rivillä invader on
function Invader(x,y,row) {
    var leveys = 25;
    var korkeus = 20;
    var sprite = [];
    
    // sprite variables
    var img = new Image();
    img.src = "invaders2.png";
    
//    var frameTime = 1; // vaihdetaan sprite-animaatiota 1 sekunnin välein
//    var lastUpdateTime = 0;
    var changeSprite = false;
    
    function siirra(dx, dy) {
        x += dx;
        y += dy;
    }
    
    function piirra(context) {
//        changeSprite();
        context.drawImage(img, sprite[0], sprite[1], sprite[2], sprite[3], x,y,leveys,korkeus);
    }
    
//    // after certain time, change sprite
//    function changeSprite() {
//        var currentTime = new Date().getTime() / 1000;
//        if ((currentTime -  lastUpdateTime) > frameTime) {
//            if (secondSprite)
//                sprite[0] -= 30;
//            else
//                sprite[0] += 30;
//            
//            lastUpdateTime = currentTime;
//            secondSprite = !secondSprite;
//        }
//    }
    
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
    
    function setSprite(invaderSprite) {
        sprite = invaderSprite;
    }
    
    function getSprite() {
        return sprite;
    }
    
    function getChangeSprite() {
        return changeSprite;
    }
    
    function setChangeSprite() {
        changeSprite = !changeSprite;
    }
    
    function ammu() {
        return new Ohjus(x+10, y+5);
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
    
    function setImgSrc(imgSrc) {
        img.src = imgSrc;
    }
    
    function getImgSrc() {
        return img.src;
    }
    
    return {
        getX: getX,
        getY: getY,
        getRow: getRow,
        siirra: siirra,
        piirra: piirra,
        tormaakoSeinaan: tormaakoSeinaan,
        tormaako: tormaako,
        ammu: ammu,
        getSprite: getSprite,
        setSprite: setSprite,
        setImgSrc: setImgSrc,
        getImgSrc: getImgSrc,
        getChangeSprite: getChangeSprite,
        setChangeSprite: setChangeSprite
    };
}