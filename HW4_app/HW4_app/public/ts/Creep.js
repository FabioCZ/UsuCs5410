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
        this.speed = Game.towerSize / 40; //TODO
        this.isHorizontalPath = isHorizontalPath;
        this.entryTime = entryTime;
        this.state = CreepState.Waiting;
        this.type = type;
        this.hp = hp;
        this.maxHp = hp;
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
            var i = Game.xToI(this.x);
            var j = Game.yToJ(this.y);
            var dir = this.findNextCoord(i, j, this.isHorizontalPath);
            switch (dir) {
                case Dir.Up:
                    this.y -= this.speed * delta;
                    break;
                case Dir.Right:
                    this.x += this.speed * delta;
                    break;
                case Dir.Down:
                    this.y += this.speed * delta;
                    break;
                case Dir.Left:
                    this.x -= this.speed * delta;
                    break;
            }
        }
    };
    Creep.prototype.findNextCoord = function (currI, currJ, isHor) {
        if (isHor) {
            if (PathChecker.PathsHor[currI][currJ - 1] != undefined && PathChecker.PathsHor[currI][currJ - 1] === CellType.Path) {
                return Dir.Up;
            }
            else if (PathChecker.PathsHor[currI + 1] != undefined && PathChecker.PathsHor[currI + 1][currJ] === CellType.Path) {
                return Dir.Right;
            }
            if (PathChecker.PathsHor[currI][currJ + 1] != undefined && PathChecker.PathsHor[currI][currJ + 1] === CellType.Path) {
                return Dir.Down;
            }
            else if (PathChecker.PathsHor[currI - 1] != undefined && PathChecker.PathsHor[currI - 1][currJ] === CellType.Path) {
                return Dir.Left;
            }
            else {
                throw Error("ooops.");
            }
        }
        else {
            if (PathChecker.PathsVer[currI][currJ - 1] === CellType.Path) {
                return Dir.Up;
            }
            else if (PathChecker.PathsVer[currI + 1][currJ] === CellType.Path) {
                return Dir.Right;
            }
            if (PathChecker.PathsVer[currI][currJ + 1] === CellType.Path) {
                return Dir.Down;
            }
            else if (PathChecker.PathsVer[currI - 1][currJ] === CellType.Path) {
                return Dir.Left;
            }
            else {
                throw Error("ooops.");
            }
        }
    };
    return Creep;
}());
//# sourceMappingURL=Creep.js.map