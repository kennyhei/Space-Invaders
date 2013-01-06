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
    var explosions = new ExplosionManager();
    var bonusInvader;
    
    var level = 1;
    var bonus = 1; // only one bonus invader allowed per level
    
    var playerMissile;
    var bonusInvaderMissile;
    var invaderMissiles = [];
    
    var movement;
    var shootMissile = false;
    
    var gameOver = false;
    
    function input() {
        movement = keyhandler.getMovement();
        shootMissile = keyhandler.getAction();
    }

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
        bonusInvaderLogic();
        bonusInvaderMissileLogic();
        invadersLogic();
        invadersMissileLogic();
            
    }

    function endGame(context) {
        context.fillStyle = "rgb(0,0,0)";
        context.fillRect(180, 265, 180, 33);
        context.font = "bold 30px Courier New";
        context.fillStyle = "rgb(255,255,255)";
        context.fillText("GAME OVER", 190, 280);
        
        renderScoreList(context);
        
        $("#spaceinvaders").on('click.endGame', function(eventInfo) {
            $("#spaceinvaders").off('click.endGame');
            resetData();
            menu();
        });
    }
    
    function renderScoreList(context) {
        if (gameOver)
            score.postScore(); // post score to the server
        
        score.showScores(context);
    }
    
    function playerLogic() {
        if (player.collidesWithEdge()) {
            if (player.getX() > 514 && movement < 0)
                player.move(movement, 0);
            else if (player.getX() < 0 && movement > 0) // if player is touching the wall but is moving away from it, movement is allowed
                player.move(movement, 0);
        }
        else if (!player.collidesWithEdge())
            player.move(movement, 0);
    }
    
    function playerMissileLogic() {
        // only one player missile at a time is allowed to be in game screen
        if (shootMissile && playerMissile == null)
            playerMissile = player.shoot();
        
        if (playerMissile != null) {
            if (walls.doesCollide(playerMissile,explosions) || invaders.doesCollide(playerMissile, score))
                playerMissile = null;
            else if (bonusInvader != null && bonusInvader.doesCollide(playerMissile)) {
                playerMissile = null;
                explosions.newExplosion(bonusInvader.getX(), bonusInvader.getY());
                bonusInvader = null;
                score.raiseScore(5);
            }
            else if (playerMissile.getY() < 70)
                playerMissile = null;
            else 
                playerMissile.move(0,-10);
        }
    }
    
    function bonusInvaderLogic() {
        if (bonusInvader == null && bonus > 0) {
            if (invaders.getNumOfInvaders() < 35) {
                
                if (Math.floor((Math.random()*1000)+1) < 3) {
                    bonusInvader = new BonusInvader();
                    bonus = 0;
                }
            }
        }
        
        if (bonusInvader != null) {
            if (bonusInvader.collidesWithEdge())
                bonusInvader.directionRight = !bonusInvader.directionRight;
        
            if (bonusInvader.directionRight)
                bonusInvader.move(3,0);
            else
                bonusInvader.move(-3,0);
        
            if (bonusInvaderMissile == null) {
                if (Math.random() < 0.015)
                    bonusInvaderMissile = bonusInvader.shoot();
            }
        }
    }
    
    function bonusInvaderMissileLogic() {
        if (bonusInvaderMissile != null) {
            if (player.doesCollide(bonusInvaderMissile)) {
                player.lives -= 1;
                explosions.newExplosion(player.getX(), player.getY());
                bonusInvaderMissile = null;
            } else if (walls.doesCollide(bonusInvaderMissile, explosions) || bonusInvaderMissile.getY() > 533) {
                bonusInvaderMissile = null;
            } else
                bonusInvaderMissile.move(0,3);
        }
    }
    
    function invadersLogic() {
        invaders.update(walls, explosions);
    }
    
    function invadersMissileLogic() {
        invaderMissiles = invaders.shootLogic();
        
        // move missiles / check collisions
        if (invaderMissiles.length > 0) {
            for (var i=0; i < invaderMissiles.length; ++i) {
                var missile = invaderMissiles[i];
                
                if (player.doesCollide(missile)) {
                    player.lives -= 1;
                    explosions.newExplosion(player.getX(), player.getY());
                    invaderColumnShot[missile.getColumn()] = false;
                    invaderMissiles.splice(i,1);
                    --i;
                    
                } else if (walls.doesCollide(missile, explosions) || missile.getY() > 533) {
                    invaderColumnShot[missile.getColumn()] = false;
                    invaderMissiles.splice(i,1);
                    --i;
                } else
                    missile.move(0,1);
            }
        }
    }
    
    function render() {
        var context = $("#spaceinvaders")[0].getContext("2d");
        context.clearRect(0, 0, 540, 580);
        context.fillStyle = "rgb(0,0,0)";
        context.fillRect(0,0,540,580);

        renderMissiles(context);
        renderPlayer(context);
        walls.draw(context);
        renderInvaders(context);
        renderHUD(context);
        renderScore(context);
        renderSoundIcon(context);
        explosions.update(context);
        
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
        context.fillText("Next level is about to start...", 85, 280);
        
        setTimeout(function() {
            resetData();
            ++level;
            
            invaders.setSpeed(3+(level/10));
            invaders.setChance(0.005+(level/250));
            
            tick();
        }, 3000);
    }
    
    function resetData() {
        if (player.lives < 1)
            player = new Player();
        
        invaders = new InvaderManager();
        walls = new WallManager();
        explosions = new ExplosionManager();
        playerMissile = null;
        bonusInvaderMissile = null;
        bonusInvader = null;
        bonus = 1;
        invaderMissiles = null;
        spritemanager.resetFrametime();
        shootMissile = false;
        gameOver = false;
        
        for (var i = 0; i < invaderColumnShot.length; ++i) {
            invaderColumnShot[i] = false; // every column is allowed to shoot again
        }
    }
    
    // player lives & current level
    function renderHUD(context) {
        context.lineWidth = 2;
        context.strokeStyle = "rgb(0,255,0)";
        
        context.beginPath();
        context.moveTo(0,540);
        context.lineTo(540, 540);
        context.stroke();
        
        var playerImg = player.img;
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
    
    function renderSoundIcon(context) {
        var icon = $("#sound-icon")[0];
        context.drawImage(icon, 500, 543, 35, 35);
        
        if (!soundManager.areSoundsOn()) {
            context.strokeStyle = "rgb(255,255,255)";
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(507,571);
            context.lineTo(529,550);
            context.stroke();
        }
    }
    
    // current score and high score
    function renderScore(context) {
        context.fillText("SCORE", 20,30);
        context.fillText(score.getScore(), 20, 50);
        context.fillText("HIGH SCORE", 140, 30);
        context.fillText(score.getHighScore(), 140,50);
    }
    
    function renderInvaders(context) {
        if (bonusInvader != null)
            bonusInvader.draw(context);
        
        invaders.draw(context);
    }
    
    function renderPlayer(context) {
        if (movement == -2)
            var srcX = 147;
        else if (movement == 2)
            srcX = 78;
        else 
            srcX = 0;

        player.draw(context, srcX);
    }
    
    function renderMissiles(context) {
        if (playerMissile != null)
            playerMissile.draw(context);
        
        if (bonusInvaderMissile != null)
            bonusInvaderMissile.draw(context);
        
        if (invaderMissiles.length > 0) {
            $.each(invaderMissiles, function(index, missile) {
                missile.draw(context);
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
        context.clearRect(0,0,540,580);
        context.fillStyle = "rgb(0,0,0)";
        context.fillRect(0,0,540,580);
        
        context.fillStyle = "rgb(255,255,255)";
        context.font = "bold 30px Courier New";
        context.fillText("START GAME", 175, 270);
        
        context.fillText("HIGH SCORES", 175, 320);
        
        var logo = new Image();
        logo.src = "img/logo2.png";
        
        logo.onload = function() {
            context.drawImage(logo, 44, 20, 450, 200);
            context = null;
        };
    
        $("#spaceinvaders").on('click.menu', function(eventInfo) {
            var x = Math.floor((eventInfo.pageX-$(this).offset().left));
            var y = Math.floor((eventInfo.pageY-$(this).offset().top));

            if ( (x >= 176 && x <= 361) && (y >= 251 && y <= 273)) {
                $("#spaceinvaders").off('click.menu');
                score = new ScoreManager();
                engine.tick();
            } else if ((x >= 176 && x <= 379) && (y >= 299 && y <= 322)) {
                $("#spaceinvaders").off('click.menu');
                engine.highscore();
            }
        });
    }
    
    function highscore() {
        var context = $("#spaceinvaders")[0].getContext("2d");

        context.fillStyle = "rgb(0,0,0)";
        context.clearRect(0,250,540,580);
        context.fillRect(0,250,540,580);
        context.fillStyle = "rgb(255,255,255)";
        
        score.showScores(context);
        
        $("#spaceinvaders").on('click.highscore', function(eventInfo) {
            $("#spaceinvaders").off('click.highscore');
            menu();
        });
    }
    
    return {
        input: input,
        logic: logic,
        render: render,
        tick: tick,
        menu: menu,
        highscore: highscore
    };
    
})();

$(document).ready(function() {
    configuration.init();
    engine.menu(); // show menu first
});
