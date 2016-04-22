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
    public get RatioHpLeft() { return this.hp/this.maxHp};
    speed: number;
    currCoord : number;

    //TODO visual

    constructor(gs: Game, isHorizontalPath: boolean, entryTime: number, type:CType,hp:number) {
        this.speed = Game.towerSize / 40;   //TODO
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

    public update(gs: Game,delta: number) {
        if (this.entryTime < gs.ElapsedTime && this.state === CreepState.Waiting) {
            this.state = CreepState.Active;
        }

        if (this.state === CreepState.Active) {
            var i = Game.xToI(this.x);
            var j = Game.yToJ(this.y);

            var dir = this.findNextCoord(i, j, this.isHorizontalPath);

            switch(dir) {
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
    }

    public findNextCoord(currI: number, currJ: number, isHor: boolean): Dir {
        if (isHor) {
            if (PathChecker.PathsHor[currI][currJ - 1] != undefined && PathChecker.PathsHor[currI][currJ - 1] === CellType.Path) {
                return Dir.Up;
                //return new ArCoord(currI, currJ - 1);
            } else if (PathChecker.PathsHor[currI + 1] != undefined && PathChecker.PathsHor[currI + 1][currJ] === CellType.Path) {
                return Dir.Right;
                 //return new ArCoord(currI + 1, currJ);
            } if (PathChecker.PathsHor[currI][currJ + 1] != undefined && PathChecker.PathsHor[currI][currJ + 1] === CellType.Path) {
                return Dir.Down;
                //return new ArCoord(currI, currJ + 1);
            } else if (PathChecker.PathsHor[currI - 1] != undefined && PathChecker.PathsHor[currI - 1][currJ] === CellType.Path) {
                return Dir.Left;
                //return new ArCoord(currI - 1, currJ);
            } else {
                throw Error("ooops.");
            }
        } else {
            if (PathChecker.PathsVer[currI][currJ - 1] === CellType.Path) {
                return Dir.Up;
                //return new ArCoord(currI, currJ - 1);
            } else if (PathChecker.PathsVer[currI + 1][currJ] === CellType.Path) {
                return Dir.Right;
                //return new ArCoord(currI + 1, currJ);
            } if (PathChecker.PathsVer[currI][currJ + 1] === CellType.Path) {
                return Dir.Down;
                //return new ArCoord(currI, currJ + 1);
            } else if (PathChecker.PathsVer[currI - 1][currJ] === CellType.Path) {
                return Dir.Left;
                //return new ArCoord(currI - 1, currJ);
            } else {
                throw Error("ooops.");
            }
        }
    }
}