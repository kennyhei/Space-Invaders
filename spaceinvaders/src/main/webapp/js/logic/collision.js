var collision = {};

collision.logic = (function() {
    
    function tormaakoSeinaan(x,y) {
        if (this.x > 514 || this.x < 0)
            return true;
        
        return false;
    }
    
    function tormaako(first, second) {
        if (intersects(first.getX(),first.getY(),first.getWidth(),first.getHeight(), object.getX(), object.getY(), object.getWidth(), object.getHeight())) {
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
    
    return {
        tormaako: tormaako,
        tormaakoSeinaan: tormaakoSeinaan
    };
    
})();