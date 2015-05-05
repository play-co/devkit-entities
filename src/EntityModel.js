import .physics;

exports = Class(function () {
  /**
   * ~ REQUIRED
   * ~ init is the constructor for each model instance
   */
  this.init = function (opts) {
    this.entity = opts.entity;
    this.physics = opts.physics || physics;

    this.position = this.physics.getPoint();
    this.previous = this.physics.getPoint();
    this.velocity = this.physics.getVector();
    this.acceleration = this.physics.getVector();
    this.hitBounds = this.physics.getBounds();

    this.circle = false;
    this.fixed = false;

    this._bindEntity(this.entity);
  };

  /**
   * ~ _bindEntity modifies the entity instance for convenient access to model
   *   properties and behavior
   */
  this._bindEntity = function (entity) {
    var model = this;

    // expose x position
    Object.defineProperty(entity, 'x', {
      enumerable: true,
      get: function () { return model.position.x; },
      set: function (value) { model.position.x = value; }
    });

    // expose y position
    Object.defineProperty(entity, 'y', {
      enumerable: true,
      get: function () { return model.position.y; },
      set: function (value) { model.position.y = value; }
    });

    // expose x velocity
    Object.defineProperty(entity, 'vx', {
      enumerable: true,
      get: function () { return model.velocity.x; },
      set: function (value) { model.velocity.x = value; }
    });

    // expose y velocity
    Object.defineProperty(entity, 'vy', {
      enumerable: true,
      get: function () { return model.velocity.y; },
      set: function (value) { model.velocity.y = value; }
    });

    // expose x acceleration
    Object.defineProperty(entity, 'ax', {
      enumerable: true,
      get: function () { return model.acceleration.x; },
      set: function (value) { model.acceleration.x = value; }
    });

    // expose y acceleration
    Object.defineProperty(entity, 'ay', {
      enumerable: true,
      get: function () { return model.acceleration.y; },
      set: function (value) { model.acceleration.y = value; }
    });
  };

  /**
   * ~ REQUIRED
   * ~ reset is called when an entity becomes active
   */
  this.reset = function (opts) {
    opts = opts || {};
    var x = opts.x || 0;
    var y = opts.y || 0;
    var vx = opts.vx || 0;
    var vy = opts.vy || 0;
    var ax = opts.ax || 0;
    var ay = opts.ay || 0;

    this.position.x = this.previous.x = x;
    this.position.y = this.previous.y = y;
    this.velocity.x = vx;
    this.velocity.y = vy;
    this.acceleration.x = ax;
    this.acceleration.y = ay;

    var hitBounds = opts.hitBounds || this.physics.getBounds(opts);
    this.hitBounds.x = hitBounds.x || 0;
    this.hitBounds.y = hitBounds.y || 0;
    this.hitBounds.radius = hitBounds.radius || 0;
    this.hitBounds.width = hitBounds.width || 0;
    this.hitBounds.height = hitBounds.height || 0;

    this.circle = opts.circle || false;
    this.fixed = opts.fixed || false;

    return this.validate();
  };

  /**
   * ~ REQUIRED
   * ~ update is called each tick while an entity is active
   */
  this.update = function (dt) {
    this.previous.x = this.position.x;
    this.previous.y = this.position.y;
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
   * ~ entities with fixed = true are never moved
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
    if (this.circle) {
      if (this.hitBounds.radius <= 0) {
        logger.warn("Invalid hit radius:", this.entity.uid, this.hitBounds);
        valid = false;
      }
    } else {
      if (this.hitBounds.width <= 0 || this.hitBounds.height <= 0) {
        logger.warn("Invalid hit dimensions:", this.entity.uid, this.hitBounds);
        valid = false;
      }
    }
    return valid;
  };

  /**
   * Getters
   */

  this.getX = function () {
    return this.position.x;
  };

  this.getY = function () {
    return this.position.y;
  };

  this.getPreviousX = function () {
    return this.previous.x;
  };

  this.getPreviousY = function () {
    return this.previous.y;
  };

  this.getVelocityX = function () {
    return this.velocity.x;
  };

  this.getVelocityY = function () {
    return this.velocity.y;
  };

  this.getAccelerationX = function () {
    return this.acceleration.x;
  };

  this.getAccelerationY = function () {
    return this.acceleration.y;
  };

  this.getHitX = function () {
    return this.position.x + this.hitBounds.x;
  };

  this.getHitY = function () {
    return this.position.y + this.hitBounds.y;
  };

  this.getHitWidth = function () {
    return this.hitBounds.width;
  };

  this.getHitHeight = function () {
    return this.hitBounds.height;
  };

  this.getHitRadius = function () {
    return this.hitBounds.radius;
  };

  this.isCircle = function () {
    return this.circle;
  };

  this.isFixed = function () {
    return this.fixed;
  };

});
