/*
 * This comment is to test something with git Testing testing hello moetherfucker
 */

let CanvSize = 256 * 3
let qts;
let wire;
let mVal;
let bigBrush = false;

let atlas;

let dirt;
let stone;
let grass;

let clrs;

let mDown;

function preload() {
    atlas = loadImage("Assets/terrain.png")
}

function setup() {
    createCanvas(CanvSize, CanvSize);
    frameRate(120)

    let org = 256 / 2

    //Create qts
    qts = []
    for (var y = 0; y < 3; y++) {
        for (var x = 0; x < 3; x++) {
            let qt = new QuadTree(256,org + x*256, org + y*256)
            qts.push(qt)
        }
    }



    //let qt1 = new QuadTree(256, org,300)
    //let qt2 = new QuadTree(256, org+256,300)
    //let qt3 = new QuadTree(256, org,300-256)
    //let qt4 = new QuadTree(256, org+256,300-256)

    let c1 = color(255,0,0)
    let c2 = color(0,255,0)
    let c3 = color(255,0,255)
    let c4 = color(0,0,255)


    clrs = [c1,c2,c3,c4];
    wire = true
    mVal = 1
}

function keyPressed() {

    if(keyCode == 48){
        mVal = 0;
    } else if(keyCode == 49){
        mVal = 1;
    } else if (keyCode == 50){
        mVal = 2;
    } else if (keyCode == 51){
        mVal = 3;
    } else if (keyCode == 52){
        mVal = 4;
    } else if (keyCode == 87){
        wire = !wire;
    }


}

function mousePressed(){
    mDown = true;

}

function mouseReleased(){
    mDown = false;
}

function drawQuad(qt){
    if(mouseX >= qt.x - qt.size/2 && mouseY >= qt.y - qt.size/2 && mouseX < qt.x + qt.size/2 && mouseY < qt.y + qt.size/2){
        let mx = mouseX - qt.x + qt.size/2
        let my = mouseY - qt.y + qt.size/2
        mx /= 4
        my /= 4
        mx = int(mx)
        my = int(my)


        let t = false

        if(bigBrush){
            for (var i = -4; i <= 4; i++) {
                for (var j = -4; j <= 4; j++) {
                    qt.insert(mx+i,my+j,mVal)
                }
            }
        } else {
            qt.insert(mx,my,mVal)
        }

    }
}

function printQuadValue(qt){
    if(mouseX >= qt.x - qt.size/2 && mouseY >= qt.y - qt.size/2 && mouseX < qt.x + qt.size/2 && mouseY < qt.y + qt.size/2){
        let mx = mouseX - qt.x + qt.size/2
        let my = mouseY - qt.y + qt.size/2
        mx /= 4
        my /= 4
        mx = int(mx)
        my = int(my)

        //print(qt.getValue(mx,my))
    }
}

function updateTimer(){

}

function draw() {
    background(50)

    for (var i = 0; i < qts.length; i++) {
        let qt = qts[i]
        if(mDown)
            drawQuad(qt);
        qt.draw()
    }

    stroke(255)
    text(int(frameRate()), 10,10);
    text("color: " + mVal + " Wiredframe: " + wire, 10,20);

    //image(atlas,10,10);


    //printQuadValue();



}


class QuadTree {




    constructor(size,x,y,val = 0, parent = null) {
        this.size = size;
        this.x = x
        this.y = y
        this.val = val;

        this.divided = false;

        this.nw = null
        this.ne = null
        this.sw = null
        this.se = null;

        this.parent = parent

    }

    insert(x,y,val){
        //64x64
        let sc = this.size / 256
        sc = sc/2
        let s2 = this.size / 2
        let s4 = this.size / 4

        //sc = 1 -> 64
        let nx = x * 4
        let ny = y * 4

        if(true){
            if(this.size == 4){
                if(this.val != val){
                    this.val = val
                    this.optimize()
                }
            } else {
                if(!this.divided && (this.val != val)){
                    this.subdivide()
                }
                if(this.divided){
                    let ob;
                    if(nx < s2 && ny < s2){
                        //nw
                        ob = this.nw
                    } else if(nx >= s2  && ny < s2){
                        //ne
                        ob = this.ne
                    } else if(nx < s2 && ny >= s2){
                        //sw
                        ob = this.sw
                    } else if(nx >= s2 && ny >= s2){
                        //se
                        ob = this.se
                    }
                    if(ob != null)
                        ob.insert(x%(64*sc), y%(64*sc), val)
                }
            }
        }
    }

    optimize(){
        if(this.parent != null && !this.divided){

                this.parent.combine()
                this.parent.optimize()




        }
    }

    combine(){
        if(this.childValueSame()){

            this.val = this.nw.val
            this.nw = null;
            this.ne = null;
            this.sw = null;
            this.se = null;
            this.divided = false
        }
    }

    allChildDevided(){
        if(this.divided){
            let nwv = this.nw.val
            let nev = this.ne.val
            let swv = this.sw.val
            let sev = this.se.val
            return nwv.divided && nev.divided && swv.divided && sev.divided
        }
        return false
    }

    childValueSame(){
        if(this.divided){


            if(this.nw != null && this.ne != null && this.sw != null && this.se != null){
                let nwv = this.nw.val
                let nev = this.ne.val
                let swv = this.sw.val
                let sev = this.se.val
                if(!this.nw.divided && !this.ne.divided && !this.sw.divided && !this.se.divided){
                    if(nwv == nev && nwv == swv && nwv == sev)
                        return true
                }


            }

            /*
            if(!this.allChildDevided){
                print(this)
                if(nwv == nev && nwv == swv && nwv == sev)
                    return true
            }*/
        }

        return false;
    }

    getValue(x,y){
        let sc = this.size / 256
        sc = sc/2
        let s2 = this.size / 2
        let s4 = this.size / 4

        //sc = 1 -> 64
        let nx = x * 4
        let ny = y * 4

        if(!this.divided){
            return this.val;
        } else {
            let ob;
            if(nx < s2 && ny < s2){
                //nw
                ob = this.nw
            } else if(nx >= s2  && ny < s2){
                //ne
                ob = this.ne
            } else if(nx < s2 && ny >= s2){
                //sw
                ob = this.sw
            } else if(nx >= s2 && ny >= s2){
                //se
                ob = this.se
            }
            return ob.getValue(x%(64*sc), y%(64*sc))
        }

    }

    subdivide(){
        if(!this.divided){
            let s2 = this.size / 2
            let s4 = this.size / 4
            if(s2 >= 4){

                this.nw = new QuadTree(s2,this.x - s4, this.y - s4, this.val, this);
                this.ne = new QuadTree(s2,this.x + s4, this.y - s4, this.val, this);
                this.sw = new QuadTree(s2,this.x - s4, this.y + s4, this.val, this);
                this.se = new QuadTree(s2,this.x + s4, this.y + s4, this.val, this);
                this.divided = true
                this.val = 0
            }
        }
    }

    draw(){
        noFill()
        noStroke()
        if(wire)
            stroke(255)
        rectMode(CENTER)
        if(this.val > 0){
            //fill(getColor(this.val))
            image(atlas, this.x - this.size/2, this.y - this.size/2, this.size, this.size,imgX(this.val), imgY(this.val), 16,16)

        }
        rect(this.x, this.y, this.size, this.size)
        if(this.divided){
            this.nw.draw()
            this.ne.draw()
            this.sw.draw()
            this.se.draw()
        }
    }
}


function imgX(val){
    if(val > 0 && val <= 4){
        return val * 16
    }
    return 0;
}

function imgY(val){
    return 0;
}

function getColor(val){
    if(val >= 1 && val <= 4)
        return clrs[val-1]
    return color(255,0,0)
}
