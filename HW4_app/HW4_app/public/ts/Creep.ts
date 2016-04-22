enum CreepState {
    Waiting,
    Active,
    Done,
    Dead
}

enum CType {
    Air,
    Land,
    Mixed
}

enum Dir {
    Up,
    Right,
    Down,
    Left
}
class Creep {
    entryTime: number;
    state: CreepState;
    type: CType;
    isHorizontalPath: boolean;
    x: number;
    y: number;
    hp: number;
    maxHp: number;
    public get RatioHpLeft() { return this.hp / this.maxHp };
    speed: number;
    path: any;
    isCustompath : boolean;

    //TODO visual

    constructor(gs: Game, isHorizontalPath: boolean, entryTime: number, type: CType, hp: number) {
        this.speed = Game.towerSize / 400;   //TODO
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
        } else {
            this.x = Game.iToX(25
            );
            this.y = 0;
        }

    }

    public hit(damage: number) {
        this.hp -= damage;
        if (this.hp < 0) {
            this.state = CreepState.Dead;
        }
    }

    public decrSpeed() {
        this.speed /= 2;
    }

    public incrSpeed() {
        this.speed *= 2;
    }

    public update(gs: Game, delta: number) {
        if (this.entryTime < gs.ElapsedTime && this.state === CreepState.Waiting) {
            this.state = CreepState.Active;
        }

        if (this.state === CreepState.Active) {
            var currI = Game.xToI(this.x + Game.towerSize - 0.001);
            var currJ = Game.yToJ(this.y + Game.towerSize - 0.001);
            if (this.isCustompath && Game.newPlacement) {
                this.path = PathChecker.setCreepPath(gs, currI, currJ, this.isHorizontalPath, true); //path changing due to new towers, get new custom path
            } else {
                this.path = this.isHorizontalPath ? PathChecker.PathsHor : PathChecker.PathsVer;
            }

            var succ = false;
            while (!succ) {
                
                if (this.path[currI][currJ - 1] != undefined && this.path[currI][currJ - 1] === CellType.Path) {
                    this.y -= this.speed * delta;
                    if (this.y < Game.jToY(currJ - 1)) this.y = Game.jToY(currJ - 1);
                    succ = true;
                } else if (this.path[currI + 1] != undefined && this.path[currI + 1][currJ] === CellType.Path) {
                    this.x += this.speed * delta;
                    if (this.x > Game.iToX(currI + 1)) this.x = Game.iToX(currI + 1);
                    succ = true;
                } else if (this.path[currI][currJ + 1] != undefined && this.path[currI][currJ + 1] === CellType.Path) {
                    this.y += this.speed * delta;
                    if (this.y > Game.jToY(currJ + 1)) this.y = Game.jToY(currJ + 1);
                    succ = true;
                } else if (this.path[currI - 1] != undefined && this.path[currI - 1][currJ] === CellType.Path) {
                    this.x -= this.speed * delta;
                    if (this.x < Game.iToX(currI - 1)) this.x = Game.iToX(currI - 1);
                    succ = true;
                } else {
                    if (!this.isCustompath) {
                        console.log('custom path');
                        this.path = PathChecker.setCreepPath(gs, currI, currJ, this.isHorizontalPath, true); //path changing due to new towers, get new custom path
                        this.isCustompath = true;
                    } else {
                        this.path = this.isHorizontalPath ? PathChecker.PathsHor : PathChecker.PathsVer;
                        this.isCustompath = false;
                    }
                }
        }
    }
}
}