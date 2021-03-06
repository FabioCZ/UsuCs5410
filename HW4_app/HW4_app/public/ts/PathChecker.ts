﻿enum CellType {
    Tower,
    Empty,
    Visited,
}

class PathChecker {
    private static _pathsVer: Array<Array<Array<ArCoord>>>; //stores path from some square to finish for the vertical path (top->bottom)
    private static _pathsHor: Array<Array<Array<ArCoord>>>; //stores path from some square to finish for the horizontal path (left->right) 
    public static get PathsVer() { return PathChecker._pathsVer; }
    public static get PathsHor() { return PathChecker._pathsHor; }

    private static _airPathsHor: Array<Array<Array<ArCoord>>>; //stores path from some square to finish for the vertical path (top->bottom)
    private static _airPathsVer: Array<Array<Array<ArCoord>>>; //stores path from some square to finish for the horizontal path (left->right) 
    public static get AirPathsVer() { return PathChecker._airPathsHor; }
    public static get AirPathsHor() { return PathChecker._airPathsVer; }

    private static sizeX = 25;
    private static sizeY = 16;
    private static stateArray: Array<Array<CellType>>;

    public static calcAirPaths() {
        PathChecker._airPathsVer = Array<Array<Array<ArCoord>>>(PathChecker.sizeX);
        for (var i = 0; i < PathChecker.sizeX; i++) {
            var temp = [];
            PathChecker._airPathsVer[i] = Array<Array<ArCoord>>(PathChecker.sizeY);
            for (var j = this.sizeY -1; j >= 0; j--) {
                temp.push(new ArCoord(i, j));
                PathChecker._airPathsVer[i][j] = temp.slice().reverse();
            }
        }

        PathChecker._airPathsHor = Array<Array<Array<ArCoord>>>(PathChecker.sizeX);
        for (var i = 0; i < PathChecker.sizeX; i++) {
            PathChecker._airPathsHor[i] = Array<Array<ArCoord>>(PathChecker.sizeY);
        }

        for (var j = 0; j < PathChecker.sizeY; j++) {
            var temp = [];
            for (var i = this.sizeX -1; i >= 0; i--) {
                temp.push(new ArCoord(i, j));
                PathChecker._airPathsHor[i][j] = temp.slice().reverse();
            }
        }
    }

    private static isValidMove(newX, newY, isHor) {
        if (newX >= PathChecker.sizeX || newY >= PathChecker.sizeY || newX < 0 || newY < 0) return false;
        if (isHor && PathChecker.stateArray[newX][newY] === CellType.Tower) {
            return false;
        } else if (!isHor && PathChecker.stateArray[newX][newY] === CellType.Tower) {
            return false;
        }
        return true;
    }

    public static resetCreepPaths() {
        console.log("resetting creep paths");
        if (PathChecker._pathsHor == undefined) {
            PathChecker._pathsHor = new Array<Array<Array<ArCoord>>>(PathChecker.sizeX);
            PathChecker._pathsVer = new Array<Array<Array<ArCoord>>>(PathChecker.sizeX);

        }
        for (var i = 0; i < PathChecker.sizeX; i++) {
            if (PathChecker._pathsHor[i] == undefined) {
                PathChecker._pathsHor[i] = new Array<Array<ArCoord>>(PathChecker.sizeY);
                PathChecker._pathsVer[i] = new Array<Array<ArCoord>>(PathChecker.sizeY);
            }
            for (var j = 0; j < PathChecker.sizeY; j++) {
                PathChecker._pathsHor[i][j] = null;
                PathChecker._pathsVer[i][j] = null;
            }
        }
    }

    public static getCreepPath(game: Game,i: number, j: number, isHorizontal: boolean): Array<ArCoord> {
        if (isHorizontal) {
            if (PathChecker._pathsHor[i][j] == null) {
                PathChecker.setCreepPath(game, i, j, isHorizontal);
            }
            return PathChecker._pathsHor[i][j];
        } else {
            if (PathChecker._pathsVer[i][j] == null) {
                PathChecker.setCreepPath(game, i, j, isHorizontal);
            }
            return PathChecker._pathsVer[i][j];
        }
    }

    public static setCreepPath(game: Game, initI: number, initJ: number, isHorizontal: boolean)  {
        
        PathChecker.stateArray = new Array<Array<CellType>>(this.sizeX);

        for (var i = 0; i < this.sizeX; i++) {
            PathChecker.stateArray[i] = new Array<CellType>(this.sizeY);
            for (var j = 0; j < this.sizeY; j++) {
                PathChecker.stateArray[i][j] = CellType.Empty;
            }
        }

        if (game.ActiveTowers != undefined && game.ActiveTowers.length > 0) {
            for (var i = 0; i < game.ActiveTowers.length; i++) {
                var tI = Game.xToI(game.ActiveTowers[i].x+Game.towerSize/2);
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
            var validMoves = PathChecker.getValidMoves(c.x, c.y,isHorizontal);
            for (var i = 0; i < validMoves.length; i++) {
                var newPath = c.path.slice();
                newPath.push({ x: validMoves[i].x, y: validMoves[i].y });
                queue.push({ x: validMoves[i].x, y: validMoves[i].y, path: newPath });
            }
        }

        console.log('no path, delete last tower', queue.length);
        game.deleteLatestTower();
        this.setCreepPath(game, initI, initJ, isHorizontal);
        Sound.No.play();
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

    public static getGuidedProjPath(fromI, fromJ, toI, toJ): Array<ArCoord> {
        if (toI < 0 || toJ < 0) return null;
        var state = new Array<Array<CellType>>(this.sizeX);

        for (var i = 0; i < this.sizeX; i++) {
            state[i] = new Array<CellType>(this.sizeY);
            for (var j = 0; j < this.sizeY; j++) {
                state[i][j] = CellType.Empty;
            }
        }

        var queue = new Array();
        queue.push({ x: fromI, y: fromJ, path: new Array() });

        while (queue.length > 0) {
            var c = queue.shift();

            if (c.x === toI && c.y === toJ) {
                var temp = new Array<ArCoord>();
                //temp.push(new ArCoord(fromI, fromJ));;

                for (var i = 0; i < c.path.length; i++) {
                    temp.push(new ArCoord(c.path[i].x, c.path[i].y));
                }
                return temp;
            }
            
            if (state[c.x][c.y] === CellType.Visited) {
                continue;
            }
            state[c.x][c.y] = CellType.Visited;
            var validMoves = [];
            if (c.x - 1 >= 0) validMoves.push({ x: c.x - 1, y: c.y });
            if (c.x + 1 < this.sizeX) validMoves.push({ x: c.x + 1, y: c.y });
            if (c.y - 1 >= 0) validMoves.push({ x: c.x, y: c.y - 1});
            if (c.y + 1 < this.sizeY) validMoves.push({ x: c.x, y: c.y + 1 });

            for (var i = 0; i < validMoves.length; i++) {
                var newPath = c.path.slice();
                newPath.push({ x: validMoves[i].x, y: validMoves[i].y });
                queue.push({ x: validMoves[i].x, y: validMoves[i].y, path: newPath });
            }
        }
    }
}

