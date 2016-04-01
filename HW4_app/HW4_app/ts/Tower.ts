var towerIdCt = 0;
class ITower {
    public x: number;
    public y: number;
    public radius: number;
    public name: string;
    public id: number;

    constructor(name: string) {
        this.id = ++towerIdCt;
        this.name = name;
        this.x = -1;
        this.y = -1;
        this.radius = 50;
    }

    public setCoords(x: number, y: number) {
        this.x = x;
        this.y = y;
    }




}

class TwGroundOne extends  ITower {
    constructor() {
        this.radius = 5;

        super("Ground 1");
    }
}

class TwGroundTwo extends ITower {
    constructor() {
        super("Ground 2");
    }
}

class TwAir extends ITower {
    constructor() {
        super("Air");
    }
}

class TwMixed extends ITower {
    constructor() {
        super("Mixed");
    }
}