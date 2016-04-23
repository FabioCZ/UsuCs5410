class TowerButton {
    public rect: Rect;
    public tower: Tower;
    constructor(rect :Rect, tower: Tower) {
        this.rect = rect;
        this.tower = tower;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        var centerX = this.rect.x + this.rect.w / 2;
        ctx.fillStyle = Colors.Grey;
        ctx.fillRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
        ctx.textAlign = "center";
        ctx.strokeText(this.tower.name, centerX, this.rect.y + this.rect.h / 2, this.rect.w);
    }

}

class TowerDetails {
    public tower: Tower;
    public rect: Rect;
    public buttonRectSell: Rect;
    public buttonRectUpg: Rect;

    constructor(rect:Rect) {
        this.rect = rect;
        this.tower = null;
        this.buttonRectSell = new Rect(rect.x + GameHud.buttonPadding, rect.y + rect.h * 0.6, rect.w - GameHud.buttonPadding * 2, rect.h * 0.2 - GameHud.buttonPadding);
        this.buttonRectUpg = new Rect(rect.x + GameHud.buttonPadding, rect.y + rect.h * 0.8, rect.w - GameHud.buttonPadding * 2, rect.h * 0.2 - GameHud.buttonPadding);
    }

    public setTower(tower: Tower) {
        this.tower = tower;
    }

    public draw(ctx:CanvasRenderingContext2D) {
        var centerX = this.rect.x + this.rect.w / 2;
        ctx.font = 
        ctx.fillStyle = Colors.Grey;
        ctx.fillRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
        if (this.tower != null) {
            ctx.textAlign = "center";
            ctx.strokeText("Selected tower: " + this.tower.name, centerX, this.rect.y + this.rect.h / 4, this.rect.w);

            ctx.fillStyle = Colors.LtGrey;
            ctx.fillRect(this.buttonRectSell.x, this.buttonRectSell.y, this.buttonRectSell.w, this.buttonRectSell.h);
            ctx.fillRect(this.buttonRectUpg.x, this.buttonRectUpg.y, this.buttonRectUpg.w, this.buttonRectUpg.h);

        } else {
            ctx.textAlign = "center";
            ctx.strokeText("No tower selected", centerX, this.rect.y + this.rect.h / 2, this.rect.w);
        }
    }
}

class GameHud {

    private width: number;
    private height: number;
    public static buttonPadding: number;
    private buttonWidth: number;
    private buttonHeight: number;
    private towerButtons: TowerButton[];
    private towerDetails: TowerDetails;

    constructor(w: number, h : number, towerstype : Tower[]) {
        this.width = w;
        this.height = h;
        GameHud.buttonPadding = w / 100;
        this.buttonWidth = w / 11;
        this.buttonHeight = h * 0.9;
        this.towerButtons = [];
        var n = 0;
        for (var i = 0; i < towerstype.length; i++) {
            this.towerButtons.push(new TowerButton(new Rect(GameHud.buttonPadding + (i * this.buttonWidth) + (i * GameHud.buttonPadding), GameHud.buttonPadding,
                this.buttonWidth, this.buttonHeight), towerstype[i]));
            n = i;
        }
        n++;
        this.towerDetails = new TowerDetails(new Rect(GameHud.buttonPadding + (n * this.buttonWidth) + (n * GameHud.buttonPadding), GameHud.buttonPadding,
            this.buttonWidth * 2, this.buttonHeight));
    }

    public handleClick(x: number, y: number): Object {
        for (var i = 0; i < this.towerButtons.length; i++) {
            if (IsCoordInRect(this.towerButtons[i].rect, x, y)) {
                this.towerDetails.tower = null;
                console.log("commencing tower placement");
                return { new: true, t: this.towerButtons[i].tower };
            }
        }
        if (this.towerDetails.tower != null) {
            //details pane
            if (IsCoordInRect(this.towerDetails.buttonRectSell, x, y)) {
                return { new: false, t: null };
            }
            if (IsCoordInRect(this.towerDetails.buttonRectUpg, x, y)) {
                this.towerDetails.tower.upgrade();
                return { new: false, t: this.towerDetails.tower };
            }
        }
        return null;
    }

    public setSelected(tower: Tower) {
        this.towerDetails.setTower(tower);
    }

    public isATowerSelected() {
        return this.towerDetails.tower != null;
    }

    public draw(gameState: Game, ctx: CanvasRenderingContext2D) {
        var fontSize = ctx.canvas.clientWidth / 60;
        ctx.font = fontSize + "px GoodTimes";
        ctx.fillStyle = Colors.Black;
        ctx.fillRect(0, 0, this.width, this.height);
        for (var i = 0; i < this.towerButtons.length; i++) {
            this.towerButtons[i].draw(ctx);
        }
        this.towerDetails.draw(ctx);
    }
}