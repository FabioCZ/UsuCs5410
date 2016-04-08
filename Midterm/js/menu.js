var Menu = {};
Menu.Main = (function(){
    
    function init(){
        Menu.Buttons.init();
        Menu.Graphics.init();        
        Menu.Graphics.drawAll();
        document.addEventListener('mousemove', mouseMove);
        
        document.addEventListener('click', click);
    }
    function click(e){
            document.removeEventListener('mousemove',mouseMove)
            document.removeEventListener('click',click);
            Menu.Buttons.getAction()();
            //Menu.Graphics.drawAll();        
        }
        
    function mouseMove(e){
        var x = e.clientX - document.getElementById("canvas-main").getBoundingClientRect().left;
        var y = e.clientY - document.getElementById("canvas-main").getBoundingClientRect().top;
        var selected = Math.floor(y / Menu.Graphics.getButtonSpacing());
        if(selected < 0 || selected >= Menu.Buttons.getNumButtons()){
            return;
        }
        Menu.Buttons.setSelected(selected);
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
        buttons.push({title : "New Game", exec : Bomb.Game.startGameInit});
        buttons.push({title : "High Scores - Total", exec : HighScores.Main.initTotal});
        buttons.push({title : "High Scores - By Level", exec : HighScores.Main.initLevel});
        buttons.push({title : "High Scores - Total Time", exec : HighScores.Main.initTime});
        buttons.push({title : "High Scores - Level Time", exec : HighScores.Main.initTimeLevel});
        buttons.push({title : "Credits", exec : Credits.Main.init});
        selected = 0;
    }
    
    function setSelected(num){
        selected = num;
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

        getAction : getAction,
        getSelected : getSelected,
        setSelected : setSelected,
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
    
    function init(){
         buttonSpacing = canvas.clientHeight / (Menu.Buttons.getNumButtons() + 1);
         canvas.height = canvas.clientHeight;
         canvas.width = canvas.clientWidth;
    }
    
    function drawAll(){
        console.log("drawing menu");
        context.clear();
        drawBk(context,getCanvasSize());
        drawButtons();
    }
    
    function getCanvasSize(){
        return {w: canvas.clientWidth, h:canvas.clientHeight};
    }
    
    function drawButtons(){
        context.textAlign="center"; 
        var fontSize = getCanvasSize().w / 20;
        context.font = fontSize + "px GoodTimes";
        for(var i = 0; i < Menu.Buttons.getNumButtons(); i++){
            context.fillStyle = Menu.Buttons.getSelected() == i ? "#e9f259" : "#000000";
            //console.log(Menu.Buttons.getTitleFor(i), "...", getCanvasSize().w / 2, "...",buttonSpacing * (i+1))
            context.fillText(Menu.Buttons.getTitleFor(i), getCanvasSize().w / 2, buttonSpacing * (i+1));
        }
    }

    function getButtonSpacing(){
        return buttonSpacing;
    }
    return {
        init : init,
        getCanvasSize : getCanvasSize,
        drawAll : drawAll,
        getButtonSpacing : getButtonSpacing
    }
} ());
