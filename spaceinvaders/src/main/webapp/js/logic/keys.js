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
        keydown(38);
        keydown(175);
        keydown(87);
        keydown(32);
    }
    
    function pressLeft() {
        keydown(37);
        keydown(178);
        keydown(65);
    }
    
    function pressRight() {
        keydown(39);
        keydown(177);
        keydown(68);
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
        pressUp: pressUp
    };
})()
