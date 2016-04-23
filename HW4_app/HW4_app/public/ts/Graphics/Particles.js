var Explosion = (function () {
    function Explosion(time, x, y) {
        this.duration = 1500;
        this.centerX = x;
        this.centerY = y;
        this.startTime = time;
        this.endTime = time + this.duration; //Explosion duration
        this.lastStamp = time;
        this.particles = new Array();
        this.createParticle(time);
        this.createParticle(time);
        this.createParticle(time);
        this.createParticle(time);
        this.createParticle(time);
        this.createParticle(time);
        this.createParticle(time);
    }
    Explosion.prototype.createParticle = function (t) {
        var that2 = {
            size: gaussianWithMidPoint(this.h / 20),
            x: this.centerX,
            y: this.centerY,
            direction: direction(),
            speed: gaussianWithMidPoint(2.0),
            rotation: 0,
            start: t,
            duration: gaussianWithMidPoint(this.endTime - t)
        };
        this.particles.push(that2);
    };
    Explosion.prototype.update = function (t) {
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
                this.particles.splice(i, 1); //remove if dead
            }
            else {
                var speed = this.particles[i].speed;
                //update
                this.particles[i].x += (delta / 1000) * speed * this.particles[i].direction.x;
                this.particles[i].y += (delta / 1000) * speed * this.particles[i].direction.y;
            }
        }
    };
    Explosion.prototype.draw = function (ctx) {
        for (var i = 0; i < this.particles.length; i++) {
            var size = this.particles[i].size;
            ctx.fillRect(this.particles[i].x - size / 2, this.particles[i].y - size / 2, size, size);
        }
    };
    return Explosion;
}());
var Particles = (function () {
    function Particles() {
    }
    Particles.addExplosion = function (time, x, y) {
        if (Particles.explosions == undefined) {
            Particles.explosions = new Array();
        }
        Particles.explosions.push(new Explosion(time, x, y));
    };
    Particles.updateAll = function (time) {
        for (var i = 0; i < Particles.explosions.length; i++) {
            if (Particles.explosions[i].endTime < time) {
                Particles.explosions.splice(i, 1);
                i++;
            }
            else {
                Particles.explosions[i].update(time);
            }
        }
    };
    Particles.draw = function (ctx) {
        for (var i = 0; i < Particles.explosions.length; i++) {
            Particles.explosions[i].draw(ctx);
        }
    };
    return Particles;
}());
//# sourceMappingURL=Particles.js.map