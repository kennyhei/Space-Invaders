var soundManager = (function() {
    var soundsOn = true;
    
    var eightBitExplosionAudio = $("#8bit-explosion")[0];
    var explodeAudio = $("#explosion")[0];
    var missileAudio = $("#missile")[0];
    var flightAudio = $("#flight")[0];
    
    function enableSounds() {
        soundsOn = true;
    }
    
    function disableSounds() {
        soundsOn = false;
    }
    
    function explosionSound() {
        if (soundsOn) {
            var audio = explodeAudio;
            audio.volume = 0.6;
            audio.load();
            audio.play();
        }
    }
    
    function eightBitExplosionSound() {
        if (soundsOn) {
            var audio = eightBitExplosionAudio;
            audio.volume = 0.4;
            audio.load();
            audio.play();
        }
    }
    
    function missileSound() {
        if (soundsOn) {
            var audio = missileAudio;
            audio.volume = 0.3;
            audio.load();
            audio.play();
        }
    }
    
    function flightSound() {
        if (soundsOn) {
            var audio = flightAudio;
            audio.volume = 0.1;
            audio.play();
        }
    }
    
    function areSoundsOn() {
        return soundsOn;
    }
    
    return {
        areSoundsOn: areSoundsOn,
        enableSounds: enableSounds,
        disableSounds: disableSounds,
        explosionSound: explosionSound,
        eightBitExplosionSound: eightBitExplosionSound,
        missileSound: missileSound,
        flightSound: flightSound
    };
})();