var TowerButton = (function () {
    function TowerButton(rect, tower) {
        this.rect = rect;
        this.tower = tower;
    }
    TowerButton.prototype.draw = function (ctx) {
        var centerX = this.rect.x + this.rect.w / 2;
        ctx.fillStyle = Colors.Grey;
        ctx.drawImage(GameHud.Panel, this.rect.x, this.rect.y, this.rect.w, this.rect.h);
        ctx.textAlign = "center";
        ctx.fillStyle = Colors.Black;
        ctx.fillText("Tower:", centerX, this.rect.y + this.rect.h * 0.2, this.rect.w);
        ctx.fillText(this.tower.name, centerX, this.rect.y + this.rect.h * 0.4, this.rect.w);
        ctx.fillText(this.tower.cost + "€", centerX, this.rect.y + this.rect.h * 0.6, this.rect.w);
        ctx.drawImage(this.tower.turretImg, centerX - Game.towerSize / 2, this.rect.y + this.rect.h * 0.65, Game.towerSize, Game.towerSize);
    };
    return TowerButton;
}());
var TowerDetails = (function () {
    function TowerDetails(rect) {
        this.rect = rect;
        this.tower = null;
        this.buttonRectSell = new Rect(rect.x + GameHud.buttonPadding, rect.y + rect.h * 0.6, rect.w - GameHud.buttonPadding * 2, rect.h * 0.2 - GameHud.buttonPadding);
        this.buttonRectUpg = new Rect(rect.x + GameHud.buttonPadding, rect.y + rect.h * 0.8, rect.w - GameHud.buttonPadding * 2, rect.h * 0.2 - GameHud.buttonPadding);
    }
    TowerDetails.prototype.setTower = function (tower) {
        this.tower = tower;
    };
    TowerDetails.prototype.draw = function (ctx) {
        var centerX = this.rect.x + this.rect.w / 2;
        ctx.fillStyle = Colors.Grey;
        ctx.drawImage(GameHud.Panel, this.rect.x, this.rect.y, this.rect.w, this.rect.h);
        if (this.tower != null) {
            ctx.textAlign = "center";
            ctx.fillStyle = Colors.Black;
            ctx.fillText("Selected tower: " + this.tower.name, centerX, this.rect.y + this.rect.h / 4, this.rect.w);
            ctx.fillStyle = Colors.LtGrey;
            ctx.drawImage(GameHud.Button, this.buttonRectSell.x, this.buttonRectSell.y, this.buttonRectSell.w, this.buttonRectSell.h);
            ctx.drawImage(GameHud.Button, this.buttonRectUpg.x, this.buttonRectUpg.y, this.buttonRectUpg.w, this.buttonRectUpg.h);
            ctx.textAlign = "center";
            ctx.fillStyle = Colors.Black;
            ctx.fillText("Sell: " + ~~(this.tower.cost / 2) + "€", centerX, this.buttonRectSell.y + this.buttonRectSell.h * 0.8, this.buttonRectSell.w);
            var upgradeText = this.tower.upgradeLevel == 3 ? "Maxed upgrades" : "Upgrade: " + ~~(this.tower.cost / 3) + "€";
            ctx.fillText(upgradeText, centerX, this.buttonRectUpg.y + this.buttonRectUpg.h * 0.8, this.buttonRectUpg.w);
        }
        else {
            ctx.textAlign = "center";
            ctx.fillStyle = Colors.Black;
            ctx.fillText("No tower selected", centerX, this.rect.y + this.rect.h / 2, this.rect.w);
        }
    };
    return TowerDetails;
}());
var GameDetails = (function () {
    function GameDetails(rect) {
        this.rect = rect;
        this.startGameRect = new Rect(rect.x + GameHud.buttonPadding, rect.y + rect.h * 0.8, rect.w - GameHud.buttonPadding * 2, rect.h * 0.2 - GameHud.buttonPadding);
    }
    GameDetails.prototype.draw = function (gs, ctx) {
        var centerX = this.rect.x + this.rect.w / 2;
        ctx.fillStyle = Colors.Grey;
        ctx.drawImage(GameHud.Panel, this.rect.x, this.rect.y, this.rect.w, this.rect.h);
        ctx.fillStyle = Colors.LtGrey;
        ctx.drawImage(GameHud.Button, this.startGameRect.x, this.startGameRect.y, this.startGameRect.w, this.startGameRect.h);
        ctx.textAlign = "center";
        ctx.fillStyle = Colors.Black;
        ctx.fillText("Game stats:", this.startGameRect.x + this.startGameRect.w / 2, this.rect.y + this.startGameRect.h * 0.8 + GameHud.buttonPadding * 2, this.startGameRect.w);
        ctx.fillText("Money: " + gs.Money + "€", this.startGameRect.x + this.startGameRect.w / 2, this.rect.y + this.startGameRect.h * 1.8 + GameHud.buttonPadding * 2, this.startGameRect.w);
        ctx.fillText("Lives: " + gs.LivesLeft, this.startGameRect.x + this.startGameRect.w / 2, this.rect.y + this.startGameRect.h * 2.8 + GameHud.buttonPadding * 2, this.startGameRect.w);
        ctx.fillText("Score: " + gs.Score, this.startGameRect.x + this.startGameRect.w / 2, this.rect.y + this.startGameRect.h * 3.8 + GameHud.buttonPadding * 2, this.startGameRect.w);
        var startString = gs.hasStarted ? "Level" + gs.levelNum + " started" : "Start level " + gs.levelNum;
        ctx.fillText(startString, this.startGameRect.x + this.startGameRect.w / 2, this.startGameRect.y + this.startGameRect.h * 0.8, this.startGameRect.w);
    };
    return GameDetails;
}());
var GameHud = (function () {
    function GameHud(ctx, w, h, towerstype) {
        var _this = this;
        this.width = w;
        this.height = h;
        GameHud.buttonPadding = w / 100;
        this.buttonWidth = w / 11;
        this.buttonHeight = h * 0.9;
        this.towerButtons = [];
        var n = 0;
        for (var i = 0; i < towerstype.length; i++) {
            this.towerButtons.push(new TowerButton(new Rect(GameHud.buttonPadding + (i * this.buttonWidth) + (i * GameHud.buttonPadding), GameHud.buttonPadding, this.buttonWidth, this.buttonHeight), towerstype[i]));
            n = i;
        }
        n++;
        this.towerDetails = new TowerDetails(new Rect(GameHud.buttonPadding + (n * this.buttonWidth) + (n * GameHud.buttonPadding), GameHud.buttonPadding, this.buttonWidth * 3, this.buttonHeight));
        this.gameDetails = new GameDetails(new Rect(this.towerDetails.rect.x + this.towerDetails.rect.w + GameHud.buttonPadding, GameHud.buttonPadding, this.buttonWidth * 3.22, this.buttonHeight));
        var bkImage = new Image();
        bkImage.src = "img/panelInset_blue.png";
        bkImage.onload = function (e) {
            _this.bkPattern = ctx.createPattern(bkImage, "repeat");
        };
        GameHud.Panel = new Image();
        GameHud.Panel.src = "img/panel_beige.png";
        GameHud.Button = new Image();
        GameHud.Button.src = "img/buttonLong_brown.png";
    }
    GameHud.prototype.handleClick = function (x, y, gs) {
        for (var i = 0; i < this.towerButtons.length; i++) {
            if (IsCoordInRect(this.towerButtons[i].rect, x, y)) {
                this.towerDetails.tower = null;
                console.log("commencing tower placement");
                return { new: true, t: this.towerButtons[i].tower, start: false };
            }
        }
        if (this.towerDetails.tower != null) {
            //details pane
            if (IsCoordInRect(this.towerDetails.buttonRectSell, x, y)) {
                this.setSelected(null);
                return { new: false, t: null, start: false };
            }
            if (IsCoordInRect(this.towerDetails.buttonRectUpg, x, y)) {
                this.towerDetails.tower.upgrade(gs);
                return { new: false, t: this.towerDetails.tower, start: false };
            }
        }
        //start game
        if (IsCoordInRect(this.gameDetails.startGameRect, x, y)) {
            return { start: true };
        }
        return null;
    };
    GameHud.prototype.setSelected = function (tower) {
        this.towerDetails.setTower(tower);
    };
    GameHud.prototype.isATowerSelected = function () {
        return this.towerDetails.tower != null;
    };
    GameHud.prototype.draw = function (gameState, ctx) {
        var fontSize = ctx.canvas.clientWidth / 70;
        ctx.font = fontSize + "px GoodTimes";
        //ctx.fillStyle = this.bkPattern;
        ctx.fillStyle = Colors.Black;
        ctx.fillRect(0, 0, this.width, this.height);
        for (var i = 0; i < this.towerButtons.length; i++) {
            this.towerButtons[i].draw(ctx);
        }
        this.towerDetails.draw(ctx);
        this.gameDetails.draw(gameState, ctx);
    };
    return GameHud;
}());
//# sourceMappingURL=GameHud.js.map