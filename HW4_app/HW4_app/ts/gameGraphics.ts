
    class GameGraphics {
        private game: Game;
        private ctx: CanvasRenderingContext2D;

        constructor(ctx: CanvasRenderingContext2D) {
            this.ctx = ctx;
        }

        public draw(gameState: Game) {
            this.game = gameState;
            this.ctx.fillStyle = "#5e8257";
            this.ctx.fillRect(0, gameState.HudHeight, this.ctx.canvas.width, this.ctx.canvas.height - gameState.HudHeight);
            this.ctx.arc
            this.drawTowers();
        }

        public drawTowers() {
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
        }


    }
