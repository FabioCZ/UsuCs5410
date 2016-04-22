class Colors {
    public static get Red() { return "#ff0000"; }
    public static get Green() { return "#5e825"; }
    public static get LtGreen() { return "#66ff33"; }
    public static get LtGrey() { return "#todo"; }
    public static get Grey() { return "#todo"; }
}

class GameGraphics {
    private game: Game;
    private ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    draw(gameState: Game) {
        this.game = gameState;
        this.ctx.fillStyle = Colors.Green;
        this.ctx.fillRect(0, Game.hudHeight, this.ctx.canvas.width, this.ctx.canvas.height - Game.hudHeight);
        for (var i = 0; i < 50; i++) {
            for (var j = 0; j < 32; j++) {
                if (PathChecker.PathsHor[i][j] === CellType.Path) {
                    this.ctx.fillStyle = Colors.Red;
                    this.ctx.fillRect(Game.iToX(i),Game.jToY(j),Game.towerSize,Game.towerSize);
                }
            }
        }
        this.drawTowers();
        this.drawWalls();
        this.drawCreep();
    }

    drawWalls() {
        this.ctx.fillStyle = Colors.LtGreen;
        for (var i = 0; i < this.game.WallTowers.length; i++) {
            var t = this.game.WallTowers[i];
            this.ctx.fillRect(t.x, t.y, Game.towerSize, Game.towerSize);
        }
    }

    drawTowers() {
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
    }

    drawCreep() {
        for (var i = 0; i < this.game.Creep.length; i++) {
            if (this.game.Creep[i].state === CreepState.Active) {
                var x = this.game.Creep[i].x;
                var y = this.game.Creep[i].y;
                this.ctx.fillStyle = Colors.LtGreen;
                this.ctx.fillRect(x,y - Game.towerSize/6,this.game.Creep[i].RatioHpLeft*Game.towerSize,Game.towerSize/6);
                this.ctx.fillStyle = Colors.Red;
                this.ctx.fillRect(this.game.Creep[i].RatioHpLeft, y - Game.towerSize / 6, (1-this.game.Creep[i].RatioHpLeft)*Game.towerSize, Game.towerSize / 6);
                this.ctx.fillStyle = "#33ccff";
                this.ctx.fillRect(x, y, Game.towerSize, Game.towerSize);
            }
        }
    }


}