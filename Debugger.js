const debugWidth = 200;
const debugHeight = 60;
const debugOffset = 10;

var Debugger = function() {

    this.pos = createVector(0, 0);
    this.logList = [];
    this.debugMode = false;
    this.draw = function() {
        push()
        //draw log
        translate(this.pos.x, this.pos.y);
        translate(0, -debugHeight);
        for (var i = this.logList.length - 1; i >= 0; i--) {

            var time = this.logList[i].time;
            var currTime = new Date().getTime();
            if (currTime < time) {

                var alpha = 1;
                if (time - currTime <= 1000){
                    alpha = (time - currTime) / 1000;
                }
                var str = this.logList[i].text;
                translate(0, debugHeight);
                stroke(51);

                fill(140,206,85, 255 * alpha)
                rect(0, 0, debugWidth, debugHeight);
                //stroke(51);
                //strokeWeight(2)
                noStroke();
                textFont("Regular");
                textSize(14);
                fill(3,22,52,alpha*255);
                text(str, debugOffset, debugOffset, debugWidth - debugOffset, debugHeight - debugOffset);
            }
        }
        pop();
    }

    this.log = function(logText, displayTime) {
        this.logList.push({
            text: logText,
            time: new Date().getTime() + displayTime * 1000
        })
    }

    this.clear = function(){
        console.log("The log was cleared")
        this.logList = [];
    }

    this.print = function(){
        for (var i = 0; i < this.logList.length; i++) {
            console.log(this.logList[i].text);
            console.log("___")
        }
    }






}
