var GameGraphics = (function () {
    function GameGraphics(ctx) {
        this.ctx = ctx;
    }
    GameGraphics.prototype.draw = function (gameState) {
        this.ctx["clear"]();
        this.ctx.fillStyle = "#00000000";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    };
    return GameGraphics;
}());
//# sourceMappingURL=GameGraphics.js.map