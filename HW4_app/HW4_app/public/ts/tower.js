var AttackType;
(function (AttackType) {
    AttackType[AttackType["None"] = 0] = "None";
    AttackType[AttackType["Shot"] = 1] = "Shot";
    AttackType[AttackType["Missile"] = 2] = "Missile";
    AttackType[AttackType["Freeze"] = 3] = "Freeze";
})(AttackType || (AttackType = {}));
var Tower = (function () {
    function Tower(name, x, y) {
        if (x === void 0) { x = -1; }
        if (y === void 0) { y = -1; }
        if (name !== Tower.WallName)
            console.log('new tower ', x, ",", y);
        this.name = name;
        this.x = x;
        this.y = y;
        this.turretImg = new Image();
        this.baseImg = new Image();
        this.baseImg.src = "img/tower/turret-base.gif";
        this.upgradeLevel = 1;
        this.angleRad = 0;
        this.radius = Game.baseTowerRadius;
        switch (name) {
            case Tower.Ground1Name:
                this.tFileBaseName = "img/tower/turret-1";
                this.cost = 10;
                break;
            case Tower.Ground2Name:
                this.tFileBaseName = "img/tower/turret-2";
                this.cost = 15;
                break;
            case Tower.MixedName:
                this.tFileBaseName = "img/tower/turret-3";
                this.cost = 20;
                break;
            case Tower.AirName:
                this.cost = 15;
                this.tFileBaseName = "img/tower/turret-7";
                break;
            case Tower.WallName:
                this.radius = 0;
                this.baseImg.src = "img/wall.png";
                this.turretImg = null;
                break;
        }
        this.setTurretImage();
    }
    Object.defineProperty(Tower, "Ground1Name", {
        get: function () { return "Ground 1"; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Tower, "Ground2Name", {
        get: function () { return "Ground 2"; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Tower, "MixedName", {
        get: function () { return "Mixed"; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Tower, "AirName", {
        get: function () { return "Air"; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Tower, "WallName", {
        get: function () { return "Wall"; },
        enumerable: true,
        configurable: true
    });
    ;
    Tower.prototype.setTurretImage = function () {
        if (this.name === Tower.WallName)
            return;
        var name = this.tFileBaseName + "-" + this.upgradeLevel + ".png";
        this.turretImg.src = name;
    };
    Tower.prototype.upgrade = function () {
        if (this.upgradeLevel === 3)
            return;
        this.upgradeLevel++;
        console.log("tower upgraded to level ", this.upgradeLevel);
        this.setTurretImage();
        this.attack *= 4 / 3;
    };
    Tower.prototype.setCoords = function (x, y) {
        this.x = x;
        this.y = y;
    };
    Tower.prototype.isCollision = function (x, y, w, h) {
        return x > this.x &&
            y > this.y &&
            x < this.x + Game.towerSize &&
            y < this.y + Game.towerSize;
    };
    Tower.prototype.copy = function () {
        var r = new Tower(this.name, this.radius);
        for (var attribut in this) {
            r[attribut] = this[attribut];
        }
        return r;
    };
    Tower.prototype.draw = function (ctx, drawRadius) {
        if (drawRadius) {
            var old = ctx.globalAlpha;
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.arc(this.x + Game.towerSize / 2, this.y + Game.towerSize / 2, this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = Colors.Yellow;
            ctx.fill();
            ctx.globalAlpha = old;
        }
        if (this.name === Tower.WallName) {
            ctx.drawImage(this.baseImg, this.x - Game.towerSize * 0.2, this.y - Game.towerSize * 0.2, Game.towerSize * 1.4, Game.towerSize * 1.4);
            return;
        }
        ctx.save();
        ctx.translate(this.x + Game.towerSize / 2, this.y + Game.towerSize / 2);
        ctx.rotate(this.angleRad);
        ctx.translate(-(this.x + Game.towerSize / 2), -(this.y + Game.towerSize / 2));
        ctx.drawImage(this.turretImg, this.x, this.y, Game.towerSize, Game.towerSize);
        ctx.restore();
    };
    Tower.towerFactory = function (name, x, y) {
        return new Tower(name, x, y);
    };
    return Tower;
}());
//# sourceMappingURL=Tower.js.map