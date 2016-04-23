class Binding {
    public title: string;
    public alt: boolean;
    public ctrl: boolean;
    public shift: boolean;
    public key: string;

    constructor(title: string, alt: boolean, ctrl: boolean,shift:boolean, key: string) {
        this.title = title;
        this.alt = alt;
        this.ctrl = ctrl;
        this.shift = shift;
        this.key = key;
    }
}

class Controls {
    private ctx: CanvasRenderingContext2D;
    private buttons: Array<MenuItem>;
    private buttonSpacing: number;

    private static get Action1():string {return "Upgrade Tower";}
    private static get Action2(): string { return "Sell Tower"; }
    private static get Action3(): string { return "Start Level"; }

    private recording: number;
    private bindings : Array<Binding>;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        document.addEventListener("mousemove", this.overListener);
        document.addEventListener("click", this.clickListener);
        document.addEventListener("keydown",this.keyListener);
        this.buttons = new Array<MenuItem>();
        this.buttons.push(new MenuItem("Key Controls:", () => { this.removeListeners(); new MainMenu(ctx) }));
        this.buttons.push(new MenuItem("", () => { this.recording = 0; }));
        this.buttons.push(new MenuItem("", () => { this.recording = 1; }));
        this.buttons.push(new MenuItem("", () => { this.recording = 2; }));
        this.buttons.push(new MenuItem("Back", () => { this.removeListeners(); new MainMenu(ctx) }));
        this.getCurrBindings();
        this.buttonSpacing = this.ctx.canvas.clientHeight / (this.buttons.length + 1);
        this.recording = null;
        this.draw();
    }

    public overListener = (e: MouseEvent) => {
        var x = e.clientX - document.getElementById("canvas-main").getBoundingClientRect().left;
        var y = e.clientY - document.getElementById("canvas-main").getBoundingClientRect().top;
        var selectedIndex = Math.floor((y - this.buttonSpacing / 2)/ this.buttonSpacing);
        if (selectedIndex < 0 || selectedIndex >= this.buttons.length || x > this.ctx.canvas.clientWidth || x < 0) {
            this.buttons.forEach((b) => { b.selected = false; });
        } else {
            for (var i = 0; i < this.buttons.length; i++) {
                this.buttons[i].selected = i === selectedIndex;
            }
        }
        this.draw();
    }

    public clickListener = (e: MouseEvent) => {
        for (var i = 0; i < this.buttons.length; i++) {
            if (this.buttons[i].selected && this.buttons[i].action != null) {
                this.buttons[i].action();
            }
        }
        this.draw();
    }

    public keyListener = (e: KeyboardEvent) => {
        console.log("event! " + e.keyCode);
        if (this.recording != null) {
            if (e.keyCode === 17 || e.keyCode === 18 || e.keyCode === 16) return;   //ignore if it's just the modifier key
            this.bindings[this.recording].ctrl = e.ctrlKey;
            this.bindings[this.recording].alt = e.altKey;
            this.bindings[this.recording].shift = e.shiftKey;
            this.bindings[this.recording].key = String.fromCharCode(e.keyCode);
            console.log("setting to: ", this.bindings[this.recording].key);

            localStorage.setItem("TD.keyBindings", JSON.stringify(this.bindings));
            this.recording = null;
            this.getCurrBindings();
        }
    }

    public removeListeners = () => {
        document.removeEventListener("mousemove", this.overListener);
        document.removeEventListener("click", this.clickListener);
    }

    public getCurrBindings() {
        var bind = JSON.parse(localStorage.getItem("TD.keyBindings"));
        if (bind == undefined || bind == null) {
            Application.SetDefaultKeyBindings();
        } else {
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
            this.buttons[i+1].title = this.bindings[i].title + ": " + keyCombo;
        }
        this.draw();
    }

    public draw() {
        drawBk(this.ctx);
        this.ctx.textAlign = "center";
        var fontSize = this.ctx.canvas.clientWidth / 20;
        this.ctx.font = fontSize + "px GoodTimes";
        if (this.recording == null) {
            for (var i = 0; i < this.buttons.length; i++) {
                this.ctx.fillStyle = this.buttons[i].selected && i > 0 ? "#e9f259" : "#000000";
                this.ctx.fillText(this.buttons[i].title, this.ctx.canvas.clientWidth / 2, this.buttonSpacing * (i + 1), this.ctx.canvas.clientWidth * 0.8);
            }
        } else {
            this.ctx.fillStyle = "#e9f259";

            this.ctx.fillText("Press desired key combination", this.ctx.canvas.clientWidth / 2, this.ctx.canvas.clientHeight/2, this.ctx.canvas.clientWidth * 0.8);
        }
    }
}