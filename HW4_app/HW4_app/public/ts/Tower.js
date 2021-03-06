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
        this.targetAngleRad = 0;
        this.rotSpeed = 0.015;
        this.lastAttackTime = -50000;
        switch (name) {
            case Tower.Ground1Name:
                this.tFileBaseName = "img/tower/turret-2";
                this.radius = Game.towerSize * 2.5;
                this.cost = 15;
                this.coolDown = 500;
                break;
            case Tower.Ground2Name:
                this.tFileBaseName = "img/tower/turret-1";
                this.radius = Game.towerSize * 1.5;
                this.coolDown = 0;
                this.cost = 15;
                break;
            case Tower.MixedName:
                this.tFileBaseName = "img/tower/turret-3";
                this.radius = Game.towerSize * 3.5;
                this.coolDown = 400;
                this.cost = 20;
                break;
            case Tower.AirName:
                this.cost = 30;
                this.radius = Game.baseTowerRadius * 3;
                this.tFileBaseName = "img/tower/turret-7";
                this.coolDown = 500;
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
        get: function () { return "Bomb"; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Tower, "Ground2Name", {
        get: function () { return "Slow"; },
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
    Tower.prototype.upgrade = function (gs) {
        if (this.upgradeLevel === 3)
            return;
        if (gs._money < ~~(this.cost / 3)) {
            Sound.No.play();
            return;
        }
        gs._money -= ~~(this.cost / 3);
        Sound.Buy.play();
        this.upgradeLevel++;
        this.radius *= 1.2;
        this.coolDown *= 0.8;
        console.log("tower upgraded to level ", this.upgradeLevel);
        this.setTurretImage();
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
            ctx.drawImage(this.baseImg, this.x, this.y, Game.towerSize, Game.towerSize);
            return;
        }
        ctx.drawImage(this.baseImg, this.x - Game.towerSize * 0.2, this.y - Game.towerSize * 0.2, Game.towerSize * 1.4, Game.towerSize * 1.4);
        if (this.name === Tower.Ground2Name && !drawRadius) {
            var old = ctx.globalAlpha;
            ctx.globalAlpha = 0.4;
            ctx.beginPath();
            ctx.arc(this.x + Game.towerSize / 2, this.y + Game.towerSize / 2, this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = Colors.LtBlue;
            ctx.fill();
            ctx.globalAlpha = old;
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
    Tower.prototype.update = function (gs, delta) {
        var turningMode = false;
        if (Math.abs(this.angleRad - this.targetAngleRad) > 0.3) {
            if (this.rotatingCw) {
                this.angleRad += this.rotSpeed * delta;
            }
            else {
                this.angleRad -= this.rotSpeed * delta;
            }
            this.angleRad = this.angleRad % (2 * Math.PI);
            if (this.angleRad < 0) {
                this.angleRad += Math.PI * 2;
            }
            turningMode = true;
        }
        var closest = { index: -1, dist: 500000 };
        var tCX = this.x + Game.towerSize / 2;
        var tCY = this.y + Game.towerSize / 2;
        var slowed = false;
        for (var i = 0; i < gs._creep.length; i++) {
            if (gs._creep[i].state !== CreepState.Active)
                continue;
            var cCX = gs._creep[i].x + Game.towerSize / 2;
            var cCY = gs._creep[i].y + Game.towerSize / 2;
            var dist = Math.sqrt((cCX - tCX) * (cCX - tCX) + (cCY - tCY) * (cCY - tCY));
            if (dist < closest.dist) {
                if (this.name === Tower.AirName && gs._creep[i].type == CType.Air) {
                    closest = { index: i, dist: dist };
                }
                else if (this.name === Tower.Ground1Name && gs._creep[i].type !== CType.Air) {
                    closest = { index: i, dist: dist };
                }
                else if (this.name === Tower.MixedName) {
                    closest = { index: i, dist: dist };
                }
            }
            if (this.name === Tower.Ground2Name && dist < this.radius && gs._creep[i].type !== CType.Air) {
                gs._creep[i].slow(this.upgradeLevel + 1, gs.ElapsedTime);
                slowed = true;
            }
        }
        if (slowed)
            return;
        //commit rotation
        if (closest.index !== -1) {
            if (!turningMode &&
                (((this.name == Tower.MixedName || this.name == Tower.AirName) && gs._creep[closest.index].type === CType.Air) ||
                    ((this.name == Tower.MixedName || this.name == Tower.Ground1Name) && (gs._creep[closest.index].type === CType.Land1 || gs._creep[closest.index].type === CType.Land2 || gs._creep[closest.index].type === CType.Land3)))) {
                var x2 = gs._creep[closest.index].x + Game.towerSize / 2;
                var y2 = gs._creep[closest.index].y + Game.towerSize / 2;
                var newTargetAngleRad = Math.atan2((y2 - tCY), (x2 - tCX));
                newTargetAngleRad += Math.PI / 2;
                if (newTargetAngleRad > 2 * Math.PI) {
                    newTargetAngleRad -= (2 * Math.PI);
                }
                else if (newTargetAngleRad < 0) {
                    newTargetAngleRad += (2 * Math.PI);
                }
                if (Math.abs(this.angleRad - newTargetAngleRad) > 0.3) {
                    this.targetAngleRad = newTargetAngleRad;
                }
                var cwDist;
                if (this.targetAngleRad < this.angleRad) {
                    cwDist = 2 * Math.PI - this.targetAngleRad + this.angleRad;
                }
                else {
                    cwDist = this.angleRad - this.targetAngleRad;
                }
                var ccwDist;
                if (this.targetAngleRad > this.angleRad) {
                    ccwDist = 2 * Math.PI - this.targetAngleRad + this.angleRad;
                }
                else {
                    ccwDist = this.angleRad = this.targetAngleRad;
                }
                this.rotatingCw = cwDist < ccwDist;
            }
            if (this.lastAttackTime + this.coolDown > gs.ElapsedTime)
                return;
            if (Math.abs(this.angleRad - this.targetAngleRad) < 0.3) {
                if (closest.dist < this.radius) {
                    console.log("attack!");
                    var cX = gs._creep[closest.index].x;
                    var cY = gs._creep[closest.index].y;
                    switch (this.name) {
                        case Tower.Ground1Name:
                            if (gs._creep[closest.index].type !== CType.Air) {
                                Sound.Fire.play();
                                gs._projectiles.push(new Bomb(this.upgradeLevel, tCX, tCY, cX, cY));
                            }
                            break;
                        case Tower.Ground2Name:
                            //nothing here
                            break;
                        case Tower.MixedName:
                            Sound.Fire.play();
                            gs._projectiles.push(new MixedProj(this.upgradeLevel, tCX, tCY, cX, cY));
                            break;
                        case Tower.AirName:
                            if (gs._creep[closest.index].type == CType.Air) {
                                Sound.Fire.play();
                                var pr = new GuidedProj(this.upgradeLevel, tCX, tCY, cX, cY);
                                gs._projectiles.push(pr);
                                pr.setCreepIndex(closest.index);
                            }
                            break;
                    }
                    this.lastAttackTime = gs.ElapsedTime;
                }
            }
        }
    };
    return Tower;
}());
//# sourceMappingURL=Tower.js.map