function Explosions() {
    var that = {
        explosions: [],
    }

    that.addExplosion = function(time, x, y, w, h) {
        that.explosions.push(Explosion(time, x, y, w, h));
    }

    that.updateAll = function(time) {

        for (var i = 0; i < that.explosions.length; i++) {
            if(that.explosions[i].endTime < time) {
                that.explosions.splice(i,1);
                i++;
            } else {
            that.explosions[i].updateAndDraw(time);
            }
        }
    }

    return that;
}

function Explosion(time, x, y, w, h) {
    var duration = 1000;
    var that = {
        x: x,
        y: y,
        centerX: x + w / 2,
        centerY: y + h / 2,
        w: w,
        h: h,
        startTime: time,
        endTime: time + duration,
        particles: [],
        lastStamp: time,
    }

    that.createParticle = function(t) {
        var that2 = {
            size : Gen.gaussianWithMidPoint(that.h /20),
            x: that.centerX,
            y: that.centerY,
            direction: Gen.direction(),
            speed: Gen.gaussianWithMidPoint(2.0),
            rotation: 0,
            start: t,
            duration: Gen.gaussianWithMidPoint(that.endTime -t)
        }
        that.particles.push(that2);
    }

    that.updateAndDraw = function(t) {
        var delta = t - that.lastStamp;
        if(t < that.endTime - duration + 100){
            that.createParticle(t);
            that.createParticle(t);
            that.createParticle(t);
            that.createParticle(t);
            that.createParticle(t);
            that.createParticle(t);
        }
        for (var i = 0; i < that.particles.length; i++) {
            if (t >= that.particles[i].start + that.particles[i].duration) {
                that.particles.splice(i, 1);    //remove if dead
            } else {
                var speed = that.particles[i].speed;
                //update
                that.particles[i].x += (delta/1000) * speed * that.particles[i].direction.x;
                that.particles[i].y += (delta/1000) * speed * that.particles[i].direction.y;

                if (that.particles[i].x < x || that.particles[i].x > x + w ||
                    that.particles[i].y < y || that.particles[i].y > y + h) {
                    that.particles.splice(i, 1);    //remove if outside of brick
                }
            }
        }
    }
    
    that.createParticle(time);
    that.createParticle(time);
    that.createParticle(time);
    that.createParticle(time);
    that.createParticle(time);
    that.createParticle(time);
    that.createParticle(time);
    that.createParticle(time);

    return that;
}