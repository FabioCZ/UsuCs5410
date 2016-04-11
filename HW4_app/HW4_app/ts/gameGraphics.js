var GameGraphics = (function () {
    function GameGraphics(ctx) {
        this.ctx = ctx;
    }
    GameGraphics.prototype.draw = function (gameState) {
        this.game = gameState;
        this.ctx.fillStyle = "#5e8257";
        this.ctx.fillRect(0, Game.hudHeight, this.ctx.canvas.width, this.ctx.canvas.height - Game.hudHeight);
        this.drawBorders();
        this.drawTowers();
        this.drawCreep();
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
    GameGraphics.prototype.drawBorders = function () {
        var b = this.game.BorderSpec;
        this.ctx.fillStyle = "#ff0000";
        //top
        this.ctx.fillRect(b.top.x1, b.top.y, b.horWidth, Game.towerSize);
        this.ctx.fillRect(b.top.x2, b.top.y, b.horWidth, Game.towerSize);
        //bottom
        this.ctx.fillRect(b.bottom.x1, b.bottom.y, b.horWidth, Game.towerSize);
        this.ctx.fillRect(b.bottom.x2, b.bottom.y, b.horWidth, Game.towerSize);
        //left
        this.ctx.fillRect(b.left.x, b.left.y1, Game.towerSize, b.verHeight);
        this.ctx.fillRect(b.left.x, b.left.y2, Game.towerSize, b.verHeight);
        //right
        this.ctx.fillRect(b.right.x, b.right.y1, Game.towerSize, b.verHeight);
        this.ctx.fillRect(b.right.x, b.right.y2, Game.towerSize, b.verHeight);
    };
    GameGraphics.prototype.drawCreep = function () {
        for (var i = 0; i < this.game.Creep.length; i++) {
            if (this.game.Creep[i].state === CreepState.Active) {
                var x = this.game.Creep[i].x;
                var y = this.game.Creep[i].y;
                this.ctx.fillStyle = "#33ccff";
                this.ctx.fillRect(x, y, Game.towerSize, Game.towerSize);
            }
        }
    };
    return GameGraphics;
}());
//# sourceMappingURL=GameGraphics.js.map