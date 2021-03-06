var Rect = (function () {
    function Rect(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    return Rect;
}());
var Pair = (function () {
    function Pair(f, s) {
        this.first = f;
        this.second = s;
    }
    return Pair;
}());
var ArCoord = (function () {
    function ArCoord(i, j) {
        this.i = i;
        this.j = j;
    }
    return ArCoord;
}());
var Coord = (function () {
    function Coord(x, y) {
        this.x = x;
        this.y = y;
    }
    return Coord;
}());
function IsCoordInRect(r, x, y) {
    return (x <= r.x + r.w && x >= r.x && y <= r.y + r.h && y >= r.y);
}
function RandomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function clone(obj) {
    var cloneObj = new (obj.constructor());
    for (var attribut in obj) {
        if (typeof obj[attribut] === "object") {
            cloneObj[attribut] = obj.clone();
        }
        else {
            cloneObj[attribut] = obj[attribut];
        }
    }
    return cloneObj;
}
function drawBk(context) {
    var canvasSize = { w: context.canvas.clientWidth, h: context.canvas.clientHeight };
    var grd = context.createLinearGradient(0, 0, canvasSize.w, canvasSize.h);
    grd.addColorStop(0, "#9982AE");
    grd.addColorStop(0.5, "#05889A");
    grd.addColorStop(1.0, "#D30166");
    context.fillStyle = grd;
    context.fillRect(0, 0, canvasSize.w, canvasSize.h);
}
function gaussianWithMidPoint(num) {
    var randNum = ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random())) / 3;
    return num * randNum;
}
function direction() {
    var angle = Math.random() * 2 * Math.PI;
    return {
        x: Math.cos(angle),
        y: Math.sin(angle)
    };
}
//# sourceMappingURL=Tools.js.map