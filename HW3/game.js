//CS5410 Assignment 2, Fabio Gottlicher A01647928


var Game = {};

Game.KeyCode = {
    LEFT: 37,
    RIGHT: 39,
    SPACE: 32
}

Game.Color = {
    YELLOW: 'rgba(255, 255, 0, 1)',
    ORANGE: 'rgba(255, 153, 0, 1)',
    BLUE: 'rgba(0, 51, 204, 1)',
    GREEN: 'rgba(0, 204, 51, 1)'

}

Game.Game = (function () {

    var elapsedTime;
    var startTime;

    function loop(time) {
        elapsedTime = time - startTime;

        //handleInput();
        //update();
        Game.Graphics.drawAll(); //render
        requestAnimationFrame(loop);
    }

    function startGame() {
        document.addEventListener('keydown', onKeyDown);
        startTime = performance.now();
        Game.Graphics.setSize();
        Game.Paddle.init();
        Game.Bricks.init();
        loop(performance.now());
    }

    function onKeyDown(e) {
        console.log('butt', e.keyCode)
        if (e.keyCode == Game.KeyCode.LEFT || e.keyCode == Game.KeyCode.RIGHT) Game.Paddle.move(e.keyCode);
        else if (e.keyCode == Game.KeyCode.LEFT) { }
    }
    return {
        startGame : startGame
    }
} ());

Game.Bricks = (function () {
    var bricks = [];
    var numBricks = 14;

    function init() {
        for (var i = 0; i < 8; i++) {
            bricks[i] = [];
            for (var j = 0; j < numBricks; j++) {
                var color;
                switch (i) {
                    case 0:
                    case 1:
                        color = Game.Color.GREEN;
                        break;
                    case 2:
                    case 3:
                        color = Game.Color.BLUE;
                        break;
                    case 4:
                    case 5:
                        color = Game.Color.ORANGE;
                        break;
                    case 6:
                    case 7:
                        color = Game.Color.YELLOW;
                        break;
                    default:
                        break;
                }
                bricks[i][j] = makeBrick(color,i,j);
            }
        }
    }

    function makeBrick(color,row,column) {
        var y = Game.Graphics.getCellSpacing() + row * (Game.Graphics.getCellSpacing() + Game.Graphics.getCellHeight());
        var x = Game.Graphics.getCellSpacing() + column * (Game.Graphics.getCellSpacing() + Game.Graphics.getCellWidth());
        //console.log('making brick, x:', x, '  y:', y)
        return {
            color : color,
            destroyed : false,
            x : x,
            y : y
        }
    }
    function getNumBricks(){
        return numBricks;
    }
    
    function getBrick(r,c){
        return bricks[r][c];
    }
    
    return {
        init : init,
        getNumBricks : getNumBricks,
        getBrick : getBrick
    }
} ());

Game.Paddle = (function (){
    var width;
    var currPosition;
    var moveStep = 4;
    
    function init(){
        width  = Game.Graphics.getCanvasSize() * 0.15;
        currPosition = Game.Graphics.getCanvasSize() / 2 - width / 2;
    }
    
    function getWidth(){
        return width;
    }
    
    function setHalfWidth(){
        width /= 2;
    }
    
    function getCurrPosition(){
        return currPosition;
    }
    
    function move(dir){
        console.log('moving paddle',dir);
        if(dir == Game.KeyCode.LEFT){
            if(currPosition - moveStep < 0) return;
            currPosition -= moveStep;
        } else {
            if(currPosition + width + moveStep > Game.Graphics.getCanvasSize()) return;
            currPosition += moveStep;
        }
    }
    
    return {
        getWidth : getWidth,
        getCurrPosition : getCurrPosition,
        move : move,
        init : init
    } 
}())

Game.Graphics = (function () {
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
    }
    
    function drawAll()
    {
        context.clear();
        drawBk();
        drawBricks();
        drawPaddle();
    }
    
    function drawBk(){
        context.fillStyle = "#EEEEEE";
        context.fillRect(0, 0, canvasSize, canvasSize);
    }
    
    function drawBricks(){
        for(var i = 0; i < 8; i++){
            for(var j = 0; j < Game.Bricks.getNumBricks();j++){
                var b = Game.Bricks.getBrick(i,j);
                context.fillStyle = b.color;
                context.fillRect(b.x,b.y,cellWidth,cellHeight);
            }
        }
    }
    
    function drawPaddle(){
        context.fillStyle = "#000000";
        context.fillRect(Game.Paddle.getCurrPosition(), canvasSize - 10, Game.Paddle.getWidth(),7);
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
        cellHeight = canvas.height / 3 / 8;
        cellWidth = canvas.width / 16;
        cellSpacing = cellWidth / 8;
    }
    
    function getCellWidth(){
        return cellWidth;
    }
    
    function getCellHeight(){
        return cellHeight;
    }
    
    function getCellSpacing(){
        return cellSpacing;
    }
    
    function getCanvasSize(){
        return canvasSize;
    }
    return {
        init: init,
        getCellWidth : getCellWidth,
        getCellHeight : getCellHeight,
        getCellSpacing : getCellSpacing,
        getCanvasSize : getCanvasSize,
        setSize : setSize,
        drawAll : drawAll
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