var Menu = {};

Menu.options ={
    "New Game" : Game.Game.startGame,
    "High Scores" : 'highScores',
    "Credits" : 'credits'    
};

Menu.Main = (function(){
    
    function init(){
        Menu.Buttons.init();
        Menu.Graphics.init();
        Menu.Graphics.drawAll();
        document.addEventListener('keydown', onKeyDown);
    }
    
    function onKeyDown(e){
        switch(e.keyCode){
            case KeyCode.RETURN:
                document.removeEventListener('keydown', onKeyDown);
                Menu.Buttons.getAction()();
                return;
            case KeyCode.UP:
                Menu.Buttons.up();
                break;
            case KeyCode.DOWN:
                Menu.Buttons.down();
                break;
        }
        Menu.Graphics.drawAll();
    }
    
    return{
        init : init
    }
}());

Menu.Buttons = (function(){
    var buttons = [];
    var selected = -1;
    function init(){
        buttons = [];
        buttons.push({title : "New Game", exec : Game.Game.startGame});
        buttons.push({title : "High Scores", exec : HighScores.Main.init});
        buttons.push({title : "Credits", exec : Credits.Main.init});
        selected = 0;
    }
    
    function up(){
        selected = selected == 0 ? (buttons.length - 1) : (selected - 1);
    }
    
    function down(){
        selected = selected == buttons.length - 1 ? 0 : selected + 1; 
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
    return {
        init : init,
        up : up,
        down : down,
        getAction : getAction,
        getSelected : getSelected,
        getNumButtons : getNumButtons,
        getTitleFor : getTitleFor
    }
}());

Menu.Graphics = (function () {
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
        for(var i = 0; i < Menu.Buttons.getNumButtons(); i++){
            context.fillStyle = Menu.Buttons.getSelected() == i ? "#e9f259" : "#000000";
            context.fillText(Menu.Buttons.getTitleFor(i), canvasSize / 2, buttonSpacing * (i+1));
        }
    }

    function setSize() {
        console.log('setting size');
        gameBoardDummy = document.getElementById('gameBoardDummy');
        canvasSize = gameBoardDummy.clientHeight;
        // Make it visually fill the positioned parent
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        // ...then set the internal size to match
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        buttonSpacing = canvas.height / (Menu.Buttons.getNumButtons() + 1);
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
