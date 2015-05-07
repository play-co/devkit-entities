import .physics;

exports = Class(function () {
  /**
   * ~ REQUIRED
   * ~ init is the constructor for each model instance
   */
  this.init = function (opts) {
    this.entity = opts.entity;
    this.physics = opts.physics || physics;

    this.shape = this.physics.shapeFactory.getShape();
    this.previous = new Point({ x: 0, y: 0 });
    this.velocity = new Vec2D({ x: 0, y: 0 });
    this.acceleration = new Vec2D({ x: 0, y: 0 });
  };

  /**
   * ~ REQUIRED
   * ~ reset is called when an entity becomes active
   */
  this.reset = function (opts) {
    opts = opts || {};
    var vx = opts.vx || 0;
    var vy = opts.vy || 0;
    var ax = opts.ax || 0;
    var ay = opts.ay || 0;

    this.shape = this.physics.shapeFactory.getShape(opts);
    this.shape.fixed = opts.fixed || false;
    this.previous.x = this.shape.x;
    this.previous.y = this.shape.y;
    this.velocity.x = vx;
    this.velocity.y = vy;
    this.acceleration.x = ax;
    this.acceleration.y = ay;

    return this.validate();
  };

  /**
   * ~ REQUIRED
   * ~ update is called each tick while an entity is active
   */
  this.update = function (dt) {
    this.previous.x = this.shape.x;
    this.previous.y = this.shape.y;
    this.physics.step(this, dt);
  };

  /**
   * ~ REQUIRED
   * ~ collidesWith defines how collisions are detected
   * ~ by default, only works with circles and axis-aligned rectangles
   */
  this.collidesWith = function (model) {
    return this.physics.collide(this, model);
  };

  /**
   * ~ REQUIRED
   * ~ resolveCollisionWith guarantees that two models are not colliding
   *   by pushing them apart
   * ~ shapes with fixed = true are never moved
   * ~ returns total distance moved to separate the objects
   */
  this.resolveCollisionWith = function (model) {
    return this.physics.resolveCollision(this, model);
  };

  /**
   * ~ REQUIRED
   * ~ isInside is used to determine if one entity is fully contained by another
   * ~ by default, returns a bool, and only works with circles and rects
   */
  this.isInside = function (model) {
    return this.physics.isInside(this, model);
  };

  /**
   * ~ validate warns if a model is improperly configured or broken
   */
  this.validate = function () {
    var valid = true;
    if (this.shape.radius !== undefined) {
      if (this.shape.radius <= 0) {
        logger.warn("Invalid circle radius:", this.entity.uid, this.shape);
        valid = false;
      }
    } else if (this.shape.width !== undefined) {
      if (this.shape.width <= 0 || this.shape.height <= 0) {
        logger.warn("Invalid rect dimensions:", this.entity.uid, this.shape);
        valid = false;
      }
    }
    return valid;
  };

  /**
   * Helpers
   */

  Object.defineProperty(this, 'x', {
    enumerable: true,
    get: function () { return this.shape.x; },
    set: function (value) { this.shape.x = value; }
  });

  Object.defineProperty(this, 'y', {
    enumerable: true,
    get: function () { return this.shape.y; },
    set: function (value) { this.shape.y = value; }
  });

  utils.addReadOnlyProperty(this, 'previousX', function () {
    get: function () { return this.previous.x; }
  });

  utils.addReadOnlyProperty(this, 'previousY', function () {
    get: function () { return this.previous.y; }
  });

  Object.defineProperty(this, 'velocityX', {
    enumerable: true,
    get: function () { return this.velocity.x; },
    set: function (value) { this.velocity.x = value; }
  });

  Object.defineProperty(this, 'velocityY', {
    enumerable: true,
    get: function () { return this.velocity.y; },
    set: function (value) { this.velocity.y = value; }
  });

  Object.defineProperty(this, 'accelerationX', {
    enumerable: true,
    get: function () { return this.acceleration.x; },
    set: function (value) { this.acceleration.x = value; }
  });

  Object.defineProperty(this, 'accelerationY', {
    enumerable: true,
    get: function () { return this.acceleration.y; },
    set: function (value) { this.acceleration.y = value; }
  });

});
