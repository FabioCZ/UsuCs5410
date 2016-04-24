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
            this.explRadius = Game.towerSize * 1;
        } else if (level === 2) {
            this.attack = 20;
            this.speed = Game.towerSize / 100;
            this.explRadius = Game.towerSize * 1.5;

        } else { //==3
            this.attack = 30;
            this.speed = Game.towerSize / 50;
            this.explRadius = Game.towerSize * 2.5;

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
        Particles.addTrace(gs.ElapsedTime, this.currX, this.currY);

        if (this.elapsedDist >= this.targetDist) {
            Sound.Hit.play();
            for (var i = 0; i < gs.Creep.length; i++) {
                var c = gs.Creep[i];
                if(c.type === CType.Air || c.state !== CreepState.Active) continue;
                if (Math.sqrt((c.x - this.currX) * (c.x - this.currX) + (c.y - this.currY) * (c.y - this.currY)) < this.explRadius) {
                    c.hit(this.attack, gs);
                }
            }
            Particles.addProjExpl(gs.ElapsedTime,this.currX,this.currY);
            return true;
        }
        return false;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = Colors.Black;
        ctx.fillRect(this.currX, this.currY, 5, 5);
    }
}


class MixedProj implements IProjectile {
    public attack: number;
    public speed: number;
    public fromX: number;
    public fromY: number;
    public currX: number;
    public currY: number;
    public vX: number;
    public vY: number;
    public targetDist: number;
    public elapsedDist: number;

    constructor(level, fromX, fromY, toX, toY) {
        if (level === 1) {
            this.attack = 20;
            this.speed = Game.towerSize / 200;
        } else if (level === 2) {
            this.attack = 40;
            this.speed = Game.towerSize / 100;

        } else { //==3
            this.attack = 60;
            this.speed = Game.towerSize / 50;

        }
        this.fromX = fromX;
        this.fromY = fromY;
        toX = toX + Game.towerSize / 2;
        toY = toY + Game.towerSize / 2;
        this.currX = fromX;
        this.currY = fromY;

        this.targetDist = level === 1 ? Game.baseTowerRadius : (level === 2 ? Game.baseTowerRadius * 1.25 : Game.baseTowerRadius * 1.25 * 1.25);
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

    update(gs: Game, delta: number) {
        var dX = this.vX * this.speed * delta;
        var dY = this.vY * this.speed * delta;
        this.elapsedDist += this.speed * delta;
        this.currX += dX;
        this.currY += dY;
        Particles.addTrace(gs.ElapsedTime, this.currX, this.currY);

        if (this.elapsedDist > this.targetDist) {
            Particles.addProjExpl(gs.ElapsedTime,this.currX,this.currY);
            return true;
        }

        for (var i = 0; i < gs._creep.length; i++) {
            var c = gs._creep[i];
            if (this.currX > c.x && this.currX < c.x + Game.towerSize && this.currY > c.y && this.currY < c.y + Game.towerSize) {
                c.hit(this.attack,gs);
                Sound.Hit.play();
                Particles.addProjExpl(gs.ElapsedTime,this.currX,this.currY);
                return true;
            }
        }
        return false;
    }

    draw(ctx: CanvasRenderingContext2D) {}
}

class GuidedProj implements IProjectile {
    public attack: number;
    public speed: number;
    public fromX: number;
    public fromY: number;
    public currX: number;
    public currY: number;
    public targetCreepIndex: number;
    public path: Array<ArCoord>;
    public tCI: number;
    public tCJ:number;
    constructor(level, fromX, fromY, toX, toY) {
        if (level === 1) {
            this.attack = 20;
            this.speed = Game.towerSize / 200;
        } else if (level === 2) {
            this.attack = 40;
            this.speed = Game.towerSize / 100;

        } else { //==3
            this.attack = 60;
            this.speed = Game.towerSize / 50;

        }
        this.fromX = fromX;
        this.fromY = fromY;
        this.currX = fromX;
        this.currY = fromY;
        this.tCI = -10;
        this.tCJ = -10;
    }

    setCreepIndex(cI: number) {
        this.targetCreepIndex = cI;
    }

    update(gs: Game, delta: number) {
        var c = gs._creep[this.targetCreepIndex];
        var cCI = Game.xToI(c.x);
        var cCJ = Game.yToJ(c.y);
        if (this.tCI != cCI || this.tCJ != cCJ) {   //only recalc path if we need to
            this.path = PathChecker.getGuidedProjPath(Game.xToI(this.currX), Game.yToJ(this.currY), cCI, cCJ);
        }

    }

    draw(ctx: CanvasRenderingContext2D) {}
}

