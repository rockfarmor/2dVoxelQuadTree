var Animation = function(sSheet){
    this.spritesheet = sSheet;
    this.animation = {};
    this.currAnimation = "";
    this.frame = 0;

    this.runAnimation = function(){
        if (this.currAnimation in this.animation){
            var anim = this.animation[this.currAnimation];
            this.frame++;
            if (this.frame > anim.end){
                if (anim.type === "loop"){
                    this.frame = anim.start;
                } else if (anim.type === "once"){
                    this.changeAnimation(anim.next);
                }
            }
        }
    }

    // change animation to {name} if it exist
    this.changeAnimation = function(name){
        if (name in this.animation && name != this.currAnimation){
            var anim = this.animation[name];
            this.frame = anim.start;
            this.currAnimation = name;
        } else {
            //Invalid name
        }

    }

    this.addAnimation = function(name, startFrame, stopFrame, animationType = "loop", nextAnimation = ""){

        //if start and stop frame is within the right range
        if (startFrame >= 0 && startFrame < this.spritesheet.lastFrame() && stopFrame >= startFrame && stopFrame < this.spritesheet.lastFrame()){
            this.animation[name] = {
                start: startFrame,
                end: stopFrame,
                type: animationType,
                next: nextAnimation
            }

            if (this.currAnimation == "") this.currAnimation = name;

        } else {
            debug.log("Animation couldn't be added", 10);
        }



    }



}
