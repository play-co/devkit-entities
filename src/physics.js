import .shapes.ShapeFactory as ShapeFactory;
import .shapes.collisionHelper as collisionHelper;

var Physics = Class(function () {

  this.init = function(opts) {
    this.shapeFactory = opts.shapeFactory || new ShapeFactory();
  };

  /**
   * ~ REQUIRED
   * ~ step updates a model's position based on dt (delta time) and physics
   * ~ velocity is added half before update and half after, which helps
   *   mitigate lag spikes, for smoother, more frame-independent movements
   */
  this.step = function (model, dt) {
    var x = model.getX();
    var y = model.getY();
    var vx = model.getVelocityX();
    var vy = model.getVelocityY();
    var ax = model.getAccelerationX();
    var ay = model.getAccelerationY();

    x += dt * vx / 2;
    vx += dt * ax;
    x += dt * vx / 2;

    y += dt * vy / 2;
    vy += dt * ay;
    y += dt * vy / 2;

    model.setX(x);
    model.setY(y);
    model.setVelocityX(vx);
    model.setVelocityY(vy);
  };

  this.collide = function(entity1, entity2) {
    var shape1 = (entity1.model || entity1).getShape();
    var shape2 = (entity2.model || entity2).getShape();
    return collisionHelper.collide(shape1, shape2);
  };

  this.resolveCollision = function(entity1, entity2) {
    var shape1 = (entity1.model || entity1).getShape();
    var shape2 = (entity2.model || entity2).getShape();
    return collisionHelper.resolveCollision(shape1, shape2);
  };

  this.isInside = function(entity1, entity2) {
    var shape1 = (entity1.model || entity1).getShape();
    var shape2 = (entity2.model || entity2).getShape();
    return collisionHelper.isInside(shape1, shape2);
  };

});

// Singleton
exports = new Physics();
