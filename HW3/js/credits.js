var Credits = {}

Credits.Main = (function(){
    
    function init(){
        Credits.Buttons.init();
        Credits.Graphics.init();
        document.addEventListener('keydown', onKeyDown);
        Credits.Graphics.drawAll();
    }
    
    function onKeyDown(e){
        switch(e.keyCode){
            case KeyCode.RETURN:
            case KeyCode.ESCAPE:
                toMainMenu();
                return;
        }
        Credits.Graphics.drawAll();
    }
    
    function toMainMenu(){
        document.removeEventListener('keydown', onKeyDown);
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
        for(var i = 0; i < Credits.Buttons.getNumButtons(); i++){
            context.fillStyle = Credits.Buttons.getSelected() == i ? "#e9f259" : "#000000";
            context.fillText(Credits.Buttons.getTitleFor(i), canvasSize / 2, buttonSpacing * (i+1));
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
        buttonSpacing = canvas.height / (Credits.Buttons.getNumButtons() + 1);
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
