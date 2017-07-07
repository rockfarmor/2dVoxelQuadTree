
function entityStaticPolygonCollision(entity, polygon){
    var entityPos = entity.polygon.pos.copy();

    entity.polygon.pos.add(entity.vel);


    var response = new Response();
    var collided = testPolygonPolygon(entity.polygon, polygon, response);

    var pColl = pointInPolygon(createVector(entity.polygon.pos.x, entity.polygon.pos.y+10), polygon);
    if (collided && response.overlapV != null){
    //    if (pColl) playerColl = true;
     entity.vel.sub(response.overlapV);

    }
    if (!entity.jumpReady && pColl) entity.jumpReady = true;

    entity.polygon.pos.set(entityPos);

}
