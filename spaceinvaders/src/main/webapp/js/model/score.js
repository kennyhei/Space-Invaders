var GameScore = Parse.Object.extend("GameScore");

function ScoreManager() {
    Parse.initialize("xR4SolA0VPCzrf7Pp9zuBDVOM6EB6KodPAnWbgso", "JoAmAsdAt3lHQCkqAIVPVDDyYMVCRIo9PZrrQfMM");
    
    var score = 0;
    var highScore = 0;
    var gameScore = new GameScore();
    var query = new Parse.Query(GameScore);
    
    // initialize highscore
    query.equalTo("userID", $.cookie('userId'));
    query.descending("score");
    query.limit(1);
    query.find({
        success: function(results) {
            if (results.length == 0)
                highScore = 0;
            else
                highScore = results[0].attributes.score;
        }
    });
    
    function raiseScore(enemyType) {
        if (enemyType < 1)
            score += 30;
        else if (enemyType < 3)
            score += 20;
        else if (enemyType == 5)
            score += 100;
        else
            score += 10;
        
        if (score > highScore)
            highScore = score;
    }

    function getHighScore() {
        return highScore;
    }
    
    function getScore() {
        return score;
    }
    
    // send current score to server
    function postScore() {
        // save score to Parse
        gameScore.save({
            userID: $.cookie('userId'),
            score: score
        });
}
    
    function showScores(context) {
        // fetch scores
        query.equalTo("userID", $.cookie('userId'));
        query.exists("score");
        
        query.descending("score");
        query.limit(5); // only top 5 scores will be fetched
        
        query.find({
            success: function(results) {
                context.font = "20px Courier New";

                if (results.length < 1) {
                    context.fillText("No scores yet! Go and play!", 115, 305);
                    return;
                }
                
                var y = 305;
                for (var i=0; i < results.length; ++i) {
                    context.fillText((i+1)+": "+ results[i].attributes.score, 230, y);
                    y += 30;
                }
            }
        });
    }
    
    return {
        raiseScore: raiseScore,
        getScore: getScore,
        getHighScore: getHighScore,
        showScores: showScores,
        postScore: postScore
    };
}