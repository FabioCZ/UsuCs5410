
class Game implements IAppPage {

    private elapsedTime: number;
    private startTime: number;
    private pausedTime: number;
    private _context: CanvasRenderingContext2D;
    private  hudRatio = 0.2;
    private hudHeight: number;
    get HudHeight(): number {
        return this.hudHeight
    }
    get Context(): CanvasRenderingContext2D { return this._context }

    private gameHud : GameHud;
    private gameGraphics: GameGraphics;
    public CurrentlyPlacingTower: ITower;

    private money : number;
    private activeTowers: ITower[];
    get ActiveTowers():ITower[] { return this.activeTowers; }
    private placementCells: number[][];

    constructor(startTime: number, context: CanvasRenderingContext2D) {
        this.startTime = startTime;
        this._context = context;
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
            }
        } else {
            if (this.CurrentlyPlacingTower != null) {
                //todo collision checking
                this.activeTowers.push(this.CurrentlyPlacingTower);
                this.CurrentlyPlacingTower = null;
            }
            //gameboard event
        }
    }

    public overListener = (e: MouseEvent) => {
        var x = e.clientX - document.getElementById("canvas-main").getBoundingClientRect().left;
        var y = e.clientY - document.getElementById("canvas-main").getBoundingClientRect().top;
        if (this.CurrentlyPlacingTower != null && y > this.hudHeight) {
            console.log("setting tower coords to: ", x, ",", y);
            this.CurrentlyPlacingTower.setCoords(x, y);
        }
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

