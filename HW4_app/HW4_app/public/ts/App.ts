﻿//Application entry point
requirejs(['js/jquery-2.2.3.min.js',
    'ts/Graphics/GameGraphics.js',
    'ts/Graphics/GameHud.js',
    'ts/Graphics/Sprite.js',
    'ts/Menus/Controls.js',
    'ts/Menus/Credits.js',
    'ts/Menus/Highscore.js',
    'ts/Menus/MainMenu.js',
    'ts/Creep.js',
    'ts/Game.js',
    'ts/PathChecker.js',
    'ts/Tools.js',
    'ts/Tower.js',
],() => {
    $(document).ready(() => {
        var app = new Application();
    });
});
class Application {
    private _context: CanvasRenderingContext2D;
    public static LevelSpec: Array<LevelSpec>;

    constructor() {
        CanvasRenderingContext2D.prototype["clear"] = function () {
            this.save();
            this.setTransform(1, 0, 0, 1, 0, 0);
            this.clearRect(0, 0, canvas.width, canvas.height);
            this.restore();
        }
        var canvas = <HTMLCanvasElement>document.getElementById("canvas-main");
        canvas.height = canvas.clientHeight;
        canvas.width = canvas.clientWidth;  //dafuq?
        this._context = canvas.getContext("2d");

        Application.SetDefaultKeyBindings();

        //Calculate air paths
        PathChecker.calcAirPaths();

        //var game = new Game(performance.now(), this._context,l);
        var menu = new MainMenu(this._context);

    }

    public static SetDefaultKeyBindings() {
        //Set default key bindings:
        var bind = JSON.parse(localStorage.getItem("TD.keyBindings"));
        if (bind == undefined || bind == null) {
            var bindings = [];
            bindings.push(new Binding("Upgrade Tower", false, false,false, "u"));
            bindings.push(new Binding("Sell Tower", false, false,false, "s"));
            bindings.push(new Binding("Start Level", false, false,false, "g"));
            localStorage.setItem("TD.keyBindings", JSON.stringify(bindings));
        }
    }


}