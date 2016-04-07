﻿class ITower {
    public x: number;
    public y: number;
    public radius: number;
    public name: string;
    public id: number;
    static towerIdCt = 0;
    static get Ground1Name(): string { return "Ground 1" };
    static get Ground2Name(): string { return "Ground 2" };
    static get MixedName(): string { return "Mixed" };
    static get AirName(): string { return "Air" };


    constructor(name: string, radius: number) {
        this.id = ++ITower.towerIdCt;
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

    static getTowerType(name: string): ITower {
        switch (name) {
            case ITower.Ground1Name:
                return new ITower(name, Game.baseTowerRadius);
                break;
            case ITower.Ground2Name:
                return new ITower(name, Game.baseTowerRadius);
                break;
            case ITower.MixedName:
                return new ITower(name, Game.baseTowerRadius);
                break;
            case ITower.AirName:
                return new ITower(name, Game.baseTowerRadius);
                break;
        }
    }

}
