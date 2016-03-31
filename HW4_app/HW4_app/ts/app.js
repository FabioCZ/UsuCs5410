var Application = (function () {
    function Application() {
        var canvas = document.getElementById("canvas-main");
        this._context = canvas.getContext("2d");
        CanvasRenderingContext2D.prototype["clear"] = function () {
            this.save();
            this.setTransform(1, 0, 0, 1, 0, 0);
            this.clearRect(0, 0, canvas.width, canvas.height);
            this.restore();
        };
        var game = new Game(10, this._context);
        game.draw();
    }
    return Application;
}());
var app = new Application();
//# sourceMappingURL=App.js.map