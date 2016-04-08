function Explosions() {
    var that = {
        explosions: [],
    }

    that.addExplosion = function(time, x, y) {
        that.explosions.push(Explosion(time, x, y));
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

function Explosion(time, x, y) {
    var duration = 2000;
    var that = {
        x: x,
        y: y,
        centerX: x + Bomb.Graphics.getBombWidth()*0.6,
        centerY: y + Bomb.Graphics.getBombWidth()*0.6,
        startTime: time,
        endTime: time + duration,
        particles: [],
        lastStamp: time,
    }

    that.createParticle = function(t) {
        var that2 = {
            size : Gen.gaussianWithMidPoint(Bomb.Graphics.getBombWidth()/40),
            x: that.centerX,
            y: that.centerY,
            direction: Gen.direction(),
            speed: Gen.gaussianWithMidPoint(Bomb.Graphics.getBombWidth()/75),
            rotation: 0,
            start: t,
            duration: Gen.gaussianWithMidPoint(that.endTime -t)
        }
        that.particles.push(that2);
    }

    that.updateAndDraw = function(t) {  //t is elapsed
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
                var el = t - that.startTime;
                that.particles[i].y += (el/100) * (el/100) * (Bomb.Graphics.getBombWidth()/5000);
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