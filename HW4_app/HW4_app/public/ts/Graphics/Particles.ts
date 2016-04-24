interface IParticleSys {
    centerX: number;
    centerY: number;
    w: number;
    h: number;
    startTime: number;
    endTime: number;
    particles: any;
    lastStamp: number;
    duration: number;
    color;
    update(t);
    draw(ctx: CanvasRenderingContext2D);
}

class Explosion implements IParticleSys{
    centerX: number;
    centerY: number;
    w: number;
    h: number;
    startTime: number;
    endTime: number;
    particles: any;
    lastStamp: number;
    duration: number;
    color;
    constructor(time, x, y, color,duration) {
        this.color = color;
        this.duration = duration;
        this.centerX = x;
        this.centerY = y;
        this.startTime = time;
        this.endTime = time + this.duration; //Explosion duration
        this.lastStamp = time;
        this.particles = new Array<any>();
        this.createParticle(time);
        this.createParticle(time);
        this.createParticle(time);
        this.createParticle(time);
        this.createParticle(time);
        this.createParticle(time);
        this.createParticle(time);

    }

    private createParticle (t) {
        var that2 = {
            size: gaussianWithMidPoint(Game.towerSize / 35),
            x: this.centerX,
            y: this.centerY,
            direction: direction(),
            speed: gaussianWithMidPoint(1.5),
            rotation: 0,
            start: t,
            duration: gaussianWithMidPoint(this.endTime - t)
        }
        this.particles.push(that2);
    }

    public update(t) {
        var delta = t - this.lastStamp;
        if (t < this.endTime - this.duration + 100) {
            this.createParticle(t);
            this.createParticle(t);
            this.createParticle(t);
            this.createParticle(t);
            this.createParticle(t);
            this.createParticle(t);
        }
        for (var i = 0; i < this.particles.length; i++) {
            if (t >= this.particles[i].start + this.particles[i].duration) {
                this.particles.splice(i, 1);    //remove if dead
            } else {
                var speed = this.particles[i].speed;
                //update
                this.particles[i].x += (delta / 1000) * speed * this.particles[i].direction.x;
                this.particles[i].y += (delta / 1000) * speed * this.particles[i].direction.y;

            }
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        for (var i = 0; i < this.particles.length; i++) {
            var size = this.particles[i].size;
            ctx.fillStyle = this.color;
            ctx.fillRect(this.particles[i].x - size / 2, this.particles[i].y - size / 2, size, size);
        }
    }


}

class Trace implements IParticleSys {
    centerX: number;
    centerY: number;
    w: number;
    h: number;
    startTime: number;
    endTime: number;
    particles: any;
    lastStamp: number;
    duration: number;
    color;
    constructor(time, x, y, color, duration) {
        this.color = color;
        this.duration = duration;
        this.centerX = x;
        this.centerY = y;
        this.startTime = time;
        this.endTime = time + this.duration; //Explosion duration
        this.lastStamp = time;
        this.particles = new Array<any>();
        this.createParticle(time);
        this.createParticle(time);
        this.createParticle(time);
        this.createParticle(time);
        this.createParticle(time);
        this.createParticle(time);
        this.createParticle(time);

    }

    private createParticle(t) {
        var that2 = {
            size: gaussianWithMidPoint(Game.towerSize / 60),
            x: this.centerX,
            y: this.centerY,
            direction: direction(),
            speed: gaussianWithMidPoint(5),
            rotation: 0,
            start: t,
            duration: gaussianWithMidPoint(this.endTime - t)
        }
        this.particles.push(that2);
    }

    public update(t) {
        var delta = t - this.lastStamp;
        if (t < this.endTime - this.duration + 100) {
            this.createParticle(t);

        }
        for (var i = 0; i < this.particles.length; i++) {
            if (t >= this.particles[i].start + this.particles[i].duration) {
                this.particles.splice(i, 1);    //remove if dead
            } else {
                var speed = this.particles[i].speed;
                //update
                this.particles[i].x += (delta / 1000) * speed * this.particles[i].direction.x;
                this.particles[i].y += (delta / 1000) * speed * this.particles[i].direction.y;

                //if (this.particles[i].x < this.x || this.particles[i].x > this.x + this.w ||
                //    this.particles[i].y < this.y || this.particles[i].y > this.y + this.h) {
                //    this.particles.splice(i, 1);    //remove if outside of brick
                //}
            }
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        for (var i = 0; i < this.particles.length; i++) {
            var size = this.particles[i].size;
            if (this.color == Colors.Red) size *= 3;
            ctx.fillStyle = this.color;
            ctx.fillRect(this.particles[i].x - size / 2, this.particles[i].y - size / 2, size, size);
        }
    }


}
class Particles {
    static explosions: Array<IParticleSys>;

    public static addExplosion(time, x, y) {
        if (Particles.explosions == undefined) {
            Particles.explosions = new Array<IParticleSys>();
        }
        Particles.explosions.push(new Explosion(time, x, y,Colors.Black,500));
    }

    public static addCreepExpl(time, x, y) {
        if (Particles.explosions == undefined) {
            Particles.explosions = new Array<IParticleSys>();
        }
        Particles.explosions.push(new Explosion(time, x, y,Colors.Red,750));
    }

    public static addProjExpl(time, x, y) {
        if (Particles.explosions == undefined) {
            Particles.explosions = new Array<IParticleSys>();
        }
        Particles.explosions.push(new Explosion(time, x, y, Colors.Yellow, 750));
        Particles.explosions.push(new Explosion(time, x, y, Colors.Orage, 750));

    }

    public static addTowerSold(time, x, y) {
        if (Particles.explosions == undefined) {
            Particles.explosions = new Array<IParticleSys>();
        }
        Particles.explosions.push(new Explosion(time, x, y, Colors.Pink, 750)); 
    }

    public static addTraceMissile(time, x, y) {
        if (Particles.explosions == undefined) {
            Particles.explosions = new Array<IParticleSys>();
        }
        Particles.explosions.push(new Trace(time, x, y, Colors.DarkRed, 150)); 
    }

    public static addTraceBomb(time, x, y) {
        if (Particles.explosions == undefined) {
            Particles.explosions = new Array<IParticleSys>();
        }
        Particles.explosions.push(new Trace(time, x, y, Colors.Grey, 150));
    }

    public static updateAll(time) {
        if (Particles.explosions == undefined) return;
        for (var i = 0; i < Particles.explosions.length; i++) {
            if (Particles.explosions[i].endTime < time) {
                Particles.explosions.splice(i, 1);
                i++;
            } else {
                Particles.explosions[i].update(time);
            }
        }
    }

    public static drawAll(ctx: CanvasRenderingContext2D) {
        if (Particles.explosions == undefined) return;
        for (var i = 0; i < Particles.explosions.length; i++) {
            Particles.explosions[i].draw(ctx);
        }
    }

}