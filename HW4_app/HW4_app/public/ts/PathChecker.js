var CellType;
(function (CellType) {
    CellType[CellType["Tower"] = 0] = "Tower";
    CellType[CellType["Empty"] = 1] = "Empty";
    CellType[CellType["Path"] = 2] = "Path";
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
    PathChecker.isValidMove = function (newX, newY, isHor) {
        if (newX >= PathChecker.sizeX || newY >= PathChecker.sizeY || newX < 0 || newY < 0)
            return false;
        if (isHor && PathChecker._pathsHor[newX][newY] === CellType.Tower) {
            return false;
        }
        else if (!isHor && PathChecker._pathsVer[newX][newY] === CellType.Tower) {
            return false;
        }
        return true;
    };
    PathChecker.setCreepPaths = function (game) {
        console.log("resetting creep paths");
        PathChecker.setCreepPath(game, 0, 16, true, false);
        //PathChecker.setCreepPath(game, 25, 0, false,false);
    };
    PathChecker.setCreepPath = function (game, initI, initJ, isHorizontal, isCustom) {
        var mazeVisited = new Array(this.sizeX);
        var back = isCustom ? (isHorizontal ? PathChecker._pathsHor : PathChecker._pathsVer) : null;
        if (isHorizontal) {
            PathChecker._pathsHor = new Array(this.sizeX);
        }
        else {
            PathChecker._pathsVer = new Array(this.sizeX);
        }
        for (var i = 0; i < this.sizeX; i++) {
            if (isHorizontal) {
                PathChecker._pathsHor[i] = new Array(this.sizeY);
            }
            else {
                PathChecker._pathsVer[i] = new Array(this.sizeY);
            }
            mazeVisited[i] = new Array(this.sizeY);
            for (var j = 0; j < this.sizeY; j++) {
                if (isHorizontal) {
                    PathChecker._pathsHor[i][j] = CellType.Empty;
                }
                else {
                    PathChecker._pathsVer[i][j] = CellType.Empty;
                }
                mazeVisited[i][j] = false;
            }
        }
        if (game.ActiveTowers != undefined) {
            for (var i = 0; i < game.ActiveTowers.length; i++) {
                var tI = Game.xToI(game.ActiveTowers[i].x);
                var tJ = Game.yToJ(game.ActiveTowers[i].y);
                if (i >= 128) {
                    console.log("tower", tI, ",", tJ);
                }
                if (isHorizontal) {
                    PathChecker._pathsHor[tI][tJ] = CellType.Tower;
                }
                else {
                    PathChecker._pathsVer[tI][tJ] = CellType.Tower;
                }
            }
        }
        if (game.WallTowers != undefined) {
            for (var i = 0; i < game.WallTowers.length; i++) {
                var tI = Game.xToI(game.WallTowers[i].x);
                var tJ = Game.yToJ(game.WallTowers[i].y);
                if (isHorizontal) {
                    PathChecker._pathsHor[tI][tJ] = CellType.Tower;
                }
                else {
                    PathChecker._pathsVer[tI][tJ] = CellType.Tower;
                }
            }
        }
        var queue = new Array();
        queue.push({ x: initI, y: initJ, path: new Array() });
        while (queue.length > 0) {
            var c = queue.shift();
            //console.log('c is', c, ' l:', queue.length);
            if (isHorizontal && c.x === 49 && c.y > 11 && c.y < 20) {
                for (var i = 0; i < c.path.length; i++) {
                    PathChecker._pathsHor[c.path[i].x][c.path[i].y] = CellType.Path;
                }
                if (isCustom) {
                    var toRet = PathChecker._pathsHor;
                    PathChecker._pathsHor = back;
                    return toRet;
                }
                return PathChecker._pathsHor;
            }
            if (!isHorizontal && c.x > 20 && c.x < 29 && c.y === 31) {
                for (var i = 0; i < c.path.length; i++) {
                    PathChecker._pathsVer[c.path[i].x][c.path[i].y] = CellType.Path;
                }
                if (isCustom) {
                    var toRet = PathChecker._pathsHor;
                    PathChecker._pathsVer = back;
                    return toRet;
                }
                return PathChecker._pathsHor;
            }
            if (mazeVisited[c.x][c.y]) {
                continue;
            }
            mazeVisited[c.x][c.y] = true;
            var validMoves = PathChecker.getValidMoves(c.x, c.y, isHorizontal);
            for (var i = 0; i < validMoves.length; i++) {
                var newPath = c.path.slice();
                newPath.push({ x: validMoves[i].x, y: validMoves[i].y });
                queue.push({ x: validMoves[i].x, y: validMoves[i].y, path: newPath });
            }
        }
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
    PathChecker._pathsVer = new Array(); //stores path from some square to finish for the vertical path (top->bottom)
    PathChecker._pathsHor = new Array(); //stores path from some square to finish for the horizontal path (left->right) 
    PathChecker.sizeX = 50;
    PathChecker.sizeY = 32;
    return PathChecker;
}());
//# sourceMappingURL=PathChecker.js.map