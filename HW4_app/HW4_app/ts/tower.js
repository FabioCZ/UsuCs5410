var ITower = (function () {
    function ITower(name, radius) {
        this.id = ++ITower.towerIdCt;
        this.name = name;
        this.x = -1;
        this.y = -1;
        this.radius = radius;
    }
    Object.defineProperty(ITower, "Ground1Name", {
        get: function () { return "Ground 1"; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ITower, "Ground2Name", {
        get: function () { return "Ground 2"; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ITower, "MixedName", {
        get: function () { return "Mixed"; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ITower, "AirName", {
        get: function () { return "Air"; },
        enumerable: true,
        configurable: true
    });
    ;
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
    ITower.getTowerType = function (name) {
        switch (name) {
            case ITower.Ground1Name:
                return new ITower(name, Game.baseTowerRadius);
                break;
            case ITower.Ground2Name:
                return new ITower(name, Game.baseTowerRadius);
                break;
            case ITower.MixedName:
                return new ITower(name, Game.baseTowerRadius);
                break;
            case ITower.AirName:
                return new ITower(name, Game.baseTowerRadius);
                break;
        }
    };
    ITower.towerIdCt = 0;
    return ITower;
})();
//# sourceMappingURL=Tower.js.map