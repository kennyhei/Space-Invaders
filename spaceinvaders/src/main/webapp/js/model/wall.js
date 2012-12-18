// tiilien x ja y-koordinaatit jokaista nelj‰‰ muuria varten
var wallData = [
    [[70, 455],
    [110, 455],
    [70, 435],
    [110, 435],
    [85, 435],
    [100, 435]],

    [[180, 455],
    [220, 455],
    [180, 435],
    [220, 435],
    [195, 435],
    [210, 435]],

    [[290, 455],
    [330, 455],
    [290, 435],
    [330, 435],
    [305, 435],
    [320, 435]],

    [[400, 455],
    [440, 455],
    [400, 435],
    [440, 435],
    [415, 435],
    [430, 435]]
];

// pelimoottorilla on lista muureista
function WallManager() {
    var walls = new Array();
    
    $.each(wallData, function(index, data) {
        var wall = new Wall(data);
        walls.push(wall);
    });
    
    function piirra(context) {
        for (var i=0; i < walls.length; ++i) {
            walls[i].piirra(context);
        }
    }
    
    function tormaako(ohjus) {
        for (var i=0; i < walls.length; ++i) {
            if (walls[i].tormaako(ohjus))
                return true;
        }
    
        return false;
    }
    
    return {
        piirra: piirra,
        tormaako: tormaako
    };
}

// alusta suojaava yksitt‰inen muuri
function Wall(wallData) {
    var tiilet = new Array();
    
    $.each(wallData, function(index, coordinates) {
        var tiili = new Tiili(coordinates[0], coordinates[1]);
        tiilet.push(tiili);
    });

    
    function piirra(context) {
        for (var i=0; i < tiilet.length; ++i) {
            tiilet[i].piirra(context);
        }
    }
    
    function getTiilet() {
        return tiilet;
    }
    
    // jos muuri havaitsee, ett‰ johonkin sen tiileen osuu ohjus/invader, se osaa
    // itse poistaa tiilen
    function tormaako(object) {
        for (var i=0; i < tiilet.length; ++i) {
            if (tiilet[i].tormaako(object)) {
                poistaTiili(i);
                return true; // ohjus/invader osui johonkin, ei tarvetta jatkaa l‰pik‰ynti‰
            }
        }
        return false;
    }
    
    function poistaTiili(index) {
        tiilet.splice(index, 1);
    }
    
    return {
        piirra: piirra,
        getTiilet: getTiilet,
        tormaako: tormaako
    };
}

Tiili.prototype = new Drawable();
Tiili.prototype.constructor = Tiili;

// muuri koostuu eri tiileist‰
function Tiili(x,y) {
    
    Drawable.call(this,x,y,15,20);
    
    Tiili.prototype.piirra = function(context) {
        context.fillStyle = "rgb(0,255,0)";
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}