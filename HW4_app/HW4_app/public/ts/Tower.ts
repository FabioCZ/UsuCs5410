enum AttackType {
    None,
    Shot,
    Missile,
    Freeze
}
class Tower {
    public x: number;
    public y: number;
    public angleRad: number;

    public radius: number;
    public name: string;
    public cost: number;
    public upgradeLevel: number;
    public attack: number;
    public baseImg: any;
    public turretImg: any;
    public tFileBaseName: any;

    static get Ground1Name(): string { return "Bomb" };
    static get Ground2Name(): string { return "Slow" };
    static get MixedName(): string { return "Mixed" };
    static get AirName(): string { return "Air" };
    static get WallName(): string { return "Wall" };


    constructor(name: string, x = -1, y = -1) {
        if(name !== Tower.WallName) console.log('new tower ', x, ",", y);
        this.name = name;
        this.x = x;
        this.y = y;
        this.turretImg = new Image();
        this.baseImg = new Image();
        this.baseImg.src = "img/tower/turret-base.gif";
        this.upgradeLevel = 1;
        this.angleRad = 0;
        switch(name) {
            case Tower.Ground1Name:
                this.tFileBaseName = "img/tower/turret-1";
                this.radius = Game.baseTowerRadius;
                this.cost = 10;
                break;
            case Tower.Ground2Name:
                this.tFileBaseName = "img/tower/turret-2";
                this.radius = Game.baseTowerRadius / 2;
                this.cost = 15;
                break;
            case Tower.MixedName:
                this.tFileBaseName = "img/tower/turret-3";
                this.radius = Game.baseTowerRadius;
                this.cost = 20;
                break;
            case Tower.AirName:
                this.cost = 15;
                this.radius = Game.baseTowerRadius * 2;
                this.tFileBaseName = "img/tower/turret-7";
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
        console.log("tower upgraded to level ", this.upgradeLevel);
        this.setTurretImage();
        this.attack *= 4/3;
    }


    public setCoords(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public isCollision(x: number, y: number, w: number, h:number) {
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
            ctx.beginPath();
            ctx.arc(this.x + Game.towerSize / 2, this.y + Game.towerSize / 2, this.radius, 0, 2 * Math.PI, false);
            ctx.lineWidth = Game.towerSize / 10;
            ctx.strokeStyle = Colors.LtBlue;
            ctx.stroke();
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

}
