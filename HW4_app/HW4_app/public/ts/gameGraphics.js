var Colors = (function () {
    function Colors() {
    }
    Object.defineProperty(Colors, "Red", {
        get: function () { return "#ff0000"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Colors, "Green", {
        get: function () { return "#5e825"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Colors, "LtGreen", {
        get: function () { return "#66ff33"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Colors, "LtGrey", {
        get: function () { return "#todo"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Colors, "Grey", {
        get: function () { return "#todo"; },
        enumerable: true,
        configurable: true
    });
    return Colors;
}());
var GameGraphics = (function () {
    function GameGraphics(ctx) {
        this.ctx = ctx;
    }
    GameGraphics.prototype.draw = function (gameState) {
        this.game = gameState;
        this.ctx.fillStyle = Colors.Green;
        this.ctx.fillRect(0, Game.hudHeight, this.ctx.canvas.width, this.ctx.canvas.height - Game.hudHeight);
        for (var i = 0; i < 50; i++) {
            for (var j = 0; j < 32; j++) {
                if (PathChecker.PathsHor[i][j] === CellType.Path) {
                    this.ctx.fillStyle = Colors.Red;
                    this.ctx.fillRect(Game.iToX(i), Game.jToY(j), Game.towerSize, Game.towerSize);
                }
            }
        }
        this.drawTowers();
        this.drawWalls();
        this.drawCreep();
    };
    GameGraphics.prototype.drawWalls = function () {
        this.ctx.fillStyle = Colors.LtGreen;
        for (var i = 0; i < this.game.WallTowers.length; i++) {
            var t = this.game.WallTowers[i];
            this.ctx.fillRect(t.x, t.y, Game.towerSize, Game.towerSize);
        }
    };
    GameGraphics.prototype.drawTowers = function () {
        this.ctx.fillStyle = "#ff0000";
        if (this.game.CurrentlyPlacingTower != null) {
            var t = this.game.CurrentlyPlacingTower;
            this.ctx.strokeRect(t.x, t.y, Game.towerSize, Game.towerSize);
            this.ctx.beginPath();
            this.ctx.arc(t.x + Game.towerSize / 2, t.y + Game.towerSize / 2, t.radius, 0, 2 * Math.PI, false);
            this.ctx.stroke();
        }
        for (var i = 0; i < this.game.ActiveTowers.length; i++) {
            var t = this.game.ActiveTowers[i];
            this.ctx.strokeRect(t.x, t.y, Game.towerSize, Game.towerSize);
        }
    };
    GameGraphics.prototype.drawCreep = function () {
        for (var i = 0; i < this.game.Creep.length; i++) {
            if (this.game.Creep[i].state === CreepState.Active) {
                var x = this.game.Creep[i].x;
                var y = this.game.Creep[i].y;
                this.ctx.fillStyle = Colors.LtGreen;
                this.ctx.fillRect(x, y - Game.towerSize / 6, this.game.Creep[i].RatioHpLeft * Game.towerSize, Game.towerSize / 6);
                this.ctx.fillStyle = Colors.Red;
                this.ctx.fillRect(this.game.Creep[i].RatioHpLeft, y - Game.towerSize / 6, (1 - this.game.Creep[i].RatioHpLeft) * Game.towerSize, Game.towerSize / 6);
                this.ctx.fillStyle = "#33ccff";
                this.ctx.fillRect(x, y, Game.towerSize, Game.towerSize);
            }
        }
    };
    return GameGraphics;
}());
//# sourceMappingURL=GameGraphics.js.map