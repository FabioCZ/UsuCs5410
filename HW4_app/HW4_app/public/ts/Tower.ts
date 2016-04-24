﻿enum AttackType {
    None,
    Shot,
    Missile,
    Freeze
}
class Tower {
    public x: number;
    public y: number;
    public angleRad: number;
    public targetAngleRad: number;
    public rotSpeed: number;
    public rotatingCw: boolean;

    public radius: number;
    public name: string;
    public cost: number;
    public upgradeLevel: number;
    public coolDown: number;
    public lastAttackTime: number;
    public baseImg: any;
    public turretImg: any;
    public tFileBaseName: any;

    static get Ground1Name(): string { return "Bomb" };
    static get Ground2Name(): string { return "Slow" };
    static get MixedName(): string { return "Mixed" };
    static get AirName(): string { return "Air" };
    static get WallName(): string { return "Wall" };


    constructor(name: string, x = -1, y = -1) {
        if (name !== Tower.WallName) console.log('new tower ', x, ",", y);
        this.name = name;
        this.x = x;
        this.y = y;
        this.turretImg = new Image();
        this.baseImg = new Image();
        this.baseImg.src = "img/tower/turret-base.gif";
        this.upgradeLevel = 1;
        this.angleRad = 0;
        this.targetAngleRad = 0;
        this.rotSpeed = 0.2;
        this.lastAttackTime = -50000;
        switch (name) {
            case Tower.Ground1Name:
                this.tFileBaseName = "img/tower/turret-2";
                this.radius = Game.towerSize * 2.5;
                this.cost = 10;
                this.coolDown = 500;
                break;
            case Tower.Ground2Name:
                this.tFileBaseName = "img/tower/turret-1";
                this.radius = Game.towerSize * 1.5;
                this.coolDown = 0;
                this.cost = 15;
                break;
            case Tower.MixedName:
                this.tFileBaseName = "img/tower/turret-3";
                this.radius = Game.baseTowerRadius;
                this.coolDown = 500;
                this.cost = 20;
                break;
            case Tower.AirName:
                this.cost = 15;
                this.radius = Game.baseTowerRadius * 2;
                this.tFileBaseName = "img/tower/turret-7";
                this.coolDown = 500;
                break;
            case Tower.WallName:
                this.radius = 0;
                this.baseImg.src = "img/wall.png";
                this.turretImg = null;
                break;
        }
        this.setTurretImage();
    }

    public setTurretImage() {
        if (this.name === Tower.WallName) return;
        var name = this.tFileBaseName + "-" + this.upgradeLevel + ".png";
        this.turretImg.src = name;
    }

    public upgrade() {
        if (this.upgradeLevel === 3) return;
        this.upgradeLevel++;
        this.radius *= 1.5;
        this.coolDown *= 0.75;
        console.log("tower upgraded to level ", this.upgradeLevel);
        this.setTurretImage();
    }


    public setCoords(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public isCollision(x: number, y: number, w: number, h: number) {
        return x > this.x &&
            y > this.y &&
            x < this.x + Game.towerSize &&
            y < this.y + Game.towerSize;
    }

    public copy(): Tower {
        var r = new Tower(this.name, this.radius);
        for (var attribut in this) {
            r[attribut] = this[attribut];
        }
        return r;
    }

    public draw(ctx: CanvasRenderingContext2D, drawRadius: boolean) {
        if (drawRadius) {
            var old = ctx.globalAlpha;
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.arc(this.x + Game.towerSize / 2, this.y + Game.towerSize / 2, this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = Colors.Yellow;
            ctx.fill();
            ctx.globalAlpha = old;
        }
        if (this.name === Tower.WallName) {
            ctx.drawImage(this.baseImg, this.x, this.y, Game.towerSize, Game.towerSize);
            return;
        }
        if (this.name === Tower.Ground2Name && !drawRadius) { //slow tower
            var old = ctx.globalAlpha;
            ctx.globalAlpha = 0.4;
            ctx.beginPath();
            ctx.arc(this.x + Game.towerSize / 2, this.y + Game.towerSize / 2, this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = Colors.LtBlue;
            ctx.fill();
            ctx.globalAlpha = old;
        }
        ctx.save();
        ctx.translate(this.x + Game.towerSize / 2, this.y + Game.towerSize / 2);
        ctx.rotate(this.angleRad);
        ctx.translate(-(this.x + Game.towerSize / 2), -(this.y + Game.towerSize / 2));
        ctx.drawImage(this.turretImg, this.x, this.y, Game.towerSize, Game.towerSize);
        ctx.restore();

    }

    static towerFactory(name: string, x?: number, y?: number): Tower {
        return new Tower(name, x, y);
    }

    public update(gs: Game) {
        var turningMode = false;
        if (Math.abs(this.angleRad - this.targetAngleRad) > 0.3) {
            if (this.rotatingCw) {
                this.angleRad += this.rotSpeed;

            } else {
                this.angleRad -= this.rotSpeed;
            }

            this.angleRad = this.angleRad % (2 * Math.PI);
            if (this.angleRad < 0) {
                this.angleRad += Math.PI * 2;
            }

            turningMode = true;
        }
        var closest = { index: -1, dist: 500000 };
        var tCX = this.x + Game.towerSize / 2;
        var tCY = this.y + Game.towerSize / 2;


        for (var i = 0; i < gs._creep.length; i++) {
            if (gs._creep[i].state !== CreepState.Active) continue;
            var cCX = gs._creep[i].x + Game.towerSize / 2;
            var cCY = gs._creep[i].y + Game.towerSize / 2;
            var dist = Math.sqrt((cCX - tCX) * (cCX - tCX) + (cCY - tCY) * (cCY - tCY));
            if (dist < closest.dist) {
                closest = { index: i, dist: dist };
            }
            if (this.name === Tower.Ground2Name && dist < this.radius) {
                gs._creep[i].slow(this.upgradeLevel + 1, gs.ElapsedTime);
                return;
            }
        }

        //commit rotation
        if (closest.index !== -1) {
            if (!turningMode) {
                var x2 = gs._creep[closest.index].x + Game.towerSize / 2;
                var y2 = gs._creep[closest.index].y + Game.towerSize / 2;

                this.targetAngleRad = Math.atan2((y2 - tCY), (x2 - tCX));
                this.targetAngleRad += Math.PI / 2;
                if (this.targetAngleRad > 2 * Math.PI) {
                    this.targetAngleRad -= (2 * Math.PI);
                } else if (this.targetAngleRad < 0) {
                    this.targetAngleRad += (2 * Math.PI);

                }

                var cwDist;
                if (this.targetAngleRad < this.angleRad) {
                    cwDist = 2 * Math.PI - this.targetAngleRad + this.angleRad;
                } else {
                    cwDist = this.angleRad - this.targetAngleRad;
                }
                var ccwDist;
                if (this.targetAngleRad > this.angleRad) {
                    ccwDist = 2 * Math.PI - this.targetAngleRad + this.angleRad;
                } else {
                    ccwDist = this.angleRad = this.targetAngleRad;
                }
                this.rotatingCw = cwDist < ccwDist;
            }

            if (this.lastAttackTime + this.coolDown > gs.ElapsedTime) return;

            if (Math.abs(this.angleRad - this.targetAngleRad) < 0.5) { //if angle is right
                if (dist < this.radius) { //execute attack
                    console.log("attack!");
                    var cX = gs._creep[closest.index].x;
                    var cY = gs._creep[closest.index].y;
                    switch (this.name) {
                        case Tower.Ground1Name:
                            gs._projectiles.push(new Bomb(this.upgradeLevel, tCX, tCY, cX, cY));
                            break;
                        case Tower.Ground2Name:
                            //nothing here
                            break;
                        case Tower.MixedName:
                            break;
                        case Tower.AirName:
                            break;
                    }
                }
            }

            this.lastAttackTime = gs.ElapsedTime;
        }

    }

}
