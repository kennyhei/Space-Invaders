// pelaajan tai muukalaisten ampumat ohjukset
function Ohjus(x,y,column) {
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

    function getColumn() {
        return column;
    }
    
    return {
        getX: getX,
        getY: getY,
        getColumn: getColumn,
        siirra: siirra,
        piirra: piirra
    };
}