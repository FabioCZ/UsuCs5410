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
                    _this.CurrentlyPlacingTower.setCoords(-1, -1);
                }
            }
            else {
                if (_this.CurrentlyPlacingTower != null) {
                    //todo collision checking
                    _this.activeTowers.push(_this.CurrentlyPlacingTower.copy());
                    _this.CurrentlyPlacingTower = null;
                }
            }
        };
        this.overListener = function (e) {
            var x = e.clientX - document.getElementById("canvas-main").getBoundingClientRect().left;
            var y = e.clientY - document.getElementById("canvas-main").getBoundingClientRect().top;
            if (_this.CurrentlyPlacingTower != null && _this.isInBorders(x, y) && !_this.isTowerCollision(x, y, Game.towerSize, Game.towerSize)) {
                x = x - x % Game.towerSize;
                y = y - y % Game.towerSize;
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
        Game.canvasHeight = context.canvas.height;
        Game.canvasWidth = context.canvas.width;
        Game.towerSize = Game.canvasHeight / 40;
        Game.baseTowerRadius = Game.canvasHeight / 10;
        this.gameGraphics = new GameGraphics(this._context);
        var towerTypes = [new TwGroundOne(), new TwGroundTwo(), new TwAir(), new TwMixed()];
        this.hudHeight = context.canvas.scrollHeight * this.hudRatio;
        this.gameHud = new GameHud(context.canvas.scrollWidth, this.hudHeight, towerTypes);
        document.addEventListener("click", this.clickListener);
        document.addEventListener("mousemove", this.overListener);
        document.addEventListener("contextmenu", function (e) {
            e.preventDefault();
            if (_this.CurrentlyPlacingTower != null) {
                _this.CurrentlyPlacingTower = null;
            }
        });
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
    Object.defineProperty(Game.prototype, "BorderSpec", {
        get: function () {
            var borderOffset = Game.towerSize * 2;
            var borderOpening = Game.canvasHeight / 4;
            var horWidth = Game.canvasWidth / 2 - borderOpening / 2 - borderOffset;
            var verHeight = (Game.canvasHeight - this.HudHeight) / 2 - borderOpening / 2 - borderOffset;
            var r = {
                borderOffset: borderOffset,
                horWidth: horWidth,
                verHeight: verHeight,
                top: {
                    x1: borderOffset,
                    x2: borderOffset + horWidth + borderOpening,
                    y: this.HudHeight + borderOffset
                },
                bottom: {
                    x1: borderOffset,
                    x2: borderOffset + horWidth + borderOpening,
                    y: Game.canvasHeight - 1.5 * borderOffset
                },
                left: {
                    x: borderOffset,
                    y1: this.HudHeight + borderOffset,
                    y2: this.HudHeight + borderOffset + verHeight + borderOpening
                },
                right: {
                    x: Game.canvasWidth - 1.5 * borderOffset,
                    y1: this.HudHeight + borderOffset,
                    y2: this.HudHeight + borderOffset + verHeight + borderOpening
                }
            };
            return r;
        },
        enumerable: true,
        configurable: true
    });
    Game.prototype.isInBorders = function (x, y) {
        return x > this.BorderSpec.borderOffset * 1.5 &&
            y > this.BorderSpec.borderOffset * 1.5 + this.HudHeight &&
            x < Game.canvasWidth - this.BorderSpec.borderOffset * 1.5 &&
            y < Game.canvasHeight - this.BorderSpec.borderOffset * 1.5;
    };
    Game.prototype.isTowerCollision = function (x, y, w, h) {
        for (var i = 0; i < this.activeTowers.length; i++) {
            if (this.activeTowers[i].isCollision(x, y, w, h)) {
                return true;
            }
        }
        return false;
    };
    return Game;
}());
//# sourceMappingURL=Game.js.map