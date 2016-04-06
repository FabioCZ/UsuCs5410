var towerIdCt = 0;
class ITower {
    public x: number;
    public y: number;
    public radius: number;
    public name: string;
    public id: number;

    constructor(name: string, radius: number) {
        this.id = ++towerIdCt;
        this.name = name;
        this.x = -1;
        this.y = -1;
        this.radius = radius;
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

    public copy(): ITower {
        var r = new ITower(this.name, this.radius);
        for (var attribut in this) {
            r[attribut] = this[attribut];
        }
        return r;
    }

}

class TwGroundOne extends  ITower {
    constructor() {
        super("Ground 1",Game.baseTowerRadius);
    }
}

class TwGroundTwo extends ITower {
    constructor() {
        super("Ground 2", Game.baseTowerRadius);
    }
}

class TwAir extends ITower {
    constructor() {
        super("Air", Game.baseTowerRadius * 1.5);
    }
}

class TwMixed extends ITower {
    constructor() {
        super("Mixed", Game.baseTowerRadius);
    }
}