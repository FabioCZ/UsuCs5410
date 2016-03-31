
    class GameGraphics {
        private game: Game;
        private ctx: CanvasRenderingContext2D;

        constructor(ctx: CanvasRenderingContext2D) {
            this.ctx = ctx;
        }

        public draw(gameState: Game) {
            this.ctx["clear"]();
            this.ctx.fillStyle = "#00000000";
            this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        }


    }
