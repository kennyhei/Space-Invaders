function ExplosionManager() {
    var explosions = [];
    
    function newExplosion(x,y) {
        explosions.push(new Explosion(x,y));
        soundManager.explosionSound();
    }
    
    function update(context) {
        for (var i=0; i < explosions.length; ++i) {
            var explosion = explosions[i];
            
            if (explosion.empty()) {
                explosions.splice(i,1);
                --i;
            }
        }
        
        if (explosions.length > 0)
            draw(context);
    }
    
    function draw(context) {
        for (var i=0; i < explosions.length; ++i) {
            explosions[i].draw(context);
        }
    }
    
    return {
        update: update,
        newExplosion: newExplosion
    }
}


// creates particle explosion
function Explosion(x,y) {
    this.particles = [];
    
    for (var i=0; i < 30; ++i) {
        this.particles.push(new Particle(x,y));
    }
    
    Explosion.prototype.empty = function() {
        for (var i=0; i < this.particles.length; ++i) {
            if (this.particles[i].radius <= 0) {
                this.particles.splice(i,1);
                --i;
            }    
        }
        
        if (this.particles.length == 0)
            return true;
        else
            return false;
    }
    
    Explosion.prototype.draw = function(context) {
        //Fill the canvas with circles
        for(var i = 0; i < this.particles.length; i++){
            var particle = this.particles[i];
    
            //Create the circles
            context.beginPath();
            context.globalCompositeOperation = "lighter";
            context.arc(particle.x, particle.y, particle.radius, 0, Math.PI*2, false);
            context.fillStyle = "rgba("+particle.r+", "+particle.g+", "+particle.b+", 0.5)";
            context.fill();
    
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.radius -= .20;
        }
    }
}

function Particle(x,y) {
    
    // location    
    this.x = x;
    this.y = y;
    
    this.radius = 3 + Math.random()*4;
    
    //Random colors
    this.r = Math.round(Math.random())*255;
    this.g = Math.round(Math.random())*255;
    this.b = Math.round(Math.random())*255;
    
    // velocities
    this.vx = -10 + Math.random()*20;
    this.vy = -10 + Math.random()*20;
}
