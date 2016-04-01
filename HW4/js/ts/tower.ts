class Tower{
    x : number;
    y : number;
    towerType: TowerType;

    constructor(x:number, y:number) {
        this.x = x;
        this.y = y;
    }
}

enum TowerType {
    One,
    Two,
    Three
}