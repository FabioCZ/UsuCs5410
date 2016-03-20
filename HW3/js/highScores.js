var HighScores = {}

HighScores.Main = (function(){
    
    var highScores = [];
    
    function init(){
        HighScores.Buttons.init();
        HighScores.Graphics.init();
        getScores();
        document.addEventListener('keydown', onKeyDown);
        HighScores.Graphics.drawAll();
    }
    
    function onKeyDown(e){
        switch(e.keyCode){
            case KeyCode.RETURN:
                HighScores.Buttons.getAction()();
                if(HighScores.Buttons.getSelected() == 6)
                    break;
                else
                    return;
            case KeyCode.UP:
                HighScores.Buttons.up();
                break;
            case KeyCode.DOWN:
                HighScores.Buttons.down();
                break;
            case KeyCode.ESCAPE:
                toMainMenu();
                return;
        }
        HighScores.Graphics.drawAll();
    }
    
    function toMainMenu(){
        document.removeEventListener('keydown', onKeyDown);
        Menu.Main.init();
    }
    
    function getScores(){
        highScores = JSON.parse(localStorage.getItem('Breakout.highScores'));
        HighScores.Buttons.setScores(highScores);
    }
    
    function resetScores()
    {
        highScores = [-1,-1,-1,-1,-1];
        localStorage.removeItem('Breakout.highScores');
        HighScores.Buttons.setScores(highScores);
    }
    
    return{
        init : init,
        toMainMenu : toMainMenu,
        resetScores : resetScores,
    }
}());



HighScores.Buttons = (function(){
    var buttons = [];
    var selected = -1;
    function init(){
        buttons = [];
        buttons.push({title : "High Scores:", exec : null});

        buttons.push({title : "1:", exec : null});
        buttons.push({title : "2:", exec : null});
        buttons.push({title : "3:", exec : null});
        buttons.push({title : "4:", exec : null});
        buttons.push({title : "5:", exec : null});

        
        buttons.push({title : "Reset Scores", exec : HighScores.Main.resetScores});
        buttons.push({title : "Back", exec : HighScores.Main.toMainMenu});
        selected = 6;
    }
    
    function up(){
        selected = selected == 6 ? (buttons.length - 1) : (selected - 1);
    }
    
    function down(){
        selected = selected == buttons.length - 1 ? 6 : selected + 1; 
    }
    
    function getAction(){
        return buttons[selected].exec;
    }
    
    function getTitleFor(index){
        return buttons[index].title;
    }
    
    function getSelected(){
        return selected;
    }
    
    function getNumButtons(){
        return buttons.length;
    }
    
    function setScores(scoresIntArr){
        for(var i = 0; i < 5;i++){
            buttons[i+1].title = (i+1) + " : " + (scoresIntArr == null || scoresIntArr[i] == -1 ? "N/A" : scoresIntArr[i]);
        }
    }
    
    return {
        init : init,
        up : up,
        down : down,
        getAction : getAction,
        getSelected : getSelected,
        getNumButtons : getNumButtons,
        getTitleFor : getTitleFor,
        setScores : setScores
    }
}());

HighScores.Graphics = (function () {
    'use strict';

    var canvas = document.getElementById('canvas-main');
    var context = canvas.getContext('2d');

    var gameBoardDummy;
    var canvasSize;
    var buttonSpacing;
    
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
        context.clear();
        setSize();
    }
    
    function drawAll(){
        context.clear();
        drawBk(context,canvasSize);
        drawButtons();
    }
    
    function drawButtons(){
        context.textAlign="center"; 
        var fontSize = canvasSize / 15;
        context.font = fontSize + "px GoodTimes";
        for(var i = 0; i < HighScores.Buttons.getNumButtons(); i++){
            context.fillStyle = HighScores.Buttons.getSelected() == i ? "#e9f259" : "#000000";
            context.fillText(HighScores.Buttons.getTitleFor(i), canvasSize / 2, buttonSpacing * (i+1));
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
        buttonSpacing = canvas.height / (HighScores.Buttons.getNumButtons() + 1);
    }
    
    function getCanvasSize(){
        return canvasSize;
    }
    return {
        init: init,
        getCanvasSize : getCanvasSize,
        setSize : setSize,
        drawAll : drawAll
    }
} ());
