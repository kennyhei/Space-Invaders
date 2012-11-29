"use strict";

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
    
    var walls = new MuuriVarasto();
    var invaders = new InvaderList();
    
    function input() {
//        otetaan liikkeet ja toiminta talteen
        movement = keyhandler.getMovement();
        shootMissile = keyhandler.getAction();
    }

    // käsitellään pelaajan syötteet ja tietokoneen toiminta (tito) täällä
    function logic() {
        playerLogic();
        playerMissileLogic();
        invadersLogic();
    }
    
    function invadersLogic() {
        // todo
    }
    
    // suoritetaan pelaajaan liittyvä logiikka
    function playerLogic() {
        // onko liikkuminen ok
        
        if (player.tormaakoSeinaan()) {
            if (player.getX() > 514 && movement[0] < 0)
                player.siirra(movement[0]);
            else if (player.getX() < 0 && movement[0] > 0) // jos ollaan kiinni seinässä, mutta liikutaan poispäin siitä, sallitaan liike
                player.siirra(movement[0]);
        }
        else if (!player.tormaakoSeinaan())
            player.siirra(movement[0]);
    }
    
    // ohjuksen logiikka
    function playerMissileLogic() {
        // vain yksi pelaajan ohjus saa olla kentällä
        if (shootMissile && playerMissile == null)
            playerMissile = player.ammu();
        
        if (playerMissile != null) {
            if (walls.tormaako(playerMissile) || invaders.tormaako(playerMissile)) // jos ohjus törmää johonkin tai katoaa ruudulta, poistetaan se
                playerMissile = null;
            else if (playerMissile.getY() < 0)
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
        invaders.piirra(context);
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
        if (x > 514 || x < 0)
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
        y -= 10;
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
