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
                if (r['start']) {
                    _this.startLevel();
                }
                else if (r['new'] && _this.CurrentlyPlacingTower == null) {
                    _this.CurrentlyPlacingTower = r['t'];
                    _this.CurrentlyPlacingTower.setCoords(-1, -1);
                    _this.selectedTowerIndex = -1;
                }
                else if (!r['new'] && _this.selectedTowerIndex > -1) {
                    if (r['t'] == null) {
                        _this._money += ~~(_this._activeTowers[_this.selectedTowerIndex].cost / 2);
                        _this._activeTowers.splice(_this.selectedTowerIndex, 1);
                        _this.selectedTowerIndex = -1;
                        Sound.Sell.play();
                    }
                    else {
                        _this._activeTowers[_this.selectedTowerIndex] = r['t'];
                    }
                }
            }
            else {
                if (_this.CurrentlyPlacingTower != null) {
                    if (_this.CurrentlyPlacingTower.cost > _this._money) {
                        Sound.No.play();
                        return;
                    }
                    _this._activeTowers.push(Tower.towerFactory(_this.CurrentlyPlacingTower.name, _this.CurrentlyPlacingTower.x, _this.CurrentlyPlacingTower.y));
                    _this._money -= _this.CurrentlyPlacingTower.cost;
                    _this.CurrentlyPlacingTower = null;
                    //Check path for validity
                    Game.newTowerPlaced = true;
                    PathChecker.resetCreepPaths();
                    Sound.Buy.play();
                    if (!_this.hasStarted) {
                        console.log('checking if path exists');
                        PathChecker.setCreepPath(_this, 0, 7, true);
                        PathChecker.setCreepPath(_this, 12, 0, false);
                        Game.newTowerPlaced = false;
                    }
                }
                else {
                    _this.selectedTowerIndex = _this.isTowerCollision(x, y, Game.towerSize / 5, Game.towerSize / 5);
                    if (_this.selectedTowerIndex > -1) {
                        _this.gameHud.setSelected(_this.ActiveTowers[_this.selectedTowerIndex]);
                    }
                    else {
                        _this.gameHud.setSelected(null);
                        _this.selectedTowerIndex = -1;
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
                if (_this.selectedTowerIndex > -1) {
                    _this._activeTowers[_this.selectedTowerIndex].upgrade();
                }
            }
            //sellTower
            if (e.ctrlKey === _this.bindings[1].ctrl && e.altKey === _this.bindings[1].alt && e.shiftKey === _this.bindings[1].shift && String.fromCharCode(e.keyCode) === _this.bindings[1].key) {
                if (_this.selectedTowerIndex > -1) {
                    _this._activeTowers.splice(_this.selectedTowerIndex, 1);
                    _this.selectedTowerIndex = -1;
                }
            }
            //startLevel
            if (e.ctrlKey === _this.bindings[2].ctrl && e.altKey === _this.bindings[2].alt && e.shiftKey === _this.bindings[2].shift && String.fromCharCode(e.keyCode) === _this.bindings[2].key) {
                _this.startLevel();
            }
            if (String.fromCharCode(e.keyCode) === "ESC") {
                _this.removeListeners();
                Application.CurrScreen = new MainMenu(_this._context);
            }
        };
        this.loop = function (time) {
            var prev = _this.elapsedTime;
            _this.elapsedTime = time - _this.startTime - _this.pausedTime;
            var delta = _this.elapsedTime - prev;
            _this.update(delta);
            _this.draw(delta);
            if (_this.continue)
                requestAnimationFrame(_this.loop);
        };
        this.update = function (delta) {
            //TODO shooting!
            //Update creep position
            console.log('cs', _this._creep.length);
            for (var i = 0; i < _this._creep.length; i++) {
                _this._livesLeft -= _this._creep[i].update(_this, delta); //creep update returns 1 if a _creep has made it
                if (_this._livesLeft <= 0) {
                    _this.checkWinLose();
                }
            }
            for (var i = 0; i < _this._activeTowers.length; i++) {
                _this._activeTowers[i].update(_this);
            }
            Game.newTowerPlaced = false;
            _this.checkWinLose();
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
        this.gameHud = new GameHud(context, context.canvas.scrollWidth, Game.hudHeight, towerTypes);
        document.addEventListener("click", this.clickListener);
        document.addEventListener("mousemove", this.overListener);
        document.addEventListener("contextmenu", this.rightClickListener);
        document.addEventListener("keydown", this.keyListener);
        this.CurrentlyPlacingTower = null;
        this._activeTowers = [];
        this._wallTowers = [];
        this.initBorder();
        PathChecker.resetCreepPaths();
        this._creep = [];
        this.levelNum = levelNum;
        this.hasStarted = false;
        this.continue = true;
        this.selectedTowerIndex = -1;
        //restore gameData
        this._money = gameData['money'];
        this._livesLeft = gameData['lives'];
        this._score = gameData['score'];
        if (gameData['towers'] != null)
            this._activeTowers = gameData['towers'];
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
        get: function () { return this._activeTowers; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "WallTowers", {
        get: function () { return this._wallTowers; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "Creep", {
        get: function () { return this._creep; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "Money", {
        get: function () { return this._money; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "Score", {
        get: function () { return this._score; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "LivesLeft", {
        get: function () { return this._livesLeft; },
        enumerable: true,
        configurable: true
    });
    Game.xToI = function (x) { return ~~(x / Game.towerSize); };
    Game.yToJ = function (y) { return ~~((y - Game.hudHeight) / Game.towerSize); };
    Game.xToINoRound = function (x) { return (x / Game.towerSize); };
    Game.yToJNoRound = function (y) { return ((y - Game.hudHeight) / Game.towerSize); };
    Game.iToX = function (i) { return Game.towerSize * i; };
    Game.jToY = function (j) { return (Game.towerSize * j) + Game.hudHeight; };
    Game.prototype.startLevel = function () {
        if (this.hasStarted)
            return;
        switch (this.levelNum) {
            case 1:
                for (var i = 0; i < 1; i++) {
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 1000, this.elapsedTime + 10000), CType.Land1));
                }
                for (var i = 0; i < 5; i++) {
                }
                break;
            case 2:
                for (var i = 0; i < 10; i++) {
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 1000, this.elapsedTime + 15000), CType.Land2));
                }
                for (var i = 0; i < 5; i++) {
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 1000, this.elapsedTime + 15000), CType.Land1));
                }
                break;
            case 3:
                for (var i = 0; i < 10; i++) {
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 1000, this.elapsedTime + 25000), CType.Land2));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 1000, this.elapsedTime + 25000), CType.Land1));
                }
                for (var i = 0; i < 5; i++) {
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 1000, this.elapsedTime + 25000), CType.Land1));
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 1000, this.elapsedTime + 25000), CType.Air));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 1000, this.elapsedTime + 25000), CType.Air));
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
                this._wallTowers.push(Tower.towerFactory(Tower.WallName, Game.iToX(0), Game.jToY(j)));
                this._wallTowers.push(Tower.towerFactory(Tower.WallName, Game.iToX(24), Game.jToY(j)));
            }
        }
        for (var i = 1; i < 24; i++) {
            if (i < 10 || i > 14) {
                this._wallTowers.push(Tower.towerFactory(Tower.WallName, Game.iToX(i), Game.jToY(0)));
                this._wallTowers.push(Tower.towerFactory(Tower.WallName, Game.iToX(i), Game.jToY(15)));
            }
        }
    };
    Game.prototype.removeListeners = function () {
        document.removeEventListener("click", this.clickListener);
        document.removeEventListener("mousemove", this.overListener);
        document.removeEventListener("contextmenu", this.rightClickListener);
        document.removeEventListener("keydown", this.keyListener);
    };
    Game.prototype.isInBorders = function (x, y) {
        return x > Game.towerSize &&
            y > Game.hudHeight + Game.towerSize &&
            x < Game.canvasWidth - Game.towerSize &&
            y < Game.canvasHeight - Game.towerSize;
    };
    Game.prototype.isTowerCollision = function (x, y, w, h) {
        for (var i = 0; i < this._activeTowers.length; i++) {
            if (this._activeTowers[i].isCollision(x, y, w, h)) {
                return i;
            }
        }
        return -1;
    };
    Game.prototype.deleteLatestTower = function () {
        this._activeTowers.splice(this._activeTowers.length - 1, 1);
    };
    Game.prototype.checkWinLose = function () {
        if (!this.hasStarted)
            return;
        if (this._livesLeft <= 0) {
        }
        var done = true;
        for (var i = 0; i < this.Creep.length; i++) {
            if (this.Creep[i].state !== CreepState.Done && this.Creep[i].state !== CreepState.Dead) {
                done = false;
            }
        }
        if (done) {
            this.continue = false;
            if (this.levelNum === 5) {
            }
            else {
                this.removeListeners();
                Application.CurrScreen = new Game(performance.now(), this._context, ++this.levelNum, { towers: this._activeTowers, money: this._money, lives: this._livesLeft, score: this._score });
            }
        }
    };
    return Game;
}());
//# sourceMappingURL=Game.js.map