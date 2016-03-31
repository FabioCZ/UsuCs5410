var Tower = (function () {
    function Tower(x, y) {
        this.x = x;
        this.y = y;
    }
    return Tower;
}());
var TowerType;
(function (TowerType) {
    TowerType[TowerType["One"] = 0] = "One";
    TowerType[TowerType["Two"] = 1] = "Two";
    TowerType[TowerType["Three"] = 2] = "Three";
})(TowerType || (TowerType = {}));
//# sourceMappingURL=Tower.js.map