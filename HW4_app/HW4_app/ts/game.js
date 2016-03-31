var Game = (function () {
    function Game(startTime, context) {
        this.startTime = startTime;
        this._context = context;
        this.gameGraphics = new GameGraphics(this._context);
    }
    Object.defineProperty(Game.prototype, "Context", {
        get: function () { return this._context; },
        enumerable: true,
        configurable: true
    });
    Game.prototype.loop = function (time) {
        this.elapsedTime = time - this.startTime - this.pausedTime;
        requestAnimationFrame(this.loop);
    };
    Game.prototype.draw = function () {
        this.gameGraphics.draw(this);
    };
    return Game;
}());
//# sourceMappingURL=game.js.map