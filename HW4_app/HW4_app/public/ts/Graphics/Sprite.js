var Sprite = (function () {
    function Sprite(filename, size) {
        this.stepCt = 4;
        this.stepTime = 200;
        this.isBat = filename.indexOf("bat") > -1;
        this.img = new Image();
        this.img.src = filename;
        this.spriteSize = size / 4;
        this.currIter = 0;
        this.stepTimeCt = 0;
    }
    Sprite.prototype.draw = function (ctx, x, y, dir, delta, isFrozen) {
        this.stepTimeCt += delta;
        var st = isFrozen ? this.stepTime * 2 : this.stepTime;
        if (this.stepTimeCt > st) {
            this.currIter = this.currIter === 3 ? 0 : this.currIter + 1;
            this.stepTimeCt = 0;
        }
        var num;
        switch (dir) {
            case Dir.Up:
                num = this.isBat ? 2 : 0;
                break;
            case Dir.Right:
                num = this.isBat ? 1 : 3;
                break;
            case Dir.Down:
                num = this.isBat ? 0 : 2;
                break;
            case Dir.Left:
                num = this.isBat ? 3 : 1;
                break;
        }
        ctx.drawImage(this.img, this.currIter * this.spriteSize, num * this.spriteSize, this.spriteSize, this.spriteSize, x - Game.towerSize * 0.4, y - Game.towerSize * 0.4, Game.towerSize * 1.8, Game.towerSize * 1.8);
    };
    return Sprite;
}());
//# sourceMappingURL=Sprite.js.map