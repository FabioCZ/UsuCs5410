class LevelSpec {
    creepNum : number;
}
class Game {

    private elapsedTime: number;
    get ElapsedTime() {return this.elapsedTime; }
    private startTime: number;
    private pausedTime: number;
    private _context: CanvasRenderingContext2D;
    private hudRatio = 0.2;

    get Context(): CanvasRenderingContext2D { return this._context }

    private gameHud: GameHud;
    private gameGraphics: GameGraphics;
    private bindings: Array<Binding>;
    public CurrentlyPlacingTower: ITower;

    private money: number;
    private activeTowers: ITower[];
    private wallTowers: ITower[];
    private creep: Creep[];

    get ActiveTowers(): ITower[] { return this.activeTowers; }
    get WallTowers(): ITower[] { return this.wallTowers; }
    get Creep(): Creep[] { return this.creep; }

    static newPlacement: boolean;
    static canvasWidth: number;
    static canvasHeight: number;
    static towerSize: number;
    static baseTowerRadius: number;
    static hudHeight: number;
    static xToI(x: number) { return ~~(x / Game.towerSize); }
    static yToJ(y: number) { return ~~((y - Game.hudHeight) / Game.towerSize); }
    static xToINoRound(x: number) { return (x / Game.towerSize); }
    static yToJNoRound(y: number) { return ((y - Game.hudHeight) / Game.towerSize); }
    static iToX(i: number) { return Game.towerSize * i; }
    static jToY(j: number) { return (Game.towerSize * j) + Game.hudHeight; }

    get BorderSpec(): any {
        var borderOffset = 0;//Game.towerSize * 2;
        var borderOpening = Game.canvasHeight / 4;
        var horWidth = Game.canvasWidth / 2 - borderOpening / 2 - borderOffset; //width of the wall part
        var verHeight = (Game.canvasHeight - Game.hudHeight) / 2 - borderOpening / 2 - borderOffset;
        var r = {
            borderOffset: borderOffset,
            horWidth: horWidth,
            verHeight: verHeight,
            top: {
                x1: borderOffset,
                x2: borderOffset + horWidth + borderOpening,
                y: Game.hudHeight + borderOffset
            },
            bottom: {
                x1: borderOffset,
                x2: borderOffset + horWidth + borderOpening,
                y: Game.canvasHeight - Game.towerSize - borderOffset
            },
            left: {
                x: borderOffset,
                y1: Game.hudHeight + borderOffset,
                y2: Game.hudHeight + borderOffset + verHeight + borderOpening
            },
            right: {
                x: Game.canvasWidth - Game.towerSize - borderOffset,
                y1: Game.hudHeight + borderOffset,
                y2: Game.hudHeight + borderOffset + verHeight + borderOpening
            }
        }
        return r;
    }

    constructor(startTime: number, context: CanvasRenderingContext2D, levelNum: number, gameData /*TODO*/) {
        this.startTime = startTime;
        this.pausedTime = 0;
        this._context = context;
        Game.canvasHeight = context.canvas.height;
        Game.canvasWidth = context.canvas.width;
        Game.towerSize = Game.canvasHeight / 40;
        Game.baseTowerRadius = Game.canvasHeight / 10;
        this.bindings = JSON.parse(localStorage.getItem("TD.keyBindings"));

        this.gameGraphics = new GameGraphics(this._context);
        var towerTypes = Array<ITower>();
        towerTypes.push(ITower.getTowerType(ITower.Ground1Name));
        towerTypes.push(ITower.getTowerType(ITower.Ground2Name));
        towerTypes.push(ITower.getTowerType(ITower.MixedName));
        towerTypes.push(ITower.getTowerType(ITower.AirName));

        Game.hudHeight = context.canvas.scrollHeight * this.hudRatio;
        this.gameHud = new GameHud(context.canvas.scrollWidth, Game.hudHeight, towerTypes);
        document.addEventListener("click", this.clickListener);
        document.addEventListener("mousemove", this.overListener);
        document.addEventListener("contextmenu", this.rightClickListener);
        document.addEventListener("keydown",this.keyListener);
        this.CurrentlyPlacingTower = null;
        this.activeTowers = [];
        this.wallTowers = [];
        this.initBorder();
        PathChecker.setCreepPaths(this);
        this.creep = [];
        //Add creep
        ///TODO make better
        for (var i = 0; i < Application.LevelSpec[levelNum-1].creepNum; i++) {
            this.creep.push(new Creep(this, true, RandomBetween(startTime, startTime + 10000),CType.Land,100));
        }

        this.loop(performance.now());
    }

    public initBorder() {
        for (var j = 0; j < 32; j++) {
            if (j < 12 || j > 19) {
                this.wallTowers.push(ITower.getTowerType(ITower.WallName, Game.iToX(0), Game.jToY(j)));
                this.wallTowers.push(ITower.getTowerType(ITower.WallName, Game.iToX(49), Game.jToY(j)));
            }
        }

        for (var i = 1; i < 49; i++) {
            if (i < 21 || i > 28) {
                this.wallTowers.push(ITower.getTowerType(ITower.WallName, Game.iToX(i), Game.jToY(0)));
                this.wallTowers.push(ITower.getTowerType(ITower.WallName, Game.iToX(i), Game.jToY(31)));
            }
        }
    }

    public clickListener = (e: MouseEvent) => {
        var x = e.clientX - document.getElementById("canvas-main").getBoundingClientRect().left;
        var y = e.clientY - document.getElementById("canvas-main").getBoundingClientRect().top;
        if (y < Game.hudHeight) {   //HUD click
            //console.log("hud click");
            var tower = this.gameHud.handleClick(x, y);
            if (tower != null && this.CurrentlyPlacingTower == null) {
                this.CurrentlyPlacingTower = tower;
                this.CurrentlyPlacingTower.setCoords(-1, -1);
            }
        } else {
            if (this.CurrentlyPlacingTower != null) {   //placing towers
                this.activeTowers.push(ITower.getTowerType(this.CurrentlyPlacingTower.name,this.CurrentlyPlacingTower.x,this.CurrentlyPlacingTower.y));
                this.CurrentlyPlacingTower = null;
                PathChecker.setCreepPaths(this);
                Game.newPlacement = true;
            }

            //TODO tower upgrades
            //gameboard event
        }
    }

    public rightClickListener = (e) => {
        if (this.CurrentlyPlacingTower != null) {
            e.preventDefault();
            this.CurrentlyPlacingTower = null;
        }
    }

    public overListener = (e: MouseEvent) => {
        var x = e.clientX - document.getElementById("canvas-main").getBoundingClientRect().left;
        var y = e.clientY - document.getElementById("canvas-main").getBoundingClientRect().top;
        if (this.CurrentlyPlacingTower != null && this.isInBorders(x, y) && !this.isTowerCollision(x, y, Game.towerSize, Game.towerSize)) {
            var x = Game.xToI(x) * Game.towerSize;
            var y = Game.yToJ(y) * Game.towerSize + Game.hudHeight;
            this.CurrentlyPlacingTower.setCoords(x,y);
        }
    }

    public keyListener = (e: KeyboardEvent) => {
        if (e.keyCode === 17 || e.keyCode === 18 || e.keyCode === 16) return;   //return if just ctrl or just alt
        //upgradeTower
        if (e.ctrlKey === this.bindings[0].ctrl && e.altKey === this.bindings[0].alt && e.shiftKey === this.bindings[0].shift && String.fromCharCode(e.keyCode) === this.bindings[0].key) {
            
        }
        //sellTower
        if (e.ctrlKey === this.bindings[1].ctrl && e.altKey === this.bindings[1].alt && e.shiftKey === this.bindings[1].shift && String.fromCharCode(e.keyCode) === this.bindings[1].key) {


        }
        //startLevel
        if (e.ctrlKey === this.bindings[2].ctrl && e.altKey === this.bindings[2].alt && e.shiftKey === this.bindings[2].shift && String.fromCharCode(e.keyCode) === this.bindings[2].key) {

        }
    }

    private isInBorders(x: number, y: number): boolean {
        return x > this.BorderSpec.borderOffset + Game.towerSize &&
            y > this.BorderSpec.borderOffset + Game.hudHeight + Game.towerSize &&
            x < Game.canvasWidth - this.BorderSpec.borderOffset - Game.towerSize &&
            y < Game.canvasHeight - this.BorderSpec.borderOffset - Game.towerSize;
    }

    private isTowerCollision(x: number, y: number, w: number, h: number): boolean {
        for (var i = 0; i < this.activeTowers.length; i++) {
            if (this.activeTowers[i].isCollision(x, y, w, h)) {
                return true;
            }
        }
        return false;
    }

    public loop = (time) => {
        var prev = this.elapsedTime;
        this.elapsedTime = time - this.startTime - this.pausedTime;
        this.update(this.elapsedTime - prev);
        this.draw();
        requestAnimationFrame(this.loop);
    }

    public update = (delta:number) => {
        //TODO shooting!
        //Update creep position
        for (var i = 0; i < this.creep.length; i++) {
            this.creep[i].update(this,delta);
        }
        Game.newPlacement = false;
    }

    public draw = () => {
        this._context["clear"]();
        this.gameGraphics.draw(this);
        this.gameHud.draw(this, this._context);
    }
}

