// configurates event handlers, user-specific scores, touchscreen buttons + game sounds
var configuration = (function() {
    function init() {
        if (jQuery.browser.mobile == true){ // checks if user is browsing with mobile device
            sounds(); // if true, disable sounds for better performance
        
            screen(); // if true, add touchscreen buttons for mobile users
            buttonEvents(); // add event handlers for touchscreen buttons
        } else {
            clickEvents(); // allow user to enable sounds only if he's not using mobile device
        }

        keyEvents();
        scores();
    }
    
    function sounds() {
        soundManager.disableSounds();
    }
    
    function screen() {
        $("<div/>").attr("id", "left").text("Left").appendTo(".buttons");
        $("<div/>").attr("id", "shoot").text("Shoot").appendTo(".buttons");
        $("<div/>").attr("id", "right").text("Right").appendTo(".buttons");
    }
    
    function clickEvents() {

        // click event for disabling/enabling sounds
        $("#spaceinvaders").click(function(eventInfo) {
            var x = Math.floor((eventInfo.pageX-$(this).offset().left));
            var y = Math.floor((eventInfo.pageY-$(this).offset().top));
            
            if ( (x >= 502 && x <= 535) && (y >= 545 && y <= 580)) {
                if (soundManager.areSoundsOn()) {
                    soundManager.disableSounds();
                } else {
                    soundManager.enableSounds();
                }
            }
        });
    }
    
    function keyEvents() {
        $(document).keydown(function(eventInformation) {

            keyhandler.keydown(eventInformation.which);
            if (keyhandler.isValidKey(eventInformation.which))
                eventInformation.preventDefault();
        });
    
        $(document).keyup(function(eventInformation) {
            keyhandler.keyup(eventInformation.which);
            if (keyhandler.isValidKey(eventInformation.which))
                eventInformation.preventDefault();
        });
    }
    
    function buttonEvents() {
        $("#right").swipe({
            swipeStatus:function(event, phase, direction, distance, duration, fingerCount) {
                if (phase == "start" || phase == "move")
                    keyhandler.pressRight();
            
                if (phase == "end" || phase == "cancel")
                    keyhandler.clear();
            }
        });
        
    
        $("#left").swipe({
            swipeStatus:function(event, phase, direction, distance, duration, fingerCount) {
                if (phase == "start" || phase == "move")
                    keyhandler.pressLeft();
            
                if (phase == "end" || phase == "cancel")
                    keyhandler.clear();
            }
        });
    
        $("#shoot").swipe({
            swipeStatus:function(event, phase, direction, distance, duration, fingerCount) {
                if (phase == "start" || phase == "move")
                    keyhandler.pressUp();
            
                if (phase == "end" || phase == "cancel")
                    keyhandler.clear();
            }
        });
    }
    
    function scores() {
        createCookie();
    }
    
    // unique user id stored in a cookie for user-specific scores
    function createCookie() {
        var id = localStorage.getItem("userId");
    
        if (id != null)
            $.cookie('userId', id);
    
        if ($.cookie('userId') != null)
            return;
    
        var uniqueID = makeId(); // unique id for user-specific scores
        localStorage.setItem("userId", uniqueID);
        $.cookie('userId', uniqueID, {
            expires: 30
        });
    }
    
    function makeId() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
    
    return {
        init: init
    };
})();
