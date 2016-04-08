//CS5410 Assignment 3, Fabio Gottlicher A01647928
var Bomb = {};

Bomb.Color = {
    YELLOW: 'rgba(255, 255, 0, 1)',
    ORANGE: 'rgba(255, 153, 0, 1)',
    BLUE: 'rgba(0, 51, 204, 1)',
    GREEN: 'rgba(0, 204, 51, 1)'

}

Bomb.Game = (function() {

    var elapsedTime;
    var startTime;
    var lastUpdate;
    var carryoverTime;
    var carryoverScore;
    var score;
    var explosions;
    var currLevel;
    var clickInitialized;
    var startUpCt;
    var addedScore;

    function loop(time) {
        elapsedTime = time - startTime;
        var keepUpdating = update(elapsedTime - lastUpdate);

        if(keepUpdating){
            Bomb.Graphics.drawAll(); //render
            lastUpdate = elapsedTime;
            requestAnimationFrame(loop);
        }
    }
    
    function update(delta){
        if(elapsedTime < 3000){
            startUpCt = (3000 - elapsedTime )/ 1000;
        } else {
            if(!clickInitialized){
                startUpCt = -1;
                document.addEventListener('click',click);
                clickInitialized = true;
            }
            
            explosions.updateAll(elapsedTime);
            
            //check next level
            if(Bomb.Bombs.allDead()){
                console.log('all dead in level '+ currLevel);
                document.removeEventListener('click',click);
                    
                if(currLevel === 5){
                    console.log('done level 5');
                    if(!addedScore){
                    addScore(score,'level'+currLevel);
                    addScore(Math.round(elapsedTime/10)/100,'timeLevel'+currLevel);
                    addScore(score+carryoverScore,'total');
                    addScore(Math.round(elapsedTime+carryoverTime/10)/100,'time');
                    addedScore=true;
                    }
                    
                    Bomb.Graphics.drawEndScore();
                    document.addEventListener('click',clickFinish);
                    return false;
                } else {
                    
                    addScore(score,'level'+currLevel);
                    addScore(Math.round((elapsedTime-3000)/10)/100,'timeLevel'+currLevel);
                    var nextLevel = currLevel + 1;
                    startGame(score+carryoverScore,carryoverTime+elapsedTime-3000,nextLevel);
                }
            }
            
            Bomb.Bombs.decrCounters();
        }
        return true;
    }

    function startGameInit() {
        startGame(0,0,5);
    }
    
    function startGame(coScore,coTime,level){
        addedScore=false;
        currLevel=level;
        carryoverTime = coTime;
        carryoverScore = coScore;
        score = 0;
        startUpCt = -1;
        clickInitialized = false;
        startTime = performance.now();
        Bomb.Bombs.initLevel(level);
        Bomb.Graphics.init();
        explosions = Explosions();
        loop(performance.now()); //needs to be last
    }
    
    function click(e){
        var x = e.clientX - document.getElementById("canvas-main").getBoundingClientRect().left;
        var y = e.clientY - document.getElementById("canvas-main").getBoundingClientRect().top;
        Bomb.Bombs.checkClick(x,y);
    }
    
    function clickFinish(e){
        document.removeEventListener('click',clickFinish);
        Menu.Main.init();
    }

    function getTotalScore() {
        var a = score + carryoverScore;
        var s = a + "";
        while (s.length < 3) s = "0" + s;
        return s;
    }
    
    function getTotalTime(){
        return Math.round(((carryoverTime + elapsedTime - 3000)/1000)*100)/100;
    }

    function addScore(score,key) {
        var highScores = JSON.parse(localStorage.getItem('Bomb.highScores.'+key));

        
        if(key.indexOf('time') == -1){  //not time -> asc
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
        } else {    //desc
            if (highScores == null) {
            highScores = [9007199254740992, 9007199254740992, 9007199254740992, 9007199254740992, 9007199254740992];    //init 5 null
            }
            Array.max = function(array) {
                return Math.max.apply(Math, array);
            };

            var max = Array.max(highScores);
            if (max > score) {
                var index = highScores.indexOf(max);
                highScores.splice(index, 1);
                highScores.push(score);
            }

            highScores.sort(function(a, b) {
                return a - b;
            });
        }

        localStorage.setItem('Bomb.highScores.'+key, JSON.stringify(highScores));
    }

    function getExplosionManager() {
        return explosions;
    }

    function incrScore(num) {
        score += num;
    }

    function getElapsedTime() {
        return elapsedTime;
    }

    return {
        startGame: startGame,
        startGameInit : startGameInit,
        getTotalScore: getTotalScore,
        getTotalTime : getTotalTime,
        incrScore: incrScore,
        getExplosionManager: getExplosionManager,
        getElapsedTime: getElapsedTime,
        getCounter : function(){return startUpCt;},
        getCarryoverTime : function(){return Math.round(carryoverTime/10)/100;}
    }
} ());

Bomb.Bombs = (function(){
    
    var bombs;
    var bombCt;
    var lastDecremented;
    
    function initLevel(levelNum){
        lastDecremented = 3000;
        console.log("bombs init level:" + levelNum);
        var b = [];
        bombs = [];
        b.push([3,3,2,2,1,1]);
        
        b.push([4,3,2]);
        b[1] = b[1].concat(b[0]);
        
        b.push([5,4,3]);
        b[2] = b[2].concat(b[1]);
        
        b.push([6,5,4]);
        b[3] = b[3].concat(b[2]);
        
        b.push([7,6,5]);
        b[4] = b[4].concat(b[3]);
        
        b = b[levelNum-1];
        b = shuffleArray(b);
        bombCt = b.length;
        
        var c = Bomb.Graphics.getCanvasSize();
        
        var widthSpacing = c.w / 6;
        var heightSpacing = c.h / 8;
        
        bombs.push({counter: b.splice(0,1)[0],x:widthSpacing*1,y:heightSpacing, cleared:false});
        bombs.push({counter: b.splice(0,1)[0],x:widthSpacing*2,y:heightSpacing, cleared:false});
        bombs.push({counter: b.splice(0,1)[0],x:widthSpacing*3,y:heightSpacing, cleared:false});
        
        for(var i = 3; i < bombCt;i+=3){
        bombs.push({counter: b.splice(0,1)[0],x:widthSpacing*1,y:heightSpacing * ((i/3)+1), cleared:false});
        bombs.push({counter: b.splice(0,1)[0],x:widthSpacing*2,y:heightSpacing * ((i/3)+1), cleared:false});
        bombs.push({counter: b.splice(0,1)[0],x:widthSpacing*3,y:heightSpacing * ((i/3)+1), cleared:false});
        }
        console.log("bombs init done");
    }
    
    function checkClick(x,y){
        for(var i = 0; i < bombs.length;i++){
            var b = bombs[i];
            if(x>b.x && y>b.y && x<b.x+Bomb.Graphics.getBombWidth()&& y<b.y+Bomb.Graphics.getBombWidth() && !b.cleared && b.counter>-1){
                bombs[i].cleared = true;
                Bomb.Game.incrScore(b.counter);
                
            }
        }
    }
    
    function decrCounters(){
        var el =Bomb.Game.getElapsedTime();
        if( el - lastDecremented > 1000){
            lastDecremented = el;
            for(var i = 0; i < bombs.length;i++){
                if(bombs[i].counter > -1 && !bombs[i].cleared){
                    bombs[i].counter--;
                    if(bombs[i].counter == -1){
                        Bomb.Game.getExplosionManager().addExplosion(Bomb.Game.getElapsedTime(), bombs[i].x,bombs[i].y);
                    }
                }
            }
        }
    }
    function getBombs(){
        return bombs;
    }
    
    function allDead(){
        for(var i = 0; i < bombs.length;i++){
            if(bombs[i].counter > -1 && !bombs[i].cleared){
                return false;
            }
        }
        return true;
    }
    
    return{
        initLevel : initLevel,
        getBombs : getBombs,
        checkClick : checkClick,
        allDead : allDead,
        decrCounters : decrCounters
    }
}());

Bomb.Graphics = (function() {
    'use strict';

    var canvas = document.getElementById('canvas-main');
    var context = canvas.getContext('2d');

    var cellHeight;
    var cellWidth;
    var cellSpacing;
    var gameBoardDummy;
    var canvasSize;
    
    var bkImg;
    var ctImgs;
    var explosionImg;
    var checkmarkImg;
    var bombImg;
    var bombWidth;

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
    
    function makeImage(path){
    var that = {},
        ready = false,
        image = new Image();
    image.onload = function() { 
        ready = true;
    };
    
    image.src = path;
    
    that.draw = function(x,y,w,h){
        if(ready){
            context.drawImage(image,x,y,w,h);
        }
    }
    return that;
}
    
    function init(){
        bkImg = makeImage("res/Background.png");
        ctImgs = [
            makeImage("res/glass_numbers_0.png"),
            makeImage("res/glass_numbers_1.png"),
            makeImage("res/glass_numbers_2.png"),
            makeImage("res/glass_numbers_3.png"),
            makeImage("res/glass_numbers_4.png"),
            makeImage("res/glass_numbers_5.png"),
            makeImage("res/glass_numbers_6.png"),
            makeImage("res/glass_numbers_7.png"),
            makeImage("res/glass_numbers_8.png"),
            makeImage("res/glass_numbers_9.png"),
        ];
        explosionImg = makeImage("res/Explosion.png");
        checkmarkImg = makeImage("res/checkmark.png");
        bombImg = makeImage("res/Bomb.png");
        bombWidth = getCanvasSize().w/9;
    }

    function clear() {
        context.clear();
    }

    function drawAll() {
        context.clear();
        bkImg.draw(0,0,canvas.clientWidth,canvas.clientHeight);
        drawBombs();
        drawScore();
        drawCounter();
        drawExplosions();
    }
    
    function drawBombs(){
        var b = Bomb.Bombs.getBombs();
        for(var i = 0; i < b.length;i++){
            bombImg.draw(b[i].x,b[i].y,bombWidth,bombWidth);
            if(b[i].cleared){   //cleared
                checkmarkImg.draw(b[i].x + bombWidth*0.22 ,b[i].y+ bombWidth*0.2,bombWidth*0.8,bombWidth*0.8);
            } else if(b[i].counter > -1) {  //counting down
                ctImgs[b[i].counter].draw(b[i].x + bombWidth*0.22 ,b[i].y+ bombWidth*0.2,bombWidth*0.8,bombWidth*0.8);
            } else {    //exploded
                explosionImg.draw(b[i].x + bombWidth*0.22 ,b[i].y+ bombWidth*0.2,bombWidth*0.8,bombWidth*0.8);
            }
        }
    }

    function drawScore() {
        var c = getCanvasSize();
        var fontSize = c.w / 30;
        context.textAlign = "start";
        context.font = fontSize + "px GoodTimes";
        context.fillStyle = "#000000";
        context.fillText("Score: " +Bomb.Game.getTotalScore(), c.w - (c.w/3), c.h*0.15);
        if(Bomb.Game.getCounter() == -1){
        context.fillText("Time: " +Bomb.Game.getTotalTime(), c.w - (c.w/3), c.h*0.25);
        } else {
        context.fillText("Time: " +Bomb.Game.getCarryoverTime(), c.w - (c.w/3), c.h*0.25);
        }
        
        
        
    }

    function drawCounter() {
        var sec = Bomb.Game.getCounter();
        //console.log(sec)
        if (sec == -1) return;
        context.textAlign = "center";
        var fontSize = canvasSize / 15;
        context.font = fontSize + "px GoodTimes";
        context.fillStyle = "#33ccff";
        context.fillText("Starting in: " + ((sec+1)|0), getCanvasSize().w / 2,  getCanvasSize().h / 2);
    }
    
    function drawExplosions(){
        var e =Bomb.Game.getExplosionManager();
        for(var i = 0; i < e.explosions.length;i++){
            for(var j = 0; j < e.explosions[i].particles.length;j++){
                    var that = e.explosions[i];
                    var size =  that.particles[j].size;
                    context.fillRect(that.particles[j].x - size/2,that.particles[j].y - size/2, size, size);
            }
        }
    }
    
    function drawEndScore(){
        canvasSize = getCanvasSize();
        context.textAlign = "center";
        var fontSize = canvasSize.w / 30;
        context.font = fontSize + "px GoodTimes";
        context.fillStyle = "#33ccff";
        context.fillText("Done! Click to return to main menu ", canvasSize.w / 2, canvasSize.h / 2);
    }
    
    function getCanvasSize(){
        return {w: canvas.clientWidth, h:canvas.clientHeight};
    }

    function getContext() {
        return context;
    }
    return {
        init : init,
        getCanvasSize: getCanvasSize,
        drawAll: drawAll,
        getBombWidth : function(){return bombWidth;},
        getContext: getContext,
        drawEndScore : drawEndScore
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