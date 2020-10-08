var Board = function(){
    this.grid = [];
    this.tile_size = int(width / BOARD_SIZE);
    this.init = function(){



        for (var y = 0; y < BOARD_SIZE; y++) {
            this.grid.push([]);
            for (var x = 0; x < BOARD_SIZE; x++) {


                var val = 0;
                if(x%2 == 1 && y%2 == 1)
                    val = 1;
                if(dist(x,y,6,6) <= 6.5 && val == 0) val = 2
                this.grid[y][x] = val;
            }
        }
    }

    this.breakTile = function(x,y){
        if(x >= 0 && y >= 0 && x < BOARD_SIZE && y < BOARD_SIZE){
            if(this.getTile(x,y) === 2)
                this.grid[y][x] = 0;
        }
    }

    this.getTile = function(x, y){
        if(x >= 0 && y >= 0 && x < BOARD_SIZE && y < BOARD_SIZE)
            return this.grid[y][x];
        return -1;
    }

    this.isCollidable = function(x,y) {
        var tile = this.getTile(x,y);
        if(tile === 0) return false;
        return true;
    }

    this.draw = function(){
        for (var y = 0; y < BOARD_SIZE; y++) {
            for (var x = 0; x < BOARD_SIZE; x++) {
                noStroke();
                fill(70);
                var val = this.grid[y][x];
                if(val === 1){
                    stroke(0)
                    fill(242, 210, 113);
                }
                if(val === 2){
                    stroke(0)
                    fill(192, 99, 242);
                }
                rect(x * this.tile_size, y * this.tile_size, this.tile_size, this.tile_size)


            }
        }
    }
}
