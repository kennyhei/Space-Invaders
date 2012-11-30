// tiilien koordinaatit jokaista nelj�� muuria varten
var muuriData = [
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
function MuuriVarasto() {
    var muurit = new Array();
    
    $.each(muuriData, function(index, data) {
        var muuri = new Muuri(data);
        muurit.push(muuri);
    });
    
    function piirra(context) {
        for (var i=0; i < muurit.length; ++i) {
            muurit[i].piirra(context);
        }
    }
    
    function tormaako(ohjus) {
        for (var i=0; i < muurit.length; ++i) {
            if (muurit[i].tormaako(ohjus))
                return true;
        }
    
        return false;
    }
    
    return {
        piirra: piirra,
        tormaako: tormaako
    };
}

// alusta suojaava yksitt�inen muuri
function Muuri(muuriData) {
    var tiilet = new Array();
    
    $.each(muuriData, function(index, koordinaatit) {
        var tiili = new Tiili(koordinaatit[0], koordinaatit[1]);
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
    
    // jos muuri havaitsee, ett� johonkin sen tiileen osuu ohjus, se osaa
    // itse poistaa tiilen
    function tormaako(ohjus) {
        for (var i=0; i < tiilet.length; ++i) {
            if (tiilet[i].tormaako(ohjus)) {
                poistaTiili(i);
                return true; // ohjus osui johonkin, ei tarvetta jatkaa l�pik�ynti�
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

// muuri koostuu eri tiileist�
function Tiili(x,y) {
    var leveys = 15;
    var korkeus = 20;
    
    function piirra(context) {
        context.fillStyle = "rgb(0,255,0)";
        context.fillRect(x, y, leveys, korkeus);
    }

    // huom. x ja y koordinaatin muodostama piste sijaitsee laatikon vasemmassa yl�kulmassa
    function tormaako(ohjus) {
        if (intersects(x,y,15,20, ohjus.getX(), ohjus.getY(), 3, 5))
            return true;
        else
            return false;
    }
    
    function intersects(x1, y1, w1, h1, x2, y2, w2, h2) {
        w2 += x2-1;
        w1 += x1-1;
        if (x2 > w1 || x1 > w2) return false;
        h2 += y2-1;
        h1 += y1-1;
        if (y2 > h1 || y1 > h2) return false;
        return true;
    }
    
    return {
        piirra: piirra,
        tormaako: tormaako
    };
}