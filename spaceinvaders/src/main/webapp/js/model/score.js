function ScoreManager() {
    var score = 0;
    var highScore = 0;
    
    // alustetaan pisteet
    if (localStorage.getItem("highScore"))
        highScore = localStorage.getItem("highScore");
    
    function raiseScore(enemyType) {
        if (enemyType < 1)
            score += 30;
        else if (enemyType < 3)
            score += 20;
        else
            score += 10;
        
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }
    }

    function getHighScore() {
        if (localStorage.getItem("highScore"))
            return localStorage.getItem("highScore");
        else
            return highScore;
    }
    
    function getScore() {
        return score;
    }
    
    return {
        raiseScore: raiseScore,
        getScore: getScore,
        getHighScore: getHighScore
    };
}