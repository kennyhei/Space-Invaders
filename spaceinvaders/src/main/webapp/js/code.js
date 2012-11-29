"use strict";

// tiilien koordinaatit jokaista nelj‰‰ muuria varten
var muuriData = [
    [[70, 495],
    [110, 495],
    [70, 475],
    [110, 475],
    [85, 475],
    [100, 475]],

    [[180, 495],
    [220, 495],
    [180, 475],
    [220, 475],
    [195, 475],
    [210, 475]],

    [[290, 495],
    [330, 495],
    [290, 475],
    [330, 475],
    [305, 475],
    [320, 475]],

    [[400, 495],
    [440, 495],
    [400, 475],
    [440, 475],
    [415, 475],
    [430, 475]]
];

window.requestAnimFrame = (function(){
    return window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function(/* kutsuttava funktio */ callback, /* elementti */ element){
        window.setTimeout(callback, 1000 / 60);
    };
})();  

var engine = (function() {
    var player = new Player();
    var playerMissile;
    
    var movement = {};
    var shootMissile = false;
    
    
    var walls = new MuuriVarasto(muuriData);
    
    function input() {
//        otetaan liikkeet ja toiminta talteen
        movement = keyhandler.getMovement();
        shootMissile = keyhandler.getAction();
    }

    // k‰sitell‰‰n pelaajan syˆtteet ja tietokoneen toiminta (tito) t‰‰ll‰
    function logic() {
        playerLogic();
        playerMissileLogic();
    }
    
    // suoritetaan pelaajaan liittyv‰ logiikka
    function playerLogic() {
        // onko liikkuminen ok
        if (!player.tormaakoSeinaan())
            player.siirra(movement[0]);
    }
    
    // ohjuksen logiikka
    function playerMissileLogic() {
        // vain yksi pelaajan ohjus saa olla kent‰ll‰
        if (shootMissile && playerMissile == null)
            playerMissile = player.ammu();
        
        if (playerMissile != null) {
            walls.tormaako(playerMissile);
            
            if (playerMissile.getY() < 0) 
                playerMissile = null;
            else 
                playerMissile.siirra();
        }
    }
    
    function render() {
        // get context and clear
        var context = $("#spaceinvaders")[0].getContext("2d");
        context.clearRect(0, 0, 540, 580);
        
        player.piirra(context);
        
        if (playerMissile != null)
            playerMissile.piirra(context);
        
        walls.piirra(context);
    }
    
    function tick() {
        engine.input();
        engine.logic();
        engine.render();
        requestAnimFrame(engine.tick);
    }
    
    return {
        input: input,
        logic: logic,
        render: render,
        tick: tick
    };
    
})();



$(document).ready(function() {
    
    $(document).keydown(function(eventInformation) {
        keyhandler.keydown(eventInformation.which);
    });
    
    $(document).keyup(function(eventInformation) {
        keyhandler.keyup(eventInformation.which);
    });
    
    engine.tick();
});

function Player() {
    var x = 260;
    var y = 540;
    var leveys = 25;
    var korkeus = 25;
    
    // alus voi liikkua vain sivuttaisuunnassa
    function siirra(dx) {
        x += dx;
    }
    
    function piirra(context) {
        context.fillStyle = "rgb(0,255,0)";
        context.fillRect(x, y, leveys, korkeus);
    }
    
    function tormaakoSeinaan() {
        if (x > 515 || x < 0)
            return true;
        
        return false;
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
        ammu: ammu
    };
}

// pelaajan tai muukalaisten ampumat ohjukset
function Ohjus(x,y) {
    var leveys = 3;
    var korkeus = 5;
    
    function piirra(context) {
        context.fillStyle = "rgb(0,0,0)";
        context.fillRect(x, y, leveys, korkeus);
    }
    
    function siirra() {
        y -= 4;
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
        piirra: piirra
    };
}

// pelimoottorilla on lista muureista
function MuuriVarasto(muuriData) {
    var muurit = new Array();
    
    $.each(muuriData, function(index, data) {
        var muuri = new Muuri(data);
        muurit.push(muuri);
    });
    
    function piirra(context) {
        for (var i=0; i < muurit.length; ++i) {
            muurit[i].piirra(context);
        }
    }
    
    function getMuurit() {
        return muurit;
    }
    
    function tormaako(ohjus) {
        $.each(muurit, function(index,muuri) {
            console.log(muuri.tormaako(ohjus));
        });
    }
    
    return {
        piirra: piirra,
        getMuurit: getMuurit,
        tormaako: tormaako
    };
}

// alusta suojaava yksitt‰inen muuri
function Muuri(muuriData) {
    var tiilet = new Array();
    
    $.each(muuriData, function(index, koordinaatit) {
        var tiili = new Tiili(koordinaatit[0], koordinaatit[1]);
        tiilet.push(tiili);
    });

    
    function piirra(context) {
        for (var i=0; i < tiilet.length; ++i) {
            tiilet[i].piirra(context);
        }
    }
    
    function getTiilet() {
        return tiilet;
    }
    
    // jos muuri havaitsee, ett‰ johonkin sen tiileen osuu ohjus, se osaa
    // itse poistaa tiilen
    function tormaako(ohjus) {
        for (var i=0; i < tiilet.length; ++i) {
            if (tiilet[i].tormaako(ohjus)) {
                poistaTiili(i);
                return true; // ohjus osui johonkin, ei tarvetta jatkaa l‰pik‰ynti‰
            }
        }
        
        return false;
    }
    
    function poistaTiili(index) {
        tiilet.splice(index, 1);
    }
    
    return {
        piirra: piirra,
        getTiilet: getTiilet,
        tormaako: tormaako
    };
}

// muuri koostuu eri tiileist‰
function Tiili(x,y) {
    var leveys = 15;
    var korkeus = 20;
    
    function piirra(context) {
        context.fillStyle = "rgb(0,255,0)";
        context.fillRect(x, y, leveys, korkeus);
    }

    // huom. x ja y koordinaatin muodostama piste sijaitsee laatikon vasemmassa yl‰kulmassa
    function tormaako(ohjus) {
        if (intersects(x,y,15,20, ohjus.getX(), ohjus.getY(), 3, 5))
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
    
    return {
        piirra: piirra,
        tormaako: tormaako
    };
}
