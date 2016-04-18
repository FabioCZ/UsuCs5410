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
            var j = RandomBetween(11, 20);
            this.y = Game.jToY(j);
            this.x = 0;
        }
        else {
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
    Creep.prototype.update = function (gs, recalcPath) {
        if (this.entryTime < gs.ElapsedTime && this.state === CreepState.Waiting) {
            //console.log(this.entryTime);
            this.state = CreepState.Active;
        }
        if (this.state === CreepState.Active) {
            if (this.path.length === null || recalcPath) {
            }
            if (this.path.length > 1) {
                var curr = this.path[0];
                var next = this.path[1];
                if (next.i === curr.i + 1) {
                    this.x += this.speed;
                    if (this.x > Game.iToX(next.i)) {
                        this.x = Game.iToX(next.i);
                        this.path.splice(0, 1);
                    }
                }
                else if (next.i === curr.i - 1) {
                    this.x -= this.speed;
                    if (this.x < Game.iToX(next.i)) {
                        this.x = Game.iToX(next.i);
                        this.path.splice(0, 1);
                    }
                }
                else if (next.j === curr.j + 1) {
                    this.y += this.speed;
                    if (this.y > Game.jToY(next.j)) {
                        this.y = Game.jToY(next.j);
                        this.path.splice(0, 1);
                    }
                }
                else if (next.j === curr.j - 1) {
                    this.y -= this.speed;
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
            }
        }
    };
    return Creep;
}());
//# sourceMappingURL=Creep.js.map