// for testing purposes
var scores = [1000, 1500, 2000, 2500, 3000];

function ScoreManager() {
    var score = 0;
    var highScore = 0;
    
    // initialize highscore
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
    
    // send current score to server
    function update() {
        // todo
    }
    
    function showScores() {
        // fetch scores
        var scoreList = scores.slice(0); // copy array by VALUE, no reference!
        
        // add current score to list and highscore
        scoreList.push(score);
        scoreList.push(getHighScore());
        scoreList = bubbleSort(scoreList);
        // show only top 5 scores
        return scoreList = scoreList.slice(0,5);
    }
    
    function bubbleSort(list) {
        for (var i=0; i < list.length; i++) {
            for (var j=0; j < list.length-1; j++) {
                if (list[j] < list[j+1]) {
                    // exchange elements
                    var temp = list[j];
                    list[j] = list[j+1];
                    list[j+1] = temp;
                }
            }
        }
        return list;
    }
    
    return {
        raiseScore: raiseScore,
        getScore: getScore,
        getHighScore: getHighScore,
        showScores: showScores,
        update: update
    };
}