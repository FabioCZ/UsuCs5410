var Bomb = (function () {
    function Bomb(level, fromX, fromY, toX, toY) {
        if (level === 1) {
            this.attack = 10;
            this.speed = Game.towerSize / 200;
            this.explRadius = Game.towerSize * 1;
        }
        else if (level === 2) {
            this.attack = 20;
            this.speed = Game.towerSize / 100;
            this.explRadius = Game.towerSize * 1.5;
        }
        else {
            this.attack = 30;
            this.speed = Game.towerSize / 50;
            this.explRadius = Game.towerSize * 2.5;
        }
        this.fromX = fromX;
        this.fromY = fromY;
        toX = toX + Game.towerSize / 2;
        toY = toY + Game.towerSize / 2;
        this.currX = fromX;
        this.currY = fromY;
        this.targetDist = Math.sqrt((fromX - toX) * (fromX - toX) + (fromY - toY) * (fromY - toY));
        this.elapsedDist = 0;
        var targetAngleRad = Math.atan2((toY - fromY), (toX - fromX));
        //targetAngleRad += Math.PI / 2;
        if (targetAngleRad > 2 * Math.PI) {
            targetAngleRad -= (2 * Math.PI);
        }
        else if (targetAngleRad < 0) {
            targetAngleRad += (2 * Math.PI);
        }
        this.vX = Math.cos(targetAngleRad);
        this.vY = Math.sin(targetAngleRad);
    }
    Bomb.prototype.update = function (gs, delta) {
        var dX = this.vX * this.speed * delta;
        var dY = this.vY * this.speed * delta;
        this.elapsedDist += this.speed * delta;
        this.currX += dX;
        this.currY += dY;
        Particles.addTrace(gs.ElapsedTime, this.currX, this.currY);
        if (this.elapsedDist >= this.targetDist) {
            Sound.Hit.play();
            for (var i = 0; i < gs.Creep.length; i++) {
                var c = gs.Creep[i];
                if (c.type === CType.Air || c.state !== CreepState.Active)
                    continue;
                if (Math.sqrt((c.x - this.currX) * (c.x - this.currX) + (c.y - this.currY) * (c.y - this.currY)) < this.explRadius) {
                    c.hit(this.attack, gs);
                }
            }
            Particles.addProjExpl(gs.ElapsedTime, this.currX, this.currY);
            return true;
        }
        return false;
    };
    Bomb.prototype.draw = function (ctx) {
        ctx.fillStyle = Colors.Black;
        ctx.fillRect(this.currX, this.currY, 5, 5);
    };
    return Bomb;
}());
var MixedProj = (function () {
    function MixedProj(level, fromX, fromY, toX, toY) {
        if (level === 1) {
            this.attack = 20;
            this.speed = Game.towerSize / 200;
        }
        else if (level === 2) {
            this.attack = 40;
            this.speed = Game.towerSize / 100;
        }
        else {
            this.attack = 60;
            this.speed = Game.towerSize / 50;
        }
        this.fromX = fromX;
        this.fromY = fromY;
        toX = toX + Game.towerSize / 2;
        toY = toY + Game.towerSize / 2;
        this.currX = fromX;
        this.currY = fromY;
        this.targetDist = level === 1 ? Game.baseTowerRadius : (level === 2 ? Game.baseTowerRadius * 1.25 : Game.baseTowerRadius * 1.25 * 1.25);
        this.elapsedDist = 0;
        var targetAngleRad = Math.atan2((toY - fromY), (toX - fromX));
        //targetAngleRad += Math.PI / 2;
        if (targetAngleRad > 2 * Math.PI) {
            targetAngleRad -= (2 * Math.PI);
        }
        else if (targetAngleRad < 0) {
            targetAngleRad += (2 * Math.PI);
        }
        this.vX = Math.cos(targetAngleRad);
        this.vY = Math.sin(targetAngleRad);
    }
    MixedProj.prototype.update = function (gs, delta) {
        var dX = this.vX * this.speed * delta;
        var dY = this.vY * this.speed * delta;
        this.elapsedDist += this.speed * delta;
        this.currX += dX;
        this.currY += dY;
        Particles.addTrace(gs.ElapsedTime, this.currX, this.currY);
        if (this.elapsedDist > this.targetDist) {
            Particles.addProjExpl(gs.ElapsedTime, this.currX, this.currY);
            return true;
        }
        for (var i = 0; i < gs._creep.length; i++) {
            var c = gs._creep[i];
            if (this.currX > c.x && this.currX < c.x + Game.towerSize && this.currY > c.y && this.currY < c.y + Game.towerSize) {
                c.hit(this.attack, gs);
                Sound.Hit.play();
                Particles.addProjExpl(gs.ElapsedTime, this.currX, this.currY);
                return true;
            }
        }
        return false;
    };
    MixedProj.prototype.draw = function (ctx) { };
    return MixedProj;
}());
var GuidedProj = (function () {
    function GuidedProj(level, fromX, fromY, toX, toY) {
        if (level === 1) {
            this.attack = 20;
            this.speed = Game.towerSize / 200;
        }
        else if (level === 2) {
            this.attack = 40;
            this.speed = Game.towerSize / 100;
        }
        else {
            this.attack = 60;
            this.speed = Game.towerSize / 50;
        }
        this.fromX = fromX;
        this.fromY = fromY;
        this.currX = fromX;
        this.currY = fromY;
        this.tCI = -10;
        this.tCJ = -10;
    }
    GuidedProj.prototype.setCreepIndex = function (cI) {
        this.targetCreepIndex = cI;
    };
    GuidedProj.prototype.update = function (gs, delta) {
        var c = gs._creep[this.targetCreepIndex];
        var cCI = Game.xToI(c.x);
        var cCJ = Game.yToJ(c.y);
        if (this.tCI != cCI || this.tCJ != cCJ) {
            this.path = PathChecker.getGuidedProjPath(Game.xToI(this.currX), Game.yToJ(this.currY), cCI, cCJ);
        }
    };
    GuidedProj.prototype.draw = function (ctx) { };
    return GuidedProj;
}());
//# sourceMappingURL=Projectiles.js.map