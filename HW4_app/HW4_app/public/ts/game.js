var LevelSpec = (function () {
    function LevelSpec() {
    }
    return LevelSpec;
}());
var Game = (function () {
    function Game(startTime, context, levelNum, gameData /*TODO*/) {
        var _this = this;
        this.hudRatio = 0.2;
        this.clickListener = function (e) {
            var x = e.clientX - document.getElementById("canvas-main").getBoundingClientRect().left;
            var y = e.clientY - document.getElementById("canvas-main").getBoundingClientRect().top;
            if (y < Game.hudHeight) {
                //console.log("hud click");
                var r = _this.gameHud.handleClick(x, y);
                if (r == null)
                    return;
                if (r['new'] && _this.CurrentlyPlacingTower == null) {
                    _this.CurrentlyPlacingTower = r['t'];
                    _this.CurrentlyPlacingTower.setCoords(-1, -1);
                    _this.selectedTowerIndex = -1;
                }
                else if (!r['new'] && _this.selectedTowerIndex > -1) {
                    if (r['t'] == null) {
                        _this.activeTowers.splice(_this.selectedTowerIndex, 1);
                        _this.selectedTowerIndex = -1;
                    }
                    else {
                        _this.activeTowers[_this.selectedTowerIndex] = r['t'];
                    }
                }
            }
            else {
                if (_this.CurrentlyPlacingTower != null) {
                    _this.activeTowers.push(Tower.towerFactory(_this.CurrentlyPlacingTower.name, _this.CurrentlyPlacingTower.x, _this.CurrentlyPlacingTower.y));
                    _this.CurrentlyPlacingTower = null;
                    Game.newTowerPlaced = true;
                }
                else {
                    _this.selectedTowerIndex = _this.isTowerCollision(x, y, Game.towerSize / 5, Game.towerSize / 5);
                    if (_this.selectedTowerIndex > -1) {
                        _this.gameHud.setSelected(_this.ActiveTowers[_this.selectedTowerIndex]);
                    }
                }
            }
        };
        this.rightClickListener = function (e) {
            if (_this.CurrentlyPlacingTower != null) {
                e.preventDefault();
                _this.CurrentlyPlacingTower = null;
            }
            if (_this.gameHud.isATowerSelected()) {
                e.preventDefault();
                _this.gameHud.setSelected(null);
                _this.selectedTowerIndex = -1;
            }
        };
        this.overListener = function (e) {
            var x = e.clientX - document.getElementById("canvas-main").getBoundingClientRect().left;
            var y = e.clientY - document.getElementById("canvas-main").getBoundingClientRect().top;
            if (_this.CurrentlyPlacingTower != null && _this.isInBorders(x, y) && _this.isTowerCollision(x, y, Game.towerSize, Game.towerSize) === -1) {
                var x = Game.xToI(x) * Game.towerSize;
                var y = Game.yToJ(y) * Game.towerSize + Game.hudHeight;
                _this.CurrentlyPlacingTower.setCoords(x, y);
            }
        };
        this.keyListener = function (e) {
            if (e.keyCode === 17 || e.keyCode === 18 || e.keyCode === 16)
                return; //return if just ctrl or just alt
            //upgradeTower
            if (e.ctrlKey === _this.bindings[0].ctrl && e.altKey === _this.bindings[0].alt && e.shiftKey === _this.bindings[0].shift && String.fromCharCode(e.keyCode) === _this.bindings[0].key) {
            }
            //sellTower
            if (e.ctrlKey === _this.bindings[1].ctrl && e.altKey === _this.bindings[1].alt && e.shiftKey === _this.bindings[1].shift && String.fromCharCode(e.keyCode) === _this.bindings[1].key) {
            }
            //startLevel
            if (e.ctrlKey === _this.bindings[2].ctrl && e.altKey === _this.bindings[2].alt && e.shiftKey === _this.bindings[2].shift && String.fromCharCode(e.keyCode) === _this.bindings[2].key) {
            }
        };
        this.loop = function (time) {
            var prev = _this.elapsedTime;
            _this.elapsedTime = time - _this.startTime - _this.pausedTime;
            var delta = _this.elapsedTime - prev;
            _this.update(delta);
            _this.draw(delta);
            requestAnimationFrame(_this.loop);
        };
        this.update = function (delta) {
            //TODO shooting!
            //Update creep position
            for (var i = 0; i < _this.creep.length; i++) {
                _this.livesLeft -= _this.creep[i].update(_this, delta); //creep update returns 1 if a creep has made it
            }
            Game.newTowerPlaced = false;
        };
        this.draw = function (delta) {
            _this._context["clear"]();
            _this.gameGraphics.draw(_this, delta);
            _this.gameHud.draw(_this, _this._context);
        };
        this.startTime = startTime;
        this.pausedTime = 0;
        this._context = context;
        Game.canvasHeight = context.canvas.height;
        Game.canvasWidth = context.canvas.width;
        Game.towerSize = Game.canvasHeight / 20; //40
        Game.baseTowerRadius = Game.canvasHeight / 10;
        this.bindings = JSON.parse(localStorage.getItem("TD.keyBindings"));
        this.gameGraphics = new GameGraphics(this._context);
        var towerTypes = Array();
        towerTypes.push(Tower.towerFactory(Tower.Ground1Name));
        towerTypes.push(Tower.towerFactory(Tower.Ground2Name));
        towerTypes.push(Tower.towerFactory(Tower.MixedName));
        towerTypes.push(Tower.towerFactory(Tower.AirName));
        Game.hudHeight = context.canvas.scrollHeight * this.hudRatio;
        this.gameHud = new GameHud(context.canvas.scrollWidth, Game.hudHeight, towerTypes);
        document.addEventListener("click", this.clickListener);
        document.addEventListener("mousemove", this.overListener);
        document.addEventListener("contextmenu", this.rightClickListener);
        document.addEventListener("keydown", this.keyListener);
        this.CurrentlyPlacingTower = null;
        this.activeTowers = [];
        this.wallTowers = [];
        this.initBorder();
        PathChecker.resetCreepPaths();
        this.creep = [];
        this.levelNum = levelNum;
        this.hasStarted = false;
        this.selectedTowerIndex = -1;
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
    Object.defineProperty(Game.prototype, "WallTowers", {
        get: function () { return this.wallTowers; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "Creep", {
        get: function () { return this.creep; },
        enumerable: true,
        configurable: true
    });
    Game.xToI = function (x) { return ~~(x / Game.towerSize); };
    Game.yToJ = function (y) { return ~~((y - Game.hudHeight) / Game.towerSize); };
    Game.xToINoRound = function (x) { return (x / Game.towerSize); };
    Game.yToJNoRound = function (y) { return ((y - Game.hudHeight) / Game.towerSize); };
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
    Game.prototype.startLevel = function () {
        switch (this.levelNum) {
            case 1:
                for (var i = 0; i < 10; i++) {
                    this.creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 1000, this.elapsedTime + 10000), CType.Land1));
                }
                for (var i = 0; i < 5; i++) {
                    this.creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 1000, this.elapsedTime + 10000), CType.Land2));
                }
                break;
            case 2:
                for (var i = 0; i < 10; i++) {
                    this.creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 1000, this.elapsedTime + 15000), CType.Land2));
                }
                for (var i = 0; i < 5; i++) {
                    this.creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 1000, this.elapsedTime + 15000), CType.Land1));
                }
                break;
            case 3:
                for (var i = 0; i < 10; i++) {
                    this.creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 1000, this.elapsedTime + 25000), CType.Land2));
                    this.creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 1000, this.elapsedTime + 25000), CType.Land1));
                }
                for (var i = 0; i < 5; i++) {
                    this.creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 1000, this.elapsedTime + 25000), CType.Land1));
                    this.creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 1000, this.elapsedTime + 25000), CType.Air));
                    this.creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 1000, this.elapsedTime + 25000), CType.Air));
                }
                break;
            case 4:
                break;
            case 5:
                break;
        }
        this.hasStarted = true;
    };
    Game.prototype.initBorder = function () {
        for (var j = 0; j < 16; j++) {
            if (j < 6 || j > 9) {
                this.wallTowers.push(Tower.towerFactory(Tower.WallName, Game.iToX(0), Game.jToY(j)));
                this.wallTowers.push(Tower.towerFactory(Tower.WallName, Game.iToX(24), Game.jToY(j)));
            }
        }
        for (var i = 1; i < 24; i++) {
            if (i < 10 || i > 14) {
                this.wallTowers.push(Tower.towerFactory(Tower.WallName, Game.iToX(i), Game.jToY(0)));
                this.wallTowers.push(Tower.towerFactory(Tower.WallName, Game.iToX(i), Game.jToY(15)));
            }
        }
    };
    Game.prototype.isInBorders = function (x, y) {
        return x > this.BorderSpec.borderOffset + Game.towerSize &&
            y > this.BorderSpec.borderOffset + Game.hudHeight + Game.towerSize &&
            x < Game.canvasWidth - this.BorderSpec.borderOffset - Game.towerSize &&
            y < Game.canvasHeight - this.BorderSpec.borderOffset - Game.towerSize;
    };
    Game.prototype.isTowerCollision = function (x, y, w, h) {
        for (var i = 0; i < this.activeTowers.length; i++) {
            if (this.activeTowers[i].isCollision(x, y, w, h)) {
                return i;
            }
        }
        return -1;
    };
    return Game;
}());
//# sourceMappingURL=Game.js.map