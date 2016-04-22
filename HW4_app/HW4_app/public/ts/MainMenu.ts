class MenuItem {
    public title: string;
    public action: Function;
    public selected: boolean;
    constructor(title: string, action: Function) {
        this.title = title;
        this.action = action;
        this.selected = false;
    }
}
class MainMenu {
    private ctx : CanvasRenderingContext2D;
    private buttons: Array<MenuItem>;
    private buttonSpacing: number;

    constructor(ctx : CanvasRenderingContext2D) {
        this.ctx = ctx;
        document.addEventListener("mousemove", this.overListener);
        document.addEventListener("click", this.clickListener);
        this.buttons = new Array<MenuItem>();
        this.buttons.push(new MenuItem("New Game", () => { this.removeListeners(); new Game(performance.now(), ctx,1,null) }));
        this.buttons.push(new MenuItem("High Scores", () => { this.removeListeners(); new HighScore(ctx)}));
        this.buttons.push(new MenuItem("Controls", () => { this.removeListeners(); new Controls(ctx)}));
        this.buttons.push(new MenuItem("Credits", () => { this.removeListeners(); new Credits(ctx)}));
        this.buttonSpacing = this.ctx.canvas.clientHeight / (this.buttons.length + 1);
    } 

    public overListener = (e: MouseEvent) => {
        var x = e.clientX - document.getElementById("canvas-main").getBoundingClientRect().left;
        var y = e.clientY - document.getElementById("canvas-main").getBoundingClientRect().top;
        var selectedIndex = Math.floor(y / this.buttonSpacing);
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
            if (this.buttons[i].selected) {
                this.buttons[i].action();
            }
        }
    }

    public removeListeners = () => {
        document.removeEventListener("mousemove", this.overListener);
        document.removeEventListener("click", this.clickListener);
    }

    public draw() {
        drawBk(this.ctx);
        this.ctx.textAlign = "center";
        var fontSize = this.ctx.canvas.clientWidth / 20;
        this.ctx.font = fontSize + "px GoodTimes";
        for (var i = 0; i < this.buttons.length; i++) {
            this.ctx.fillStyle = this.buttons[i].selected ? "#e9f259" : "#000000";
            this.ctx.fillText(this.buttons[i].title, this.ctx.canvas.clientWidth / 2, this.buttonSpacing * (i + 1));
        }
    }
}