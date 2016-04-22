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
    CType[CType["Land"] = 1] = "Land";
    CType[CType["Mixed"] = 2] = "Mixed";
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
    function Creep(gs, isHorizontalPath, entryTime, type, hp) {
        this.speed = Game.towerSize / 400; //TODO
        this.isHorizontalPath = isHorizontalPath;
        this.entryTime = entryTime;
        this.state = CreepState.Waiting;
        this.type = type;
        this.hp = hp;
        this.maxHp = hp;
        this.path = this.isHorizontalPath ? PathChecker.PathsHor : PathChecker.PathsVer;
        this.isCustompath = false;
        if (isHorizontalPath) {
            //TODO actual path
            this.y = Game.jToY(16);
            this.x = 0;
        }
        else {
            this.x = Game.iToX(25);
            this.y = 0;
        }
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
            var currI = Game.xToI(this.x + Game.towerSize - 0.001);
            var currJ = Game.yToJ(this.y + Game.towerSize - 0.001);
            if (this.isCustompath && Game.newPlacement) {
                this.path = PathChecker.setCreepPath(gs, currI, currJ, this.isHorizontalPath, true); //path changing due to new towers, get new custom path
            }
            else {
                this.path = this.isHorizontalPath ? PathChecker.PathsHor : PathChecker.PathsVer;
            }
            var succ = false;
            while (!succ) {
                if (this.path[currI][currJ - 1] != undefined && this.path[currI][currJ - 1] === CellType.Path) {
                    this.y -= this.speed * delta;
                    if (this.y < Game.jToY(currJ - 1))
                        this.y = Game.jToY(currJ - 1);
                    succ = true;
                }
                else if (this.path[currI + 1] != undefined && this.path[currI + 1][currJ] === CellType.Path) {
                    this.x += this.speed * delta;
                    if (this.x > Game.iToX(currI + 1))
                        this.x = Game.iToX(currI + 1);
                    succ = true;
                }
                else if (this.path[currI][currJ + 1] != undefined && this.path[currI][currJ + 1] === CellType.Path) {
                    this.y += this.speed * delta;
                    if (this.y > Game.jToY(currJ + 1))
                        this.y = Game.jToY(currJ + 1);
                    succ = true;
                }
                else if (this.path[currI - 1] != undefined && this.path[currI - 1][currJ] === CellType.Path) {
                    this.x -= this.speed * delta;
                    if (this.x < Game.iToX(currI - 1))
                        this.x = Game.iToX(currI - 1);
                    succ = true;
                }
                else {
                    if (!this.isCustompath) {
                        console.log('custom path');
                        this.path = PathChecker.setCreepPath(gs, currI, currJ, this.isHorizontalPath, true); //path changing due to new towers, get new custom path
                        this.isCustompath = true;
                    }
                    else {
                        this.path = this.isHorizontalPath ? PathChecker.PathsHor : PathChecker.PathsVer;
                        this.isCustompath = false;
                    }
                }
            }
        }
    };
    return Creep;
}());
//# sourceMappingURL=Creep.js.map