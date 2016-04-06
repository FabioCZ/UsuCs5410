
class Game implements IAppPage {

    private elapsedTime: number;
    private startTime: number;
    private pausedTime: number;
    private _context: CanvasRenderingContext2D;
    private hudRatio = 0.2;
    private hudHeight: number;

    get HudHeight(): number {
        return this.hudHeight
    }

    get Context(): CanvasRenderingContext2D { return this._context }

    private gameHud: GameHud;
    private gameGraphics: GameGraphics;
    public CurrentlyPlacingTower: ITower;

    private money: number;
    private activeTowers: ITower[];

    get ActiveTowers(): ITower[] { return this.activeTowers; }

    static canvasWidth: number;
    static canvasHeight: number;
    static towerSize: number;
    static baseTowerRadius: number;

    get BorderSpec(): any {
        var borderOffset = Game.towerSize * 2;
        var borderOpening = Game.canvasHeight / 4;
        var horWidth = Game.canvasWidth / 2 - borderOpening / 2 - borderOffset;
        var verHeight = (Game.canvasHeight - this.HudHeight) / 2 - borderOpening / 2 - borderOffset
        var r = {
            borderOffset : borderOffset,
            horWidth: horWidth,
            verHeight: verHeight,
            top: {
                x1: borderOffset,
                x2: borderOffset + horWidth + borderOpening,
                y: this.HudHeight + borderOffset
            },
            bottom: {
                x1: borderOffset,
                x2: borderOffset + horWidth + borderOpening,
                y: Game.canvasHeight - 1.5 *borderOffset
            },
            left : {
                x: borderOffset,
                y1: this.HudHeight + borderOffset,
                y2: this.HudHeight + borderOffset+ verHeight + borderOpening
            },
            right: {
                x: Game.canvasWidth - 1.5*borderOffset,
                y1: this.HudHeight + borderOffset,
                y2: this.HudHeight + borderOffset + verHeight + borderOpening
            }
        }
        return r;
    }

constructor(startTime: number, context: CanvasRenderingContext2D) {
        this.startTime = startTime;
        this._context = context;
        Game.canvasHeight = context.canvas.height;
        Game.canvasWidth = context.canvas.width;
        Game.towerSize = Game.canvasHeight / 40;
        Game.baseTowerRadius = Game.canvasHeight / 10;

        this.gameGraphics = new GameGraphics(this._context);
        var towerTypes = [new TwGroundOne(), new TwGroundTwo(), new TwAir(), new TwMixed()];
        this.hudHeight = context.canvas.scrollHeight * this.hudRatio;
        this.gameHud = new GameHud(context.canvas.scrollWidth, this.hudHeight, towerTypes);
        document.addEventListener("click", this.clickListener);
        document.addEventListener("mousemove", this.overListener);
        this.CurrentlyPlacingTower = null;
        this.activeTowers = [];
        this.loop(performance.now());
    }

    public clickListener = (e: MouseEvent) => {
        var x = e.clientX - document.getElementById("canvas-main").getBoundingClientRect().left;
        var y = e.clientY - document.getElementById("canvas-main").getBoundingClientRect().top;
        console.log("a click!", x, ", ", y, "hh",this.hudHeight);
        if (y < this.hudHeight) {
            console.log("hud click");
            var tower = this.gameHud.handleClick(x, y);
            if (tower != null && this.CurrentlyPlacingTower == null) {
                this.CurrentlyPlacingTower = tower;
                this.CurrentlyPlacingTower.setCoords(-1,-1);
            }
        } else {
            if (this.CurrentlyPlacingTower != null) {
                //todo collision checking
                this.activeTowers.push(this.CurrentlyPlacingTower.copy());
                this.CurrentlyPlacingTower = null;
            }
            //gameboard event
        }
    }

    public overListener = (e: MouseEvent) => {
        var x = e.clientX - document.getElementById("canvas-main").getBoundingClientRect().left;
        var y = e.clientY - document.getElementById("canvas-main").getBoundingClientRect().top;
        if (this.CurrentlyPlacingTower != null && this.isInBorders(x, y) && !this.isTowerCollision(x, y, Game.towerSize, Game.towerSize)) {
            x = x - x % Game.towerSize;
            y = y - y % Game.towerSize;
            console.log("setting tower coords to: ", x, ",", y);
            this.CurrentlyPlacingTower.setCoords(x, y);
        }
    }

    private isInBorders(x: number, y: number): boolean {
        return x > this.BorderSpec.borderOffset *1.5 &&
            y > this.BorderSpec.borderOffset * 1.5 + this.HudHeight &&
            x < Game.canvasWidth - this.BorderSpec.borderOffset * 1.5 && 
            y < Game.canvasHeight - this.BorderSpec.borderOffset * 1.5;
    }

    private isTowerCollision(x: number, y: number,w:number,h:number): boolean {
        for (var i = 0; i < this.activeTowers.length; i++) {
            if (this.activeTowers[i].isCollision(x, y,w,h)) {
                return true;
            }
        }
        return false;
    }

    public loop = (time) => {
        this.elapsedTime = time - this.startTime - this.pausedTime;
        this.draw();
        requestAnimationFrame(this.loop);
    }

    public draw = () => {
        this._context["clear"]();
        this.gameGraphics.draw(this);
        this.gameHud.draw(this, this._context);
    }

}

