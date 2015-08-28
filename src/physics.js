import .shapes.collisionHelper as collisionHelper;

/**
 * This singleton class defines the physics used to control entities' behavior
 * @class Physics
 */
var Physics = Class(function () {
  /**
   * Called by {@link EntityModel#update} each tick while the entity is active; velocity is added half before update and half after, which helps mitigate lag spikes, for smoother, more frame-independent movements
   * @method Physics#step
   * @arg {EntityModel} model - the model whose position to update
   * @arg {number} dt - the number of milliseconds elapsed since last update
   */
  this.step = function (model, dt) {
    var x = model.x;
    var y = model.y;
    var vx = model.vx;
    var vy = model.vy;
    var ax = model.ax;
    var ay = model.ay;

    x += dt * vx / 2;
    vx += dt * ax;
    x += dt * vx / 2;

    y += dt * vy / 2;
    vy += dt * ay;
    y += dt * vy / 2;

    model.x = x;
    model.y = y;
    model.vx = vx;
    model.vy = vy;
  };

  /**
   * Checks for a collision between two entities; wraps {@link collisionHelper#collide}
   * @method Physics#collide
   * @arg {Entity} entity1 - The first entity
   * @arg {Entity} entity2 - The second entity
   * @returns {boolean} Whether or not the two entities are colliding
   */
  this.collide = function (entity1, entity2) {
    return collisionHelper.collide(
      entity1.model || entity1,
      entity2.model || entity2);
  };

  /**
   * Resolves a collision between two entities by pushing them apart; wraps {@link collisionHelper#resolveCollision}
   * @method Physics#resolveCollision
   * @arg {Entity} entity1 - The first entity
   * @arg {Entity} entity2 - The second entity
   * @returns {number} The distance the two entities were pushed apart
   */
  this.resolveCollision = function (entity1, entity2) {
    return collisionHelper.resolveCollision(
      entity1.model || entity1,
      entity2.model || entity2);
  };

  /**
   * Checks to see if entity1 is fully contained within entity2; wraps {@link collisionHelper#isInside}
   * @method Physics#isInside
   * @arg {Entity} entity1 - The first entity
   * @arg {Entity} entity2 - The second entity
   * @returns {boolean} Whether or not entity1 is fully contained within entity2
   */
  this.isInside = function (entity1, entity2) {
    return collisionHelper.isInside(
      entity1.model || entity1,
      entity2.model || entity2);
  };
});

// Singleton
exports = new Physics();
