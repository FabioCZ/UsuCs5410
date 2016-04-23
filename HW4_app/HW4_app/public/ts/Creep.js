var CreepState;
(function (CreepState) {
    CreepState[CreepState["Waiting"] = 0] = "Waiting";
    CreepState[CreepState["Active"] = 1] = "Active";
    CreepState[CreepState["Done"] = 2] = "Done";
    CreepState[CreepState["Dead"] = 3] = "Dead";
})(CreepState || (CreepState = {}));
var CType;
(function (CType) {
    CType[CType["Air"] = 0] = "Air";
    CType[CType["Land1"] = 1] = "Land1";
    CType[CType["Land2"] = 2] = "Land2";
    CType[CType["Land3"] = 3] = "Land3";
})(CType || (CType = {}));
var Dir;
(function (Dir) {
    Dir[Dir["Up"] = 0] = "Up";
    Dir[Dir["Right"] = 1] = "Right";
    Dir[Dir["Down"] = 2] = "Down";
    Dir[Dir["Left"] = 3] = "Left";
})(Dir || (Dir = {}));
var Creep = (function () {
    //TODO visual
    function Creep(gs, isHorizontalPath, entryTime, type) {
        this.speed = Game.towerSize / 600; //TODO
        this.isHorizontalPath = isHorizontalPath;
        this.entryTime = entryTime;
        this.state = CreepState.Waiting;
        this.type = type;
        if (isHorizontalPath) {
            //TODO actual path
            this.lastDir = Dir.Left;
            this.y = Game.jToY(RandomBetween(6, 9));
            this.x = 0;
        }
        else {
            this.lastDir = Dir.Right;
            this.x = Game.iToX(RandomBetween(10, 14));
            this.y = 0;
        }
        switch (type) {
            case CType.Air:
                this.sprite = new Sprite("img/bat.png", 128);
                var i = Game.xToI(this.x);
                var j = Game.yToJ(this.y);
                this.path = isHorizontalPath ? PathChecker.AirPathsHor[i][j] : PathChecker.AirPathsVer[i][j];
                this.hp = 40;
                break;
            case CType.Land1:
                this.sprite = new Sprite("img/cow.png", 512);
                this.hp = 50;
                break;
            case CType.Land2:
                this.sprite = new Sprite("img/llama.png", 512);
                this.hp = 90;
                break;
            case CType.Land3:
                this.sprite = new Sprite("img/pig.png", 512);
                this.hp = 125;
                break;
        }
        this.maxHp = this.hp;
    }
    Object.defineProperty(Creep.prototype, "RatioHpLeft", {
        get: function () { return this.hp / this.maxHp; },
        enumerable: true,
        configurable: true
    });
    ;
    Creep.prototype.hit = function (damage) {
        this.hp -= damage;
        if (this.hp < 0) {
            this.state = CreepState.Dead;
        }
    };
    Creep.prototype.decrSpeed = function () {
        this.speed /= 2;
    };
    Creep.prototype.incrSpeed = function () {
        this.speed *= 2;
    };
    Creep.prototype.update = function (gs, delta) {
        if (this.entryTime < gs.ElapsedTime && this.state === CreepState.Waiting) {
            this.state = CreepState.Active;
        }
        if (this.state === CreepState.Active) {
            if (this.path == undefined || Game.newTowerPlaced || this.type !== CType.Air) {
                var i = Game.xToI(this.x);
                var j = Game.yToJ(this.y);
                this.path = PathChecker.getCreepPath(gs, i, j, this.isHorizontalPath).slice();
            }
            if (this.path.length > 1) {
                var curr = this.path[0];
                var next = this.path[1];
                if (next.i === curr.i + 1) {
                    this.lastDir = Dir.Right;
                    this.x += this.speed * delta;
                    if (this.x > Game.iToX(next.i)) {
                        this.x = Game.iToX(next.i);
                        this.path.splice(0, 1);
                    }
                }
                else if (next.i === curr.i - 1) {
                    this.lastDir = Dir.Left;
                    this.x -= this.speed * delta;
                    if (this.x < Game.iToX(next.i)) {
                        this.x = Game.iToX(next.i);
                        this.path.splice(0, 1);
                    }
                }
                else if (next.j === curr.j + 1) {
                    this.lastDir = Dir.Down;
                    this.y += this.speed * delta;
                    if (this.y > Game.jToY(next.j)) {
                        this.y = Game.jToY(next.j);
                        this.path.splice(0, 1);
                    }
                }
                else if (next.j === curr.j - 1) {
                    this.lastDir = Dir.Up;
                    this.y -= this.speed * delta;
                    if (this.y < Game.jToY(next.j)) {
                        this.y = Game.jToY(next.j);
                        this.path.splice(0, 1);
                    }
                }
                else {
                    throw ("error in creep path");
                }
            }
            else {
                this.state = CreepState.Done;
                return 1;
            }
        }
        return 0;
    };
    Creep.prototype.draw = function (ctx, delta) {
        if (this.state !== CreepState.Active)
            return;
        this.sprite.draw(ctx, this.x, this.y, this.lastDir, delta);
        //health bar
        ctx.fillStyle = Colors.LtGreen;
        ctx.fillRect(this.x, this.y - Game.towerSize / 10, this.RatioHpLeft * Game.towerSize, Game.towerSize / 10);
        ctx.fillStyle = Colors.Red;
        ctx.fillRect(this.RatioHpLeft, this.y - Game.towerSize / 10, (1 - this.RatioHpLeft) * Game.towerSize, Game.towerSize / 10);
    };
    return Creep;
}());
//# sourceMappingURL=Creep.js.map