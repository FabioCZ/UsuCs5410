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
//# sourceMappingURL=Tools.js.map