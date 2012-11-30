// yksittäisen muukalaisen koordinaatit per rivi
var invaderData = [
    
    // 1. rivi    
    [60, 100,0], // 0
    [100, 100,0],
    [140, 100,0],
    [180, 100,0],
    [220, 100,0],
    [260, 100,0],
    [300, 100,0],
    [340, 100,0],
    [380, 100,0],
    [420, 100,0],
    [460, 100,0],

    // 2. rivi
    [60, 140,1], // 11
    [100, 140,1],
    [140, 140,1],
    [180, 140,1],
    [220, 140,1],
    [260, 140,1],
    [300, 140,1],
    [340, 140,1],
    [380, 140,1],
    [420, 140,1],
    [460, 140,1],

    // 3. rivi
    [60, 180,2], // 22
    [100, 180,2],
    [140, 180,2],
    [180, 180,2],
    [220, 180,2],
    [260, 180,2],
    [300, 180,2],
    [340, 180,2],
    [380, 180,2],
    [420, 180,2],
    [460, 180,2],

    // 4. rivi
    [60, 220,3],
    [100, 220,3],
    [140, 220,3],
    [180, 220,3],
    [220, 220,3],
    [260, 220,3],
    [300, 220,3],
    [340, 220,3],
    [380, 220,3],
    [420, 220,3],
    [460, 220,3],

    // 5. rivi
    [60, 260,4],
    [100, 260,4],
    [140, 260,4],
    [180, 260,4],
    [220, 260,4],
    [260, 260,4],
    [300, 260,4],
    [340, 260,4],
    [380, 260,4],
    [420, 260,4],
    [460, 260,4]
];

function InvaderList() {
    var invaders = new Array();
    
    $.each(invaderData, function(index, data) {
        var invader = new Invader(data[0], data[1], data[2]);
        invaders.push(invader);
    });
    
    function siirra(x,y) {
        $.each(invaders, function(index, invader) {
            invader.siirra(x,y);
        });
    }
    
    function piirra(context) {
        for (var i=0; i < invaders.length; ++i) {
            var row = invaders[i].getRow(); // kuva päätellään invaderin sijaitseman rivin perusteella
            var sprite = getSprite(row);
            invaders[i].piirra(context, sprite);
        }
    }
    
    function getSprite(row) {
        if (row == 0)
            return sprite = [1,4,30,25]; // srcX, srcY, width, height
        else if (row == 1 || row == 2)
            return sprite = [70,4,30,25];
        else
            return sprite = [176,4,30,25];
            
    }
    
    // jos johonkin invaderiin osuu ohjus, poistetaan se listalta
    function tormaako(ohjus) {
        for (var i=0; i < invaders.length; ++i) {
            if (invaders[i].tormaako(ohjus)) {
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
    
    var img = new Image();
    img.src = "invaders.png";
    
    function siirra(dx, dy) {
        x += dx;
        y += dy;
    }
    
    function piirra(context, sprite) {
        context.drawImage(img, sprite[0], sprite[1], sprite[2], sprite[3], x,y,leveys,korkeus);
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
    
    return {
        getX: getX,
        getY: getY,
        getRow: getRow,
        siirra: siirra,
        piirra: piirra,
        tormaakoSeinaan: tormaakoSeinaan,
        tormaako: tormaako,
        ammu: ammu
    };
}