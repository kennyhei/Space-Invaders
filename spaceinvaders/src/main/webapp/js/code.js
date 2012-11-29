"use strict";

// tiilien koordinaatit, jotka muodostavat yhden muurin
var muuriData = [
    [50, 495],
    [90, 495],
    [50, 475],
    [90, 475],
    [65, 475],
    [80, 475]
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
    
    var muuri = new Muuri(muuriData);
    
    function input() {
//        otetaan liikkeet ja toiminta talteen
        movement = keyhandler.getMovement();
        shootMissile = keyhandler.getAction();
    }

    // k�sitell��n pelaajan sy�tteet ja tietokoneen toiminta (tito) t��ll�
    function logic() {
        playerLogic();
        playerMissileLogic();
    }
    
    // suoritetaan pelaajaan liittyv� logiikka
    function playerLogic() {
        // onko liikkuminen ok
        if (!player.tormaakoSeinaan())
            player.siirra(movement[0]);
    }
    
    // ohjuksen logiikka
    function playerMissileLogic() {
        // vain yksi pelaajan ohjus saa olla kent�ll�
        if (shootMissile && playerMissile == null)
            playerMissile = player.ammu();
        
        if (playerMissile != null) {
            
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
        
        muuri.piirra(context);
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

// alusta suojaava yksitt�inen muuri
function Muuri(muuriData) {
    var tiilet = new Array();
    
    $.each(muuriData, function(index, koordinaatit) {
        console.log(koordinaatit[0]+" "+koordinaatit[1]);
        var tiili = new Tiili(koordinaatit[0], koordinaatit[1]);
        tiilet.push(tiili);
    });

    
    function piirra(context) {
        for (var i=0; i < tiilet.length; ++i) {
            tiilet[i].piirra(context);
        }
    }
    
    return {
        piirra: piirra
    };
}

// muuri koostuu eri tiileist�
function Tiili(x,y) {
    var leveys = 15;
    var korkeus = 20;
    
    function piirra(context) {
        context.fillStyle = "rgb(0,255,0)";
        context.fillRect(x, y, leveys, korkeus);
    }
    
    return {
        piirra: piirra
    };
}
