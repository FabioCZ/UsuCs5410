var LevelSpec = (function () {
    function LevelSpec() {
    }
    return LevelSpec;
}());
var Game = (function () {
    function Game(startTime, context, levelSpec) {
        var _this = this;
        this.hudRatio = 0.2;
        this.clickListener = function (e) {
            var x = e.clientX - document.getElementById("canvas-main").getBoundingClientRect().left;
            var y = e.clientY - document.getElementById("canvas-main").getBoundingClientRect().top;
            console.log("a click!", x, ", ", y, "hh", Game.hudHeight);
            if (y < Game.hudHeight) {
                console.log("hud click");
                var tower = _this.gameHud.handleClick(x, y);
                if (tower != null && _this.CurrentlyPlacingTower == null) {
                    _this.CurrentlyPlacingTower = tower;
                    _this.CurrentlyPlacingTower.setCoords(-1, -1);
                }
            }
            else {
                if (_this.CurrentlyPlacingTower != null) {
                    _this.activeTowers.push(ITower.getTowerType(_this.CurrentlyPlacingTower.name, _this.CurrentlyPlacingTower.x, _this.CurrentlyPlacingTower.y));
                    _this.CurrentlyPlacingTower = null;
                    _this.reCalcPaths = true;
                }
            }
        };
        this.overListener = function (e) {
            var x = e.clientX - document.getElementById("canvas-main").getBoundingClientRect().left;
            var y = e.clientY - document.getElementById("canvas-main").getBoundingClientRect().top;
            if (_this.CurrentlyPlacingTower != null && _this.isInBorders(x, y) && !_this.isTowerCollision(x, y, Game.towerSize, Game.towerSize)) {
                x = x - x % Game.towerSize;
                y = y - y % Game.towerSize;
                //console.log("setting tower coords to: ", x, ",", y);
                _this.CurrentlyPlacingTower.setCoords(x, y);
            }
        };
        this.loop = function (time) {
            _this.elapsedTime = time - _this.startTime - _this.pausedTime;
            _this.update();
            _this.draw();
            requestAnimationFrame(_this.loop);
        };
        this.update = function () {
            //TODO shooting!
            //Update creep position
            for (var i = 0; i < _this.creep.length; i++) {
                _this.creep[i].update(_this, _this.reCalcPaths);
            }
            _this.reCalcPaths = false;
        };
        this.draw = function () {
            _this._context["clear"]();
            _this.gameGraphics.draw(_this);
            _this.gameHud.draw(_this, _this._context);
        };
        this.startTime = startTime;
        this.pausedTime = 0;
        this._context = context;
        Game.canvasHeight = context.canvas.height;
        Game.canvasWidth = context.canvas.width;
        Game.towerSize = Game.canvasHeight / 40;
        Game.baseTowerRadius = Game.canvasHeight / 10;
        this.gameGraphics = new GameGraphics(this._context);
        var towerTypes = Array();
        towerTypes.push(ITower.getTowerType(ITower.Ground1Name));
        towerTypes.push(ITower.getTowerType(ITower.Ground2Name));
        towerTypes.push(ITower.getTowerType(ITower.MixedName));
        towerTypes.push(ITower.getTowerType(ITower.AirName));
        Game.hudHeight = context.canvas.scrollHeight * this.hudRatio;
        this.gameHud = new GameHud(context.canvas.scrollWidth, Game.hudHeight, towerTypes);
        document.addEventListener("click", this.clickListener);
        document.addEventListener("mousemove", this.overListener);
        document.addEventListener("contextmenu", function (e) {
            if (_this.CurrentlyPlacingTower != null) {
                e.preventDefault();
                _this.CurrentlyPlacingTower = null;
            }
        });
        this.CurrentlyPlacingTower = null;
        this.reCalcPaths = true;
        this.activeTowers = [];
        this.creep = [];
        //Add creep
        ///TODO make better
        for (var i = 0; i < levelSpec.creepNum; i++) {
            this.creep.push(new Creep(this, true, RandomBetween(startTime, startTime + 10000), CType.Land, 100));
        }
        this.loop(performance.now());
    }
    Object.defineProperty(Game.prototype, "ElapsedTime", {
        get: function () { return this.elapsedTime; },
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
    Object.defineProperty(Game.prototype, "Creep", {
        get: function () { return this.creep; },
        enumerable: true,
        configurable: true
    });
    Game.xToI = function (x) { return x / Game.towerSize; };
    Game.yToJ = function (y) { return (y - Game.hudHeight) / Game.towerSize; };
    Game.iToX = function (i) { return Game.towerSize * i; };
    Game.jToY = function (j) { return (Game.towerSize * j) + Game.hudHeight; };
    Object.defineProperty(Game.prototype, "BorderSpec", {
        get: function () {
            var borderOffset = 0; //Game.towerSize * 2;
            var borderOpening = Game.canvasHeight / 4;
            var horWidth = Game.canvasWidth / 2 - borderOpening / 2 - borderOffset; //width of the wall part
            var verHeight = (Game.canvasHeight - Game.hudHeight) / 2 - borderOpening / 2 - borderOffset;
            var r = {
                borderOffset: borderOffset,
                horWidth: horWidth,
                verHeight: verHeight,
                top: {
                    x1: borderOffset,
                    x2: borderOffset + horWidth + borderOpening,
                    y: Game.hudHeight + borderOffset
                },
                bottom: {
                    x1: borderOffset,
                    x2: borderOffset + horWidth + borderOpening,
                    y: Game.canvasHeight - Game.towerSize - borderOffset
                },
                left: {
                    x: borderOffset,
                    y1: Game.hudHeight + borderOffset,
                    y2: Game.hudHeight + borderOffset + verHeight + borderOpening
                },
                right: {
                    x: Game.canvasWidth - Game.towerSize - borderOffset,
                    y1: Game.hudHeight + borderOffset,
                    y2: Game.hudHeight + borderOffset + verHeight + borderOpening
                }
            };
            return r;
        },
        enumerable: true,
        configurable: true
    });
    Game.prototype.isInBorders = function (x, y) {
        return x > this.BorderSpec.borderOffset + Game.towerSize &&
            y > this.BorderSpec.borderOffset + Game.hudHeight + Game.towerSize &&
            x < Game.canvasWidth - this.BorderSpec.borderOffset - Game.towerSize &&
            y < Game.canvasHeight - this.BorderSpec.borderOffset - Game.towerSize;
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