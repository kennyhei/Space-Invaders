function Player() {
    var x = 260;
    var y = 500;
    var leveys = 25;
    var korkeus = 25;
    
    var lives = 3;
    
    var img = new Image();
    img.src = "ships2.png";
    
    // alus voi liikkua vain sivuttaisuunnassa
    function siirra(dx) {
        x += dx;
    }
    
    function piirra(context, srcX) {
//        context.fillStyle = "rgb(0,255,0)";
//        context.fillRect(x, y, leveys, korkeus);
        context.drawImage(img,srcX,12,80,72, x,y,leveys, korkeus); // 4: vikaa: 2 ekaa: sijainti, 2 tokaa: koko
    }
    
    function tormaakoSeinaan() {
        if (x > 514 || x < 0)
            return true;
        
        return false;
    }
    
    function tormaako(ohjus) {
        if (intersects(x,y,25,25, ohjus.getX(), ohjus.getY(), 3, 5)) {
            --lives;
            return true;
        } else {
            return false;
        }
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
    
    function ammu() {
        return new Ohjus(x+10, y+5);
    }
    
    function getX() {
        return x;
    }
    
    function getY() {
        return y;
    }
    
    function getLives() {
        return lives;
    }
    
    function getImg() {
        return img;
    }
    
    return {
        getImg: getImg,
        getLives: getLives,
        getX: getX,
        getY: getY,
        siirra: siirra,
        piirra: piirra,
        tormaakoSeinaan: tormaakoSeinaan,
        ammu: ammu,
        tormaako: tormaako
    };
}