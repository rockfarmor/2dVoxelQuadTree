/* Version 0.1 Copyright 2017 -  Johan Nilsson <johan.nilsson1227@gmail.com>
 *
 * A implementation of the Separating Axis Theorem for p5.js
 *
 * Using p5 vector
 *
 *
 */


/**
 * Calculates the perpendicular to a 2d vector. Returns a new p5.Vector
 *
 * @method perp
 * @return {p5.Vector} The perpendicular to the 2d vector
 * @example
 * <div class="norender">
 * <code>
 * // Static method
 * var v1 = createVector(6, 4);
 * print(v1.perp()); // Prints "[4,-6]"
 * </code>
 * </div>
 */


// Constants for Voronoi regions
/**
 * @const
 */
var LEFT_VORONOI_REGION = -1;
/**
 * @const
 */
var MIDDLE_VORONOI_REGION = 0;
/**
 * @const
 */
var RIGHT_VORONOI_REGION = 1;

var T_VECTORS = [];

var T_ARRAYS = [];

var T_RESPONSE;
var TEST_POINT;

p5.Vector.prototype.perp = function() {
    var x = this.x;
    this.x = this.y;
    this.y = -x;
    return this;
};

//TODO: Write comment
p5.Vector.prototype.project = function(other) {
    var amt = this.dot(other) / other.magSq();
    this.x = amt * other.x;
    this.y = amt * other.y;
    return this;
};

//TODO: write comment
p5.Vector.prototype.reflect = function(axis) {
    var x = this.x;
    var y = this.y;
    this.project(axis).mult(2);

    this.x -= x;
    this.y -= y;

    return this;
};

var Polygon = function(pos, points) {
    this.pos = pos || createVector();
    this.angle = 0;
    this.offset = createVector();
    this.points = [];

    this.calcPoints = [];
    this.edges = [];
    this.normals = [];

    this.reCalculate = function() {

        var calcPoints = this.calcPoints;
        var edges = this.edges;
        var normals = this.normals;
        var points = this.points;
        var offset = this.offset;
        var angle = this.angle;
        var len = points.length;

        for (var i = 0; i < len; i++) {
            var calcPoint = calcPoints[i].set(points[i]);
            calcPoint.x += offset.x;
            calcPoints.y += offset.y;
            if (angle !== 0) {
                calcPoint.rotate(angle);
            }
        }

        //Calculate edges and normals
        for (var i = 0; i < len; i++) {
            var p1 = calcPoints[i];
            var p2 = i < len - 1 ? calcPoints[i + 1] : calcPoints[0];
            var e = edges[i].set(p2).sub(p1);
            normals[i].set(e).perp().normalize();
        }
    }

    this.setPoints = function(points) {
        this.calcPoints = [];
        this.edges = [];
        this.normals = [];
        for (var i = 0; i < points.length; i++) {
            this.calcPoints.push(createVector());
            this.edges.push(createVector());
            this.normals.push(createVector());
        }
        this.points = points;
        this.reCalculate();
    }

    this.setPoints(points || []);

    this.setAngle = function(angle) {
        this.angle = angle;
        this.reCalculate();
    }

    this.setOffset = function(offset) {
        this.offset = offset;
        this.reCalculate();
    }

    this.rotate = function(angle) {
        var points = this.points;
        var len = points.length;
        for (var i = 0; i < points.length; i++) {
            points[i].rotate(angle);
        }
        this.reCalculate();
    }

    this.translate = function(x, y = 0) {
        var points = this.points;
        if (x instanceof p5.Vector) {
            //x is vector
            for (var i = 0; i < points.length; i++) {
                points[i].x += x.x;
                points[i].y += x.y;
            }
        } else {
            //x and y is integer or double
            for (var i = 0; i < points.length; i++) {
                points[i].x += x;
                points[i].y += y;
            }
        }
        this.reCalculate();
    }

    this.getAABB = function() {
        var points = this.points;
        var len = points.length;
        var xMin = points[0].x;
        var yMin = points[0].y;
        var xMax = points[0].x;
        var yMax = points[0].y;

        for (var i = 1; i < len; i++) {
            var points = points[i];
            if (point.x < xMin)
                xMin = point.x;
            else if (point.x > xMax)
                xMax = point.x;

            if (point.y < yMin)
                yMin = point.y;
            else if (point.y > yMax)
                yMax = point.y;
        }
        return new Box(createVector().set(this.pos).add(createVector(xMin, yMin)), xMax - xMin, yMax - yMin)
    }

}

var Box = function(pos, w, h) {
    this.pos = pos || createVector();
    this.w = w || 0;
    this.h = h || 0;

    this.toPolygon = function() {
        return new Polygon(createVector(this.x, this.y), [createVector(), createVector(w, 0), createVector(w, h), createVector(0, h)])
    }
}

var Response = function() {
    this.a = null;
    this.b = null;
    this.overlapN = createVector(0,0);
    this.overlapV = createVector(0,0);

    this.aInB = true;
    this.bInA = true;
    this.overlap = Number.MAX_VALUE;

    this.clear = function() {
        this.aInB = true;
        this.bInA = true;
        this.overlap = Number.MAX_VALUE;
    }

    this.clear();
}


function flattenPointsOn(points, normal, result) {
    var min = Number.MAX_VALUE;
    var max = -Number.MAX_VALUE;
    var len = points.length;
    for (var i = 0; i < len; i++) {
        var dot = points[i].dot(normal);
        if (dot < min) min = dot;
        if (dot > max) max = dot;
    }
    result[0] = min;
    result[1] = max;
}

function isSeparatingAxis(aPos, bPos, aPoints, bPoints, axis, response) {
    var rangeA = T_ARRAYS.pop();
    var rangeB = T_ARRAYS.pop();

    var offsetV = T_VECTORS.pop().set(bPos).sub(aPos);
    var projectedOffset = offsetV.dot(axis);

    flattenPointsOn(aPoints, axis, rangeA);
    flattenPointsOn(bPoints, axis, rangeB);

    rangeB[0] += projectedOffset;
    rangeB[1] += projectedOffset;

    if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {
        T_VECTORS.push(offsetV);
        T_ARRAYS.push(rangeA);
        T_ARRAYS.push(rangeB);
        return true;
    }

    if (response) {
        var overlap = 0;
        // A starts further left than B
        if (rangeA[0] < rangeB[0]) {
            response['aInB'] = false;
            // A ends before B does. We have to pull A out of B
            if (rangeA[1] < rangeB[1]) {
                overlap = rangeA[1] - rangeB[0];
                response['bInA'] = false;
                // B is fully inside A.  Pick the shortest way out.
            } else {
                var option1 = rangeA[1] - rangeB[0];
                var option2 = rangeB[1] - rangeA[0];
                overlap = option1 < option2 ? option1 : -option2;
            }
            // B starts further left than A
        } else {
            response['bInA'] = false;
            // B ends before A ends. We have to push A out of B
            if (rangeA[1] > rangeB[1]) {
                overlap = rangeA[0] - rangeB[1];
                response['aInB'] = false;
                // A is fully inside B.  Pick the shortest way out.
            } else {
                var option1 = rangeA[1] - rangeB[0];
                var option2 = rangeB[1] - rangeA[0];
                overlap = option1 < option2 ? option1 : -option2;
            }
        }

        // If this is the smallest amount of overlap we've seen so far, set it as the minimum overlap.
        var absOverlap = Math.abs(overlap);
        if (absOverlap < response.overlap) {
            response.overlap = absOverlap;
            response.overlapN.set(axis);
            if (overlap < 0) {
                response.overlapN.mult(-1);
            }
        }
    }

    T_VECTORS.push(offsetV);
    T_ARRAYS.push(rangeA);
    T_ARRAYS.push(rangeB);
    return false;
}

function voroniRegion (line, point) {
    var len2 = line.magSq();
    var dp = point.dot(line);

    if (dp < 0) return LEFT_VORONOI_REGION;
    else if (dp > len2) return RIGHT_VORONOI_REGION;
    else return MIDDLE_VORONOI_REGION;
}

function pointInPolygon(p, poly){
    TEST_POINT.pos.set(p);
    T_RESPONSE.clear();
    var result = testPolygonPolygon(TEST_POINT, poly, T_RESPONSE);
    if (result){
        result = T_RESPONSE['aInB'];
    }
    return result;
}


function testPolygonPolygon(a, b, response){
    var aPoints = a.calcPoints;
    var aLen = aPoints.length;
    var bPoints = b.calcPoints;
    var bLen = bPoints.length;

    for (var i = 0; i < aLen; i++) {
        if (isSeparatingAxis(a.pos, b.pos, aPoints, bPoints, b.normals[i], response)) {
            return false;
        }
    }

    for (var i = 0; i < bLen; i++) {
        if (this.isSeparatingAxis(a.pos, b.pos, aPoints, bPoints, b.normals[i], response)) {
            return false;
        }
    }

    if (response) {
        response.a = a;
        response.b = b;
        response.overlapV.set(response.overlapN).mult(response.overlap);
    }

    return true;

}
