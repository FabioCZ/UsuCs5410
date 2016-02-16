//CS5410 Assignment 2, Fabio Gottlicher A01647928

var lastUpdate;
var elapsedTime;

var MazeGame = {};

MazeGame.mazeArray = (function () {
    'use strict';

    var mazeArray;
    var size;

    var CellType = {
        EMPTY: 1,
        WALL: 2,
        PLAYER: 3,
        BREADCRUMB: 4,
        HINT: 5,
        START: 6,
        END: 7
    }

    function init(sizeM) {
        
        size = sizeM;
        mazeArray = new Array(size)
        for (var i = 0; i < size; i++) {
            mazeArray[i] = new Array(size);
            for (var j = 0; j < size; j++) {
                mazeArray[i][j] = CellType.EMPTY;
            }
        }

       recursiveDivider(0, 0, size, size);

    }

    function recursiveDivider(startX, startY, width, height) {
        console.log('w ', width, ' h ', height);
        if (width <= 2 || height <= 2) return;
        console.log('start3');
        //add vertical
        var verticalDivide = randomBetween(startX + 1, startX + width -1)
        for(var  j = startY; j < startY + height;j++){
            mazeArray[verticalDivide][j] = CellType.WALL;
        }
        //add hole to vertical
        if(height == 3){
            verticalHole = startY; //edge case
        } else {
        var verticalHole = randomBetween(startY,startY+height);
        mazeArray[verticalDivide][verticalHole] = CellType.EMPTY;
        }
        //add horizontal
        var horizontalDivide = 0;
        do{
            horizontalDivide = randomBetween(startY + 1, startY + height - 1);
        }while(horizontalDivide == verticalHole)
        
        for(var i = startX; i < startX + height;i++)
        {
            mazeArray[i][horizontalDivide] = CellType.WALL;
        }
        
        //add hole to horizontal
        var horizontalHole1 = randomBetween(startX, verticalDivide);
        mazeArray[horizontalHole1][horizontalDivide] = CellType.EMPTY;
        
        var horizontalHole2 = randomBetween(verticalDivide + 1, startX + width);
        mazeArray[horizontalHole2][horizontalDivide] = CellType.EMPTY;
        logMaze();
        //topleft
        recursiveDivider(startX, startY, verticalDivide - startX - 1, horizontalDivide - startY - 1);
        //topright
        recursiveDivider(verticalDivide + 1, startY, startX + width - verticalDivide, horizontalDivide - startY );
        //bottomleft
        //recursiveDivider(startX, horizontalDivide, verticalDivide - startX, startY + height - horizontalDivide);
        //bottomright
        //recursiveDivider(verticalDivide, horizontalDivide, startX + width - verticalDivide, startY + height - horizontalDivide);
    }
    
    function logMaze(){
        var a = '';
        for(var j = 0; j < size;j++){
            for(var i = 0; i < size; i++){
                if(mazeArray[i][j] == CellType.EMPTY)
                {
                    a += " ";
                }
                else
                {
                    a += "*";
                }
            }
            a += '\r\n';
        }
        console.log(a);
    }


    return {
        CellType: CellType,
        init: init,
        logMaze : logMaze
    }
} ());

function gameLoop(time) {
    elapsedSinceLast = time - lastUpdate;
    var toRender = update(time);
    render(toRender);
    lastUpdate = time;
    window.requestAnimationFrame(gameLoop);
}

function update(time) {

}

function render(toRender) {

}

function startGame() {

}


function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

console.log('test')
MazeGame.mazeArray.init(20);