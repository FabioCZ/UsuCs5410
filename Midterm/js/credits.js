var Credits = {}

Credits.Main = (function(){
    
    function init(){
        Credits.Buttons.init();
        Credits.Graphics.init();
        document.addEventListener('click', click);
        Credits.Graphics.drawAll();
    }
    
    function click(e){
        toMainMenu();
    }
    function toMainMenu(){
        document.removeEventListener('click', click);
        Menu.Main.init();
    }
    
    return{
        init : init,
        toMainMenu : toMainMenu
    }
}());

Credits.Buttons = (function(){
    var buttons = [];
    var selected = -1;
    function init(){
        buttons = [];
        buttons.push({title : "Created by:", exec : null});
        buttons.push({title : "Fabio Göttlicher", exec : null});
        buttons.push({title : "for USU CS5410", exec : null});
        buttons.push({title : "Spring 2016", exec : null});
        
        buttons.push({title : "Back", exec : Credits.Main.toMainMenu});
        selected = 4;
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
        getNumButtons : getNumButtons,
        getTitleFor : getTitleFor,
    }
}());

Credits.Graphics = (function () {
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
        for(var i = 0; i < Credits.Buttons.getNumButtons(); i++){
            context.fillStyle = Credits.Buttons.getSelected() == i ? "#e9f259" : "#000000";
            console.log(Credits.Buttons.getTitleFor(i), "...", getCanvasSize().w / 2, "...",buttonSpacing * (i+1))
            context.fillText(Credits.Buttons.getTitleFor(i), getCanvasSize().w / 2, buttonSpacing * (i+1));
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
