class Sprite {
    stepCt: number = 4;
    img: HTMLImageElement;
    currIter : number;
    spriteSize: number;
    stepTime: number = 200;
    stepTimeCt: number;
    isBat : boolean;
    constructor(filename: string, size: number) {
        this.isBat = filename.indexOf("bat") > -1;
        this.img = new Image();
        this.img.src = filename;
        this.spriteSize = size / 4;
        this.currIter = 0;
        this.stepTimeCt = 0;
    }

    draw(ctx:CanvasRenderingContext2D,x:number,y:number,dir: Dir, delta: number) {
        this.stepTimeCt += delta;
        if (this.stepTimeCt > this.stepTime) {
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

        ctx.drawImage(this.img, this.currIter * this.spriteSize, num * this.spriteSize, this.spriteSize, this.spriteSize,
            x - Game.towerSize * 0.4, y - Game.towerSize * 0.4,Game.towerSize*1.8,Game.towerSize*1.8);
    }
}