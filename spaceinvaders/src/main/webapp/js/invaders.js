// yksittäisen muukalaisen koordinaatit per rivi
var invaderData = [
    
    // 1. rivi    
    [60, 100], // 0
    [100, 100],
    [140, 100],
    [180, 100],
    [220, 100],
    [260, 100],
    [300, 100],
    [340, 100],
    [380, 100],
    [420, 100],
    [460, 100],

    // 2. rivi
    [60, 140], // 11
    [100, 140],
    [140, 140],
    [180, 140],
    [220, 140],
    [260, 140],
    [300, 140],
    [340, 140],
    [380, 140],
    [420, 140],
    [460, 140],

    // 3. rivi
    [60, 180], // 22
    [100, 180],
    [140, 180],
    [180, 180],
    [220, 180],
    [260, 180],
    [300, 180],
    [340, 180],
    [380, 180],
    [420, 180],
    [460, 180],

    // 4. rivi
    [60, 220],
    [100, 220],
    [140, 220],
    [180, 220],
    [220, 220],
    [260, 220],
    [300, 220],
    [340, 220],
    [380, 220],
    [420, 220],
    [460, 220],

    // 5. rivi
    [60, 260],
    [100, 260],
    [140, 260],
    [180, 260],
    [220, 260],
    [260, 260],
    [300, 260],
    [340, 260],
    [380, 260],
    [420, 260],
    [460, 260]
];

function InvaderList() {
    var invaders = new Array();
    
    $.each(invaderData, function(index, data) {
        var invader = new Invader(data[0], data[1]);
        invaders.push(invader);
    });
    
    function siirra(x,y) {
        $.each(invaders, function(index, invader) {
            invader.siirra(x,y);
        });
    }
    
    function piirra(context) {
        for (var i=0; i < invaders.length; ++i) {
            invaders[i].piirra(context);
        }
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

function Invader(x,y) {
    var leveys = 25;
    var korkeus = 25;
    
    // alien voi liikkua vain sivuttaisuunnassa
    function siirra(dx, dy) {
        x += dx;
        y += dy;
    }
    
    function piirra(context) {
        context.fillStyle = "rgb(255,0,0)";
        context.fillRect(x, y, leveys, korkeus);
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
    
    return {
        getX: getX,
        getY: getY,
        siirra: siirra,
        piirra: piirra,
        tormaakoSeinaan: tormaakoSeinaan,
        tormaako: tormaako,
        ammu: ammu
    };
}