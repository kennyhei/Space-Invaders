var keyhandler = (function() {
    var keys = new Array();
    var i = 0;
    while(i < 256) {
        keys[i] = false;
        i = i + 1;
    }

    function up() {
        return keys[38] || keys[175] || keys[87];
    }

    function down() {
        return keys[40] || keys[176] || keys[83];
    }

    function left() {
        return keys[37] || keys[178] || keys[65];
    }

    function right() {
        return keys[39] || keys[177] || keys[68];
    }
    
    function keydown(keycode) {
        keys[keycode] = true;
    }    
    
    function keyup(keycode) {
        keys[keycode] = false;
    }
    
    function pressUp() {
        keys[38] = true;
        keys[175] = true;
        keys[87] = true;
        keys[32] = true;
    }
    
    function pressLeft() {
        keys[37] = true;
        keys[178] = true;
        keys[65] = true;
    }
    
    function pressRight() {
        keys[39] = true;
        keys[177] = true;
        keys[68] = true;
    }
    
    function releaseUp() {
        keys[38] = false;
        keys[175] = false;
        keys[87] = false;
        keys[32] = false;
    }
    
    function getAction() {
        if (up() || keys[32])
            return true;
        
        return false;
    }
    
    function getMovement() {
        var movement = 0;

        if(left()) {
            movement = -2;
        }
        if(right()) {
            movement = 2;
        }
        
        return movement;
    }
    
    function clear() {
        var i = 0;
        while(i < 256) {
            keys[i] = false;
            i = i + 1;
        }
    }
    
    return {
        keydown: keydown,
        keyup: keyup,
        getMovement: getMovement,
        getAction: getAction,
        clear: clear,
        pressLeft: pressLeft,
        pressRight: pressRight,
        pressUp: pressUp,
        releaseUp: releaseUp
    };
})()
