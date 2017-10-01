
function ScoreManager() {

    var scores = [];
    if (localStorage.getItem("highscore") !== null ) {
        scores = JSON.parse(localStorage.getItem("highscore"));
    }

    var score = 0;
    var highScore = 0;

    if (scores.length > 0) {
        highScore = scores[0];
    }

    function raiseScore(enemyType) {
        if (enemyType < 1) {
            score += 30;
        } else if (enemyType < 3) {
            score += 20;
        } else if (enemyType == 5) {
            score += 100;
        } else {
            score += 10;
        }

        if (score > highScore) {
            highScore = score;
        }
    }

    function getHighScore() {
        return highScore;
    }

    function getScore() {
        return score;
    }

    function postScore() {

        scores.push(score);
        scores.sort(function(a, b) {
            return b - a;
        });

        scores = scores.slice(0, 5);
        localStorage.setItem("highscore", JSON.stringify(scores));
}

    function showScores(context) {
        // fetch scores
        var results = JSON.parse(localStorage.getItem("highscore"));
        if (results === null) {
            results = scores;
        }

        context.font = "20px Courier New";

        if (results.length === 0) {
            context.fillText("No scores yet! Go and play!", 115, 305);
            return;
        }

        var y = 305;
        for (var i = 0; i < results.length; ++i) {
            context.fillText((i+1)+": "+ results[i], 230, y);
            y += 30;
        }
    }

    return {
        raiseScore: raiseScore,
        getScore: getScore,
        getHighScore: getHighScore,
        showScores: showScores,
        postScore: postScore
    };
}
