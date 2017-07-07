
var ParticleType = {
    Blood: 0,
    Leave: 1,
    Bluepart: 2,
    Purplepart: 3,
    Sparkle: 4
}


var ParticleEmitter = function(x, y, type, amount, collision = false, infinite = true){

    this.particles = [];
    this.pos = createVector(x, y);
    this.infinite = infinite;
    this.type = type;
    this.amount = amount;
    this.collision = collision;
    this.addParticle = function(num){
        for (var i = 0; i < num; i++) {
            var grav = false;
            var lifetime = 20;
            if (this.type == ParticleType.Blood){
                grav = true;
                lifetime = 100;
            }

            if (this.type == ParticleType.Bluepart || this.type == ParticleType.Purplepart){
                grav = false;
                lifetime = 20;
            }
            this.particles.push(new Particle(this.pos.x, this.pos.y, createVector(random(-1,1), random(-1,1)), this.type, lifetime, this.collision,grav));
        }
    }
    this.addParticle(this.amount);

    this.update = function(){
        for (var i = this.particles.length - 1; i >= 0; i--) {
            var part = this.particles[i];
            if (part.lifeTime > 0){
                part.update();

            } else {
                this.particles.splice(i,1);
                //remove particle
            }
        }

        if (this.infinite){
            this.addParticle(amount/4);
        }

    }

    this.draw = function(){
        for (var i = 0; i < this.particles.length; i++) {
            this.particles[i].draw();
        }
    }

}

var Particle = function(x, y, force, type, lifetime, collision = false, grav = true) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector().set(force)
    this.acc.normalize();
    this.acc.div(random(1,5));
    this.acc.mult(random(1,3))
    this.type = type;
    this.lifeTime = lifetime;
    this.lifeTimeOrg = lifetime;
    this.gravity = grav;
    this.collide = collision
    this.dead = false;

    this.update = function(){
        if (!this.dead){
            this.vel.add(this.acc);
            this.acc.mult(0.99);
            this.pos.add(this.vel);
            this.vel.mult(airFriction);

            if (this.gravity){
                this.acc.add(pGravity);
            }
            if (this.collide){
                for (var i = 0; i < platforms.length; i++) {
                    var coll = pointInPolygon(this.pos, platforms[i].polygon); // false
                    if (coll){
                        this.dead = true;
                        break;
                    }
                }
            }

        }
        this.lifeTime--;

    }

    this.draw = function(){
        noStroke();
        var r = 255;
        var g  = 0;
        var b = 0;
        var a = 255 - 200*(1 - this.lifeTime/this.lifeTimeOrg);

        if (this.type == ParticleType.Bluepart){
            r = 0;
            g = 0;
            b = 200;
            a /= 3;
            fill(r, g, b, a);
            ellipse(this.pos.x, this.pos.y, random(1,2), random(1,3))
        } else if (this.type == ParticleType.Purplepart){
            r = 148;
            g = 0;
            b = 211;
            a /= 3;
            fill(r, g, b, a);
            ellipse(this.pos.x, this.pos.y, random(1,2), random(1,3))

        } else if (this.type == ParticleType.Sparkle){
            r = 255;
            g = 255;
            b = 0;
            fill(r, g, b, a);
            ellipse(this.pos.x, this.pos.y, random(1,2), random(1,3))


        } else if (this.type == ParticleType.Blood){
            fill(r, g, b, a);
            ellipse(this.pos.x, this.pos.y, random(1,2), random(1,3))
        } else {
            fill(r, g, b, a);
            ellipse(this.pos.x, this.pos.y, random(1,2), random(1,3))
        }



    }

}
