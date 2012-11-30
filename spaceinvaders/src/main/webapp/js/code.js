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
    var invaderMissiles = [];
    
    var movement = {};
    var shootMissile = false;
    
    var walls = new MuuriVarasto();
    var invaders = new InvaderList();
    var invaderDirection = true; // jos true, muukalaiset liikkuvat oikealle, muuten vasemmalle
    
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
        invadersMissileLogic();
    }
    
    function invadersLogic() {
        // kosketetaan seinää => rivi alemmas ja suunnanvaihdos
        if (invaders.tormaakoSeinaan()) {
            if (invaderDirection)
                invaders.siirra(-1,25);
            else
                invaders.siirra(1,25);
            
            invaderDirection = !invaderDirection;
        } else if (!invaders.tormaakoSeinaan()) {
            if (invaderDirection)
                invaders.siirra(1,0);
            else
                invaders.siirra(-1,0);
        }
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
                playerMissile.siirra(-10);
        }
    }
    
    function invadersMissileLogic() {
        $.each(invaders.getInvaders(), function(index, invader) {
            if (Math.random() < 0.001 && index > 43)
                invaderMissiles.push(invader.ammu());
        });
        
        // siirretään ohjuksia / meneekö ohjukset ruudun ulkopuolelle
        if (invaderMissiles.length > 0) {
            for (var i=0; i < invaderMissiles.length; ++i) {
                var missile = invaderMissiles[i];
                
                if (player.tormaako(missile) || walls.tormaako(missile)) {
                    invaderMissiles.splice(i,1);
                    --i;
                } else if (missile.getY() > 580) {
                    invaderMissiles.splice(i, 1);
                    --i;
                } else
                    missile.siirra(1);
            }
        }
    }
    
    function render() {
        // get context and clear
        var context = $("#spaceinvaders")[0].getContext("2d");
        context.clearRect(0, 0, 540, 580);
        context.fillStyle = "rgb(0,0,0)";
        context.fillRect(0,0,540,580);
        
        renderPlayer(context);
        
        if (playerMissile != null)
            playerMissile.piirra(context);
        
        if (invaderMissiles.length > 0) {
            $.each(invaderMissiles, function(index, missile) {
                missile.piirra(context);
            });
        }
        
        walls.piirra(context);
        renderInvaders(context);
    }
    
    function renderInvaders(context) {
        invaders.piirra(context);
    }
    
    function renderPlayer(context) {
        if (movement[0] == -2)
            var srcX = 147;
        else if (movement[0] == 2)
            srcX = 78;
        else 
            srcX = 0;
        
        player.piirra(context, srcX);
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
