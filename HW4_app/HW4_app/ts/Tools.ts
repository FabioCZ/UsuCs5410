class Rect {
    public x: number;
    public y: number;
    public w: number;
    public h: number;
    constructor(x: number, y: number, w: number, h: number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

class Coord {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

function isClickIn(r: Rect, x: number, y: number): boolean {
    return (x <= r.x + r.w && x >= r.x && y <= r.y + r.h && y >= r.y);
}

function clone(obj): any {
    var cloneObj = new (<any>obj.constructor());
    for (var attribut in obj) {
        if (typeof obj[attribut] === "object") {
            cloneObj[attribut] = obj.clone();
        } else {
            cloneObj[attribut] = obj[attribut];
        }
    }
return cloneObj;
}