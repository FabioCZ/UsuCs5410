class FloatingScore {

    startTime;
    x;
    y;
    baseY;
    value;
    
    constructor(x, y, value, startTime) {
        this.x = x;
        this.baseY = y;
        this.y = y;
        this.value = value;
        this.startTime = startTime;
    }
}
class FloatingScores {
    static scores: Array<FloatingScore>;

    static addScore(x, y, value,currTime) {
        if (FloatingScores.scores == undefined) {
            FloatingScores.scores = new Array<FloatingScore>();
        }
        FloatingScores.scores.push(new FloatingScore(x, y, value, currTime));
    }
    static updateAndDraw(ctx: CanvasRenderingContext2D, currTime) {
        if (FloatingScores.scores === undefined) return;
        for (var i = 0; i < FloatingScores.scores.length; i++) {
            var s = FloatingScores.scores[i];
            var elapsed = currTime - s.startTime;
            if (elapsed > 1000) {
                FloatingScores.scores.splice(i, 1); //remove if more than a sec
                i = i === FloatingScores.scores.length ? i : i - 1;
            } else {
                var percDone = elapsed / 1000;
                s.y = s.baseY - percDone * Game.towerSize;
                var old = ctx.globalAlpha;
                ctx.globalAlpha = 1 - percDone;
                ctx.fillStyle = Colors.Black;
                ctx.fillText(s.value, s.x, s.y);
                ctx.globalAlpha = old;
            }

        }
    }
}