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

class Pair {
    first: number;
    second: number;
    constructor(f: number, s: number) {
        this.first = f;
        this.second = s;
    }  
}

class ArCoord {
    i: number;
    j: number;
    constructor(i: number, j: number) {
        this.i = i;
        this.j = j;
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

function IsCoordInRect(r: Rect, x: number, y: number): boolean {
    return (x <= r.x + r.w && x >= r.x && y <= r.y + r.h && y >= r.y);
}

function RandomBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

function drawBk(context: CanvasRenderingContext2D) {
    var canvasSize = { w: context.canvas.clientWidth, h: context.canvas.clientHeight };
    var grd = context.createLinearGradient(0, 0, canvasSize.w, canvasSize.h);
    grd.addColorStop(0, "#9982AE");
    grd.addColorStop(0.5, "#05889A");
    grd.addColorStop(1.0, "#D30166");
    context.fillStyle = grd;
    context.fillRect(0, 0, canvasSize.w, canvasSize.h);
}