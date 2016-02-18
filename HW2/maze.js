//CS5410 Assignment 2, Fabio Gottlicher A01647928


var MazeGame = {};

MazeGame.CellType = {
    EMPTY: 1,
    WALL: 2,
    PLAYER: 3,
    VISITED: 4,
    HINT: 5,
    PATHFULL : 6
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
    var highscores = [];

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
        startTime = performance.now();
        gameLoop(performance.now());
    }

    function onLoad() {
        MazeGame.Graphics.init();
        document.addEventListener('keydown', onKeyDown);
        updateHtml();
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
    }

    function CheckWin() {
        if (MazeGame.mazeArray.hasWon() && !winDialogShown) {
            console.log('win');
            alert('Congratulation. You have solved the maze.\nTime: '
                + millisToTimeString(MazeGame.Game.elapsedTime()) +
                '\nYour score: ' + MazeGame.mazeArray.score());
            highscores.push(MazeGame.mazeArray.score());
            console.log(highscores);
            winDialogShown = true;
        }
    }

    function updateHtml() {
        var hint = document.getElementById('hint');
        var breadCrumbs = document.getElementById('breadCrumbs');
        var finishPath = document.getElementById('finishPath');
        var score = document.getElementById('score');
        var time = document.getElementById('time');
        var highScoresTable = document.getElementById('highscorestable');
        
        hint.innerHTML = "Print Hint (H): " + (printHint ? "ON" : "OFF");
        breadCrumbs.innerHTML = "Print Breadcrumbs (B): " + (printBreadCrumbs ? "ON" : "OFF");
        finishPath.innerHTML = "Print Path to Finish (P): " + (printFinishPath ? "ON" : "OFF");
        score.innerHTML = "Print Score (Y): " + (printScore ? ("ON, Score: " + MazeGame.mazeArray.score()) : "OFF");
        time.innerHTML = "Elapsed time: " + millisToTimeString(MazeGame.Game.elapsedTime());
        
        //TODO print highscores
        if(highscores.length > 0){
            highscores.sort(function(a,b){return b-a;});
            var tbl = document.createElement('table');
            tbl.style.border = '1px solid black';
            tbl.style.borderCollapse = 'collapse';
            var scoreCt = (highscores.length > 5) ? 5 : highscores.length;
            console.log('score Ct to print', scoreCt);
            for(var i = 0; i < scoreCt;i++){
                var tr = tbl.insertRow();
                var td1 = tr.insertCell();
                td1.appendChild(document.createTextNode('Highscore no.' + (i+1).toString()));
                td1.style.border = '1px solid black';
                td1.style.padding = '0px 5px';
                
                var td2 = tr.insertCell();
                td2.appendChild(document.createTextNode((highscores[i]).toString()));
                td2.style.border = '1px solid black';
                td2.style.padding = '0px 5px';
                td2.style.textAlign = 'right';
                
            }
            highScoresTable.removeChild(highScoresTable.firstChild);
            highScoresTable.appendChild(tbl);
        } else {
            highScoresTable.innerHTML = "None available"
        }
    }

    return {
        startGame: startGame,
        updateHtml: updateHtml,
        elapsedTime: function () { return elapsedTime; },
        printHint: function () { return printHint; },
        printBreadCrumbs: function () { return printBreadCrumbs; },
        printFinishPath: function () { return printFinishPath; },
        onLoad: onLoad
    }
} ());

MazeGame.Graphics = (function () {
    'use strict';

    var canvas = document.getElementById('canvas-main');
    var context = canvas.getContext('2d');

    var cellSize;
    var gameBoardDummy;
    var canvasSize;
    
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
        setSize();
        context.fillStyle = "#EEEEEE";
        context.fillRect(0, 0, canvasSize, canvasSize);
        context.fillStyle = "#000000";
        var fontSize = canvasSize / 15;
        context.font = fontSize + "px Segoe UI";
        context.fillText("Welcome to the Maze Game", canvasSize * 0.15, canvasSize / 2 - fontSize / 2, canvasSize * 0.7);
        context.fillText("Select a maze size to start", canvasSize * 0.15, (canvasSize / 2) + fontSize / 2, canvasSize * 0.7);

    }

    function drawMaze() {
        //console.log('draw, size: ', MazeGame.mazeArray.size());
        context.clear();
        setSize();
        cellSize = canvasSize / MazeGame.mazeArray.size();
        for (var j = 0; j < MazeGame.mazeArray.size(); j++) {
            for (var i = 0; i < MazeGame.mazeArray.size(); i++) {
                var currCell = MazeGame.mazeArray.getCell(i, j);
                if (currCell === MazeGame.CellType.PLAYER) {
                    context.fillStyle = "#FF00FF";
                } else if (i == 1 && j == 1) {
                    context.fillStyle = "#00FF00";  //start
                } else if (i == MazeGame.mazeArray.size() - 2 && j == MazeGame.mazeArray.size() - 2) {
                    context.fillStyle = "#FF0000";  //goal
                } else if (currCell === MazeGame.CellType.HINT) {
                    context.fillStyle = (MazeGame.Game.printFinishPath() || MazeGame.Game.printHint()) ? "#FF9900" : "#EEEEEE";
                } else if (currCell === MazeGame.CellType.PATHFULL) {
                    context.fillStyle = MazeGame.Game.printFinishPath() ? "#FF9900" : "#EEEEEE";
                } else if (currCell === MazeGame.CellType.EMPTY || currCell === MazeGame.CellType.EMPTYVISITED) {
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
    function setSize() {
        gameBoardDummy = document.getElementById('gameBoardDummy');
        canvasSize = gameBoardDummy.clientWidth;
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
    var score;

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
        score = 0;
        setHintPath();
    }

    function recursiveDivider(horizontal, startX, startY, endX, endY) {
        console.log('sx', startX, 'sy', startY, 'ex', endX, 'ey', endY, 'hor', horizontal);
        if (horizontal) {
            if (endX - startX < 2) return;

            do {
                var horizontalDivideY = Math.floor(randomBetween(startY, endY) / 2) * 2;
            } while (horizontalDivideY == startY - 1 || horizontalDivideY == endY + 1);
            for (var i = startX; i < endX; i++) {
                setCell(i, horizontalDivideY, MazeGame.CellType.WALL);
            }

            var hHoleX = Math.floor(randomBetween(startX, endX) / 2) * 2 + 1;
            setCell(hHoleX, horizontalDivideY, MazeGame.CellType.EMPTY);

            logMaze();
            recursiveDivider(!horizontal, startX, startY, endX, horizontalDivideY - 1);
            recursiveDivider(!horizontal, startX, horizontalDivideY + 1, endX, endY);

        } else {
            if (endY - startY < 2) return;
            do {
                var verticalDivideX = Math.floor(randomBetween(startX, endX) / 2) * 2;
            } while (verticalDivideX == startX - 1 || verticalDivideX == endX + 1)
            for (var i = startY; i < endY; i++) {
                setCell(verticalDivideX, i, MazeGame.CellType.WALL);
            }

            var vHoleY = Math.floor(randomBetween(startY, endY) / 2) * 2 + 1;
            setCell(verticalDivideX, vHoleY, MazeGame.CellType.EMPTY);

            logMaze();
            recursiveDivider(!horizontal, startX, startY, verticalDivideX - 1, endY);
            recursiveDivider(!horizontal, verticalDivideX + 1, startY, endX, endY);
        }
    }

    function setCell(x, y, type) {
        if (typeof mazeArray[x] === 'undefined' || typeof mazeArray[x][y] === 'undefined') {
            console.log('Attempting to set coord (', x, ',', y, ') to ', type, ' ,which is not defined.');
            console.trace('stacktrace:');
            throw 'Bad Maze array access'
        } else {
            //console.log(type, ' to (', x, ',', y, ')');
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
            //adjust score, does it just like the assignment description
            var hintCell = getHintCell();
            var diffFromHint = Math.abs(newX - hintCell.x) + Math.abs(newY - hintCell.y);
            if(diffFromHint == 0){
                score +=5;
            } else if (diffFromHint == 1){
                score -=1;
            } else if(diffFromHint > 1) {
                score -=2;
            }
            
            lastPlayerX = newX;
            lastPlayerY = newY;
            mazeArray[lastPlayerX][lastPlayerY] = MazeGame.CellType.PLAYER;
        }
        //check win
        hasWon = (lastPlayerX === size - 2 && lastPlayerY === size - 2);
        setHintPath();
    }

    function isValidMove(newX, newY) {
        if (newX >= size || newY >= size || newX < 0 || newY < 0) return false;
        if (mazeArray[newX][newY] == MazeGame.CellType.WALL) return false;
        return true;
    }
    
    function getHintCell(){
        for(var i = 0; i < size;i++)
        {
            for(var j = 0; j < size;j++){
                if(mazeArray[i][j] == MazeGame.CellType.HINT)
                {
                    return {x : i, y : j};
                }
            }
        }
    }

    function setHintPath() {
        //resets hint path from previous
        for (var j = 0; j < size; j++) {
            for (var i = 0; i < size; i++) {
                if (mazeArray[i][j] === MazeGame.CellType.EMPTYVISITED || mazeArray[i][j] === MazeGame.CellType.HINT)
                    setCell(i, j, MazeGame.CellType.EMPTY);
            }
        }

        var mazeVisited = new Array(size);
        for(var i = 0; i < size;i++){
            mazeVisited[i] = new Array(size);
            for(var j = 0; j < size; j++){
                mazeVisited[i][j] = false;
            }
        }
        
        var queue = new Array();
        queue.push({ x: lastPlayerX, y: lastPlayerY, path : new Array() });
        
        while(queue.length > 0){
            var c = queue.shift();
            console.log('c is', c);
            if(c.x == size - 2 && c.y == size - 2){
                for(var i = 0; i < c.path.length;i++){
                    if(i == 0){
                        setCell(c.path[i].x, c.path[i].y, MazeGame.CellType.HINT);
                    }else{                    
                        setCell(c.path[i].x, c.path[i].y, MazeGame.CellType.PATHFULL);
                    }
                }
                logMaze();
                return;
            }
            if(mazeVisited[c.x][c.y] == true){
                continue;
            }
            mazeVisited[c.x][c.y] = true;
            var validMoves = getValidMoves(c.x,c.y);
            for(var i = 0; i < validMoves.length;i++){
                var newPath = c.path.slice();
                newPath.push({x : validMoves[i].x, y : validMoves[i].y});
                queue.push({x : validMoves[i].x, y : validMoves[i].y, path : newPath});
            }
        }


    }

    function getValidMoves(x, y) {
        var validMoves = [];
        if (isValidMove(x, y - 1))
            validMoves.push({ x: x, y: y - 1 });
        if (isValidMove(x, y + 1))
            validMoves.push({ x: x, y: y + 1 });
        if (isValidMove(x - 1, y))
            validMoves.push({ x: x - 1, y: y });
        if (isValidMove(x + 1, y))
            validMoves.push({ x: x + 1, y: y });
        return validMoves;
    }

    function logMaze() {
        var a = '';
        for (var j = 0; j < size; j++) {
            for (var i = 0; i < size; i++) {
                if (mazeArray[i][j] == MazeGame.CellType.EMPTY) {
                    a += " ";
                } else if(mazeArray[i][j] == MazeGame.CellType.HINT) {
                    a += "h";
                } else {
                    a+= "*";
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
        updatePlayer: updatePlayer,
        score: function () { return score; }
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