
class Game implements IAppPage {

    private elapsedTime: number;
    private startTime: number;
    private pausedTime: number;
    private _context: CanvasRenderingContext2D;
    private  hudRatio = 0.2;
    private hudHeight : number;
    get Context(): CanvasRenderingContext2D { return this._context }

    private gameHud : GameHud;
    private gameGraphics: GameGraphics;
    private isPlacingTower : boolean;

    private money : number;
    private activeTowers: ITower[];
    private placementCells: number[][];

    constructor(startTime: number, context: CanvasRenderingContext2D) {
        this.startTime = startTime;
        this._context = context;
        this.gameGraphics = new GameGraphics(this._context);
        this.hudHeight = context.canvas.height * this.hudRatio;
        var towerTypes: ITower[];
        towerTypes.push(new TwGroundOne());
        towerTypes.push(new TwGroundTwo());
        towerTypes.push(new TwAir());
        towerTypes.push(new TwMixed());
        this.gameHud = new GameHud(context.canvas.width, this.hudHeight,towerTypes);
        document.addEventListener("click", this.clickListener);
        document.addEventListener("mouseover", this.overListener);
    }

    public clickListener(e:MouseEvent) {
        if (e.clientY < this.hudHeight) {
            //hud event
        } else {
            //gameboard event
        }
    }

    public overListener(e: MouseEvent) {
        
    }

    public loop(time) {
        this.elapsedTime = time - this.startTime - this.pausedTime;
        requestAnimationFrame(this.loop);
    }

    public draw() {
        this.gameGraphics.draw(this);
        this.gameHud.draw(this);
    }

}

