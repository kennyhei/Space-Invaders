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
    var score = new ScoreManager();
    var walls = new MuuriVarasto();
    var invaders = new InvaderList();
    
    var level = 1;
    
    var playerMissile;
    var invaderMissiles = [];
    
    var invaderDirection = true; // jos true, muukalaiset liikkuvat oikealle, muuten vasemmalle
    var movement = {};
    var shootMissile = false;
    
    var gameOver = false;
    
    function input() {
//        otetaan liikkeet ja toiminta talteen
        movement = keyhandler.getMovement();
        shootMissile = keyhandler.getAction();
    }

    // käsitellään pelaajan syötteet ja tietokoneen toiminta (tito) täällä
    function logic() {
        if (player.getLives() < 1 || invaders.getNumOfInvaders() < 1)
            gameOver = true;
        
        playerLogic();
        playerMissileLogic();
        invadersLogic();
        invadersMissileLogic();
            
    }

    function endGame(context) {
        context.fillStyle = "rgb(0,0,0)";
        context.fillRect(180, 265, 180, 33);
        context.font = "bold 30px Courier New";
        context.fillStyle = "rgb(255,255,255)";
        context.fillText("GAME OVER", 190, 290);
    }
    
    function invadersLogic() {
        
//        $.each(invaders.getInvaders(), function(index, invaderColumn) {
//            for (var i=0; i < invaderColumn.length; ++i) {
//                console.log(invaderColumn.length);
//                if (invaderColumn[i].getY() > 500 || player.tormaako(invaderColumn[i])) {
//                    gameOver = true;
//                    return;
//                }
//            }
//        });
        
        invaders.tormaakoMuuriin(walls);
        
        // kosketetaan seinää => rivi alemmas ja suunnanvaihdos
        if (invaders.tormaakoSeinaan()) {
            if (invaderDirection)
                invaders.siirra(-1-(invaders.getSpeed()),25);
            else
                invaders.siirra(1+(invaders.getSpeed()),25);
            
            invaderDirection = !invaderDirection;
        } else if (!invaders.tormaakoSeinaan()) {
            
            var speed = invaders.getSpeed();
            if (invaderDirection)
                invaders.siirra(speed,0);
            else
                invaders.siirra(-speed,0);
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
            if (walls.tormaako(playerMissile) || invaders.tormaako(playerMissile, score)) // jos ohjus törmää johonkin tai katoaa ruudulta, poistetaan se
                playerMissile = null;
            else if (playerMissile.getY() < 70)
                playerMissile = null;
            else 
                playerMissile.siirra(-10);
        }
    }
    
    function invadersMissileLogic() {
        invaderMissiles = invaders.shootLogic();
        
        // siirretään ohjuksia / meneekö ohjukset ruudun ulkopuolelle
        if (invaderMissiles.length > 0) {
            for (var i=0; i < invaderMissiles.length; ++i) {
                var missile = invaderMissiles[i];
                
                if (player.tormaako(missile) || walls.tormaako(missile)) {
                    invaderColumnShot[missile.getColumn()] = false;
                    invaderMissiles.splice(i,1);
                    --i;
                } else if (missile.getY() > 535) {
                    invaderColumnShot[missile.getColumn()] = false;
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
        renderMissiles(context);
        walls.piirra(context);
        renderInvaders(context);
        renderHUD(context);
        renderScore(context);
        
        if (gameOver) {
            endGame(context);
            newGame();
        }
            
    }
    
    // start new game with increased difficulty after 3 seconds
    // if player still has lives
    function newGame() {
        
        if (player.getLives() > 0) {
            setTimeout(function() {
                resetData();
                ++level;
                tick();
            }, 3000);
        }
    }
    
    function resetData() {
        invaders = new InvaderList();
        walls = new MuuriVarasto();
        playerMissile = null;
        invaderMissiles = [];
        invaderDirection = true;
        shootMissile = false;
        gameOver = false;
    }
    
    function renderHUD(context) {
        context.lineWidth = 2;
        context.strokeStyle = "rgb(0,255,0)";
        context.moveTo(0,540);
        context.lineTo(540, 540);
        context.stroke();
        
        var playerImg = player.getImg();
        var xLocation = 50;
        for (var i=0; i < player.getLives(); ++i) {
            context.drawImage(playerImg,0,12,80,72,xLocation,550,25,25);
            xLocation += 30;
        }
        
        context.font = "20px Courier New";
        context.fillStyle = "rgb(255, 255, 255)";
        context.fillText(player.getLives()+"x", 20, 570);
        
        context.fillText("LEVEL", 340, 30);
        context.fillText(level, 340, 50);
    }
    
    // current score and high score
    function renderScore(context) {
        context.fillText("SCORE", 20,30);
        context.fillText(score.getScore(), 20, 50);
        context.fillText("HIGH SCORE", 140, 30);
        context.fillText(score.getHighScore(), 140,50);
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
    
    function renderMissiles(context) {
        if (playerMissile != null)
            playerMissile.piirra(context);
        
        if (invaderMissiles.length > 0) {
            $.each(invaderMissiles, function(index, missile) {
                missile.piirra(context);
            });
        }
    }
    
    function tick() {
        engine.input();
        engine.logic();
        engine.render();
        
        if (!gameOver)
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
