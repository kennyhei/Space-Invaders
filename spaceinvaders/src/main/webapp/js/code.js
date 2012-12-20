'use strict';

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
    var walls = new WallManager();
    var invaders = new InvaderManager();
    
    var level = 1;
    
    var playerMissile;
    var invaderMissiles = [];
    
    var movement;
    var shootMissile = false;
    
    var gameOver = false;
    
    function input() {
        movement = keyhandler.getMovement();
        shootMissile = keyhandler.getAction();
    }

    // käsitellään pelaajan syötteet ja tietokoneen toiminta (tito)
    function logic() {
        if (player.lives < 1 || invaders.getNumOfInvaders() < 1)
            gameOver = true;
        
        $.each(invaders.getInvaders(), function(index, invader) {
            for (var i=0; i < invader.length; ++i) {
                if (invader[i].getY() > 460) {
                    player.lives = 0;
                    gameOver = true;
                    return;
                }
            }
        });
        
        if (gameOver)
            return;
        
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
        context.fillText("GAME OVER", 190, 280);
    }
    
    function playerLogic() {
        // onko liikkuminen ok
        if (player.tormaakoSeinaan()) {
            if (player.getX() > 514 && movement < 0)
                player.siirra(movement, 0);
            else if (player.getX() < 0 && movement > 0) // jos ollaan kiinni seinässä, mutta liikutaan poispäin siitä, sallitaan liike
                player.siirra(movement, 0);
        }
        else if (!player.tormaakoSeinaan())
            player.siirra(movement, 0);
    }
    
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
                playerMissile.siirra(0,-10);
        }
    }
    
    function invadersLogic() {
        invaders.update(walls);
    }
    
    function invadersMissileLogic() {
        invaderMissiles = invaders.shootLogic();
        
        // siirretään ohjuksia / meneekö ohjukset ruudun ulkopuolelle
        if (invaderMissiles.length > 0) {
            for (var i=0; i < invaderMissiles.length; ++i) {
                var missile = invaderMissiles[i];
                
                if (player.tormaako(missile)) {
                    player.lives -= 1;
                    invaderColumnShot[missile.getColumn()] = false;
                    invaderMissiles.splice(i,1);
                    --i;
                    
                } else if (walls.tormaako(missile) || missile.getY() > 535) {
                    invaderColumnShot[missile.getColumn()] = false;
                    invaderMissiles.splice(i,1);
                    --i;
                } else
                    missile.siirra(0,1);
            }
        }
    }
    
    function render() {
        var context = $("#spaceinvaders")[0].getContext("2d");
        context.clearRect(0, 0, 540, 580); // clear canvas
        context.fillStyle = "rgb(0,0,0)";
        context.fillRect(0,0,540,580);

        renderPlayer(context);
        renderMissiles(context);
        walls.piirra(context);
        renderInvaders(context);
        renderHUD(context);
        renderScore(context);
        
        if (gameOver) {
            if (player.lives > 0)
                newGame(context);
            else
                endGame(context);
        }
        
        context = null;
    }
    
    // start new game with increased difficulty after 3 seconds
    // if player still has lives
    function newGame(context) {
        context.fillStyle = "rgb(0,0,0)";
        context.fillRect(180, 265, 180, 33);
        context.font = "20px Courier New";
        context.fillStyle = "rgb(255,255,255)";
        context.fillText("CONGRATULATIONS!", 178, 250);
        context.fillText("Proceeding to the next level...", 80, 280);
        
        setTimeout(function() {
            resetData();
            ++level;
            
            invaders.setSpeed(3+(level/10));
            if (level % 3 == 0)
                invaders.setChance(0.01+(level/100));
            
            tick();
        }, 3000);
    }
    
    function resetData() {
        invaders = new InvaderManager();
        walls = new WallManager();
        playerMissile = null;
        invaderMissiles = null;
        spritemanager.resetFrametime();
        shootMissile = false;
        gameOver = false;
    }
    
    // player lives & current level
    function renderHUD(context) {
        context.lineWidth = 2;
        context.strokeStyle = "rgb(0,255,0)";
        
        context.beginPath();
        context.moveTo(0,540);
        context.lineTo(540, 540);
        context.stroke();
        
        var playerImg = player.getImg();
        var xLocation = 50;
        for (var i=0; i < player.lives; ++i) {
            context.drawImage(playerImg,0,12,80,72,xLocation,550,25,25);
            xLocation += 30;
        }
        
        context.font = "20px Courier New";
        context.fillStyle = "rgb(255, 255, 255)";
        context.fillText(player.lives+"x", 20, 570);
        
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
        if (movement == -2)
            var srcX = 147;
        else if (movement == 2)
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
    
    function menu() {
        var context = $("#spaceinvaders")[0].getContext("2d");
        context.fillStyle = "rgb(0,0,0)";
        context.fillRect(0,0,540,580);
        
        context.fillStyle = "rgb(255,255,255)";
        context.font = "bold 30px Courier New";
        context.fillText("START GAME", 180, 270);
        
        var logo = new Image();
        logo.src = "img/logo.png";
        
        logo.onload = function() {
            context.drawImage(logo, 51, 20);
            context = null;
        };
    }
    
    return {
        input: input,
        logic: logic,
        render: render,
        tick: tick,
        menu: menu
    };
    
})();

$(document).ready(function() {
    
    $(document).keydown(function(eventInformation) {
        keyhandler.keydown(eventInformation.which);
    });
    
    $(document).keyup(function(eventInformation) {
        keyhandler.keyup(eventInformation.which);
    });
    
    engine.menu(); // show menu first
    
    $("#spaceinvaders").click(function(eventInfo) {
        var x = Math.floor((eventInfo.pageX-$(this).offset().left));
        var y = Math.floor((eventInfo.pageY-$(this).offset().top));
        
        if ( (x >= 176 && x <= 361) && (y >= 251 && y <= 273))
            engine.tick();
    });
});

// spritemanager (changesprite pois invadermanagerista)
// textrectangle
// jokin keino palauttaa lista niin, että ei tarvita kahta sisäkkäistä foria => funktio, joka käsittelee matriiseja listana?
// invadereiden logiikka manager-luokkaan kokonaisuudessaan
// perintää, koska invaderilla, playerilla, missilellä ja tiilillä samoja ominaisuuksia
// kuvien lisenssit (space invaders spritesheet, wallpaper, space invaders logo)
// pisteille backbone?