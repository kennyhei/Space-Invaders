var spritemanager = {};

spritemanager = (function() {
    
    var frameTime = 0.5; // change animation every 0.5 seconds
    var lastUpdateTime = 0;
    
    // after certain time, change invaders' sprite
    function changeSprite(invaders) {
        var currentTime = new Date().getTime() / 1000;
        
        if ((currentTime - lastUpdateTime) > frameTime) {
            
            for (var i=0; i < invaders.length; ++i) {
                for (var j=0; j < invaders[i].length; ++j) {
                    
                    invaders[i][j].animate();
                    lastUpdateTime = currentTime;
                }
            }
            return true;
        }
        return false;
    }
    
    // which piece of spritesheet will be used for certain invader
    function getSprite(row) {
        if (row == 0)
            return sprite = [0,4,30,25]; // srcX, srcY, width, height
        else if (row == 1 || row == 2)
            return sprite = [69,4,30,25];
        else
            return sprite = [143,4,30,25];     
    }
    
    function decreaseFrametime() {
        frameTime -= 0.009;
    }
    
    function resetFrametime() {
        frameTime = 0.5;
    }
    
    return {
        changeSprite: changeSprite,
        getSprite: getSprite,
        decreaseFrametime: decreaseFrametime,
        resetFrametime: resetFrametime
    };
})();