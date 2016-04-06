var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var towerIdCt = 0;
var ITower = (function () {
    function ITower(name, radius) {
        this.id = ++towerIdCt;
        this.name = name;
        this.x = -1;
        this.y = -1;
        this.radius = radius;
    }
    ITower.prototype.setCoords = function (x, y) {
        this.x = x;
        this.y = y;
    };
    ITower.prototype.isCollision = function (x, y, w, h) {
        return x > this.x &&
            y > this.y &&
            x < this.x + Game.towerSize &&
            y < this.y + Game.towerSize;
    };
    ITower.prototype.copy = function () {
        var r = new ITower(this.name, this.radius);
        for (var attribut in this) {
            r[attribut] = this[attribut];
        }
        return r;
    };
    return ITower;
}());
var TwGroundOne = (function (_super) {
    __extends(TwGroundOne, _super);
    function TwGroundOne() {
        _super.call(this, "Ground 1", Game.baseTowerRadius);
    }
    return TwGroundOne;
}(ITower));
var TwGroundTwo = (function (_super) {
    __extends(TwGroundTwo, _super);
    function TwGroundTwo() {
        _super.call(this, "Ground 2", Game.baseTowerRadius);
    }
    return TwGroundTwo;
}(ITower));
var TwAir = (function (_super) {
    __extends(TwAir, _super);
    function TwAir() {
        _super.call(this, "Air", Game.baseTowerRadius * 1.5);
    }
    return TwAir;
}(ITower));
var TwMixed = (function (_super) {
    __extends(TwMixed, _super);
    function TwMixed() {
        _super.call(this, "Mixed", Game.baseTowerRadius);
    }
    return TwMixed;
}(ITower));
//# sourceMappingURL=Tower.js.map