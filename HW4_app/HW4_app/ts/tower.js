var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ITower = (function () {
    function ITower(name) {
        this.name = name;
    }
    return ITower;
}());
var TwGroundOne = (function (_super) {
    __extends(TwGroundOne, _super);
    function TwGroundOne() {
        this.radius = 5;
        _super.call(this, "Grnd2");
    }
    return TwGroundOne;
}(ITower));
var TwGroundTwo = (function (_super) {
    __extends(TwGroundTwo, _super);
    function TwGroundTwo() {
        _super.call(this, "Grnd1");
    }
    return TwGroundTwo;
}(ITower));
var TwAir = (function (_super) {
    __extends(TwAir, _super);
    function TwAir() {
        _super.call(this, "Air");
    }
    return TwAir;
}(ITower));
var TwMixed = (function (_super) {
    __extends(TwMixed, _super);
    function TwMixed() {
        _super.call(this, "Mixed");
    }
    return TwMixed;
}(ITower));
//# sourceMappingURL=Tower.js.map