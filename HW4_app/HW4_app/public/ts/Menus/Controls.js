var Binding = (function () {
    function Binding(title, alt, ctrl, shift, key) {
        this.title = title;
        this.alt = alt;
        this.ctrl = ctrl;
        this.shift = shift;
        this.key = key;
    }
    return Binding;
}());
var Controls = (function () {
    function Controls(ctx) {
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
            _this.draw();
        };
        this.keyListener = function (e) {
            console.log("event! " + e.keyCode);
            if (_this.recording != null) {
                if (e.keyCode === 17 || e.keyCode === 18 || e.keyCode === 16)
                    return; //ignore if it's just the modifier key
                _this.bindings[_this.recording].ctrl = e.ctrlKey;
                _this.bindings[_this.recording].alt = e.altKey;
                _this.bindings[_this.recording].shift = e.shiftKey;
                _this.bindings[_this.recording].key = String.fromCharCode(e.keyCode);
                console.log("setting to: ", _this.bindings[_this.recording].key);
                localStorage.setItem("TD.keyBindings", JSON.stringify(_this.bindings));
                _this.recording = null;
                _this.getCurrBindings();
            }
        };
        this.removeListeners = function () {
            document.removeEventListener("mousemove", _this.overListener);
            document.removeEventListener("click", _this.clickListener);
        };
        this.ctx = ctx;
        document.addEventListener("mousemove", this.overListener);
        document.addEventListener("click", this.clickListener);
        document.addEventListener("keydown", this.keyListener);
        this.buttons = new Array();
        this.buttons.push(new MenuItem("Key Controls:", null));
        this.buttons.push(new MenuItem("", function () { _this.recording = 0; }));
        this.buttons.push(new MenuItem("", function () { _this.recording = 1; }));
        this.buttons.push(new MenuItem("", function () { _this.recording = 2; }));
        this.buttons.push(new MenuItem("Back", function () { _this.removeListeners(); Application.CurrScreen = new MainMenu(ctx); }));
        this.getCurrBindings();
        this.buttonSpacing = this.ctx.canvas.clientHeight / (this.buttons.length + 1);
        this.recording = null;
        this.draw();
    }
    Object.defineProperty(Controls, "Action1", {
        get: function () { return "Upgrade Tower"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Controls, "Action2", {
        get: function () { return "Sell Tower"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Controls, "Action3", {
        get: function () { return "Start Level"; },
        enumerable: true,
        configurable: true
    });
    Controls.prototype.getCurrBindings = function () {
        var bind = JSON.parse(localStorage.getItem("TD.keyBindings"));
        if (bind == undefined || bind == null) {
            Application.SetDefaultKeyBindings();
        }
        else {
            this.bindings = bind;
        }
        for (var i = 0; i < this.bindings.length; i++) {
            var keyCombo = "";
            if (this.bindings[i].shift) {
                keyCombo += "shift+";
            }
            if (this.bindings[i].ctrl) {
                keyCombo += "ctrl+";
            }
            if (this.bindings[i].alt) {
                keyCombo += "alt+";
            }
            keyCombo += this.bindings[i].key;
            this.buttons[i + 1].title = this.bindings[i].title + ": " + keyCombo;
        }
        this.draw();
    };
    Controls.prototype.draw = function () {
        drawBk(this.ctx);
        this.ctx.textAlign = "center";
        var fontSize = this.ctx.canvas.clientWidth / 20;
        this.ctx.font = fontSize + "px GoodTimes";
        if (this.recording == null) {
            for (var i = 0; i < this.buttons.length; i++) {
                this.ctx.fillStyle = this.buttons[i].selected && i > 0 ? "#e9f259" : "#000000";
                this.ctx.fillText(this.buttons[i].title, this.ctx.canvas.clientWidth / 2, this.buttonSpacing * (i + 1), this.ctx.canvas.clientWidth * 0.8);
            }
        }
        else {
            this.ctx.fillStyle = "#e9f259";
            this.ctx.fillText("Press desired key combination", this.ctx.canvas.clientWidth / 2, this.ctx.canvas.clientHeight / 2, this.ctx.canvas.clientWidth * 0.8);
        }
    };
    return Controls;
}());
//# sourceMappingURL=Controls.js.map