var Colors = (function () {
    function Colors() {
    }
    Object.defineProperty(Colors, "Red", {
        get: function () { return "#ff0000"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Colors, "Green", {
        get: function () { return "#009933"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Colors, "LtGreen", {
        get: function () { return "#66ff33"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Colors, "LtGrey", {
        get: function () { return "#A8A8A8"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Colors, "Grey", {
        get: function () { return "#7D7D7D"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Colors, "Yellow", {
        get: function () { return "#FCEA5B"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Colors, "Black", {
        get: function () { return "#000000"; },
        enumerable: true,
        configurable: true
    });
    return Colors;
}());
var GameGraphics = (function () {
    function GameGraphics(ctx) {
        var _this = this;
        this.ctx = ctx;
        var bk = new Image();
        bk.src = "img/grass.png";
        bk.onload = function (e) {
            _this.bkPattern = _this.ctx.createPattern(bk, "repeat");
        };
    }
    GameGraphics.prototype.draw = function (gameState, delta) {
        this.game = gameState;
        this.delta = delta;
        this.drawBackground();
        this.drawTowers();
        this.drawWalls();
        this.drawCreep();
    };
    GameGraphics.prototype.drawBackground = function () {
        this.ctx.rect(0, Game.hudHeight, this.ctx.canvas.width, this.ctx.canvas.height - Game.hudHeight);
        this.ctx.fillStyle = this.bkPattern;
        this.ctx.fill();
    };
    GameGraphics.prototype.drawWalls = function () {
        this.ctx.fillStyle = Colors.LtGreen;
        for (var i = 0; i < this.game.WallTowers.length; i++) {
            this.game.WallTowers[i].draw(this.ctx, false);
        }
    };
    GameGraphics.prototype.drawTowers = function () {
        //TODO placing and selected
        for (var i = 0; i < this.game.ActiveTowers.length; i++) {
            if (this.game.selectedTowerIndex === i) {
                this.game.ActiveTowers[i].draw(this.ctx, true);
            }
            else {
                this.game.ActiveTowers[i].draw(this.ctx, false);
            }
        }
        if (this.game.CurrentlyPlacingTower != null) {
            this.game.CurrentlyPlacingTower.draw(this.ctx, true);
        }
    };
    GameGraphics.prototype.drawCreep = function () {
        for (var i = 0; i < this.game.Creep.length; i++) {
            this.game.Creep[i].draw(this.ctx, this.delta);
        }
    };
    GameGraphics.prototype.drawStartPrompt = function () {
    };
    return GameGraphics;
}());
//# sourceMappingURL=GameGraphics.js.map