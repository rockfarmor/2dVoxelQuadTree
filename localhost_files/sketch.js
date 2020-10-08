const BOARD_SIZE = 13;


var board;
var player;

var Grenade = function(x, y, power){

    this.x = x;
    this.y = y;
    this.power = power;
    this.cooldown = 40;
    this.cooldown2 = 20;

    this.exploded = false;

    this.minX = x;
    this.minY = y;
    this.maxX = x;
    this.maxY = y;

    this.update = function(){

        if(!this.exploded) {
            this.cooldown--;
            if(this.cooldown <= 0) {
                this.explode();
            }
        } else {
            this.cooldown2--;
        }


    }

    this.explode = function() {
        this.exploded = true;
        this.minX = x - this.power+1;
        this.maxX = x + this.power-1;
        this.minY = y - this.power+1;
        this.maxY = y + this.power-1;
        for (var i = this.x; i > this.x-this.power; i--) {
            if(board.getTile(i,this.y) == 2){
                board.breakTile(i,this.y);
                this.minX = i;
                break;
            }
            if(board.isCollidable(i,this.y)){
                this.minX = i+1;
                break;
            }
        }

        for (var i = this.x; i < this.x+this.power; i++) {
            if(board.getTile(i,this.y) == 2){
                board.breakTile(i,this.y);
                this.maxX = i;
                break;
            }
            if(board.isCollidable(i,this.y)){
                this.maxX = i-1;
                break;
            }
        }

        for (var i = this.y; i < this.y+this.power; i++) {
            if(board.getTile(this.x,i) == 2){
                board.breakTile(this.x, i);
                this.maxY = i;
                break;
            }
            if(board.isCollidable(this.x, i)) {
                this.maxY = i-1;
                break;
            }
        }

        for (var i = this.y; i > this.y-this.power; i--) {
            if(board.getTile(this.x,i) == 2){
                board.breakTile(this.x, i);
                this.minY = i;
                break;
            }
            if(board.isCollidable(this.x, i)){
                this.minY = i+1;
                break;
            }
        }






    }

    this.draw = function(){
        var tile_size = board.tile_size;
        fill(0, 255, 0);
        ellipse(this.x * tile_size + tile_size / 2, this.y * tile_size + tile_size / 2, tile_size * 0.4);
        if(this.exploded){
            fill(255, 255, 0);
            //ellipse(this.x * tile_size + tile_size / 2, this.y * tile_size + tile_size / 2, tile_size * 2);

            rect(this.minX * tile_size, this.y * tile_size, (this.x - this.minX)*tile_size, tile_size)
            rect(this.x * tile_size, this.y * tile_size, (this.maxX - this.x+1) * tile_size, tile_size)
            rect(this.x * tile_size, this.y * tile_size, tile_size, (this.maxY - this.y+1)*tile_size)
            rect(this.x * tile_size, this.minY * tile_size, tile_size, (this.y - this.minY) * tile_size)
        }
    }

}

function keyPressed() {
    if(keyCode === 32) {
        //space
        player.addGrenade(player.x, player.y);
    }
}

function setup() {
    createCanvas(600, 600);
    board = new Board();
    board.init();
    player = new Player(0, 0);

}

function keyHandler(){
    if(keyIsDown(LEFT_ARROW)){
        player.walk("left");
    } else if (keyIsDown(RIGHT_ARROW)){
        player.walk("right");
    } else if(keyIsDown(DOWN_ARROW)){
        player.walk("down");
    } else if(keyIsDown(UP_ARROW)){
        player.walk("up");
    }
}


function draw() {
    keyHandler();
    background(51)
    board.draw();
    player.draw();




}
