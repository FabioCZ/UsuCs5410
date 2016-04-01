var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var towerIdCt = 0;
var ITower = (function () {
    function ITower(name) {
        this.id = ++towerIdCt;
        this.name = name;
        this.x = -1;
        this.y = -1;
        this.radius = 50;
    }
    ITower.prototype.setCoords = function (x, y) {
        this.x = x;
        this.y = y;
    };
    return ITower;
})();
var TwGroundOne = (function (_super) {
    __extends(TwGroundOne, _super);
    function TwGroundOne() {
        this.radius = 5;
        _super.call(this, "Ground 1");
    }
    return TwGroundOne;
})(ITower);
var TwGroundTwo = (function (_super) {
    __extends(TwGroundTwo, _super);
    function TwGroundTwo() {
        _super.call(this, "Ground 2");
    }
    return TwGroundTwo;
})(ITower);
var TwAir = (function (_super) {
    __extends(TwAir, _super);
    function TwAir() {
        _super.call(this, "Air");
    }
    return TwAir;
})(ITower);
var TwMixed = (function (_super) {
    __extends(TwMixed, _super);
    function TwMixed() {
        _super.call(this, "Mixed");
    }
    return TwMixed;
})(ITower);
//# sourceMappingURL=Tower.js.map