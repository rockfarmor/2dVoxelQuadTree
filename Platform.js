var Platform = function(x, y, points){

    this.polygon = new Polygon(createVector(x,y), points);
    this.draw = function(){
        fill(255,0,0,100);
        beginShape();
        for (var i = 0; i < this.polygon.calcPoints.length; i++) {

            var x_ = this.polygon.pos.x + this.polygon.calcPoints[i].x;
            var y_ = this.polygon.pos.y + this.polygon.calcPoints[i].y;
            vertex(x_, y_);
        }
        endShape(CLOSE);
    }
}
