
class Game implements IAppPage {

    private elapsedTime: number;
    private startTime: number;
    private pausedTime: number;
    private _context: CanvasRenderingContext2D;

    get Context(): CanvasRenderingContext2D { return this._context }

    private gameGraphics: GameGraphics;

    private activeTowers: Tower[];


    constructor(startTime: number, context: CanvasRenderingContext2D) {
        this.startTime = startTime;
        this._context = context;
        this.gameGraphics = new GameGraphics(this._context);
    }

    public loop(time) {
        this.elapsedTime = time - this.startTime - this.pausedTime;
        requestAnimationFrame(this.loop);
    }

    public draw() {
        this.gameGraphics.draw(this);
    }

}

