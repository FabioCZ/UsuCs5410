enum CreepState {
    Waiting,
    Active,
    Done,
    Dead
}

enum CType {
    Air,
    Land1,
    Land2,
    Land3
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
    origSpeed:number;
    path: any;
    sprite: Sprite;
    lastDir: Dir;
    slowedTime : number;

    //TODO visual

    constructor(gs: Game, isHorizontalPath: boolean, entryTime: number, type: CType) {
        this.speed = Game.towerSize / 600;   //TODO
        this.origSpeed = this.speed;
        this.isHorizontalPath = isHorizontalPath;
        this.entryTime = entryTime;
        this.state = CreepState.Waiting;
        this.type = type;
        if (isHorizontalPath) {
            //TODO actual path
            this.lastDir = Dir.Left;
            this.y = Game.jToY(RandomBetween(6,9));
            this.x = 0;
        } else {
            this.lastDir = Dir.Right;
            this.x = Game.iToX(RandomBetween(10,14));
            this.y = Game.hudHeight;
        }
        switch (type) {
            case CType.Air:
                this.sprite = new Sprite("img/bat.png", 128);
                var i = Game.xToI(this.x);
                var j = Game.yToJ(this.y);
                this.path = !isHorizontalPath ? PathChecker.AirPathsHor[i][j] : PathChecker.AirPathsVer[i][j];  
                this.hp = 60;
                break;
            case CType.Land1:
                this.sprite = new Sprite("img/cow.png", 512);
                this.hp = 60;
                break;
            case CType.Land2:
                this.sprite = new Sprite("img/llama.png", 512);
                this.hp = 90;
                break;
            case CType.Land3:
                this.sprite = new Sprite("img/pig.png", 512);
                this.hp = 120;
                break;
        }
        this.maxHp = this.hp;
        this.slowedTime = -1;
    }

    public hit(damage: number, gs: Game) {
        if (this.hp < 0) return;
        this.hp -= damage;
        if (this.hp < 0) {
            this.state = CreepState.Dead;
            gs._money += ~~(this.maxHp/10);
            gs._score += ~~(this.maxHp / 5);
            FloatingScores.addScore(this.x, this.y, ~~(this.maxHp / 5), gs.ElapsedTime,false);
            Particles.addCreepExpl(gs.ElapsedTime, this.x + Game.towerSize / 2, this.y + Game.towerSize / 2);
            Sound.Death.play();
            this.x = -2;
            this.y = -2;
        }
    }

    public slow(ratio, currTime) {
        if (Math.abs(this.speed - this.origSpeed) < 0.01 && this.slowedTime === -1) {
            this.speed /= ratio;
            this.slowedTime = currTime;
        }
    }

    public update(gs: Game, delta: number): number {
        if (this.entryTime < gs.ElapsedTime && this.state === CreepState.Waiting) {
            this.state = CreepState.Active;
        }

        if (this.state === CreepState.Active) {
            if (this.slowedTime + 2000 < gs.ElapsedTime) {
                this.speed = this.origSpeed;
                this.slowedTime = -1;
            }
            if ((this.path == undefined || Game.newTowerPlaced) && this.type !== CType.Air) {
                var i = Game.xToI(this.x);
                var j = Game.yToJ(this.y);
                this.path = PathChecker.getCreepPath(gs, i, j, this.isHorizontalPath).slice();
            }
            if (this.path.length > 1) {
                var curr = this.path[0];
                var next = this.path[1];
                if (next.i === curr.i + 1) { //next right
                    this.lastDir = Dir.Right;
                    this.x += this.speed * delta;
                    if (this.x > Game.iToX(next.i)) {
                        this.x = Game.iToX(next.i);
                        this.path.splice(0, 1);
                    }
                } else if (next.i === curr.i - 1) { // next left
                    this.lastDir = Dir.Left;
                    this.x -= this.speed * delta;
                    if (this.x < Game.iToX(next.i)) {
                        this.x = Game.iToX(next.i);
                        this.path.splice(0, 1);
                    }
                } else if (next.j === curr.j + 1) { //next down
                    this.lastDir = Dir.Down;
                    this.y += this.speed * delta;
                    if (this.y > Game.jToY(next.j)) {
                        this.y = Game.jToY(next.j);
                        this.path.splice(0, 1);
                    }
                } else if (next.j === curr.j - 1) { // next up
                    this.lastDir = Dir.Up;
                    this.y -= this.speed * delta;
                    if (this.y < Game.jToY(next.j)) {
                        this.y = Game.jToY(next.j);
                        this.path.splice(0, 1);
                    }
                } else {
                    throw ("error in creep path");
                }
            } else {
                this.state = CreepState.Done;
                return 1;
            }
        }
        return 0;
    }

    public draw(ctx: CanvasRenderingContext2D, delta: number) {
        if (this.state !== CreepState.Active) return;
        this.sprite.draw(ctx, this.x, this.y, this.lastDir, delta,this.slowedTime !== -1);

        if (Math.abs(this.speed - this.origSpeed) > 0.01) {
            ctx.fillStyle = Colors.LtBlue;
            ctx.fillRect(this.x, this.y - Game.towerSize / 10, this.RatioHpLeft * Game.towerSize, Game.towerSize / 10);
            ctx.fillStyle = Colors.DarkBlue;
            ctx.fillRect(this.x + Game.towerSize - + (1 - this.RatioHpLeft) * Game.towerSize, this.y - Game.towerSize / 10, (1 - this.RatioHpLeft) * Game.towerSize, Game.towerSize / 10);
        } else {
            //health bar
            ctx.fillStyle = Colors.LtGreen;
            ctx.fillRect(this.x , this.y - Game.towerSize / 10, this.RatioHpLeft * Game.towerSize, Game.towerSize / 10);
            ctx.fillStyle = Colors.Red;
            ctx.fillRect(this.x + Game.towerSize - + (1 - this.RatioHpLeft) * Game.towerSize, this.y - Game.towerSize / 10, (1 - this.RatioHpLeft) * Game.towerSize, Game.towerSize / 10);
        }
    }
}