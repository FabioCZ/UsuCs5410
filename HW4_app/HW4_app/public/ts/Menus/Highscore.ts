///<reference path="../../../Scripts/typings/jquery/jquery.d.ts" />
class HighScore {

    private ctx: CanvasRenderingContext2D;
    private buttons: Array<MenuItem>;
    private buttonSpacing: number;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        document.addEventListener("mousemove", this.overListener);
        document.addEventListener("click", this.clickListener);
        this.buttons = new Array<MenuItem>();
        this.buttons.push(new MenuItem("High Scores", null));
        this.buttons.push(new MenuItem("1 : N/A", null));
        this.buttons.push(new MenuItem("2 : N/A", null));
        this.buttons.push(new MenuItem("3 : N/A", null));
        this.buttons.push(new MenuItem("4 : N/A", null));
        this.buttons.push(new MenuItem("5 : N/A", null));
        this.buttons.push(new MenuItem("Back", () => { this.removeListeners(); Application.CurrScreen = new MainMenu(ctx);}));
        this.buttonSpacing = this.ctx.canvas.clientHeight / (this.buttons.length + 1);
        this.GetScores(this.updateScores);
    }

    public overListener = (e: MouseEvent) => {
        var x = e.clientX - document.getElementById("canvas-main").getBoundingClientRect().left;
        var y = e.clientY - document.getElementById("canvas-main").getBoundingClientRect().top;
        var selectedIndex = Math.floor((y - this.buttonSpacing / 2) / this.buttonSpacing);
        if (selectedIndex < 0 || selectedIndex >= this.buttons.length) {
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
            this.ctx.fillStyle = this.buttons[i].selected && i === 6 ? "#e9f259" : "#000000";
            this.ctx.fillText(this.buttons[i].title, this.ctx.canvas.clientWidth / 2, this.buttonSpacing * (i + 1));
        }
    }

    public updateScores = (data)=> {
        for (var i = 0; i < 5; i++) {
            this.buttons[i + 1].title = (i + 1) + ": " + (data[i] > 0 ? data[i] : "N/A");
        }
        this.draw();
    }
    public static InsertScore = (score : number) =>{
        $.ajax({
            url: 'http://localhost:3000/v1/addScore/' + score,
            type: 'POST',
            error: function () { alert('POST failed. Are you pointing to the right IP?'); },
            success: function () {
                console.log("Score " + score + " successfully added");
            }
        });
    }

    public GetScores = (callBack: Function) => {
        $.ajax({
            url: 'http://localhost:3000/v1/getScores',
            type: 'GET',
            error: function() { alert('GET scores failed'); },
            success: function(data) {
                //var res = JSON.parse(data);
                callBack(data);
            }
        });
    }
}