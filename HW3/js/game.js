//CS5410 Assignment 3, Fabio Gottlicher A01647928


var Game = {};

Game.Color = {
    YELLOW: 'rgba(255, 255, 0, 1)',
    ORANGE: 'rgba(255, 153, 0, 1)',
    BLUE: 'rgba(0, 51, 204, 1)',
    GREEN: 'rgba(0, 204, 51, 1)'

}

Game.Game = (function() {

    var elapsedTime;
    var startTime;
    var lastUpdate;
    var score;
    var bricksRemoved;
    var explosions;
    var paused;
    var pausedTime;
    var pauseBegin;
    var lives;
    var balls = [];
    var moveThisFrame = 0;
    var moveCt;
    var latestSpeed;

    function loop(time) {
        elapsedTime = time - startTime - pausedTime;

        update(elapsedTime - lastUpdate);
        Game.Graphics.drawAll(); //render
        lastUpdate = elapsedTime;
        if (!paused && lives > 0)
            requestAnimationFrame(loop);
    }

    function update(delta) {
        for (var i = 0; i < balls.length; i++) {
            balls[i].release();
            balls[i].updateBall(delta);
            checkCollision(balls[i], i);
        }
        explosions.updateAll(elapsedTime);
    }

    function startGame() {
        document.addEventListener('keydown', onKeyDown);
        startTime = performance.now();
        Game.Graphics.setSize();
        Game.Paddle.init();
        Game.Bricks.init();
        bricksRemoved = 0;
        score = 0
        elapsedTime = 0;
        pausedTime = 0;
        lives = 3;
        moveCt = 0;
        paused = false;
        explosions = Explosions();
        balls.splice(0);
        latestSpeed = Game.Graphics.getCanvasSize() / 2500;
        balls.push(makeBall(true,latestSpeed));
        loop(performance.now()); //needs to be last
    }

    function onKeyDown(e) {
        if (e.keyCode == KeyCode.LEFT) {
            Game.Paddle.move(e.keyCode);
            moveThisFrame = -1;
        }
        else if (e.keyCode == KeyCode.RIGHT) {
            Game.Paddle.move(e.keyCode);
            moveThisFrame = 1;
        }
        else if (e.keyCode == KeyCode.SPACE) balls[0].release(elapsedTime);
        else if (e.keyCode == KeyCode.ESCAPE && lives == 0) {
            document.removeEventListener('keydown', onKeyDown);
            Menu.Main.init();
        }
        else if (e.keyCode == KeyCode.ESCAPE && !paused) Game.Game.pause();
        else if (e.keyCode == KeyCode.ESCAPE && paused) {
            document.removeEventListener('keydown', onKeyDown);
            Menu.Main.init();
        }
        else if (paused && e.keyCode == KeyCode.RETURN) Game.Game.pause();

    }

    function lose() {
        if (lives > 0)
            lives--;
        if (lives == 0) {
            addScore(score);
        } else {
            balls.push(makeBall(true,latestSpeed));
        }
    }

    function checkCollision(ball, index) {
        if (ball.isOnPaddle()) {
            return;
        }
        var bb = ball.getBounds();
        var cS = Game.Graphics.getCanvasSize();
        var w = Game.Graphics.getCellWidth();
        var h = Game.Graphics.getCellHeight();

        var row = -1;
        for (var i = 0; i < 8; i++) {
            var br = Game.Bricks.getBrick(i, 0);
            if (bb.yB >= (br.y) && bb.yT <= (br.y + h)) {
                row = i;
                break;
            }
        }
        //console.log('candidate row is ', row);
        if (row != -1) {
            for (var i = 0; i < 14; i++) {
                var br = Game.Bricks.getBrick(row, i);
                if (br.hp == 0) continue;
                var collisionW = -1;
                var collisionH = -1;

                if (bb.xR <= (br.x) + w && bb.xL >= br.x) {
                    collisionW = bb.xR - bb.xL;
                } else if (bb.xL <= (br.x + w) && bb.xR > (br.x + w)) {
                    collisionW = br.x + w - bb.xL;
                } else if (bb.xR >= br.x && bb.xL < br.x) {
                    collisionW = bb.xR - br.x;
                }

                if (bb.yT >= br.y && bb.yB <= (br.y + h)) {
                    collisionH = bb.yB - bb.yT;
                } else if (bb.yB <= br.y && bb.yT < br.y) {
                    collisionH = bb.yB - br.y;
                } else if (bb.yT <= (br.y + h) && bb.yB > (br.y + h)) {
                    collisionH = br.y + h - bb.yB;
                }

                if (collisionH != -1 && collisionW != -1) {
                    Game.Bricks.hitBrick(row, i,elapsedTime);

                    if (collisionH > collisionW) {
                        ball.bounce(false);
                    } else {
                        ball.bounce(true);
                    }
                }
            }
        }

        //check loose
        if (bb.yB >= cS) {
            balls.splice(index, 1);
            latestSpeed = ball.speed;
            if (balls.length == 0)
                lose();
        } else if (bb.yT <= 0) { //bounce of top
            ball.bounce(true);
        } else if (bb.xL <= 0 || bb.xR >= cS) {   //bounce of sidewalls
            ball.bounce(false);
        } else if (bb.yB >= Game.Paddle.getY() && bb.yB <= (Game.Paddle.getY() + Game.Graphics.getCanvasSize() / 75) && bb.xL >= (Game.Paddle.getCurrPositionX() - Game.Paddle.getWidth()/5) && bb.xR <= (Game.Paddle.getCurrPositionX() + Game.Paddle.getWidth() * 1.2)) {
            ball.bounce(true,moveThisFrame);
        }
        moveCt++;
        if(moveCt == 10){
            moveThisFrame = 0;
            moveCt = 0;
        }
    }

    function getScore() {
        var s = score + "";
        while (s.length < 3) s = "0" + s;
        return s;
    }

    function addScore(score) {
        var highScores = JSON.parse(localStorage.getItem('Breakout.highScores'));
        if (highScores == null) {
            highScores = [-1, -1, -1, -1, -1];    //init 5 null
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

        localStorage.setItem('Breakout.highScores', JSON.stringify(highScores));
    }

    function pause() {
        console.log('pausing now');
        paused = !paused;
        if (paused) {
            pauseBegin = performance.now();
        } else {
            pausedTime += (performance.now() - pauseBegin);
            requestAnimationFrame(loop);
        }
    }

    function isPaused() {
        return paused;
    }

    function getExplosionManager() {
        return explosions;
    }

    function getLives() {
        return lives;
    }

    function incrScore(num) {
        score += num;
    }

    function getElapsedTime() {
        return elapsedTime;
    }

    function addBall() {
        balls.push(makeBall(false));
        balls[balls.length - 1].release(elapsedTime);
    }

    function getBalls() {
        return balls;
    }
    return {
        startGame: startGame,
        getScore: getScore,
        incrScore: incrScore,
        pause: pause,
        isPaused: isPaused,
        getExplosionManager: getExplosionManager,
        getLives: getLives,
        getElapsedTime: getElapsedTime,
        addBall: addBall,
        getBalls: getBalls
    }
} ());

Game.Bricks = (function() {
    var bricks = [];
    var numBricks = 14;
    var removedCt;
    function init() {
        removedCt = 0;
        for (var i = 0; i < 8; i++) {
            bricks[i] = [];
            for (var j = 0; j < numBricks; j++) {
                var color;
                var pts;
                switch (i) {
                    case 0:
                    case 1:
                        color = Game.Color.GREEN;
                        pts = 5;
                        break;
                    case 2:
                    case 3:
                        color = Game.Color.BLUE;
                        pts = 3;
                        break;
                    case 4:
                    case 5:
                        color = Game.Color.ORANGE;
                        pts = 2;
                        break;
                    case 6:
                    case 7:
                        color = Game.Color.YELLOW;
                        pts = 1;
                        break;
                    default:
                        break;
                }
                var hp = i == 0 || i == 1 ? 2 : 1;
                bricks[i][j] = makeBrick(color, i, j, hp, pts);
            }
        }
    }

    function makeBrick(color, row, column, hp, pts) {
        var y = (Game.Graphics.getCanvasSize() / 6) + Game.Graphics.getCellSpacing() + row * (Game.Graphics.getCellSpacing() + Game.Graphics.getCellHeight());
        var x = Game.Graphics.getCellSpacing() + column * (Game.Graphics.getCellSpacing() + Game.Graphics.getCellWidth());
        return {
            color: color,
            hp: hp,
            pts: pts,
            x: x,
            y: y
        }
    }
    function getNumBricks() {
        return numBricks;
    }

    function getBrick(r, c) {
        return bricks[r][c];
    }

    function hitBrick(r, c, time) {
        if (bricks[r][c].hp == 0) return;
        bricks[r][c].hp--;
        if (bricks[r][c].hp == 0) {
            Game.Game.incrScore(bricks[r][c].pts);
            //check row
            if (isRowClear(r)) {
                Game.Game.incrScore(25);
            }
            //increase speed
            removedCt++;
            if (removedCt == 4 || removedCt == 12 || removedCt == 36 || removedCt == 62) {
                var balls = Game.Game.getBalls();
                for (var i = 0; i < balls.length; i++) {
                    balls[i].increaseSpeed();
                }
            }

            //add ball
            if (Game.Game.getScore() % 100 == 0) {
                Game.Game.addBall();
            }

            //check topRow
            if (r == 0) {
                Game.Paddle.setHalfWidth();
            }
            Game.Game.getExplosionManager().addExplosion(time, bricks[r][c].x, bricks[r][c].y,
                Game.Graphics.getCellWidth(), Game.Graphics.getCellHeight());
        }
    }

    function isRowClear(r) {
        for (var i = 0; i < 14; i++) {
            if (bricks[r][i].hp > 0) return false;
        }
        return true;
    }

    return {
        init: init,
        getNumBricks: getNumBricks,
        getBrick: getBrick,
        hitBrick: hitBrick
    }
} ());


function makeBall(isMain,speed) {

    var that = {
        ballRadius: Game.Graphics.getCanvasSize() / 120,
        x: Game.Paddle.getCurrPositionX() + Game.Paddle.getWidth() / 2,
        y: -1,
        onPaddle: true,
        speed: speed,
        directionX: -1,
        directionY: -1,
        releaseTime: -1,
        counter: -1,
        isMain: isMain
    }

    that.directionX = Gen.gaussianWithMidPoint(0.5);
    that.y = Game.Paddle.getY() - that.ballRadius;
    that.directionY = (1 - Math.abs(that.directionX)) * -1;

    //console.log(that.directionX*that.directionX + that.directionY*that.directionY);
    that.release = function(initTime) {
        if (that.releaseTime == -1 && initTime == undefined) return;
        if (that.releaseTime == -1) {
            var delay = isMain ? 3000 : 0;
            that.releaseTime = initTime + delay;
        }

        if (that.releaseTime != -1 && that.releaseTime > Game.Game.getElapsedTime()) {
            that.counter = (that.releaseTime - Game.Game.getElapsedTime()) / 1000;
        }
        if (that.releaseTime <= Game.Game.getElapsedTime() && that.onPaddle) {
            that.onPaddle = false;
            that.counter = -1;
        }
    }

    that.moveOnPaddle = function(dir, step) {
        if (that.onPaddle) {
            that.x = dir == KeyCode.LEFT ? (that.x - step) : (that.x + step);
        }
    }

    that.getX = function() {
        return that.x;
    }

    that.getY = function() {
        return that.y;
    }

    that.getRadius = function() {
        return that.ballRadius;
    }

    that.getBounds = function() {
        return {
            xL: that.x - that.ballRadius,
            xR: that.x + that.ballRadius,
            yT: that.y - that.ballRadius,
            yB: that.y + that.ballRadius
        }
    }

    that.increaseSpeed = function() {
        that.speed += Game.Graphics.getCanvasSize() / 10000;
    }

    that.bounce = function(isHorizonatal,moveThisFrame) {
        // if(moveThisFrame != undefined && moveThisFrame != 0){ //paddle move case
        //     console.log('before',that.directionX, '  ', that.directionY );
        //     if(Math.abs(that.directionX) > 0.2){
        //         console.log('adjusting for move');
        //         that.directionY += moveThisFrame * 0.1;
        //         that.directionX -= 0.1;
        //     }
        //     that.directionY *= -1;
            
        //     //that.directionX = sum - that.directionY;
        //     console.log('after',that.directionX, '  ', that.directionY );
            
        // }
        if (isHorizonatal) {
            that.directionY *= -1;
        } else {
            that.directionX *= -1;
        }
    }
    that.updateBall = function(delta) {
        if (that.onPaddle) return;
        that.x += delta * that.speed * that.directionX;
        that.y += delta * that.speed * that.directionY;
        return { x: that.x, y: that.y }
    }

    that.isOnPaddle = function() {
        return that.onPaddle;
    }

    that.getCounter = function() {
        return that.counter;
    }
    return that;
}

Game.Paddle = (function() {
    var width;
    var currPositionX;
    var y;
    var moveStep;
    var hasHalved;

    function init() {
        moveStep = Game.Graphics.getCanvasSize() / 30;
        width = Game.Graphics.getCanvasSize() * 0.18;
        currPositionX = Game.Graphics.getCanvasSize() / 2 - width / 2;
        y = Game.Graphics.getCanvasSize() - (Game.Graphics.getCanvasSize() / 14);
        hasHalved = false;
    }

    function getWidth() {
        return width;
    }

    function setHalfWidth() {
        if (hasHalved) return;
        width /= 2;
        hasHalved = true;
    }

    function getCurrPositionX() {
        return currPositionX;
    }

    function getY() {
        return y;
    }

    function move(dir) {
        var balls = Game.Game.getBalls();

        if (dir == KeyCode.LEFT) {
            if (currPositionX - moveStep < 0) return;
            currPositionX -= moveStep;
        } else {
            if (currPositionX + width + moveStep > Game.Graphics.getCanvasSize()) return;
            currPositionX += moveStep;
        }
        for (var i = 0; i < balls.length; i++) {
            balls[0].moveOnPaddle(dir, moveStep);
        }
    }

    return {
        getWidth: getWidth,
        getCurrPositionX: getCurrPositionX,
        getY: getY,
        move: move,
        init: init,
    }
} ())

Game.Graphics = (function() {
    'use strict';

    var canvas = document.getElementById('canvas-main');
    var context = canvas.getContext('2d');

    var cellHeight;
    var cellWidth;
    var cellSpacing;
    var gameBoardDummy;
    var canvasSize;

    //------------------------------------------------------------------
    // Place a 'clear' function on the Canvas prototype, this makes it a part
    // of the canvas, rather than making a function that calls and does it.
    // This is taken from Dean Mathias's sample code
    //------------------------------------------------------------------
    CanvasRenderingContext2D.prototype.clear = function() {
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.clearRect(0, 0, canvas.width, canvas.height);
        this.restore();
    };

    function clear() {
        context.clear();
    }

    function init() {
        setSize();
    }

    function drawAll() {
        context.clear();
        drawBk(context, canvasSize);
        drawBricks();
        drawPaddle();
        drawBalls();
        drawScore();
        drawCounter();
        drawExplosions();
        if (Game.Game.getLives() == 0)
            drawLost();
        else if (Game.Game.isPaused())
            drawPauseMenu();

    }

    function drawPauseMenu() {
        context.textAlign = "center";
        var fontSize = canvasSize / 25;
        context.font = fontSize + "px GoodTimes";
        context.fillStyle = "#000000";
        context.fillText("Game paused", canvasSize / 2, canvasSize * 0.4);
        context.fillText("Press Esc to quit", canvasSize / 2, canvasSize * 0.5);
        context.fillText("Press Enter to resume", canvasSize / 2, canvasSize * 0.6);
    }

    function drawLost() {
        context.textAlign = "center";
        var fontSize = canvasSize / 25;
        context.font = fontSize + "px GoodTimes";
        context.fillStyle = "#000000";
        context.fillText("Game over", canvasSize / 2, canvasSize * 0.4);
        context.fillText("score: " + Game.Game.getScore(), canvasSize / 2, canvasSize * 0.5);
        context.fillText("Press Esc to quit", canvasSize / 2, canvasSize * 0.6);
    }

    function drawBricks() {
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < Game.Bricks.getNumBricks(); j++) {
                var b = Game.Bricks.getBrick(i, j);
                if (b.hp > 0) {
                    context.fillStyle = b.color;
                    context.fillRect(b.x, b.y, cellWidth, cellHeight);
                }
            }
        }
    }

    function drawPaddle() {
        //context.fillStyle = "#000000";
        var grd = context.createLinearGradient(0, 0, canvasSize, 0);
        grd.addColorStop("0.1", "#ee4035");
        grd.addColorStop("0.3", "#f37736");
        grd.addColorStop("0.5", "#fdf498");
        grd.addColorStop("0.7", "#7bc043");
        grd.addColorStop("0.9", "#0392cf");

        context.fillStyle = grd;
        //context.fillRect(Game.Paddle.getCurrPosition(), canvasSize - 10, Game.Paddle.getWidth(),7);
        context.roundRect(Game.Paddle.getCurrPositionX(), Game.Paddle.getY(), Game.Paddle.getWidth(), 7, canvasSize / 150).fill();
    }

    function drawBalls() {
        var balls = Game.Game.getBalls();
        for (var i = 0; i < balls.length; i++) {
            context.beginPath();
            context.arc(balls[i].getX(), balls[i].getY(), balls[i].getRadius(), 0, 2 * Math.PI, false);
            context.fillStyle = "#cc3300";
            context.fill();
        }
    }

    function drawScore() {
        console.log('size',canvasSize);
        var fontSize = canvasSize / 30;
        context.textAlign = "start";
        context.font = fontSize + "px GoodTimes";
        context.fillStyle = "#000000";
        context.fillText("Score: " + Game.Game.getScore(), canvasSize * 0.02, canvasSize * (49 / 50));
        
        for(var i = 0; i < Game.Game.getLives();i++){
            context.fillStyle = "#000000";
            context.roundRect(canvasSize - (canvasSize/48)*(i+1) - cellWidth*(i+1), canvasSize * (95 / 100), cellWidth, canvasSize/30, canvasSize / 100).fill();
        }
        
    }

    function drawCounter() {
        if(Game.Game.getBalls().length == 0){
            return;
        }
        var sec = Game.Game.getBalls()[0].getCounter();
        //console.log(sec)
        if (sec == -1) return;
        context.textAlign = "center";
        var fontSize = canvasSize / 10;
        context.font = fontSize + "px GoodTimes";
        context.fillStyle = "#000000";
        context.fillText((sec + 1) | 0, canvasSize / 2, canvasSize / 2);
    }
    
    function drawExplosions(){
        var e = Game.Game.getExplosionManager();
        for(var i = 0; i < e.explosions.length;i++){
            for(var j = 0; j < e.explosions[i].particles.length;j++){
                    var that = e.explosions[i];
                    var size =  that.particles[j].size;
                    context.fillRect(that.particles[j].x - size/2,that.particles[j].y - size/2, size, size);
            }
        }
    }

    function setSize() {
        console.log('setting size');
        gameBoardDummy = document.getElementById('gameBoardDummy');
        canvasSize = gameBoardDummy.clientWidth;
        // Make it visually fill the positioned parent
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        // ...then set the internal size to match
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        cellHeight = canvas.height / 4 / 8;
        cellWidth = canvas.width / 16;
        cellSpacing = cellWidth / 8;
    }

    function getCellWidth() {
        return cellWidth;
    }

    function getCellHeight() {
        return cellHeight;
    }

    function getCellSpacing() {
        return cellSpacing;
    }

    function getCanvasSize() {
        return canvasSize;
    }

    function getContext() {
        return context;
    }
    return {
        init: init,
        getCellWidth: getCellWidth,
        getCellHeight: getCellHeight,
        getCellSpacing: getCellSpacing,
        getCanvasSize: getCanvasSize,
        setSize: setSize,
        drawAll: drawAll,
        getContext: getContext,
        drawPauseMenu: drawPauseMenu
    }
} ());

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function millisToTimeString(millis) {
    if (typeof millis === 'undefined') return "0:00";
    var totalSec = Math.floor(millis / 1000);
    var sec = totalSec % 60;
    var min = Math.floor(totalSec / 60);
    return min + ":" + (sec < 10 ? ("0" + sec) : sec);
}