class Colors {
    public static get Red() { return "#ff0000"; }
    public static get Green() { return "#009933"; }
    public static get LtGreen() { return "#66ff33"; }
    public static get LtGrey() { return "#A8A8A8"; }
    public static get Grey() { return "#7D7D7D"; }
    public static get Yellow() { return "#FCEA5B" }
    public static get Black() { return "#000000"; }
    public static get LtBlue() { return "78D0FF"; }
}

class GameGraphics {
    private game: Game;
    private ctx: CanvasRenderingContext2D;
    private delta: number;
    private bk: any;
    private bkPattern;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        var bk = new Image();
        bk.src = "img/grass.png";
        bk.onload = (e:any) => {
            this.bkPattern = this.ctx.createPattern(bk, "repeat");
        };

    }

    draw(gameState: Game,delta:number) {
        this.game = gameState;
        this.delta = delta;
        this.drawBackground();
        this.drawTowers();
        this.drawWalls();
        this.drawCreep();
    }

    drawBackground() {
        this.ctx.rect(0, Game.hudHeight, this.ctx.canvas.width, this.ctx.canvas.height - Game.hudHeight);
        this.ctx.fillStyle = this.bkPattern;
        this.ctx.fill();
    }

    drawWalls() {
        this.ctx.fillStyle = Colors.LtGreen;
        for (var i = 0; i < this.game.WallTowers.length; i++) {
            this.game.WallTowers[i].draw(this.ctx,false);
        }
    }

    drawTowers() {
        //TODO placing and selected

        for (var i = 0; i < this.game.ActiveTowers.length; i++) {
            if (this.game.selectedTowerIndex === i) {
                this.game.ActiveTowers[i].draw(this.ctx, true);
            } else {
                this.game.ActiveTowers[i].draw(this.ctx, false);
            }
        }
        if (this.game.CurrentlyPlacingTower != null) {
            this.game.CurrentlyPlacingTower.draw(this.ctx,true);
        }
    }

    drawCreep() {
        for (var i = 0; i < this.game.Creep.length; i++) {
            this.game.Creep[i].draw(this.ctx,this.delta);
        }
    }

    drawStartPrompt() {
        
    }


}