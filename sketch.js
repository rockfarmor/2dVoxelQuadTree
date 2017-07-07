// Cam object
var Cam;
// List of Platforms
var platform;
// Debug object
var debug;
// Player variable
var player;
// Variable for controlling the speed of player
var speed = 1;
// Gravity constant
var gravity;
var pGravity;

var charSheet;
var mapSheet;
var mobSheet;
var tiledMap;

var mobList;

var particleEmitters = [];

var turrets;

var explosion;




function preload(){
    debug = new Debugger();
    platforms = [];

    tiledMap = new TiledMap();
    var charImg = loadImage("Assets/characters/char1/rogue_sheet.png");
    charSheet = new Tileset(charImg, 32, 32);
    var mobImg = loadImage("Assets/characters/char1/goblin_sheet_armour.png");
    mobSheet = new Tileset(mobImg, 32, 32, 0, 1);
    tiledMap.layer.push(loadImage("Assets/Map/map.png"));

    explosion = new Tileset(loadImage("Assets/Explosion.png"), 96, 96)

    loadXML("assets/Map/map.tmx", populate);

}





function setup() {
    createCanvas(800, 500);

    inits();

    T_RESPONSE = new Response();
    TEST_POINT = new Box(createVector(), 0.000001, 0.000001).toPolygon();

    for (var i = 0; i < 10; i++) {
        T_VECTORS.push(createVector());
    }
    for (var i = 0; i < 5; i++) {
        T_ARRAYS.push([]);
    }

    mobList = [];

    spawnMobs(10);


    player = new Hero(658, 1377-20, PurpleTeam);
    frameRate(30);
    particleEmitters = [];
    turrets = [];
    var img_ = loadImage("Assets/Map/mininicular_extended.png");
    turrets.push(new Turret(1100, 1395, PurpleTeam, img_));
    turrets.push(new Turret(1100 + 450, 1395, PurpleTeam, img_));

    turrets.push(new Turret(3721, 1395, BlueTeam, img_));
    turrets.push(new Turret(3721 - 450, 1395, BlueTeam, img_));

    document.getElementById('sketch-holder').appendChild(
        document.getElementById('defaultCanvas0')
    );

}


function update() {
    if (player.jumpReady) player.acc.add(createVector(0,0.5));
    else player.acc.add(gravity);
    player.update();

    for (var i = 0; i < mobList.length; i++) {

        if(mobList[i].jumpReady) mobList[i].acc.add(createVector(0,0.5));
        else mobList[i].acc.add(gravity);
        if (mobList[i].health > 0)
            mobList[i].update();
    }


    //Check for player collision with platform-polygons
    for (var i = 0; i < mobList.length; i++) {
        for (var j = 0; j < mobList.length; j++) {
            if (i != j && mobList[i].health > 0 && mobList[j].health > 0) {
                entityStaticPolygonCollision(mobList[i], mobList[j].polygon);
            }
        }
        mobList[i].jumpReady = false;
    }
    player.jumpReady = false;
    for (var i = 0; i < platforms.length; i++) {

        for (var j = 0; j < mobList.length; j++) {
            entityStaticPolygonCollision(mobList[j], platforms[i].polygon);
        }

        entityStaticPolygonCollision(player, platforms[i].polygon);

    }

    //Draw particles
    for (var i = particleEmitters.length -1; i >= 0; i--) {
        particleEmitters[i].update();
        if (!particleEmitters[i].infinite && particleEmitters[i].particles.length <= 0)
            particleEmitters.splice(i,1);
    }


    var ani = "";

    if (keyIsDown(LEFT_ARROW)) {
        player.acc.add(createVector(-speed, 0))
        player.dir = -1;
        ani = "running";
    } else if (keyIsDown(RIGHT_ARROW)) {
        player.acc.add(createVector(speed, 0))
        player.dir = 1;
        ani = "running";
    }

    if (keyIsDown(UP_ARROW) && player.jumpReady) {
        player.acc.add(createVector(0, -jumpConstant))
        player.jumpReady = false;
    } else if (keyIsDown(DOWN_ARROW)) {
        player.acc.add(createVector(0, speed))
    }

    if (keyIsDown(32)){
        if (player.attack())
            ani = "attack"
    }

    if (ani == "running" && player.animation.currAnimation != "attack"){
        player.animation.changeAnimation(ani);
    }
    if (ani == "attack"){
        player.animation.changeAnimation(ani);
    }
    if (ani == ""){
        if(player.animation.currAnimation == "running")
            player.animation.changeAnimation("idle")
    }
    //Set the Camera to follow the player
    camFollowEntity(player);

    //kill of dead mobs
    for (var i = mobList.length - 1; i >= 0; i--) {
        if (mobList[i].health <= 0 && mobList[i].dead) {
            mobList.splice(i, 1);
        }
    }

    for (var i = turrets.length - 1; i >= 0; i--) {
        turrets[i].update();

        /*if (turrets[i].health <= 0 && turrets[i].dead) {
            turrets.splice(i,1);
        }*/

    }

    //Spawn new mobs
    if (frameCount % 500 == 0){
        spawnMobs(10);
    }

    //Draw laser

    //addEmitter(1092+4, 1395-67, ParticleType.Bluepart, 60, false, true)





}

function keyPressed(){
    // If alt-key is down, toggle debug-mode
    if (keyIsDown(18)){
        debug.debugMode = !debug.debugMode;
        debug.log("Debug mode: " + debug.debugMode, 3)
    }
}


function draw() {
    background(41);
    update();
    push()
    cameraTranslate();

    //draw map layers
    for (var i = 0; i < tiledMap.layer.length; i++) {
        image(tiledMap.layer[i], 0, 0);
    }

    for (var i = 0; i < turrets.length; i++) {
        turrets[i].draw()
    }

    //If debug mode is on, draw platform-polygons
    if (debug.debugMode){
        for (var i = 0; i < platforms.length; i++) {
            platforms[i].draw();
        }
    }

    for (var i = 0; i < mobList.length; i++) {
        mobList[i].draw();
    }

    //draw player
    player.draw();


    //Draw particles
    for (var i = 0; i < particleEmitters.length; i++) {
        particleEmitters[i].draw();
    }



    //Draw from debug object
    pop();
    debug.draw();
    push();
    fill(255);
    text("FPS: " + getFrameRate().toFixed(2) + " | VEL: " + player.vel.mag().toFixed(2), 10, height - 20);
    pop();

}
