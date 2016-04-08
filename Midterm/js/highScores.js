var HighScores = {}

HighScores.Main = (function(){
    
    var highScores = [];
    var key;
    var level;
    
    function initTotal(){
        key = "total";
        init();
    }
    
    function initLevel(){
        key = "level";
        level = 1;
        init();
    }
    
    function initTime(){
        key = "time";
        init();
    }
    
    function initTimeLevel(){
        key = "timeLevel";
        level = 1;
        init();
    }
    
    function init(){
        HighScores.Buttons.init();
        HighScores.Graphics.init();
        getScores();
        document.addEventListener('mousemove', mouseMove);
        
        document.addEventListener('click', click);
        HighScores.Graphics.drawAll();
    }
    
    function click(e){

            if(HighScores.Buttons.getAction()!=null){
                HighScores.Buttons.getAction()();     
            }
    }
        
    function mouseMove(e){
        var x = e.clientX - document.getElementById("canvas-main").getBoundingClientRect().left;
        var y = e.clientY - document.getElementById("canvas-main").getBoundingClientRect().top;
        var selected = Math.floor(y / HighScores.Graphics.getButtonSpacing());
        HighScores.Buttons.setSelected(selected);
        HighScores.Graphics.drawAll();
        }
    
    function toMainMenu(){
        document.removeEventListener('mousemove',mouseMove)
        document.removeEventListener('click',click);
        Menu.Main.init();
    }
    
    function getScores(){
        var key2 = key;
        if(key == 'level' || key == 'timeLevel'){
            key2 = key + level;
        }
        highScores = JSON.parse(localStorage.getItem('Bomb.highScores.'+key2));
        HighScores.Buttons.setScores(highScores);
    }
    
    function resetScores()
    {
        var key2 = key;
        if(key == 'level' || key == 'timeLevel'){
            key2 = key + level;
        }
        highScores = [-1,-1,-1,-1,-1];
        localStorage.removeItem('Bomb.highScores.'+key2);
        HighScores.Buttons.setScores(highScores);
    }
    
    function getKey(){
        return key;
    }
    
    function getLevel(){
        return level;
    }
    
    function nextLevel(){
        level = level == 5 ? 1 : level+1;
        HighScores.Buttons.init();
        HighScores.Graphics.init();
        getScores();
        HighScores.Graphics.drawAll();
    }
    
    function prevLevel(){
        level = level == 1 ? 5 : level-1;
        HighScores.Buttons.init();
        HighScores.Graphics.init();
        getScores();
        HighScores.Graphics.drawAll();
    }
    
    return{
        initTotal : initTotal,
        initLevel : initLevel,
        initTime : initTime,
        initTimeLevel : initTimeLevel,
        toMainMenu : toMainMenu,
        resetScores : resetScores,
        getKey : getKey,
        getLevel : getLevel,
        nextLevel : nextLevel,
        prevLevel : prevLevel
    }
}());



HighScores.Buttons = (function(){
    var buttons = [];
    var selected = -1;
    function init(){
        buttons = [];
        switch(HighScores.Main.getKey()){
            case 'total':
                buttons.push({title : "HS - Total:", exec : null});
                break;
            case 'level':
                buttons.push({title : "HS - Level " + HighScores.Main.getLevel() + ":", exec : null});
                break;
            case 'time':
                buttons.push({title : "HS - Time:", exec : null});
                break;
            case 'timeLevel':
                buttons.push({title : "HS - Level" + HighScores.Main.getLevel() + " Time:", exec : null});
                break;
        }
        buttons.push({title : "1:", exec : null});
        buttons.push({title : "2:", exec : null});
        buttons.push({title : "3:", exec : null});
        buttons.push({title : "4:", exec : null});
        buttons.push({title : "5:", exec : null});

        if(HighScores.Main.getKey() == 'level' || HighScores.Main.getKey() == 'timeLevel'){
            buttons.push({title: "Next Level", exec: HighScores.Main.nextLevel});
            buttons.push({title: "Prev Level", exec: HighScores.Main.prevLevel});
        }
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
            buttons[i+1].title = (i+1) + " : " + (scoresIntArr == null || scoresIntArr[i] == -1 || scoresIntArr[i] == 9007199254740992 ? "N/A" : scoresIntArr[i]);
        }
    }
    
        function setSelected(num){
        selected = num;
    }
    
    
    return {
        init : init,
        up : up,
        down : down,
        getAction : getAction,
        getSelected : getSelected,
        setSelected : setSelected,
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
        buttonSpacing = canvas.clientHeight / (HighScores.Buttons.getNumButtons() + 1);
        canvas.height = canvas.clientHeight;
        canvas.width = canvas.clientWidth;
    }
    
    function drawAll(){
        console.log('drawing highScores');
        context.clear();
        drawBk(context,getCanvasSize());
        drawButtons();
    }
    
    function drawButtons(){
        context.textAlign="center"; 
        var fontSize = getCanvasSize().w / 20;;
        context.font = fontSize + "px GoodTimes";
        for(var i = 0; i < HighScores.Buttons.getNumButtons(); i++){
            context.fillStyle = HighScores.Buttons.getSelected() == i ? "#e9f259" : "#000000";
            context.fillText(HighScores.Buttons.getTitleFor(i), getCanvasSize().w / 2, buttonSpacing * (i+1));
        }
    }

    function getCanvasSize(){
        return {w: canvas.clientWidth, h:canvas.clientHeight};
    }
    
        function getButtonSpacing(){
        return buttonSpacing;
    }
    
    return {
        init: init,
        getCanvasSize : getCanvasSize,
        drawAll : drawAll,
        getButtonSpacing : getButtonSpacing
    }
} ());
