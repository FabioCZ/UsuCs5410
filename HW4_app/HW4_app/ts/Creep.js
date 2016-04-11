var CreepState;
(function (CreepState) {
    CreepState[CreepState["Waiting"] = 0] = "Waiting";
    CreepState[CreepState["Active"] = 1] = "Active";
    CreepState[CreepState["Done"] = 2] = "Done";
    CreepState[CreepState["Dead"] = 3] = "Dead";
})(CreepState || (CreepState = {}));
var Creep = (function () {
    //TODO visual
    function Creep(gs, isHorizontalPath, entryTime) {
        this.speed = Game.towerSize / 40; //TODO
        this.isHorizontalPath = isHorizontalPath;
        this.entryTime = entryTime;
        this.state = CreepState.Waiting;
        if (isHorizontalPath) {
            //TODO actual path
            var j = RandomBetween(11, 21);
            this.path = new Array();
            for (var i = 0; i < 50; i++) {
                this.path.push(new Coord(i, j));
                if (i === 10) {
                    j--;
                    this.path.push(new Coord(i, j));
                }
            }
            this.currCoord = 0;
            this.x = 0;
            this.y = Game.jToY(j);
        }
        else {
        }
    }
    Creep.prototype.update = function (gs) {
        if (this.entryTime < gs.ElapsedTime && this.state === CreepState.Waiting) {
            console.log(this.entryTime);
            this.state = CreepState.Active;
        }
        if (this.state === CreepState.Active) {
            if (this.currCoord < this.path.length - 1) {
                var curr = this.path[this.currCoord];
                var next = this.path[this.currCoord + 1];
                if (next.x === curr.x + 1) {
                    this.x += this.speed;
                    if (this.x > Game.iToX(next.x)) {
                        console.log('coord transition to ', next.x);
                        this.x = Game.iToX(next.x);
                        this.currCoord++;
                    }
                }
                else if (next.x === curr.x - 1) {
                    this.x -= this.speed;
                    if (this.x < Game.iToX(next.x)) {
                        this.x = Game.iToX(next.x);
                        this.currCoord++;
                    }
                }
                else if (next.y === curr.y + 1) {
                    this.y += this.speed;
                    if (this.y > Game.jToY(next.y)) {
                        this.y = Game.jToY(next.y);
                        this.currCoord++;
                    }
                }
                else if (next.y === curr.y - 1) {
                    console.log('up to ', next.y);
                    this.y -= this.speed;
                    if (this.y < Game.jToY(next.y)) {
                        this.y = Game.jToY(next.y);
                        this.currCoord++;
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