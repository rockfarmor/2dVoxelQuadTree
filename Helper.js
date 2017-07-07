//constants
const airFriction = 0.8;
const platformFriction = 0.7;
var jumpConstant = 25;


const PurpleTeam = 0;
const BlueTeam = 1;



function inits() {
    //Sets the camera to its init position
    Cam = {
        orgin: createVector(width / 2, height / 2),
        scale: 1,
        scale_: 2,
        follow: createVector(0, 0),
        follow_: createVector(0, 0),
        angle: 0
    }

    mobList = [];




    gravity = createVector(0, 2);
    pGravity = createVector().set(gravity).div(25);


}

function entitySameTeam(e1, e2) {
    return e1.team == e2.team;
}

function entityDistance(e1, e2) {
    var distVec = e1.polygon.pos.copy().sub(e2.polygon.pos);
    return distVec.mag();
}

//Returns the vector between e1 to e1
function entityTrackVector(e1, e2) {
    return e2.polygon.pos.copy().sub(e1.polygon.pos);
}

/*
    Returns closest entity to another entity by attackRange
*/
function findClosestEntity(e, byDirection = false, turret = false) {

    var closest = null;
    var minRange = Infinity;
    if (turret){
        for (var i = 0; i < turrets.length; i++) {
            var turr = turrets[i];
            var dist = entityDistance(e,turr);
            if (!(entitySameTeam(e,turr)) && turr.health > 0){
                if (dist < e.attackRange){
                    if (byDirection) {
                        var rightleft = e.polygon.pos.x - turr.polygon.pos.x;
                        if (e.dir == -1) {
                            //left
                            if (rightleft >= 0) {
                                return turr;
                            }
                        } else {
                            //right
                            if (rightleft <= 0) {
                                return turr;
                            }

                        }
                    } else {
                        return turr;
                    }

                }

            }
        }
    }


    if (closest == null) {
        for (var i = 0; i < mobList.length; i++) {
            var mob = mobList[i];
            if (e !== mob && mob.health > 0) {
                var dist = entityDistance(e, mob);
                if (e.team != mob.team && dist < e.attackRange) {
                    if (dist < minRange) {
                        if (byDirection) {
                            var rightleft = e.polygon.pos.x - mob.polygon.pos.x;
                            if (e.dir == -1) {
                                //left
                                if (rightleft >= 0) {
                                    minRange = dist;
                                    closest = mob;
                                }
                            } else {
                                //right
                                if (rightleft <= 0) {
                                    minRange = dist;
                                    closest = mob;
                                }

                            }
                        } else {
                            minRange = dist;
                            closest = mob;
                        }
                    }
                }
            }
        }
    }
    return closest;
}


function spawnMobs(amount) {
    debug.log(amount + " mobs was spawned", 5);
    spawnMobsByTeam(amount, PurpleTeam);
    spawnMobsByTeam(amount, BlueTeam);
}

function spawnMobsByTeam(amount, team) {
    if (team == PurpleTeam) {
        for (var i = 0; i < amount; i++) {
            mobList.push(new Mob(974 + i * 20, 1396 - 100, PurpleTeam));
        }
    } else {
        for (var i = 0; i < amount; i++) {
            mobList.push(new Mob(3830 - i * 20, 1396 - 100, BlueTeam));
        }
    }
}




function addEmitter(x, y, type, num, collision = false, infinite = false) {
    particleEmitters.push(new ParticleEmitter(x, y, type, num, collision, infinite))

}





/*
TODO: Add rotation
*/

function screenToWorld(x, y) {


    /*translate(Cam.orgin.x, Cam.orgin.y);
    scale(Cam.scale_);
    rotate(Cam.angle);
    translate(-Cam.follow_.x, -Cam.follow_.y);
    */
    var mouseXTransformed = (x - Cam.orgin.x) / Cam.scale_ + Cam.follow_.x;
    var mouseYTransformed = (y - Cam.orgin.y) / Cam.scale_ + Cam.follow_.y;


    return createVector(mouseXTransformed, mouseYTransformed);

}

function mouseCamVector() {
    var vec = createVector(mouseX - width / 2, mouseY - height / 2);
    return vec.setMag(7);
}

function camFollowEntity(e) {
    Cam.follow.set(createVector(e.polygon.pos.x, e.polygon.pos.y));
}


//draw health bar over entity
function drawHealthBar(e, height = 0) {
    var hx = e.polygon.pos.x;
    var hy = e.polygon.pos.y;

    var wid = 20;
    var hei = 3;
    noStroke();
    fill(51);

    rect(hx - wid / 2, hy - height - hei * 2 - 1, wid, hei)
    noStroke();
    fill(0, 255, 0);

    var hwid = wid * e.health / e.maxHealth - 2;
    if (hwid > 0)
        rect(hx - wid / 2 + 1, hy - height - hei * 2 - 1 + 1, hwid, hei - 2)
}

//Camera stuff
function cameraTranslate() {
    Cam.scale_ = lerp(Cam.scale_, Cam.scale, 0.1);
    Cam.follow_ = p5.Vector.lerp(Cam.follow_, Cam.follow, 0.4);

    translate(Cam.orgin.x, Cam.orgin.y);
    scale(Cam.scale_);
    rotate(Cam.angle);
    translate(-Cam.follow_.x, -Cam.follow_.y);
}

function vectorNormal(v) {
    return createVector(v.y, -v.x).normalize();
}
