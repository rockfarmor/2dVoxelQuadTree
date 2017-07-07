var TiledMap = function() {

    this.layer = [];
    this.width;
    this.height;

    this.populate = function(data) {
        debug.log("Tiled Map initialised", 3)
        var tileWidth = data.attributes.tilewidth;
        var tileHeight = data.attributes.tileheight;
        this.width = data.attributes.width;
        this.height = data.attributes.height;

        for (var i = 0; i < data.children.length; i++) {
            var d = data.children[i];
            if (d.name == "objectgroup") {

                if (d.attributes.name == "collision") {
                    for (var i = 0; i < d.children.length; i++) {
                        var pX = d.children[i].attributes.x;
                        var pY = d.children[i].attributes.y;

                        var grandchild = d.children[i].children[0];
                        if (grandchild.name == "polygon") {
                            //console.log(grandchild);
                            var points = grandchild.attributes.points;

                            points = points.replace(/ /g, ",");
                            //console.log("polygon", points)
                            var arr = points.split(',');
                            //console.log(arr)
                            var pList = [];

                            for (var k = 0; k < arr.length; k += 2) {
                                if (k >= 0 && k < arr.length - 1) {
                                    pList.push(createVector(parseInt(arr[k]), parseInt(arr[k + 1])));
                                }
                            }
                            var plat = new Platform(parseInt(pX), parseInt(pY), pList);
                            platforms.push(plat);

                        }



                        //console.log(pX, pY);
                        //console.log("____")
                    }


                }
            }

        }

    }





}

function populate(data) {
    //tiledMap;
    tiledMap.populate(data);
}


var Tileset = function(img, tileWidth, tileHeight, offsetX = 0, offsetY = 0) {
    this.img = img;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;

    this.offsetX = offsetX;
    this.offsetY = offsetY;

    this.lastFrame = function(){
        var tilesCol = floor(this.img.width / this.tileWidth);
        var tilesRow = floor(this.img.height / this.tileHeight);
        return tilesCol * tilesRow;
    }

    this.drawTile = function(id, x, y, width, height) {
        var tilesCol = floor(this.img.width / this.tileWidth);
        var tilesRow = floor(this.img.height / this.tileHeight);

        //Draw tile on screen
        if (id >= 0 && id <= tilesCol * tilesRow) {

            var x_ = (id) % tilesCol;
            var y_ = floor((id) / tilesCol);

            copy(this.img, x_ * this.tileWidth + this.offsetX, y_ * this.tileHeight + this.offsetY, this.tileWidth, this.tileHeight, x, y, width, height);
        }
    }
}




//console.log(d.name)
/*if (d.name == "tileset") {
    var tileWidth_ = d.attributes.tilewidth;
    var tileHeight_ = d.attributes.tileheight;
    if (d.children.length > 0) {
        if (d.children[0].name == "image") {
            var width_ = d.children[0].attributes.width;
            var height_ = d.children[0].attributes.height;

            var src = d.children[0].attributes.source;
            var tileImg = loadImage("assets/" + src);
            this.tileset = new Tileset(tileImg, tileWidth_, tileHeight_);
        }
    }
} else if (d.name == "layer") {
    if (d.children.length > 0) {

        var str = d.children[0].content;
        str = str.replace(/(\r\n|\n|\r)/gm, "");
        var array = str.split(',');
        //this.layer.push();

        //var lay = createGraphics(this.width * tileWidth_, this.height * tileHeight_);
        //console.log(this.width * tileWidth_, this.height * tileHeight_)
        //lay.background(255)

        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var x_ = x * tileWidth_;
                var y_ = y * tileHeight_;
                console.log()
                this.tileset.drawTileOnImg(lay,59,x_, y_, tileWidth_, tileHeight_)
                //lay.fill(255,0,0)
                //lay.rect(x_, y_, tileWidth_, tileHeight_)
            }
        }



        this.layer.push(this.tileset.createImg(this.width * tileWidth_, this.height * tileHeight_,array))

        //console.log(array)
    }

}*/
