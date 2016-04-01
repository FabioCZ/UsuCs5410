class TowerButton {
    public rect: Rect;
    public tower: ITower;
    constructor(rect :Rect, tower: ITower) {
        this.rect = rect;
        this.tower = tower;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        var centerX = this.rect.x + this.rect.w / 2;
        ctx.fillStyle = "#7a7a7a";
        ctx.fillRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
        ctx.textAlign = "center";
        ctx.strokeText(this.tower.name, centerX, this.rect.y + this.rect.h / 2, this.rect.w);
    }

}

class GameHud {

    private width: number;
    private height: number;
    private buttonPadding: number;
    private buttonWidth: number;
    private buttonHeight: number;
    private towerButtons: TowerButton[];

    constructor(w: number, h : number, towerstype : ITower[]) {
        this.width = w;
        this.height = h;
        this.buttonPadding = w / 100;
        this.buttonWidth = w / 11;
        this.buttonHeight = h * 0.9;
        this.towerButtons = [];
        for (var i = 0; i < towerstype.length; i++) {
            this.towerButtons.push(new TowerButton(new Rect(this.buttonPadding + (i * this.buttonWidth) + (i* this.buttonPadding), this.buttonPadding,
                this.buttonWidth, this.buttonHeight), towerstype[i]));
        }
    }

    public handleClick(x: number, y: number): ITower {
        for (var i = 0; i < this.towerButtons.length; i++) {
            if (isClickIn(this.towerButtons[i].rect, x, y)) {
                console.log("commencing tower placement");
                return this.towerButtons[i].tower;
            }
        }
        return null;
    }

    public draw(gameState: Game, ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "#000000";
        console.log("drawing hud background,", this.width, ",", this.height);
        ctx.fillRect(0, 0, this.width, this.height);
        for (var i = 0; i < this.towerButtons.length; i++) {
            this.towerButtons[i].draw(ctx);
        }
    }
}