class Game {

    get ElapsedTime() { return this.elapsedTime; }
    get Context(): CanvasRenderingContext2D { return this._context }
    get ActiveTowers(): Tower[] { return this._activeTowers; }
    get WallTowers(): Tower[] { return this._wallTowers; }
    get Creep(): Creep[] { return this._creep; }
    get Money(): number { return this._money; }
    get Score(): number { return this._score; }
    get LivesLeft(): number { return this._livesLeft; }

    private elapsedTime: number;
    private startTime: number;
    private pausedTime: number;
    private _context: CanvasRenderingContext2D;
    private hudRatio = 0.2;


    private gameHud: GameHud;
    private gameGraphics: GameGraphics;
    private bindings: Array<Binding>;
    public CurrentlyPlacingTower: Tower;
    public selectedTowerIndex: number;

    public hasStarted: boolean;
    public continue: boolean;
    public levelNum: number;
    public _money: number;
    private _livesLeft: number;
    public _score: number;
    private _activeTowers: Tower[];
    private _wallTowers: Tower[];
    public _creep: Creep[];
    public _projectiles: IProjectile[];

    static newTowerPlaced: boolean;
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

    constructor(startTime: number, context: CanvasRenderingContext2D, levelNum: number, gameData /*TODO*/) {
        this.startTime = startTime;
        this.pausedTime = 0;
        this._context = context;
        Game.canvasHeight = context.canvas.height;
        Game.canvasWidth = context.canvas.width;
        Game.towerSize = Game.canvasHeight / 20;    //40
        Game.baseTowerRadius = Game.canvasHeight / 10;
        this.bindings = JSON.parse(localStorage.getItem("TD.keyBindings"));

        this.gameGraphics = new GameGraphics(this._context);
        var towerTypes = Array<Tower>();
        towerTypes.push(Tower.towerFactory(Tower.Ground1Name));
        towerTypes.push(Tower.towerFactory(Tower.Ground2Name));
        towerTypes.push(Tower.towerFactory(Tower.MixedName));
        towerTypes.push(Tower.towerFactory(Tower.AirName));

        Game.hudHeight = context.canvas.scrollHeight * this.hudRatio;
        this.gameHud = new GameHud(context,context.canvas.scrollWidth, Game.hudHeight, towerTypes);
        document.addEventListener("click", this.clickListener);
        document.addEventListener("mousemove", this.overListener);
        document.addEventListener("contextmenu", this.rightClickListener);
        document.addEventListener("keydown", this.keyListener);
        this.CurrentlyPlacingTower = null;
        this._activeTowers = [];
        this._wallTowers = [];
        this.initBorder();
        PathChecker.resetCreepPaths();
        this._creep = [];
        this._projectiles = [];
        this.levelNum = levelNum;
        this.hasStarted = false;
        this.continue = true;
        this.selectedTowerIndex = -1;

        //restore gameData
        this._money = gameData['money'];
        this._livesLeft = gameData['lives'];
        this._score = gameData['score'];
        this.elapsedTime = gameData['elTime'];
        if(gameData['towers'] != null)
            this._activeTowers = gameData['towers'];
        if(this.levelNum == 1)
            FloatingScores.addScore(this._context.canvas.clientWidth / 2, this._context.canvas.clientHeight / 2, "Press 'Start Level' when ready", this.elapsedTime, true);

        this.loop(performance.now());
    }

    public startLevel() {
        if (this.hasStarted) return;
        switch (this.levelNum) {
            case 1:
                FloatingScores.addScore(this._context.canvas.clientWidth / 2, this._context.canvas.clientHeight / 2, "Wave incoming, 1 of 1", this.elapsedTime + 500, true);
                for (var i = 0; i < 5; i++) {
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 1000, this.elapsedTime + 10000), CType.Land1));
                }
                for (var i = 0; i < 1; i++) {
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 1000, this.elapsedTime + 10000), CType.Land2));
                }
                break;
            case 2:
                FloatingScores.addScore(this._context.canvas.clientWidth / 2, this._context.canvas.clientHeight / 2, "Wave incoming, 1 of 2", this.elapsedTime + 500,true);
                FloatingScores.addScore(this._context.canvas.clientWidth / 2, this._context.canvas.clientHeight / 2, "Wave incoming, 2 of 2", this.elapsedTime + 20000,true);

                for (var i = 0; i < 5; i++) {
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 1000, this.elapsedTime + 5000), CType.Land1));
                }
                for (var i = 0; i < 2; i++) {
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 1000, this.elapsedTime + 5000), CType.Land2));
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 1000, this.elapsedTime + 5000), CType.Air));
                }

                for (var i = 0; i < 10; i++) {
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 20000, this.elapsedTime + 30000), CType.Land1));
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 20000, this.elapsedTime + 30000), CType.Land2));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 20000, this.elapsedTime + 30000), CType.Land1));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 20000, this.elapsedTime + 30000), CType.Land2));
                }
                for (var i = 0; i < 2; i++) {
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 20000, this.elapsedTime + 30000), CType.Air));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 20000, this.elapsedTime + 30000), CType.Air));
                }
                break;
            case 3:
                FloatingScores.addScore(this._context.canvas.clientWidth / 2, this._context.canvas.clientHeight / 2, "Wave incoming, 1 of 3", this.elapsedTime + 500, true);
                FloatingScores.addScore(this._context.canvas.clientWidth / 2, this._context.canvas.clientHeight / 2, "Wave incoming, 2 of 3", this.elapsedTime + 20000, true);
                FloatingScores.addScore(this._context.canvas.clientWidth / 2, this._context.canvas.clientHeight / 2, "Wave incoming, 3 of 3", this.elapsedTime + 45000, true);
                for (var i = 0; i < 6; i++) {
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 500, this.elapsedTime + 10000), CType.Land1));
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 1000, this.elapsedTime + 10000), CType.Land2));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 500, this.elapsedTime + 10000), CType.Land1));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 1000, this.elapsedTime + 10000), CType.Land2));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 1000, this.elapsedTime + 10000), CType.Air));
                }
                
                for (var i = 0; i < 15; i++) {
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 20000, this.elapsedTime + 25000), CType.Land1));
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 20000, this.elapsedTime + 25000), CType.Land2));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 20000, this.elapsedTime + 25000), CType.Land1));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 20000, this.elapsedTime + 25000), CType.Land2));
                }

                for (var i = 0; i < 5; i++) {
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 20000, this.elapsedTime + 25000), CType.Land3));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 20000, this.elapsedTime + 25000), CType.Air));
                }

                for (var i = 0; i < 15; i++) {
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 45000, this.elapsedTime + 60000), CType.Land1));
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 45000, this.elapsedTime + 60000), CType.Land2));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 45000, this.elapsedTime + 60000), CType.Land1));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 45000, this.elapsedTime + 60000), CType.Land2));
                }

                for (var i = 0; i < 5; i++) {
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 45000, this.elapsedTime + 60000), CType.Land3));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 45000, this.elapsedTime + 60000), CType.Air));
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 45000, this.elapsedTime + 60000), CType.Air));
                }

                break;
            case 4:
                FloatingScores.addScore(this._context.canvas.clientWidth / 2, this._context.canvas.clientHeight / 2, "Wave incoming, 1 of 4", this.elapsedTime + 500, true);
                FloatingScores.addScore(this._context.canvas.clientWidth / 2, this._context.canvas.clientHeight / 2, "Wave incoming, 2 of 4", this.elapsedTime + 20000, true);
                FloatingScores.addScore(this._context.canvas.clientWidth / 2, this._context.canvas.clientHeight / 2, "Wave incoming, 3 of 4", this.elapsedTime + 45000, true);
                FloatingScores.addScore(this._context.canvas.clientWidth / 2, this._context.canvas.clientHeight / 2, "Wave incoming, 4 of 4", this.elapsedTime + 70000, true);
                for (var i = 0; i < 10; i++) {
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 500, this.elapsedTime + 5000), CType.Land1));
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 1000, this.elapsedTime + 5000), CType.Land2));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 500, this.elapsedTime + 5000), CType.Land1));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 1000, this.elapsedTime + 5000), CType.Land2));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 1000, this.elapsedTime + 5000), CType.Air));
                }

                for (var i = 0; i < 15; i++) {
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 20000, this.elapsedTime + 30000), CType.Land1));
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 20000, this.elapsedTime + 30000), CType.Land2));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 20000, this.elapsedTime + 30000), CType.Land1));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 20000, this.elapsedTime + 30000), CType.Land2));
                }

                for (var i = 0; i < 10; i++) {
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 20000, this.elapsedTime + 30000), CType.Land3));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 20000, this.elapsedTime + 30000), CType.Air));
                }

                for (var i = 0; i < 20; i++) {
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 45000, this.elapsedTime + 60000), CType.Land1));
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 45000, this.elapsedTime + 60000), CType.Land2));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 45000, this.elapsedTime + 60000), CType.Land1));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 45000, this.elapsedTime + 60000), CType.Land2));
                }

                for (var i = 0; i < 5; i++) {
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 45000, this.elapsedTime + 60000), CType.Land3));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 45000, this.elapsedTime + 60000), CType.Air));
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 45000, this.elapsedTime + 60000), CType.Air));
                }

                for (var i = 0; i < 20; i++) {
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 70000, this.elapsedTime + 85000), CType.Land1));
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 70000, this.elapsedTime + 85000), CType.Land2));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 70000, this.elapsedTime + 85000), CType.Land1));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 70000, this.elapsedTime + 85000), CType.Land2));
                }

                for (var i = 0; i < 7; i++) {
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 70000, this.elapsedTime + 85000), CType.Land3));
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 70000, this.elapsedTime + 85000), CType.Land3));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 70000, this.elapsedTime + 85000), CType.Air));
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 70000, this.elapsedTime + 85000), CType.Air));
                }
                break;
            case 5:
                FloatingScores.addScore(this._context.canvas.clientWidth / 2, this._context.canvas.clientHeight / 2, "Wave incoming, 1 of 5", this.elapsedTime + 500, true);
                FloatingScores.addScore(this._context.canvas.clientWidth / 2, this._context.canvas.clientHeight / 2, "Wave incoming, 2 of 5", this.elapsedTime + 20000, true);
                FloatingScores.addScore(this._context.canvas.clientWidth / 2, this._context.canvas.clientHeight / 2, "Wave incoming, 3 of 5", this.elapsedTime + 45000, true);
                FloatingScores.addScore(this._context.canvas.clientWidth / 2, this._context.canvas.clientHeight / 2, "Wave incoming, 4 of 5", this.elapsedTime + 70000, true);
                FloatingScores.addScore(this._context.canvas.clientWidth / 2, this._context.canvas.clientHeight / 2, "Final Wave of the Game!", this.elapsedTime + 90000, true);
                for (var i = 0; i < 14; i++) {
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 500, this.elapsedTime + 5000), CType.Land3));
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 1000, this.elapsedTime + 5000), CType.Land2));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 500, this.elapsedTime + 5000), CType.Land1));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 1000, this.elapsedTime + 5000), CType.Land2));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 1000, this.elapsedTime + 5000), CType.Air));
                }

                for (var i = 0; i < 20; i++) {
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 20000, this.elapsedTime + 30000), CType.Land1));
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 20000, this.elapsedTime + 30000), CType.Land2));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 20000, this.elapsedTime + 30000), CType.Land1));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 20000, this.elapsedTime + 30000), CType.Land2));
                }

                for (var i = 0; i < 15; i++) {
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 20000, this.elapsedTime + 30000), CType.Land3));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 20000, this.elapsedTime + 30000), CType.Air));
                }

                for (var i = 0; i < 25; i++) {
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 45000, this.elapsedTime + 60000), CType.Land1));
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 45000, this.elapsedTime + 60000), CType.Land2));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 45000, this.elapsedTime + 60000), CType.Land1));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 45000, this.elapsedTime + 60000), CType.Land2));
                }

                for (var i = 0; i < 10; i++) {
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 45000, this.elapsedTime + 60000), CType.Land3));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 45000, this.elapsedTime + 60000), CType.Air));
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 45000, this.elapsedTime + 60000), CType.Air));
                }

                for (var i = 0; i < 30; i++) {
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 70000, this.elapsedTime + 85000), CType.Land1));
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 70000, this.elapsedTime + 85000), CType.Land2));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 70000, this.elapsedTime + 85000), CType.Land1));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 70000, this.elapsedTime + 85000), CType.Land2));
                }

                for (var i = 0; i < 7; i++) {
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 70000, this.elapsedTime + 85000), CType.Land3));
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 70000, this.elapsedTime + 85000), CType.Land3));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 70000, this.elapsedTime + 85000), CType.Air));
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 70000, this.elapsedTime + 85000), CType.Air));
                }

                for (var i = 0; i < 25; i++) {
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 90000, this.elapsedTime + 110000), CType.Land3));
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 90000, this.elapsedTime + 110000), CType.Land2));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 90000, this.elapsedTime + 110000), CType.Land3));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 90000, this.elapsedTime + 110000), CType.Land2));
                }

                for (var i = 0; i < 20; i++) {
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 90000, this.elapsedTime + 110000), CType.Land3));
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 90000, this.elapsedTime + 110000), CType.Land3));
                    this._creep.push(new Creep(this, false, RandomBetween(this.elapsedTime + 90000, this.elapsedTime + 110000), CType.Air));
                    this._creep.push(new Creep(this, true, RandomBetween(this.elapsedTime + 90000, this.elapsedTime + 110000), CType.Air));
                }
                break;
        }
        this.hasStarted = true;
    }

    public initBorder() {
        for (var j = 0; j < 16; j++) {
            if (j < 6 || j > 9) {
                this._wallTowers.push(Tower.towerFactory(Tower.WallName, Game.iToX(0), Game.jToY(j)));
                this._wallTowers.push(Tower.towerFactory(Tower.WallName, Game.iToX(24), Game.jToY(j)));
            }
        }

        for (var i = 1; i < 24; i++) {
            if (i < 10 || i > 14) {
                this._wallTowers.push(Tower.towerFactory(Tower.WallName, Game.iToX(i), Game.jToY(0)));
                this._wallTowers.push(Tower.towerFactory(Tower.WallName, Game.iToX(i), Game.jToY(15)));
            }
        }
    }

    public clickListener = (e: MouseEvent) => {
        if (e.which != 1) return;
        var x = e.clientX - document.getElementById("canvas-main").getBoundingClientRect().left;
        var y = e.clientY - document.getElementById("canvas-main").getBoundingClientRect().top;
        if (y < Game.hudHeight) { //HUD click
            //console.log("hud click");
            var r = this.gameHud.handleClick(x, y,this);
            if (r == null) return;
            if (r['start']) {
                this.startLevel();
            } else if (r['new'] && this.CurrentlyPlacingTower == null) {
                this.CurrentlyPlacingTower = r['t'];
                this.CurrentlyPlacingTower.setCoords(-1, -1);
                this.selectedTowerIndex = -1;
            } else if (!r['new'] && this.selectedTowerIndex > -1) {
                if (r['t'] == null) {   //sell, TODO add _money
                    Particles.addTowerSold(this.elapsedTime, this._activeTowers[this.selectedTowerIndex].x + Game.towerSize / 2, this._activeTowers[this.selectedTowerIndex].y + Game.towerSize / 2);
                    this._money += ~~(this._activeTowers[this.selectedTowerIndex].cost / 2);
                    this._activeTowers.splice(this.selectedTowerIndex, 1);
                    this.selectedTowerIndex = -1;
                    Sound.Sell.play();
                } else {    //upgrade
                    this._activeTowers[this.selectedTowerIndex] = r['t'];
                }
            }
        } else {
            if (this.CurrentlyPlacingTower != null) { //placing towers
                if (this.CurrentlyPlacingTower.cost > this._money) {
                    Sound.No.play();
                    return;
                }
                this._activeTowers.push(Tower.towerFactory(this.CurrentlyPlacingTower.name, this.CurrentlyPlacingTower.x, this.CurrentlyPlacingTower.y));
                this._money -= this.CurrentlyPlacingTower.cost;
                this._score += ~~(this.CurrentlyPlacingTower.cost / 2);
                this.CurrentlyPlacingTower = null;
                
                //Check path for validity
                Game.newTowerPlaced = true;
                PathChecker.resetCreepPaths();
                Sound.Buy.play();
                if (!this.hasStarted) {
                    console.log('checking if path exists');
                    PathChecker.setCreepPath(this, 0, 7, true);
                    PathChecker.setCreepPath(this, 12, 0, false);
                    Game.newTowerPlaced = false;
                }

            } else {
                this.selectedTowerIndex = this.isTowerCollision(x, y, Game.towerSize / 5, Game.towerSize / 5);
                if (this.selectedTowerIndex > -1) {
                    this.gameHud.setSelected(this.ActiveTowers[this.selectedTowerIndex]);
                } else {
                    this.gameHud.setSelected(null);
                    this.selectedTowerIndex = -1;
                }
            }
        }
    }

    public rightClickListener = (e) => {
        if (this.CurrentlyPlacingTower != null) {
            e.preventDefault();
            this.CurrentlyPlacingTower = null;
        }

        if (this.gameHud.isATowerSelected()) {
            e.preventDefault();
            this.gameHud.setSelected(null);
            this.selectedTowerIndex = -1;
        }

    }

    public overListener = (e: MouseEvent) => {
        var x = e.clientX - document.getElementById("canvas-main").getBoundingClientRect().left;
        var y = e.clientY - document.getElementById("canvas-main").getBoundingClientRect().top;
        if (this.CurrentlyPlacingTower != null && this.isInBorders(x, y) && this.isTowerCollision(x, y, Game.towerSize, Game.towerSize) === -1) {
            var x = Game.xToI(x) * Game.towerSize;
            var y = Game.yToJ(y) * Game.towerSize + Game.hudHeight;
            this.CurrentlyPlacingTower.setCoords(x, y);
        }
    }

    public keyListener = (e: KeyboardEvent) => {
        console.log(e.keyCode);
        if (e.keyCode === 17 || e.keyCode === 18 || e.keyCode === 16) return;   //return if just ctrl or just alt
        //upgradeTower
        var eChar = String.fromCharCode(e.keyCode).toLowerCase();
        if (e.ctrlKey === this.bindings[0].ctrl && e.altKey === this.bindings[0].alt && e.shiftKey === this.bindings[0].shift && eChar === this.bindings[0].key) {
            if (this.selectedTowerIndex > -1) {
                this._activeTowers[this.selectedTowerIndex].upgrade(this);
                this.gameHud.setSelected(this._activeTowers[this.selectedTowerIndex]);
            }
            return;
        }
        //sellTower
        if (e.ctrlKey === this.bindings[1].ctrl && e.altKey === this.bindings[1].alt && e.shiftKey === this.bindings[1].shift && eChar === this.bindings[1].key) {
            if (this.selectedTowerIndex > -1) {
                Particles.addTowerSold(this.elapsedTime, this._activeTowers[this.selectedTowerIndex].x + Game.towerSize / 2, this._activeTowers[this.selectedTowerIndex].y + Game.towerSize / 2);
                this._money += ~~(this._activeTowers[this.selectedTowerIndex].cost / 2);
                this._activeTowers.splice(this.selectedTowerIndex, 1);
                this.selectedTowerIndex = -1;
                this.gameHud.setSelected(null);
                Sound.Sell.play();
            }
            return;
        }
        //startLevel
        if (e.ctrlKey === this.bindings[2].ctrl && e.altKey === this.bindings[2].alt && e.shiftKey === this.bindings[2].shift && eChar === this.bindings[2].key) {
            this.startLevel();
            return;
        }
        if (e.keyCode == 27) {
            this.continue = false;
            this.removeListeners();
            Application.CurrScreen = new MainMenu(this._context);
        }
    }

    private removeListeners() {
        document.removeEventListener("click", this.clickListener);
        document.removeEventListener("mousemove", this.overListener);
        document.removeEventListener("contextmenu", this.rightClickListener);
        document.removeEventListener("keydown", this.keyListener);
    }

    private isInBorders(x: number, y: number): boolean {
        return x > Game.towerSize &&
            y > Game.hudHeight + Game.towerSize &&
            x < Game.canvasWidth - Game.towerSize &&
            y < Game.canvasHeight - Game.towerSize;
    }

    private isTowerCollision(x: number, y: number, w: number, h: number): number {
        for (var i = 0; i < this._activeTowers.length; i++) {
            if (this._activeTowers[i].isCollision(x, y, w, h)) {
                return i;
            }
        }
        return -1;
    }

    public deleteLatestTower() {
        this._activeTowers.splice(this._activeTowers.length - 1, 1);
    }

    public loop = (time) => {
        var prev = this.elapsedTime;
        this.elapsedTime = time - this.startTime - this.pausedTime;
        var delta = this.elapsedTime - prev;
        this.update(delta);
        if (this.continue) {
            this.draw(delta);
            requestAnimationFrame(this.loop);
        }
    }

    public update = (delta: number) => {
        //TODO shooting!

        //Update creep position
        for (var i = 0; i < this._creep.length; i++) {
            this._livesLeft -= this._creep[i].update(this, delta); //creep update returns 1 if a _creep has made it
            if (this._livesLeft <= 0) {
                this.checkWinLose();
            }
        }
        for (var i = 0; i < this._activeTowers.length; i++) {
            this._activeTowers[i].update(this,delta);
        }
        for (var i = 0; i < this._projectiles.length; i++) {
            if (this._projectiles[i].update(this, delta)) {
                this._projectiles.splice(i, 1);
                i = i === this._projectiles.length ? i : i - 1;
            }
        }
        Game.newTowerPlaced = false;
        this.checkWinLose();
        Particles.updateAll(this.elapsedTime);
    }

    public checkWinLose() {
        if (!this.hasStarted) return;
        if (!this.continue) return; 
        if (this._livesLeft <= 0 ) {
            HighScore.InsertScore(this._score);
            var fontSize = this._context.canvas.clientWidth / 30;
            this._context.font = fontSize + "px GoodTimes";
            this._context.textAlign = "center";
            this._context.fillStyle = Colors.Black;
            this._context.fillText("Game Over. Press ESC to return to main menu", this._context.canvas.clientWidth / 2, this._context.canvas.clientHeight / 2, this._context.canvas.clientWidth * 0.8);
            this.continue = false;
            return;
        }
        var done = true;
        for (var i = 0; i < this.Creep.length; i++) {
            if (this.Creep[i].state !== CreepState.Done && this.Creep[i].state !== CreepState.Dead) {
                done = false;
            }
        }
        if (done) {
            this.continue = false;
            if (this.levelNum === 5) {
                HighScore.InsertScore(this._score);
                var fontSize = this._context.canvas.clientWidth / 30;
                this._context.font = fontSize + "px GoodTimes";
                this._context.textAlign = "center";
                this._context.fillStyle = Colors.Black;
                this._context.fillText("Congratulations, finished with score " + this._score + "! Press ESC to return to main menu", this._context.canvas.clientWidth / 2, this._context.canvas.clientHeight / 2, this._context.canvas.clientWidth * 0.8);
                this.continue = false;
            } else {
                this.removeListeners();
                FloatingScores.addScore(this._context.canvas.clientWidth / 2, this._context.canvas.clientHeight / 2, "Level Complete, Press 'Start Level' when ready for more", this.elapsedTime, true);
                Application.CurrScreen = new Game(this.startTime, this._context, ++this.levelNum, { towers: this._activeTowers, money: this._money, lives: this._livesLeft, score: this._score + this.levelNum * 50, elTime:this.elapsedTime});
            }
        }
    }

    public draw = (delta) => {
        this._context["clear"]();
        this.gameGraphics.draw(this, delta);
        this.gameHud.draw(this, this._context);
    }
}

