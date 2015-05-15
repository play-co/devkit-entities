import .shapes.ShapeFactory as ShapeFactory;
import .shapes.collisionHelper as collisionHelper;

var Physics = Class(function () {

  this.init = function (opts) {
    opts = opts || {};

    this.shapeFactory = opts.shapeFactory || new ShapeFactory();
  };

  /**
   * ~ REQUIRED
   * ~ step updates a model's position based on dt (delta time) and physics
   * ~ velocity is added half before update and half after, which helps
   *   mitigate lag spikes, for smoother, more frame-independent movements
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

  this.collide = function (entity1, entity2) {
    return collisionHelper.collide(
      entity1.model || entity1,
      entity2.model || entity2);
  };

  this.resolveCollision = function (entity1, entity2) {
    return collisionHelper.resolveCollision(
      entity1.model || entity1,
      entity2.model || entity2);
  };

  this.isInside = function (entity1, entity2) {
    return collisionHelper.isInside(
      entity1.model || entity1,
      entity2.model || entity2);
  };

});

// Singleton
exports = new Physics();
