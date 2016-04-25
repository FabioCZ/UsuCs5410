//Application entry point
requirejs(['js/jquery-2.2.3.min.js',
    'ts/Graphics/GameGraphics.js',
    'ts/Graphics/FloatingScores.js',
    'ts/Graphics/GameHud.js',
    'ts/Graphics/Particles.js',
    'ts/Graphics/Sprite.js',
    'ts/Menus/Controls.js',
    'ts/Menus/Credits.js',
    'ts/Menus/Highscore.js',
    'ts/Menus/MainMenu.js',
    'ts/Creep.js',
    'ts/Game.js',
    'ts/PathChecker.js',
    'ts/Projectiles.js',
    'ts/Sound.js',
    'ts/Tools.js',
    'ts/Tower.js',
], function () {
    $(document).ready(function () {
        var app = new Application();
    });
});
var Application = (function () {
    function Application() {
        CanvasRenderingContext2D.prototype["clear"] = function () {
            this.save();
            this.setTransform(1, 0, 0, 1, 0, 0);
            this.clearRect(0, 0, canvas.width, canvas.height);
            this.restore();
        };
        var canvas = document.getElementById("canvas-main");
        canvas.height = canvas.clientHeight;
        canvas.width = canvas.clientWidth; //dafuq?
        this._context = canvas.getContext("2d");
        Application.SetDefaultKeyBindings();
        Sound.init();
        //Calculate air paths
        PathChecker.calcAirPaths();
        //var game = new Game(performance.now(), this._context,l);
        Application.CurrScreen = new MainMenu(this._context);
        //Application.CurrScreen = new Game(performance.now(), this._context, 2, { towers: null, money: 100, lives: 15, score: 0, elTime:0 });
    }
    Application.SetDefaultKeyBindings = function () {
        //Set default key bindings:
        var bind = JSON.parse(localStorage.getItem("TD.keyBindings"));
        if (bind == undefined || bind == null) {
            var bindings = [];
            bindings.push(new Binding("Upgrade Tower", false, false, false, "u"));
            bindings.push(new Binding("Sell Tower", false, false, false, "s"));
            bindings.push(new Binding("Start Level", false, false, false, "g"));
            localStorage.setItem("TD.keyBindings", JSON.stringify(bindings));
        }
    };
    return Application;
}());
//# sourceMappingURL=Application.js.map