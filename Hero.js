const heroBoundWidth = 20;
const heroCollWidth = 32;
const heroBoundHeight = 32;



var Hero = function(x, y, team) {
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.polygon = new Polygon(createVector(x,y), [createVector(-heroBoundWidth / 2, -heroBoundHeight), createVector(heroBoundWidth / 2, -heroBoundHeight), createVector()]);

    this.team = team;
    this.attackRange = 40;
    this.maxAttackTimer = 10;
    this.attackTimer = this.maxAttackTimer;

    this.dir = 1;

    this.health = 100;
    this.maxHealth = 100;

    this.damage = 4;

    this.animation = new Animation(charSheet);
    this.animation.addAnimation("idle", 0, 9);
    this.animation.addAnimation("running", 20, 29);
    this.animation.addAnimation("attack", 30, 39, "once", "idle");

    this.jumpReady = false;


    this.pos = function() {
        return this.polygon.pos;
    }

    this.respawn = function (){
        if (this.health <= 0){
            this.health = this.maxHealth;
            this.polygon.pos.x = 658;
            this.polygon.pos.y = 1377-20;
        }


    }

    this.update = function() {
        this.vel.add(this.acc);
        this.acc.mult(0.5);
        this.polygon.pos.add(this.vel);
        if (this.jumpReady) {
            this.vel.mult(platformFriction);
        } else {
            this.vel.mult(airFriction);
        }

        var count = 5;
        if (this.animation.currAnimation != "idle")
            count = 1;
        if (frameCount % count == 0) {
            this.animation.runAnimation();
        }

        if (this.attackTimer < this.maxAttackTimer){
            this.attackTimer--;
            if (this.attackTimer < 0){
                this.attackTimer = this.maxAttackTimer;
            }
        }
        this.respawn();

    }

    this.attack = function() {
        //Find nearest enemy
        //Prior non ai

        if (this.attackTimer == this.maxAttackTimer){

            var mob = findClosestEntity(this,true, true);
            if (mob != null){
                var particle = ParticleType.Blood;
                if (mob instanceof Turret){
                    particle = ParticleType.Sparkle;
                }


                addEmitter(mob.polygon.pos.x, mob.polygon.pos.y-20, particle, 20, true, false)
                //mob.acc.add(createVector(0,-2))
                mob.health -= this.damage;;

            }

            this.attackTimer--;
            return true;
        }



        return false;

    }

    this.draw = function() {
        if (debug.debugMode) {
            fill(0, 0, 255, 50)
            beginShape();
            for (var i = 0; i < this.polygon.calcPoints.length; i++) {
                vertex(this.polygon.pos.x + this.polygon.calcPoints[i].x, this.polygon.pos.y + this.polygon.calcPoints[i].y);
            }
            endShape(CLOSE);
        }
        scale(this.dir,1);
        this.animation.spritesheet.drawTile(this.animation.frame, this.dir * (this.polygon.pos.x) - this.animation.spritesheet.tileWidth/2, this.polygon.pos.y - this.animation.spritesheet.tileHeight, this.animation.spritesheet.tileWidth, this.animation.spritesheet.tileHeight)
        scale(this.dir,1);

        drawHealthBar(this, heroBoundHeight);

    }








}
