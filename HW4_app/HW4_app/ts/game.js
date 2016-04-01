var Game = (function () {
    function Game(startTime, context) {
        var _this = this;
        this.hudRatio = 0.2;
        this.clickListener = function (e) {
            var x = e.clientX - document.getElementById("canvas-main").getBoundingClientRect().left;
            var y = e.clientY - document.getElementById("canvas-main").getBoundingClientRect().top;
            console.log("a click!", x, ", ", y, "hh", _this.hudHeight);
            if (y < _this.hudHeight) {
                console.log("hud click");
                var tower = _this.gameHud.handleClick(x, y);
                if (tower != null && _this.CurrentlyPlacingTower == null) {
                    _this.CurrentlyPlacingTower = tower;
                }
            }
            else {
                if (_this.CurrentlyPlacingTower != null) {
                    //todo collision checking
                    _this.activeTowers.push(_this.CurrentlyPlacingTower);
                    _this.CurrentlyPlacingTower = null;
                }
            }
        };
        this.overListener = function (e) {
            var x = e.clientX - document.getElementById("canvas-main").getBoundingClientRect().left;
            var y = e.clientY - document.getElementById("canvas-main").getBoundingClientRect().top;
            if (_this.CurrentlyPlacingTower != null && y > _this.hudHeight) {
                console.log("setting tower coords to: ", x, ",", y);
                _this.CurrentlyPlacingTower.setCoords(x, y);
            }
        };
        this.loop = function (time) {
            _this.elapsedTime = time - _this.startTime - _this.pausedTime;
            _this.draw();
            requestAnimationFrame(_this.loop);
        };
        this.draw = function () {
            _this._context["clear"]();
            _this.gameGraphics.draw(_this);
            _this.gameHud.draw(_this, _this._context);
        };
        this.startTime = startTime;
        this._context = context;
        this.gameGraphics = new GameGraphics(this._context);
        var towerTypes = [new TwGroundOne(), new TwGroundTwo(), new TwAir(), new TwMixed()];
        this.hudHeight = context.canvas.scrollHeight * this.hudRatio;
        this.gameHud = new GameHud(context.canvas.scrollWidth, this.hudHeight, towerTypes);
        document.addEventListener("click", this.clickListener);
        document.addEventListener("mousemove", this.overListener);
        this.CurrentlyPlacingTower = null;
        this.activeTowers = [];
        this.loop(performance.now());
    }
    Object.defineProperty(Game.prototype, "HudHeight", {
        get: function () {
            return this.hudHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "Context", {
        get: function () { return this._context; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "ActiveTowers", {
        get: function () { return this.activeTowers; },
        enumerable: true,
        configurable: true
    });
    return Game;
})();
//# sourceMappingURL=Game.js.map