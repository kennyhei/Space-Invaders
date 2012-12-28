var soundManager = (function() {
    var soundsOn = true;
    
    var eightBitExplosionAudio = $("#8bit-explosion")[0];
    var explodeAudio = $("#explosion")[0];
    var laserAudio = $("#laser")[0];
    var flightAudio = $("#flight")[0];
    
    function enableSounds() {
        soundsOn = true;
    }
    
    function disableSounds() {
        soundsOn = false;
    }
    
    function explosionSound() {
        var audio = explodeAudio;
        
        if (soundsOn) {
            audio.volume = 0.6;
            audio.load();
            audio.play();
        }
    }
    
    function eightBitExplosionSound() {
        var audio = eightBitExplosionAudio;
        
        if (soundsOn) {
            audio.volume = 0.4;
            audio.load();
            audio.play();
        }
    }
    
    function laserSound() {
        var audio = laserAudio;
        
        if (soundsOn) {
            audio.volume = 0.3;
            audio.load();
            audio.play();
        }
    }
    
    function flightSound() {
        var audio = flightAudio;
        
        if (soundsOn) {
            audio.volume = 0.1;
            audio.play();
        }
    }
    
    return {
        enableSounds: enableSounds,
        disableSounds: disableSounds,
        explosionSound: explosionSound,
        eightBitExplosionSound: eightBitExplosionSound,
        laserSound: laserSound,
        flightSound: flightSound
    };
})();