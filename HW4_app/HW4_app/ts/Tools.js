var Rect = (function () {
    function Rect(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    return Rect;
})();
var Coord = (function () {
    function Coord(x, y) {
        this.x = x;
        this.y = y;
    }
    return Coord;
})();
function isClickIn(r, x, y) {
    return (x <= r.x + r.w && x >= r.x && y <= r.y + r.h && y >= r.y);
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