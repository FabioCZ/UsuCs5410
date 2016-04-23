var CellType;
(function (CellType) {
    CellType[CellType["Tower"] = 0] = "Tower";
    CellType[CellType["Empty"] = 1] = "Empty";
    CellType[CellType["Visited"] = 2] = "Visited";
})(CellType || (CellType = {}));
var PathChecker = (function () {
    function PathChecker() {
    }
    Object.defineProperty(PathChecker, "PathsVer", {
        get: function () { return PathChecker._pathsVer; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PathChecker, "PathsHor", {
        get: function () { return PathChecker._pathsHor; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PathChecker, "AirPathsVer", {
        get: function () { return PathChecker._airPathsHor; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PathChecker, "AirPathsHor", {
        get: function () { return PathChecker._airPathsVer; },
        enumerable: true,
        configurable: true
    });
    PathChecker.calcAirPaths = function () {
        PathChecker._airPathsVer = Array(PathChecker.sizeX);
        for (var i = 0; i < PathChecker.sizeX; i++) {
            var temp = [];
            PathChecker._airPathsVer[i] = Array(PathChecker.sizeY);
            for (var j = this.sizeY - 1; j >= 0; j--) {
                temp.push(new ArCoord(i, j));
                PathChecker._airPathsVer[i][j] = temp.slice().reverse();
            }
        }
        PathChecker._airPathsHor = Array(PathChecker.sizeX);
        for (var i = 0; i < PathChecker.sizeX; i++) {
            PathChecker._airPathsHor[i] = Array(PathChecker.sizeY);
        }
        for (var j = 0; j < PathChecker.sizeY; j++) {
            var temp = [];
            for (var i = this.sizeX - 1; i >= 0; i--) {
                temp.push(new ArCoord(i, j));
                PathChecker._airPathsHor[i][j] = temp.slice().reverse();
            }
        }
    };
    PathChecker.isValidMove = function (newX, newY, isHor) {
        if (newX >= PathChecker.sizeX || newY >= PathChecker.sizeY || newX < 0 || newY < 0)
            return false;
        if (isHor && PathChecker.stateArray[newX][newY] === CellType.Tower) {
            return false;
        }
        else if (!isHor && PathChecker.stateArray[newX][newY] === CellType.Tower) {
            return false;
        }
        return true;
    };
    PathChecker.resetCreepPaths = function () {
        console.log("resetting creep paths");
        if (PathChecker._pathsHor == undefined) {
            PathChecker._pathsHor = new Array(PathChecker.sizeX);
            PathChecker._pathsVer = new Array(PathChecker.sizeX);
        }
        for (var i = 0; i < PathChecker.sizeX; i++) {
            if (PathChecker._pathsHor[i] == undefined) {
                PathChecker._pathsHor[i] = new Array(PathChecker.sizeY);
                PathChecker._pathsVer[i] = new Array(PathChecker.sizeY);
            }
            for (var j = 0; j < PathChecker.sizeY; j++) {
                PathChecker._pathsHor[i][j] = null;
                PathChecker._pathsVer[i][j] = null;
            }
        }
    };
    PathChecker.getCreepPath = function (game, i, j, isHorizontal) {
        if (isHorizontal) {
            if (PathChecker._pathsHor[i][j] == null) {
                PathChecker.setCreepPath(game, i, j, isHorizontal);
            }
            return PathChecker._pathsHor[i][j];
        }
        else {
            if (PathChecker._pathsVer[i][j] == null) {
                PathChecker.setCreepPath(game, i, j, isHorizontal);
            }
            return PathChecker._pathsVer[i][j];
        }
    };
    PathChecker.setCreepPath = function (game, initI, initJ, isHorizontal) {
        var mazeVisited = new Array(this.sizeX);
        PathChecker.stateArray = new Array(this.sizeX);
        for (var i = 0; i < this.sizeX; i++) {
            PathChecker.stateArray[i] = new Array(this.sizeY);
            mazeVisited[i] = new Array(this.sizeY);
            for (var j = 0; j < this.sizeY; j++) {
                PathChecker.stateArray[i][j] = CellType.Empty;
            }
        }
        if (game.ActiveTowers != undefined && game.ActiveTowers.length > 0) {
            for (var i = 0; i < game.ActiveTowers.length; i++) {
                var tI = Game.xToI(game.ActiveTowers[i].x + Game.towerSize / 2);
                var tJ = Game.yToJ(game.ActiveTowers[i].y + Game.towerSize / 2);
                console.log("tower", tI, ",", tJ);
                PathChecker.stateArray[tI][tJ] = CellType.Tower;
            }
        }
        if (game.WallTowers != undefined) {
            for (var i = 0; i < game.WallTowers.length; i++) {
                var tI = Game.xToI(game.WallTowers[i].x + Game.towerSize / 2);
                var tJ = Game.yToJ(game.WallTowers[i].y + Game.towerSize / 2);
                PathChecker.stateArray[tI][tJ] = CellType.Tower;
            }
        }
        var queue = new Array();
        queue.push({ x: initI, y: initJ, path: new Array() });
        while (queue.length > 0) {
            var c = queue.shift();
            if (isHorizontal && c.x === 24 && c.y > 6 && c.y <= 9) {
                var temp = [];
                //temp.push(new ArCoord(-1, -1));
                for (var i = c.path.length - 1; i >= 0; i--) {
                    temp.push(new ArCoord(c.path[i].x, c.path[i].y));
                    PathChecker._pathsHor[c.path[i].x][c.path[i].y] = temp.slice().reverse();
                    if (i == 0) {
                        temp.push(new ArCoord(initI, initJ));
                        PathChecker._pathsHor[initI][initJ] = temp.slice().reverse();
                    }
                }
                return;
            }
            if (!isHorizontal && c.x > 10 && c.x <= 14 && c.y === 15) {
                var temp = [];
                //temp.push(new ArCoord(-1, -1));
                for (var i = c.path.length - 1; i >= 0; i--) {
                    temp.push(new ArCoord(c.path[i].x, c.path[i].y));
                    PathChecker._pathsVer[c.path[i].x][c.path[i].y] = temp.slice().reverse();
                    if (i == 0) {
                        temp.push(new ArCoord(initI, initJ));
                        PathChecker._pathsVer[initI][initJ] = temp.slice().reverse();
                    }
                }
                return;
            }
            if (PathChecker.stateArray[c.x][c.y] === CellType.Visited) {
                continue;
            }
            PathChecker.stateArray[c.x][c.y] = CellType.Visited;
            var validMoves = PathChecker.getValidMoves(c.x, c.y, isHorizontal);
            for (var i = 0; i < validMoves.length; i++) {
                var newPath = c.path.slice();
                newPath.push({ x: validMoves[i].x, y: validMoves[i].y });
                queue.push({ x: validMoves[i].x, y: validMoves[i].y, path: newPath });
            }
        }
        console.log('no path, delete last tower', queue.length);
        game.deleteLatestTower();
        this.setCreepPath(game, initI, initJ, isHorizontal);
    };
    PathChecker.getValidMoves = function (x, y, isHor) {
        var validMoves = [];
        if (PathChecker.isValidMove(x, y - 1, isHor))
            validMoves.push({ x: x, y: y - 1 });
        if (PathChecker.isValidMove(x, y + 1, isHor))
            validMoves.push({ x: x, y: y + 1 });
        if (PathChecker.isValidMove(x - 1, y, isHor))
            validMoves.push({ x: x - 1, y: y });
        if (PathChecker.isValidMove(x + 1, y, isHor))
            validMoves.push({ x: x + 1, y: y });
        return validMoves;
    };
    PathChecker.sizeX = 25;
    PathChecker.sizeY = 16;
    return PathChecker;
}());
//# sourceMappingURL=PathChecker.js.map