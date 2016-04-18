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
    path: Array<ArCoord>;
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
            var j = RandomBetween(11, 20);

            this.y = Game.jToY(j);
            this.x = 0;
            //this.path = new Array<ArCoord>();
            //for (var i = 0; i <  50; i++) {
            //    this.path.push(new ArCoord(i, j));
            //}
        } else {
            //TODO ver
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

    public update(gs: Game,recalcPath:boolean) {
        if (this.entryTime < gs.ElapsedTime && this.state === CreepState.Waiting) {
            //console.log(this.entryTime);
            this.state = CreepState.Active;
        }

        if (this.state === CreepState.Active) {
            if (this.path.length === null || recalcPath) {
                //TODO calc path
            }
            if (this.path.length > 1) {
                var curr = this.path[0];
                var next = this.path[1];
                if (next.i === curr.i + 1) { //next right
                    this.x += this.speed;
                    if (this.x > Game.iToX(next.i)) {
                        this.x = Game.iToX(next.i);
                        this.path.splice(0,1);
                    }
                } else if (next.i === curr.i - 1) { // next left
                    this.x -= this.speed;
                    if (this.x < Game.iToX(next.i)) {
                        this.x = Game.iToX(next.i);
                        this.path.splice(0, 1);
                    }
                } else if (next.j === curr.j + 1) { //next down
                    this.y += this.speed;
                    if (this.y > Game.jToY(next.j)) {
                        this.y = Game.jToY(next.j);
                        this.path.splice(0, 1);
                    }
                } else if (next.j === curr.j - 1) { // next up
                    this.y -= this.speed; 
                    if (this.y < Game.jToY(next.j)) {
                        this.y = Game.jToY(next.j);
                        this.path.splice(0, 1);
                    }
                } else {
                    throw ("error in creep path");
                }
            } else{
                this.state = CreepState.Done;
            }
        }

    }
}