
function drawBk(context, canvasSize) {
    var grd = context.createLinearGradient(0, 0, canvasSize.w, canvasSize.h);
    grd.addColorStop("0", "#9982AE");
    grd.addColorStop("0.5", "#05889A");
    grd.addColorStop("1.0", "#D30166");
    context.fillStyle = grd;
    context.fillRect(0, 0, canvasSize.w, canvasSize.h);
}

var KeyCode = {
    LEFT: 37,
    RIGHT: 39,
    SPACE: 32,
    DOWN: 40,
    UP: 38,
    RETURN: 13,
    ESCAPE: 27
}

//Courtesy of http://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas
CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
}

Gen = {};

//From class example
Gen.direction = function() {
    var angle = Math.random() * 2 * Math.PI;
    return {
        x: Math.cos(angle),
        y: Math.sin(angle)
    };
}

Gen.gaussianWithMidPoint = function(num) {
    var randNum = ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random())) / 3;
    return num * randNum;
}

/**
 * http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
