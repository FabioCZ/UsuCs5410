var spaceArray = new Array();
//50*32
function CheckPath(gameState, fromX, fromY, toX, toY) {
    var q = new Array();
    if (spaceArray.length === 0) {
        for (var i = 0; i < 50; i++) {
            spaceArray[i] = new Array();
            for (var j = 0; j < 32; j++) {
                spaceArray[i][j] = new Coord();
            }
        }
    }
    return null;
}
//# sourceMappingURL=PathChecker.js.map