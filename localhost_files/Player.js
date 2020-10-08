var Player = function(x, y) {

    this.x = x;
    this.y = y;

    this.dir = "none";
    this.walkingFactor = 0;
    this.baseWalkingFactor = 5;
    this.grenadePower = 4;

    this.grenades = [];

    this.addGrenade = function(x,y){
        this.grenades.push(new Grenade(x,y,this.grenadePower));
    }


    this.update = function(){

        for (var i = this.grenades.length-1; i>= 0; i--) {
            this.grenades[i].draw();
            this.grenades[i].update();
            if(this.grenades[i].cooldown2 <= 0) this.grenades.splice(i);

        }

        if(this.dir !== "none"){
            if(this.walkingFactor <= 0){
                if (this.dir == "left"){
                    if(!board.isCollidable(this.x-1, this.y)){
                        this.x --;
                    }
                } else if (this.dir == "right"){
                    if(!board.isCollidable(this.x+1, this.y)){
                        this.x ++;
                    }
                } else if (this.dir == "up"){
                    if(!board.isCollidable(this.x, this.y-1)){
                        this.y --;
                    }
                } else if (this.dir == "down"){
                    if(!board.isCollidable(this.x, this.y+1)){
                        this.y ++;
                    }
                }
                this.walkingFactor = this.baseWalkingFactor;
                this.dir = "none";
            } else {
                this.walkingFactor--;
            }

        }
    }

    this.walk = function(dir){
        this.dir = dir;
    }

    this.draw = function() {
        this.update();
        noStroke();
        var tile_size = board.tile_size;

        fill(255, 0, 0);

        ellipse(this.x * tile_size + tile_size / 2, this.y * tile_size + tile_size / 2, tile_size * 0.8);
    }
}
