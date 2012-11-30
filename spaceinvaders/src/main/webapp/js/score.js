function Score() {
    var score = 0;
    
    function raiseScore(enemyType) {
        if (enemyType < 1)
            score += 30;
        else if (enemyType < 3)
            score += 20;
        else
            score += 10;
    }
    
    function getScore() {
        return score;
    }
    
    return {
        raiseScore: raiseScore,
        getScore: getScore
    };
}