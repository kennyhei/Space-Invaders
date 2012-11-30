// pelaajan tai muukalaisten ampumat ohjukset
function Ohjus(x,y) {
    var leveys = 3;
    var korkeus = 5;
    
    function piirra(context) {
        context.fillStyle = "rgb(255,255,255)";
        context.fillRect(x, y, leveys, korkeus);
    }
    
    function siirra(dy) {
        y += dy;
    }
    
    function getX() {
        return x;
    }
    
    function getY() {
        return y;
    }
    
    return {
        getX: getX,
        getY: getY,
        siirra: siirra,
        piirra: piirra
    };
}