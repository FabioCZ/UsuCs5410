var Credits = (function () {
    function Credits(ctx) {
        var _this = this;
        this.overListener = function (e) {
            var x = e.clientX - document.getElementById("canvas-main").getBoundingClientRect().left;
            var y = e.clientY - document.getElementById("canvas-main").getBoundingClientRect().top;
            var selectedIndex = Math.floor((y - _this.buttonSpacing / 2) / _this.buttonSpacing);
            if (selectedIndex < 0 || selectedIndex >= _this.buttons.length || x > _this.ctx.canvas.clientWidth || x < 0) {
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
        this.buttons.push(new MenuItem("Created by:", null));
        this.buttons.push(new MenuItem("Fabio Gottlicher:", null));
        this.buttons.push(new MenuItem("CS 5410 - Spring 2016", null));
        this.buttons.push(new MenuItem("Back", function () { _this.removeListeners(); Application.CurrScreen = new MainMenu(ctx); }));
        this.buttonSpacing = this.ctx.canvas.clientHeight / (this.buttons.length + 1);
    }
    Credits.prototype.draw = function () {
        drawBk(this.ctx);
        this.ctx.textAlign = "center";
        var fontSize = this.ctx.canvas.clientWidth / 20;
        this.ctx.font = fontSize + "px GoodTimes";
        for (var i = 0; i < this.buttons.length; i++) {
            this.ctx.fillStyle = this.buttons[i].selected && i === 3 ? "#e9f259" : "#000000";
            this.ctx.fillText(this.buttons[i].title, this.ctx.canvas.clientWidth / 2, this.buttonSpacing * (i + 1));
        }
    };
    return Credits;
}());
//# sourceMappingURL=Credits.js.map