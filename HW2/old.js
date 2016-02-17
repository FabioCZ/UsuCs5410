   function oldrecursiveDivider(startX, startY, width, height, lastVertH,lastHoriH, type) {
        console.log('startX',startX, ' startY', startY, 'w' , width, ' h ', height, 'type',type);
        if (width <= 2 || height <= 2) return;
        
        //add vertical
        verticalDivide = -1;
        //do{
        var verticalDivide = startX + Math.floor(width/2);//randomBetween(startX + 1, startX + width -1)
       // } while (verticalDivide == lastHoriH);
        
        for(var  j = startY; j < startY + height;j++){
            setMazeField(verticalDivide,j,MazeGame.CellType.WALL);
        }
        
        //add hole to vertical
        if(height == 3){
            verticalHole = startY; //edge case
        } else {
            var verticalHole = randomBetween(startY,startY+height);
            setMazeField(verticalDivide,verticalHole,MazeGame.CellType.EMPTY);
        }
        
        //add horizontal
        var horizontalDivide = 0;
        if(height > 3){
            //do{
                horizontalDivide = startY + Math.floor(height/2);//randomBetween(startY + 1, startY + height - 1);
            //} while(horizontalDivide == verticalHole || horizontalDivide == lastVertH)
        }
        
        for(var i = startX; i < startX + width;i++) {
            setMazeField(i,horizontalDivide,MazeGame.CellType.WALL);
        }
        
        //add hole to horizontal
        var horizontalHole1 = randomBetween(startX, verticalDivide);
        setMazeField(horizontalHole1,horizontalDivide,MazeGame.CellType.EMPTY);
        
        var horizontalHole2 = randomBetween(verticalDivide + 1, startX + width);
        setMazeField(horizontalHole2,horizontalDivide,MazeGame.CellType.EMPTY);
        logMaze();
        //topleft
        recursiveDivider(startX +1, startY +1, verticalDivide - startX -1 , horizontalDivide - startY -1 , 'TL');
        //topright
        recursiveDivider(verticalDivide +1, startY +1, startX + width - verticalDivide -1 , horizontalDivide - startY  -1, 'TR');
        //bottomleft
        recursiveDivider(startX+1 , horizontalDivide +1, verticalDivide - startX  -1, startY + height - horizontalDivide -1 , 'BL');
        //bottomright
        recursiveDivider(verticalDivide+1 , horizontalDivide +1, startX + width - verticalDivide -1 , startY + height - horizontalDivide -1 , 'BR');
    }