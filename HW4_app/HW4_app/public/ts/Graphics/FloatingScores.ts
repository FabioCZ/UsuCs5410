class FloatingScore {

    startTime;
    x;
    y;
    baseY;
    value;
    isBig;
    constructor(x, y, value, startTime,isBig) {
        this.x = x;
        this.baseY = y;
        this.y = y;
        this.value = value;
        this.startTime = startTime;
        this.isBig = isBig;
    }
}
class FloatingScores {
    static scores: Array<FloatingScore>;

    static addScore(x, y, value, currTime, isBig) {
        console.log("adding floating score");
        if (FloatingScores.scores == undefined) {
            FloatingScores.scores = new Array<FloatingScore>();
        }
        FloatingScores.scores.push(new FloatingScore(x, y, value, currTime,isBig));
    }
    static updateAndDraw(ctx: CanvasRenderingContext2D, currTime: number) {
        if (FloatingScores.scores === undefined) return;
        for (var i = 0; i < FloatingScores.scores.length; i++) {
            var s = FloatingScores.scores[i];
            var elapsed = currTime - s.startTime;
            //console.log("fsEl", elapsed);
            if (elapsed < 0) return;
            if (elapsed > (s.isBig ? 2000 :1000)) {
                FloatingScores.scores.splice(i, 1); //remove if more than a sec
                i = i === FloatingScores.scores.length ? i : i - 1;
            } else {
                var percDone = elapsed / (s.isBig ? 2000 : 1000);
                s.y = s.baseY - percDone * Game.towerSize;
                var old = ctx.globalAlpha;
                ctx.globalAlpha = 1 - percDone;
                ctx.textAlign = "center";
                var fontSize = s.isBig ? ctx.canvas.clientWidth / 30 : ctx.canvas.clientWidth / 70;
                ctx.font = fontSize + "px GoodTimes";
                ctx.fillStyle = Colors.Black;
                ctx.fillText(s.value, s.x, s.y,ctx.canvas.clientWidth * 0.8);
                ctx.globalAlpha = old;
            }

        }
    }
}