var spaceArray = new Array<Array<boolean>>();   //represents the game board
var pathsVer = new Array<Array<Array<Pair>>>();    //stores paths from some square to finish for the vertical path (top->bottom)
var pathsHor = new Array<Array<Array<Pair>>>();    //stores paths from some square to finish for the horizontal path (left->right) 


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

