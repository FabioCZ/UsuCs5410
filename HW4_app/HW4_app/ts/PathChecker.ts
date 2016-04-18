var spaceArray = new Array<Array<boolean>>();   //represents the game board
var pathsVer = new Array<Array<Array<ArCoord>>>();    //stores paths from some square to finish for the vertical path (top->bottom)
var pathsHor = new Array<Array<Array<ArCoord>>>();    //stores paths from some square to finish for the horizontal path (left->right) 


//function SetPaths(gameState: Game, fromI: number, fromJ: number, toI: number, toJ: number) : boolean {
//    var hor = FindPath(gameState,)
//}

////50*32
//function FindPath(gameState: Game, fromI: number, fromJ: number, toI: number, toJ: number): Array<Coord> {
//    var q = new Array<Coord>();

//    //var fromXArr = fromX / 50;
//    //var fromYArr = (fromY - gameState.HudHeight) / 32;
    

//    if (spaceArray.length === 0) {
//        for (var i = 0; i < 50; i++) {
//            spaceArray[i] = new Array<boolean>();
//            for (var j = 0; j < 32; j++) {
//                spaceArray[i][j] = true;
//            }
//        }
//    }

//    return null;
//}

enum CellType {
    Tower,
    Empty,
    Visited,
    Path
}

function setHintPath(gs: Game, from: ArCoord, to: ArCoord) {

    var arr = new Array<Array<CellType>>();
    for (var i = 0; i < 50; i++) {
        for (var j = 0; j < 32; j++) {

        }
    }

    for (var i = 0; i < gs.ActiveTowers.length; i++) {
        var t = gs.ActiveTowers[i];
        arr[Game.xToI(t.x)][Game.xToI(t.y)] = CellType.Tower;
    }

    var mazeVisited = new Array(50);
    for (var i = 0; i < 50; i++) {
        mazeVisited[i] = new Array(32);
        for (var j = 0; j < 32; j++) {
            mazeVisited[i][j] = false;
        }
    }

    var queue = new Array();
    queue.push({ x: from.i, y: from.j, path: new Array() });

    while (queue.length > 0) {
        var c = queue.shift();
        console.log('c is', c);
        if (c.x == 50 - 2 && c.y == 32 - 2) {
            for (var i = 0; i < c.path.length; i++) {
                    arr[c.path[i].x][c.path[i].y] = CellType.Path;
            }
            return;
        }
        if (mazeVisited[c.x][c.y] === true) {
            continue;
        }
        mazeVisited[c.x][c.y] = true;
        var validMoves = ValidMoves(arr,c.x, c.y);

        for (var i = 0; i < validMoves.length; i++) {
            var newPath = c.path.slice();
            newPath.push({ x: validMoves[i].x, y: validMoves[i].y });
            queue.push({ x: validMoves[i].x, y: validMoves[i].y, path: newPath });
        }
        if (queue.length === 1) {
            return queue.
        }
    }
}

function ValidMoves(arr: Array<Array<CellType>>, i: number, j: number) {
    var validMoves = [];
    if (isValidMove(arr,i, j - 1))
        validMoves.push({ x: i, y: j - 1 });
    if (isValidMove(arr,i, j + 1))
        validMoves.push({ x: i, y: j + 1 });
    if (isValidMove(arr,i - 1, j))
        validMoves.push({ x: i - 1, y: j });
    if (isValidMove(arr,i + 1, j))
        validMoves.push({ x: i + 1, y: j });
    return validMoves;
}

function isValidMove(arr: Array<Array<CellType>>, newI: number, newJ: number) {
    if (newI >= 50 || newJ >= 32 || newI < 0 || newJ < 0) return false;
    if (arr[newI][newJ] === CellType.Tower) return false;
    return true;
}

