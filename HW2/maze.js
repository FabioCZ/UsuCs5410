//CS5410 Assignment 2, Fabio Gottlicher A01647928


var MazeGame = {};

MazeGame.CellType = {
    EMPTY: 1,
    WALL: 2,
    PLAYER: 3,
    VISITED: 4,
    HINT: 5,
}

MazeGame.Direction = {
    UP: 1,
    RIGHT: 2,
    DOWN: 3,
    LEFT: 4
}

MazeGame.KeyCode = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    W: 87,
    A: 65,
    S: 83,
    D: 68,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    H: 72,
    P: 80,
    B: 66,
    Y: 89
}

MazeGame.Game = (function () {

    var elapsedTime;
    var startTime;

    var printHint = false;
    var printBreadCrumbs = true;
    var printFinishPath = false;
    var printScore = true;
    var winDialogShown;

    function gameLoop(time) {
        if (!winDialogShown)
            elapsedTime = time - startTime;
        MazeGame.Graphics.drawMaze();
        updateHtml();
        CheckWin();
        window.requestAnimationFrame(gameLoop);
    }

    function startGame(size) {
        winDialogShown = false;
        console.log('starting game of size ', size);
        MazeGame.mazeArray.init(size);
        MazeGame.Graphics.init();
        startTime = performance.now();
        document.addEventListener('keydown', onKeyDown);
        gameLoop(performance.now());
    }

    function onKeyDown(e) {
        console.log('key event, ', e.keyCode)
        if (e.keyCode === MazeGame.KeyCode.UP || e.keyCode === MazeGame.KeyCode.W || e.keyCode === MazeGame.KeyCode.I) MazeGame.mazeArray.updatePlayer(MazeGame.Direction.UP);
        else if (e.keyCode === MazeGame.KeyCode.RIGHT || e.keyCode === MazeGame.KeyCode.D || e.keyCode === MazeGame.KeyCode.L) MazeGame.mazeArray.updatePlayer(MazeGame.Direction.RIGHT);
        else if (e.keyCode === MazeGame.KeyCode.DOWN || e.keyCode === MazeGame.KeyCode.S || e.keyCode === MazeGame.KeyCode.K) MazeGame.mazeArray.updatePlayer(MazeGame.Direction.DOWN);
        else if (e.keyCode === MazeGame.KeyCode.LEFT || e.keyCode === MazeGame.KeyCode.A || e.keyCode === MazeGame.KeyCode.J) MazeGame.mazeArray.updatePlayer(MazeGame.Direction.LEFT);
        else if (e.keyCode === MazeGame.KeyCode.H) printHint = !printHint;
        else if (e.keyCode === MazeGame.KeyCode.B) printBreadCrumbs = !printBreadCrumbs;
        else if (e.keyCode === MazeGame.KeyCode.P) printFinishPath = !printFinishPath;
        else if (e.keyCode === MazeGame.KeyCode.Y) printScore = !printScore;
        
        //gameLoop(performance.now());
    }

    function CheckWin() {
        if (MazeGame.mazeArray.hasWon() && !winDialogShown) {
            console.log('win');
            alert('win. Time: ' + millisToTimeString(MazeGame.Game.elapsedTime()));
            winDialogShown = true;
        }
    }

    function updateHtml() {
        var hint = document.getElementById('hint');
        var breadCrumbs = document.getElementById('breadCrumbs');
        var finishPath = document.getElementById('finishPath');
        var score = document.getElementById('score');
        var time = document.getElementById('time');

        hint.innerHTML = "Print Hint (H): " + (printHint ? "ON" : "OFF");
        breadCrumbs.innerHTML = "Print Breadcrumbs (B): " + (printBreadCrumbs ? "ON" : "OFF");
        finishPath.innerHTML = "Print Path to Finish (P): " + (printFinishPath ? "ON" : "OFF");
        score.innerHTML = "Print Score (Y): " + (printScore ? ("ON, Score: " + 1) : "OFF");
        time.innerHTML = "Elapsed time: " + millisToTimeString(MazeGame.Game.elapsedTime());
    }

    return {
        startGame: startGame,
        updateHtml: updateHtml,
        elapsedTime: function () { return elapsedTime; },
        printHint: function () { return printHint; },
        printBreadCrumbs: function () { return printBreadCrumbs; },
        printFinishPath: function () { return printFinishPath; }
        //printScore: function () { return printScore; }
    }
} ());

MazeGame.Graphics = (function () {
    'use strict';

    var canvas = document.getElementById('canvas-main');
    var context = canvas.getContext('2d');

    var cellSize;
    
    //------------------------------------------------------------------
    // Place a 'clear' function on the Canvas prototype, this makes it a part
    // of the canvas, rather than making a function that calls and does it.
    // This is taken from Dean Mathias's sample code
    //------------------------------------------------------------------
    CanvasRenderingContext2D.prototype.clear = function () {
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.clearRect(0, 0, canvas.width, canvas.height);
        this.restore();
    };

    function clear() {
        context.clear();
    }

    function init() {
        var gameBoardDummy = document.getElementById('gameBoardDummy');
        var canvasSize = gameBoardDummy.clientWidth;
        cellSize = canvasSize / MazeGame.mazeArray.size();
        fitToContainer();
    }

    function drawMaze() {
        //console.log('draw, size: ', MazeGame.mazeArray.size());
        context.clear();
        for (var j = 0; j < MazeGame.mazeArray.size(); j++) {
            for (var i = 0; i < MazeGame.mazeArray.size(); i++) {
                var currCell = MazeGame.mazeArray.getCell(i, j);

                if (currCell === MazeGame.CellType.PLAYER) {
                    context.fillStyle = "#FF00FF";
                } else if (i == 1 && j == 1) {
                    context.fillStyle = "#00FF00";  //start
                } else if (i == MazeGame.mazeArray.size() - 2 && j == MazeGame.mazeArray.size() - 2) {
                    context.fillStyle = "#FF0000";
                } else if (currCell === MazeGame.CellType.EMPTY) {
                    context.fillStyle = "#EEEEEE";
                } else if (currCell === MazeGame.CellType.WALL) {
                    context.fillStyle = "#000000";
                } else if (currCell === MazeGame.CellType.VISITED) {
                    context.fillStyle = MazeGame.Game.printBreadCrumbs() ? "#FFFF00" : "#EEEEEE";
                }
                context.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
        }

    }

    //from http://stackoverflow.com/questions/10214873/make-canvas-as-wide-and-as-high-as-parent
    function fitToContainer() {
        // Make it visually fill the positioned parent
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        // ...then set the internal size to match
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    return {
        drawMaze: drawMaze,
        clear: clear,
        init: init
    }
} ());

MazeGame.mazeArray = (function () {
    'use strict';

    var mazeArray;
    var size = -1;
    var lastPlayerX;
    var lastPlayerY;
    var hasWon;

    function init(sizeM) {
        hasWon = false;
        size = sizeM + 2;
        mazeArray = new Array(size)
        for (var i = 0; i < size; i++) {
            mazeArray[i] = new Array(size);
            for (var j = 0; j < size; j++) {
                mazeArray[i][j] = MazeGame.CellType.EMPTY;
            }
        }

        logMaze();
        recursiveDivider(true, 1, 1, size - 2, size - 2);

        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                if (i == 0 || j == 0 || i == (size - 1) || j == (size - 1))
                    mazeArray[i][j] = MazeGame.CellType.WALL;
            }
        }

        mazeArray[1][1] = MazeGame.CellType.EMPTY;
        mazeArray[size - 2][size - 2] = MazeGame.CellType.EMPTY;
        lastPlayerX = 1;
        lastPlayerY = 1;
        mazeArray[lastPlayerX][lastPlayerY] = MazeGame.CellType.PLAYER;
    }

    function recursiveDivider(horizontal, startX, startY, endX, endY) {
        console.log('sx', startX, 'sy', startY, 'ex', endX, 'ey', endY, 'hor', horizontal);
        if (horizontal) {
            if (endX - startX < 2) return;

            do {
                var horizontalDivideY = Math.floor(randomBetween(startY, endY) / 2) * 2;
            } while (horizontalDivideY == startY - 1 || horizontalDivideY == endY + 1);
            for (var i = startX; i < endX; i++) {
                setMazeField(i, horizontalDivideY, MazeGame.CellType.WALL);
            }

            var hHoleX = Math.floor(randomBetween(startX, endX) / 2) * 2 + 1;
            setMazeField(hHoleX, horizontalDivideY, MazeGame.CellType.EMPTY);

            logMaze();
            recursiveDivider(!horizontal, startX, startY, endX, horizontalDivideY - 1);
            recursiveDivider(!horizontal, startX, horizontalDivideY + 1, endX, endY);

        } else {
            if (endY - startY < 2) return;
            do {
                var verticalDivideX = Math.floor(randomBetween(startX, endX) / 2) * 2;
            } while (verticalDivideX == startX - 1 || verticalDivideX == endX + 1)
            for (var i = startY; i < endY; i++) {
                setMazeField(verticalDivideX, i, MazeGame.CellType.WALL);
            }

            var vHoleY = Math.floor(randomBetween(startY, endY) / 2) * 2 + 1;
            setMazeField(verticalDivideX, vHoleY, MazeGame.CellType.EMPTY);

            logMaze();
            recursiveDivider(!horizontal, startX, startY, verticalDivideX - 1, endY);
            recursiveDivider(!horizontal, verticalDivideX + 1, startY, endX, endY);
        }
    }

    function setMazeField(x, y, type) {

        if (typeof mazeArray[x] === 'undefined' || typeof mazeArray[x][y] === 'undefined') {
            console.log('Attempting to set coord (', x, ',', y, ') to ', type, ' ,which is not defined.');
            console.trace('stacktrace:');
            throw 'Bad Maze array access'
        } else {
            console.log(type, ' to (', x, ',', y, ')');
            mazeArray[x][y] = type;
        }
    }

    function updatePlayer(direction) {
        if (hasWon) return;
        var newX = lastPlayerX;
        var newY = lastPlayerY;
        if (direction == MazeGame.Direction.UP) {
            newY--;
        } else if (direction == MazeGame.Direction.RIGHT) {
            newX++;
        } else if (direction == MazeGame.Direction.DOWN) {
            newY++;
        } else if (direction == MazeGame.Direction.LEFT) {
            newX--;
        }
        if (isValidMove(newX, newY)) {
            mazeArray[lastPlayerX][lastPlayerY] = MazeGame.CellType.VISITED;
            lastPlayerX = newX;
            lastPlayerY = newY;
            mazeArray[lastPlayerX][lastPlayerY] = MazeGame.CellType.PLAYER;
        }


        //check win
        hasWon = (lastPlayerX === size - 2 && lastPlayerY === size - 2);
    }

    function isValidMove(newX, newY) {
        if (newX >= size || newY >= size || newX < 0 || newY < 0) return false;
        if (mazeArray[newX][newY] == MazeGame.CellType.WALL) return false;
        return true;
    }

    function logMaze() {
        var a = '';
        for (var j = 0; j < size; j++) {
            for (var i = 0; i < size; i++) {
                if (mazeArray[i][j] == MazeGame.CellType.EMPTY) {
                    a += " ";
                } else {
                    a += "*";
                }
            }
            a += '\r\n';
        }
        console.log(a);
    }

    function getCell(x, y) {
        return mazeArray[x][y];
    }

    return {
        init: init,
        logMaze: logMaze,
        getCell: getCell,
        size: function () { return size; },
        hasWon: function () { return hasWon; },
        updatePlayer: updatePlayer
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

MazeGame.Game.updateHtml();     //set on first load