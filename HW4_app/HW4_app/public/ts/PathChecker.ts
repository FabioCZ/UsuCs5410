enum CellType {
    Tower,
    Empty,
    Path
}

class PathChecker {
    private static _pathsVer = new Array<Array<CellType>>(); //stores paths from some square to finish for the vertical path (top->bottom)
    private static _pathsHor = new Array<Array<CellType>>(); //stores paths from some square to finish for the horizontal path (left->right) 
    public static get PathsVer() { return PathChecker._pathsVer; }
    public static get PathsHor() { return PathChecker._pathsHor; }
    private static sizeX = 32;
    private static sizeY = 50;
    private static stateArray: Array<Array<CellType>>;

    private static isValidMove(newX, newY, isHor) {
        if (newX >= PathChecker.sizeX || newY >= PathChecker.sizeY || newX < 0 || newY < 0) return false;
        if (isHor) {
            if (PathChecker.PathsHor[newX][newY] === CellType.Tower) return false;
        } else {
            if (PathChecker.PathsVer[newX][newY] === CellType.Tower) return false;

        }
        return true;
    }

    public static setHintPaths(game: Game) {
        PathChecker.setHintPath(game, 0, 16, true);
        PathChecker.setHintPath(game, 25, 0, false);
    }

    private static setHintPath(game: Game, initI: number, initJ: number, isHorizontal: boolean) {

        var mazeVisited = new Array<Array<boolean>>(32);
        if (isHorizontal) {
            PathChecker._pathsHor = new Array <Array<CellType>>(32);
        } else {
            PathChecker._pathsVer = new Array <Array<CellType>>(32);
        }
        for (var i = 0; i < 32; i++) {
            if (isHorizontal) {
                PathChecker._pathsHor[i] = new Array<CellType>(50);
            } else {
                PathChecker._pathsVer[i] = new Array<CellType>(50);
            }
            mazeVisited[i] = new Array<boolean>(50);
            for (var j = 0; j < 50; j++) {
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
                var t = game.ActiveTowers[i];
                if (isHorizontal) {
                    PathChecker.PathsHor[Game.xToI(t.x)][Game.yToJ(t.y)] = CellType.Tower;
                } else {
                    PathChecker.PathsVer[Game.xToI(t.x)][Game.yToJ(t.y)] = CellType.Tower;
                }
            }
        }

        var queue = new Array();
        queue.push({ x: initI, y: initJ, path: new Array() });

        while (queue.length > 0) {
            var c = queue.shift();
            //console.log('c is', c);
            if (isHorizontal && c.x === 49 && c.y > 11 && c.y < 20) {
                for (var i = 0; i < c.path.length; i++) {
                    PathChecker._pathsHor[c.path[i].x][c.path[i].y] = CellType.Path;
                }
                return;
            }
            if (!isHorizontal && c.x > 20 && c.x < 29 && c.y === 31) {
                for (var i = 0; i < c.path.length; i++) {
                    PathChecker._pathsVer[c.path[i].x][c.path[i].y] = CellType.Path;
                }
                return;
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

