var TowerButton = (function () {
    function TowerButton(rect, tower) {
        this.rect = rect;
        this.tower = tower;
    }
    TowerButton.prototype.draw = function (ctx) {
        var centerX = this.rect.x + this.rect.w / 2;
        ctx.fillStyle = Colors.Grey;
        ctx.fillRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
        ctx.textAlign = "center";
        ctx.fillStyle = Colors.Black;
        ctx.fillText(this.tower.name, centerX, this.rect.y + this.rect.h / 2, this.rect.w);
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
        ctx.fillRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
        if (this.tower != null) {
            ctx.textAlign = "center";
            ctx.fillStyle = Colors.Black;
            ctx.fillText("Selected tower: " + this.tower.name, centerX, this.rect.y + this.rect.h / 4, this.rect.w);
            ctx.fillStyle = Colors.LtGrey;
            ctx.fillRect(this.buttonRectSell.x, this.buttonRectSell.y, this.buttonRectSell.w, this.buttonRectSell.h);
            ctx.fillRect(this.buttonRectUpg.x, this.buttonRectUpg.y, this.buttonRectUpg.w, this.buttonRectUpg.h);
        }
        else {
            ctx.textAlign = "center";
            ctx.fillStyle = Colors.Black;
            ctx.fillText("No tower selected", centerX, this.rect.y + this.rect.h / 2, this.rect.w);
        }
    };
    return TowerDetails;
}());
var GameState = (function () {
    function GameState(rect) {
        this.rect = rect;
    }
    GameState.prototype.draw = function (gs) {
    };
    return GameState;
}());
var GameHud = (function () {
    function GameHud(w, h, towerstype) {
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
        this.towerDetails = new TowerDetails(new Rect(GameHud.buttonPadding + (n * this.buttonWidth) + (n * GameHud.buttonPadding), GameHud.buttonPadding, this.buttonWidth * 2, this.buttonHeight));
    }
    GameHud.prototype.handleClick = function (x, y) {
        for (var i = 0; i < this.towerButtons.length; i++) {
            if (IsCoordInRect(this.towerButtons[i].rect, x, y)) {
                this.towerDetails.tower = null;
                console.log("commencing tower placement");
                return { new: true, t: this.towerButtons[i].tower };
            }
        }
        if (this.towerDetails.tower != null) {
            //details pane
            if (IsCoordInRect(this.towerDetails.buttonRectSell, x, y)) {
                return { new: false, t: null };
            }
            if (IsCoordInRect(this.towerDetails.buttonRectUpg, x, y)) {
                this.towerDetails.tower.upgrade();
                return { new: false, t: this.towerDetails.tower };
            }
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
        ctx.fillStyle = Colors.Black;
        ctx.fillRect(0, 0, this.width, this.height);
        for (var i = 0; i < this.towerButtons.length; i++) {
            this.towerButtons[i].draw(ctx);
        }
        this.towerDetails.draw(ctx);
    };
    return GameHud;
}());
//# sourceMappingURL=GameHud.js.map