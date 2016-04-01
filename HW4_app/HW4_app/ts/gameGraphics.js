var GameGraphics = (function () {
    function GameGraphics(ctx) {
        this.ctx = ctx;
    }
    GameGraphics.prototype.draw = function (gameState) {
        this.game = gameState;
        this.ctx.fillStyle = "#5e8257";
        this.ctx.fillRect(0, gameState.HudHeight, this.ctx.canvas.width, this.ctx.canvas.height - gameState.HudHeight);
        this.ctx.arc;
        this.drawTowers();
    };
    GameGraphics.prototype.drawTowers = function () {
        this.ctx.fillStyle = "#ff0000";
        if (this.game.CurrentlyPlacingTower != null) {
            var t = this.game.CurrentlyPlacingTower;
            this.ctx.strokeRect(t.x, t.y, 10, 10);
            this.ctx.beginPath();
            this.ctx.arc(t.x, t.y, t.radius, 0, 2 * Math.PI, false);
            this.ctx.stroke();
        }
        for (var i = 0; i < this.game.ActiveTowers.length; i++) {
            var t = this.game.ActiveTowers[i];
            this.ctx.strokeRect(t.x, t.y, 10, 10);
        }
    };
    return GameGraphics;
})();
//# sourceMappingURL=GameGraphics.js.map