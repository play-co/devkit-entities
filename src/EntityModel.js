import .physics;

exports = Class(function () {
  this.name = "EntityModel";

  /**
   * ~ REQUIRED
   * ~ init is the constructor for each model instance
   */
  this.init = function (opts) {
    this._entity = opts.entity;
    this._physics = opts.physics || physics;

    this._shape = this._physics.shapeFactory.getShape();
    this._previous = { x: 0, y: 0 };
    this._velocity = { x: 0, y: 0 };
    this._acceleration = { x: 0, y: 0 };
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

    this._shape = this._physics.shapeFactory.getShape(opts);
    this._shape.fixed = opts.fixed || false;
    this._previous.x = this._shape.x;
    this._previous.y = this._shape.y;
    this._velocity.x = vx;
    this._velocity.y = vy;
    this._acceleration.x = ax;
    this._acceleration.y = ay;

    return this._validate();
  };

  /**
   * ~ REQUIRED
   * ~ update is called each tick while an entity is active
   */
  this.update = function (dt) {
    this._previous.x = this._shape.x;
    this._previous.y = this._shape.y;
    this._physics.step(this, dt);
  };

  /**
   * ~ REQUIRED
   * ~ collidesWith defines how collisions are detected
   * ~ by default, only works with circles and axis-aligned rectangles
   */
  this.collidesWith = function (model) {
    return this._physics.collide(this, model);
  };

  /**
   * ~ REQUIRED
   * ~ resolveCollisionWith guarantees that two models are not colliding
   *   by pushing them apart
   * ~ shapes with fixed = true are never moved
   * ~ returns total distance moved to separate the objects
   */
  this.resolveCollisionWith = function (model) {
    return this._physics.resolveCollision(this, model);
  };

  /**
   * ~ REQUIRED
   * ~ isInside is used to determine if one entity is fully contained by another
   * ~ by default, returns a bool, and only works with circles and rects
   */
  this.isInside = function (model) {
    return this._physics.isInside(this, model);
  };

  /**
   * ~ _validate warns if a model is improperly configured or broken
   */
  this._validate = function () {
    var valid = true;
    if (this._shape.radius !== undefined) {
      if (this._shape.radius <= 0) {
        logger.warn("Invalid circle radius:", this._entity.uid, this._shape);
        valid = false;
      }
    } else if (this._shape.width !== undefined) {
      if (this._shape.width <= 0 || this._shape.height <= 0) {
        logger.warn("Invalid rect dimensions:", this._entity.uid, this._shape);
        valid = false;
      }
    }
    return valid;
  };

  /**
   * Public API Extensions
   * ~ properties exposed for ease of use
   */

  // expose x position   
  Object.defineProperty(this, 'x', {
    enumerable: true,
    get: function () { return this._shape.x; },
    set: function (value) { this._shape.x = value; }
  });

  // expose y position
  Object.defineProperty(this, 'y', {
    enumerable: true,
    get: function () { return this._shape.y; },
    set: function (value) { this._shape.y = value; }
  });

  // expose read-only previous x position
  utils.addReadOnlyProperty(this, 'previousX', function () {
    return this._previous.x;
  });

  // expose read-only previous y position
  utils.addReadOnlyProperty(this, 'previousY', function () {
    return this._previous.y;
  });

  // expose x velocity
  Object.defineProperty(this, 'vx', {
    enumerable: true,
    get: function () { return this._velocity.x; },
    set: function (value) { this._velocity.x = value; }
  });

  // expose y velocity
  Object.defineProperty(this, 'vy', {
    enumerable: true,
    get: function () { return this._velocity.y; },
    set: function (value) { this._velocity.y = value; }
  });

  // expose x acceleration
  Object.defineProperty(this, 'ax', {
    enumerable: true,
    get: function () { return this._acceleration.x; },
    set: function (value) { this._acceleration.x = value; }
  });

  // expose y acceleration
  Object.defineProperty(this, 'ay', {
    enumerable: true,
    get: function () { return this._acceleration.y; },
    set: function (value) { this._acceleration.y = value; }
  });

  // expose read-only shape
  utils.addReadOnlyProperty(this, 'shape', function () {
    return this._shape;
  });

});
