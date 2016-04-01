var Game = (function () {
    function Game(startTime, context) {
        this.hudRatio = 0.2;
        this.startTime = startTime;
        this._context = context;
        this.gameGraphics = new GameGraphics(this._context);
        this.hudHeight = context.canvas.height * this.hudRatio;
        var towerTypes;
        towerTypes.push(new TwGroundOne());
        towerTypes.push(new TwGroundTwo());
        towerTypes.push(new TwAir());
        towerTypes.push(new TwMixed());
        this.gameHud = new GameHud(context.canvas.width, this.hudHeight, towerTypes);
        document.addEventListener("click", this.clickListener);
        document.addEventListener("mouseover", this.overListener);
    }
    Object.defineProperty(Game.prototype, "Context", {
        get: function () { return this._context; },
        enumerable: true,
        configurable: true
    });
    Game.prototype.clickListener = function (e) {
        if (e.clientY < this.hudHeight) {
        }
        else {
        }
    };
    Game.prototype.overListener = function (e) {
    };
    Game.prototype.loop = function (time) {
        this.elapsedTime = time - this.startTime - this.pausedTime;
        requestAnimationFrame(this.loop);
    };
    Game.prototype.draw = function () {
        this.gameGraphics.draw(this);
        this.gameHud.draw(this);
    };
    return Game;
}());
//# sourceMappingURL=game.js.map