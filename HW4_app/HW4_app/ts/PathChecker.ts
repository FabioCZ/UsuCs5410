var spaceArray = new Array<Array<Coord>>();

//50*32
function CheckPath(gameState: Game, fromX: number, fromY: number, toX: number, toY: number): Array<Coord> {
    var q = new Array<Coord>();
    if (spaceArray.length === 0) {
        for (var i = 0; i < 50; i++) {
            spaceArray[i] = new Array<Coord>();
            for (var j = 0; j < 32; j++) {
                spaceArray[i][j] = new Coord()
            }
        }
    }

    

    return null;
}