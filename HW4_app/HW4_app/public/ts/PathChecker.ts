enum CellType {
    Tower,
    Empty,
    Path
}

class PathChecker {
    private static _pathsVer = new Array<Array<CellType>>(); //stores path from some square to finish for the vertical path (top->bottom)
    private static _pathsHor = new Array<Array<CellType>>(); //stores path from some square to finish for the horizontal path (left->right) 
    public static get PathsVer() { return PathChecker._pathsVer; }
    public static get PathsHor() { return PathChecker._pathsHor; }
    private static sizeX = 50;
    private static sizeY = 32;
    private static stateArray: Array<Array<CellType>>;

    private static isValidMove(newX, newY, isHor) {
        if (newX >= PathChecker.sizeX || newY >= PathChecker.sizeY || newX < 0 || newY < 0) return false;
        if (isHor && PathChecker._pathsHor[newX][newY] === CellType.Tower) {
            return false;
        } else if (!isHor && PathChecker._pathsVer[newX][newY] === CellType.Tower) {
            return false;
        }
        return true;
    }

    public static setCreepPaths(game: Game) {
        console.log("resetting creep paths");
        PathChecker.setCreepPath(game, 0, 16, true,false);
        //PathChecker.setCreepPath(game, 25, 0, false,false);
    }

    public static setCreepPath(game: Game, initI: number, initJ: number, isHorizontal: boolean, isCustom : boolean): Array<Array<CellType>>  {
        
        var mazeVisited = new Array<Array<boolean>>(this.sizeX);
        var back = isCustom ? (isHorizontal ? PathChecker._pathsHor : PathChecker._pathsVer) : null;
        if (isHorizontal) {
            PathChecker._pathsHor = new Array<Array<CellType>>(this.sizeX);
        } else {
            PathChecker._pathsVer = new Array<Array<CellType>>(this.sizeX);
        } 

        for (var i = 0; i < this.sizeX; i++) {
            if (isHorizontal) {
                PathChecker._pathsHor[i] = new Array<CellType>(this.sizeY);
            } else {
                PathChecker._pathsVer[i] = new Array<CellType>(this.sizeY);
            }
            mazeVisited[i] = new Array<boolean>(this.sizeY);
            for (var j = 0; j < this.sizeY; j++) {
                if (isHorizontal) {
                    PathChecker._pathsHor[i][j] = CellType.Empty;
                } else {
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
                } else {
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
                } else {
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
            var validMoves = PathChecker.getValidMoves(c.x, c.y,isHorizontal);
            for (var i = 0; i < validMoves.length; i++) {
                var newPath = c.path.slice();
                newPath.push({ x: validMoves[i].x, y: validMoves[i].y });
                queue.push({ x: validMoves[i].x, y: validMoves[i].y, path: newPath });
            }
        }
    }

    private static getValidMoves(x, y,isHor) {
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
    }
}

