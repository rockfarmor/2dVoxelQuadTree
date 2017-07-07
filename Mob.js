const mobBoundWidth = 14;
const mobBoundHeight = 16;
var maxAttackTimer = 20;
var mobHealth = 15;
const mobAttackDamage = 4;
const mobSpeed = 0.5;

var Mob = function(x, y, team) {
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.polygon = new Polygon(createVector(x, y), [
        createVector(-mobBoundWidth / 2, -mobBoundHeight),
        createVector(mobBoundWidth / 2, -mobBoundHeight),
        createVector()
    ]);

    this.team = team;
    this.range = 200;
    this.attackRange = 20;
    this.attackTimer = maxAttackTimer;
    this.dir = 1;

    this.health = mobHealth;
    this.maxHealth = mobHealth;
    this.dead = false;

    this.target = null;

    this.animation = new Animation(mobSheet);
    this.animation.addAnimation("runningPurple", 20, 29);
    this.animation.addAnimation("runningBlue", 70, 79);
    this.animation.addAnimation("dyingPurple", 40, 49)
    this.animation.addAnimation("attackPurple", 30, 39, "once", "runningPurple");
    this.animation.addAnimation("attackBlue", 80, 89, "once", "runningBlue");
    this.animation.addAnimation("dyingBlue", 90, 99)



    if (this.team == BlueTeam) this.animation.changeAnimation("runningBlue")
    if (this.team == PurpleTeam) this.animation.changeAnimation("runningPurple")

    this.jumpReady = false;

    this.pos = function() {
        return this.polygon.pos();
    }

    this.findTarget = function() {
        if (this.target != null) {
            if (this.target.health <= 0) {
                this.target = null;
            } else {
                //Is target in range();
                if (entityDistance(this, this.target) > this.range) {
                    this.target = null;
                }
            }
        }

        if (this.target == null) {
            //Find target
            //loop through mobList

            //Start by finding Turret
            for (var i = 0; i < turrets.length; i++) {
                var turr = turrets[i];
                if (!entitySameTeam(this, turr)) {
                    var distance = entityDistance(this, turr);
                    if (distance < this.range && turr.health > 0){
                        this.target = turr;
                    }
                }
            }

            if (this.target == null) {
                var index = -1;
                var minRange = Infinity;
                for (var i = 0; i < mobList.length; i++) {
                    var mob = mobList[i];
                    if (mob !== this) {
                        //Check if hostile mob
                        if (!entitySameTeam(this, mob)) {
                            //Check for best distance
                            //if (i == 0) console.log(distVec.len());
                            var distance = entityDistance(this, mob);

                            if (minRange > distance && mob.health > 0) {
                                minRange = distance;
                                index = i;
                            }
                        }
                    }
                }
                if (index != -1 && minRange < this.range) {
                    var mob = mobList[index];
                    this.target = mob;
                }
            }

            if (this.target == null){
                if (entityDistance(this, player) < this.attackRange && !entitySameTeam(this, player)){
                    this.target = player;
                }
            }
        }
    }


    this.update = function() {

        //Physics
        this.vel.add(this.acc);
        this.acc.mult(0.3);
        this.polygon.pos.add(this.vel)
        if (this.jumpReady) {
            this.vel.mult(platformFriction);
        } else {
            this.vel.mult(airFriction);
        }


        //Make mob track for player
        this.findTarget();


        if (this.target == null) {
            if (this.team == PurpleTeam) {
                if (this.polygon.pos.x < 4100)
                    this.acc.add(createVector(mobSpeed, 0));
            } else {
                if (this.polygon.pos.x > 658)
                    this.acc.add(createVector(-mobSpeed, 0));
            }
        } else {
            //Walk towards Entity;
            if (entityDistance(this, this.target) > this.attackRange) {
                this.acc.add(entityTrackVector(this, this.target).setMag(mobSpeed));
            } else {
                //Attack
                if (this.attackTimer == maxAttackTimer) {
                    if (this.team == BlueTeam) this.animation.changeAnimation("attackBlue")
                    if (this.team == PurpleTeam) this.animation.changeAnimation("attackPurple")

                    //Add blood
                    addEmitter(this.target.polygon.pos.x, this.target.polygon.pos.y - 20, ParticleType.Blood, 20, true, false)




                    this.attackTimer--;


                    this.target.health -= mobAttackDamage;
                }

            }


        }


        if (this.attackTimer < maxAttackTimer) {
            this.attackTimer--;
            if (this.attackTimer < 0) {
                this.attackTimer = maxAttackTimer;
            }
        }

        if (this.vel.x > 0) this.dir = 1;
        if (this.vel.x < 0) this.dir = -1;



    }

    this.draw = function() {
        if (this.health < 0){
            this.health = 0;
        }

        scale(this.dir, 1)
        this.animation.spritesheet.drawTile(this.animation.frame, this.dir * (this.polygon.pos.x) - this.animation.spritesheet.tileWidth / 2, this.polygon.pos.y - this.animation.spritesheet.tileHeight, this.animation.spritesheet.tileWidth, this.animation.spritesheet.tileHeight)
        scale(this.dir, 1)
        if (this.health > 0)
            drawHealthBar(this, mobBoundHeight + 5)
        if (debug.debugMode) {
            fill(0, 255, 255, 40);
            ellipse(this.polygon.pos.x, this.polygon.pos.y, this.range, this.range)
            fill(0, 0, 255, 40);
            ellipse(this.polygon.pos.x, this.polygon.pos.y, this.attackRange, this.attackRange)

            if (this.team == PurpleTeam) fill(174, 45, 183, 100);
            else fill(46, 56, 209, 100);
            beginShape();
            for (var i = 0; i < this.polygon.calcPoints.length; i++) {
                vertex(this.polygon.pos.x + this.polygon.calcPoints[i].x, this.polygon.pos.y + this.polygon.calcPoints[i].y);
            }
            endShape(CLOSE);
        }
        if (frameCount % 2 == 0) {
            this.animation.runAnimation();
        }

        if (this.health <= 0 && !this.dead){
            if (this.team == PurpleTeam){
                if (this.animation.currAnimation != "dyingPurple"){
                    this.animation.changeAnimation("dyingPurple")
                }
                if (this.animation.frame == 49)
                    this.dead = true;
            } else {
                if (this.animation.currAnimation != "dyingBlue"){
                    this.animation.changeAnimation("dyingBlue")
                }
                if (this.animation.frame == 99)
                    this.dead = true;
            }

        }

        //if (this.team == BlueTeam) this.animation.changeAnimation("runningBlue")
        //if (this.team == PurpleTeam) this.animation.changeAnimation("runningPurple")


    }


}
