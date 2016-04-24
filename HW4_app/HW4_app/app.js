var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
app.use(bodyParser.json());

var highScoresDbFileName = "data/highscores.txt";

router.get('/getScores', function(req, res){  
    if(fs.existsSync(highScoresDbFileName)){
      var f = fs.readFileSync(highScoresDbFileName,'utf8');
      res.send(f);
    } else {
        var highscores = [-1, -1, -1, -1, -1];
        fs.writeFileSync(highScoresDbFileName,JSON.stringify(highScores));
        res.send(JSON.stringify(highscores));
    }
  });

router.post('/addScore/:score', function(req, res){
  var score = parseInt(req.params.score);
	console.log("received high score ", score);
  var highScores;
  if(fs.existsSync(highScoresDbFileName)){
    var f = fs.readFileSync(highScoresDbFileName,'utf8');
    var highScores = JSON.parse(f);
  } else {
    highScores = [-1, -1, -1, -1, -1];
  }  

  Array.min = function(array) {
      return Math.min.apply(Math, array);
  };

  var min = Array.min(highScores);
  if (min < score) {
      var index = highScores.indexOf(min);
      highScores.splice(index, 1);
      highScores.push(score);
  }

  highScores.sort(function(a, b) {
      return b - a;
  });
  fs.writeFileSync(highScoresDbFileName,JSON.stringify(highScores));
  res.send("success");
})

app.use(express.static('public'));
app.use('/v1', router);

var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log('The tower defense game server listening at: http://localhost:%s', port);
});