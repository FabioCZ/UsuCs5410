interface IProjectile {
    update(gs: Game, delta: number);
    draw(ctx: CanvasRenderingContext2D);
}

class Bomb implements IProjectile {
    public attack: number;
    public speed: number;
    public explRadius: number;
    public fromX: number;
    public fromY: number;
    public currX: number;
    public currY: number;
    public vX: number;
    public vY: number;
    public targetDist: number;
    public elapsedDist:number;

    constructor(level, fromX, fromY, toX, toY) {
        if (level === 1) {
            this.attack = 10;
            this.speed = Game.towerSize / 200;
            this.explRadius = Game.towerSize * 1.5;
        } else if (level === 2) {
            this.attack = 20;
            this.speed = Game.towerSize / 100;
            this.explRadius = Game.towerSize * 2.5;

        } else { //==3
            this.attack = 30;
            this.speed = Game.towerSize / 50;
            this.explRadius = Game.towerSize * 3.5;

        }
        this.fromX = fromX;
        this.fromY = fromY;
        toX = toX + Game.towerSize / 2;
        toY = toY + Game.towerSize / 2;
        this.currX = fromX;
        this.currY = fromY;

        this.targetDist = Math.sqrt((fromX - toX) * (fromX - toX) + (fromY - toY) * (fromY - toY));
        this.elapsedDist = 0;
        var targetAngleRad = Math.atan2((toY - fromY), (toX - fromX));
        //targetAngleRad += Math.PI / 2;
        if (targetAngleRad > 2 * Math.PI) {
            targetAngleRad -= (2 * Math.PI);
        } else if (targetAngleRad < 0) {
            targetAngleRad += (2 * Math.PI);

        }
        this.vX = Math.cos(targetAngleRad);
        this.vY = Math.sin(targetAngleRad);
    }

    update(gs: Game, delta: number): boolean {
        var dX = this.vX * this.speed * delta;
        var dY = this.vY * this.speed * delta;
        this.elapsedDist += this.speed * delta;
        this.currX += dX;
        this.currY += dY;

        if (this.elapsedDist >= this.targetDist) {
            for (var i = 0; i < gs.Creep.length; i++) {
                var c = gs.Creep[i];
                if (Math.sqrt((c.x - this.currX) * (c.x - this.currX) + (c.y - this.currY) * (c.y - this.currY)) < this.explRadius) {
                    c.hit(this.attack, gs);
                }
            }
            //TODO commit explosion
            return true;
        }
        return false;

    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = Colors.Black;
        ctx.fillRect(this.currX, this.currY, 5, 5);
    }
}