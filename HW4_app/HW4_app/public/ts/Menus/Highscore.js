///<reference path="../../../Scripts/typings/jquery/jquery.d.ts" />
var HighScore = (function () {
    function HighScore(ctx) {
        var _this = this;
        this.overListener = function (e) {
            var x = e.clientX - document.getElementById("canvas-main").getBoundingClientRect().left;
            var y = e.clientY - document.getElementById("canvas-main").getBoundingClientRect().top;
            var selectedIndex = Math.floor(y / _this.buttonSpacing);
            if (selectedIndex < 0 || selectedIndex >= _this.buttons.length) {
                _this.buttons.forEach(function (b) { b.selected = false; });
            }
            else {
                for (var i = 0; i < _this.buttons.length; i++) {
                    _this.buttons[i].selected = i === selectedIndex;
                }
            }
            _this.draw();
        };
        this.clickListener = function (e) {
            for (var i = 0; i < _this.buttons.length; i++) {
                if (_this.buttons[i].selected && _this.buttons[i].action != null) {
                    _this.buttons[i].action();
                }
            }
        };
        this.removeListeners = function () {
            document.removeEventListener("mousemove", _this.overListener);
            document.removeEventListener("click", _this.clickListener);
        };
        this.ctx = ctx;
        document.addEventListener("mousemove", this.overListener);
        document.addEventListener("click", this.clickListener);
        this.buttons = new Array();
        this.buttons.push(new MenuItem("High Scores", null));
        this.buttons.push(new MenuItem("1 : N/A", null));
        this.buttons.push(new MenuItem("2 : N/A", null));
        this.buttons.push(new MenuItem("3 : N/A", null));
        this.buttons.push(new MenuItem("4 : N/A", null));
        this.buttons.push(new MenuItem("5 : N/A", null));
        this.buttons.push(new MenuItem("Back", function () { _this.removeListeners(); new MainMenu(ctx); }));
        this.buttonSpacing = this.ctx.canvas.clientHeight / (this.buttons.length + 1);
        HighScore.GetScores(this.updateScores);
    }
    HighScore.prototype.draw = function () {
        drawBk(this.ctx);
        this.ctx.textAlign = "center";
        var fontSize = this.ctx.canvas.clientWidth / 20;
        this.ctx.font = fontSize + "px GoodTimes";
        for (var i = 0; i < this.buttons.length; i++) {
            this.ctx.fillStyle = this.buttons[i].selected && i === 6 ? "#e9f259" : "#000000";
            this.ctx.fillText(this.buttons[i].title, this.ctx.canvas.clientWidth / 2, this.buttonSpacing * (i + 1));
        }
    };
    HighScore.prototype.updateScores = function (data) {
        for (var i = 0; i < 5; i++) {
            this.buttons[i + 1].title = (i + 1) + ": " + (data[i] > 0 ? data[i] : "N/A");
        }
        this.draw();
    };
    HighScore.InsertScore = function (score) {
        $.ajax({
            url: 'http://localhost:3000/v1/score/' + score,
            type: 'POST',
            error: function () { alert('POST failed. Are you pointing to the right IP?'); },
            success: function () {
                console.log("Score " + score + " successfully added");
            }
        });
    };
    HighScore.GetScores = function (callBack) {
        $.ajax({
            url: 'http://localhost:3000/v1/getScores',
            type: 'GET',
            error: function () { alert('GET scores failed'); },
            success: function (data) {
                var res = JSON.parse(data);
                callBack(res);
            }
        });
    };
    return HighScore;
}());
//# sourceMappingURL=Highscore.js.map