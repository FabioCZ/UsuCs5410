var spaceArray = new Array<Array<Coord>>();

//50*32
function GetPath(gameState: Game, fromX: number, fromY: number, toX: number, toY: number): Array<Coord> {
    var q = new Array<Coord>();

    var fromXArr = fromX / 50;
    var fromYArr = (fromY - gameState.HudHeight) / 32;

    if (spaceArray.length === 0) {
        for (var i = 0; i < 50; i++) {
            spaceArray[i] = new Array<Coord>();
            for (var j = 0; j < 32; j++) {
                spaceArray[i][j] = new Coord(i * Game.towerSize, gameState.HudHeight + j * Game.towerSize);
            }
        }
    }





    

    return null;
}