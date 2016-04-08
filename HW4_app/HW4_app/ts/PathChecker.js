var spaceArray = new Array();
//50*32
function GetPath(gameState, fromX, fromY, toX, toY) {
    var q = new Array();
    var fromXArr = fromX / 50;
    var fromYArr = (fromY - gameState.HudHeight) / 32;
    if (spaceArray.length === 0) {
        for (var i = 0; i < 50; i++) {
            spaceArray[i] = new Array();
            for (var j = 0; j < 32; j++) {
                spaceArray[i][j] = new Coord(i * Game.towerSize, gameState.HudHeight + j * Game.towerSize);
            }
        }
    }
    return null;
}
//# sourceMappingURL=PathChecker.js.map