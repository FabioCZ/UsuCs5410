
class Application {
    private _context: CanvasRenderingContext2D;

    constructor() {
        CanvasRenderingContext2D.prototype["clear"] = function () {
            this.save();
            this.setTransform(1, 0, 0, 1, 0, 0);
            this.clearRect(0, 0, canvas.width, canvas.height);
            this.restore();
        }
        var canvas = <HTMLCanvasElement>document.getElementById("canvas-main");
        canvas.height = canvas.clientHeight;
        canvas.width = canvas.clientWidth;  //dafuq?
        this._context = canvas.getContext("2d");

        var l = new LevelSpec();
        l.creepNum = 10;
        var game = new Game(performance.now(), this._context,l);

    }


}
function start() {
    var app = new Application();
}