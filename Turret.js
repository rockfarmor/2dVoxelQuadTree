var Turret = function(x, y, team, img) {
    this.polygon = new Polygon(createVector(x, y), []);
    this.team = team;
    this.img = img;
    this.attackRange = 100;
    this.target = null;

    this.animation = new Animation(explosion);
    this.animation.addAnimation("explosion", 0, 11);

    this.health = 1000;
    this.maxHealth = 1000;
    this.dead = false;

    this.update = function() {
        if (!this.dead) {
            var particle = ParticleType.Bluepart;
            if (this.team == PurpleTeam)
                particle = ParticleType.Purplepart;
            if (frameCount % 4 == 0)
                addEmitter(this.polygon.pos.x, this.polygon.pos.y - 16 * 4, particle, 30, false, false)


            //Find target
            if (this.target == null) {
                this.target = findClosestEntity(this);
                if (this.target == null){
                    if (entityDistance(this, player) < this.attackRange && !entitySameTeam(this, player)){
                        this.target = player;
                    }
                }
            } else {

                if (this.target.health <= 0 || entityDistance(this, this.target) > this.attackRange) {
                    this.target = null;
                } else {
                    //Attack
                    if (frameCount % 4 == 0)
                        this.target.health -= 1;

                }
            }
        }
    }

    this.draw = function() {
        if(!this.dead){
            if (this.health <= 0) {
                this.animation.spritesheet.drawTile(this.animation.frame, (this.polygon.pos.x) - this.animation.spritesheet.tileWidth/2, this.polygon.pos.y - this.animation.spritesheet.tileHeight, this.animation.spritesheet.tileWidth, this.animation.spritesheet.tileHeight)
                if (this.animation.frame == this.animation.spritesheet.lastFrame()-1)
                    this.dead = true;
                if (frameCount % 1 == 0)
                    this.animation.runAnimation();
            } else {
                copy(this.img, this.team * 16 * 3, 160, 16 * 3, 16 * 6, this.polygon.pos.x - 16 * 3 / 2, this.polygon.pos.y - 17 - 16 * 4, 16 * 3, 16 * 6);
                fill(255, 0, 0)
                //ellipse(this.polygon.pos.x, this.polygon.pos.y, 20,20)
                if (this.target != null) {
                    if (this.team == PurpleTeam)
                        stroke(255,0,255, 30);
                    else {
                        stroke(0, 0, 200, 50);
                    }
                    for (var i = 1; i < 8; i++) {
                        strokeWeight(8 - i);
                        line(this.polygon.pos.x, this.polygon.pos.y - 16 * 4, this.target.polygon.pos.x, this.target.polygon.pos.y - random(10,20))
                    }


                }
                noStroke();
                drawHealthBar(this, 10 + 16 * 4)
            }
        }

        if (this.health <= 0) {
            copy(this.img, 16 * 6, 16*8+1, 16 * 2, 16 * 2, this.polygon.pos.x - 16, this.polygon.pos.y - 17 - 12, 16 * 2, 16 * 2);

        }

    }



}
