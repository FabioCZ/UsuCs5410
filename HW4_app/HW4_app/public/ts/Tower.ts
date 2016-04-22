class ITower {
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
    static get WallName(): string { return "Wall" };


    constructor(name: string, radius: number, x = -1, y = -1) {
        if(name !== ITower.WallName) console.log('new tower ', x, ",", y);
        this.id = ++ITower.towerIdCt;
        this.name = name;
        this.x = x;
        this.y = y;
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

    static getTowerType(name: string,x?:number,y?:number): ITower {
        switch (name) {
            case ITower.Ground1Name:
                return new ITower(name, Game.baseTowerRadius,x,y);
            case ITower.Ground2Name:
                return new ITower(name, Game.baseTowerRadius,x,y);
            case ITower.MixedName:
                return new ITower(name, Game.baseTowerRadius,x,y);
            case ITower.AirName:
                return new ITower(name, Game.baseTowerRadius * 1.5, x, y);
            case ITower.WallName:
                return new ITower(name, 0, x, y);
        }
    }

}
