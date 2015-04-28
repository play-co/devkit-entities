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
  };

  /**
   * ~ REQUIRED
   * ~ reset is called when an entity becomes active
   */
  this.reset = function (opts) {
    opts = opts || {};
    var x = opts.x || 0;
    var y = opts.y || 0;

    this.position.x = this.previous.x = x;
    this.position.y = this.previous.y = y;

    var velocity = opts.velocity || {};
    this.velocity.x = velocity.x || 0;
    this.velocity.y = velocity.y || 0;

    var acceleration = opts.acceleration || {};
    this.acceleration.x = acceleration.x || 0;
    this.acceleration.y = acceleration.y || 0;

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
    if (this.circle) {
      if (model.circle) {
        return this.physics.circleCollidesWithCircle(this, model);
      } else {
        return this.physics.circleCollidesWithRect(this, model);
      }
    } else {
      if (model.circle) {
        return this.physics.circleCollidesWithRect(model, this);
      } else {
        return this.physics.rectCollidesWithRect(this, model);
      }
    }
  };

  /**
   * ~ REQUIRED
   * ~ resolveCollisionWith guarantees that two models are not colliding
   *   by pushing them apart
   * ~ entities with fixed = true are never moved
   * ~ returns total distance moved to separate the objects
   */
  this.resolveCollisionWith = function (model) {
    if (this.circle) {
      if (model.circle) {
        return this.physics.resolveCollidingCircles(this, model);
      } else {
        return this.physics.resolveCollidingCircleRect(this, model);
      }
    } else {
      if (model.circle) {
        return this.physics.resolveCollidingCircleRect(model, this);
      } else {
        return this.physics.resolveCollidingRects(this, model);
      }
    }
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

  this.getX = function() {
    return this.position.x;
  };

  this.getY = function() {
    return this.position.y;
  };

  this.getMinHitX = function () {
    return this.position.x + this.hitBounds.x;
  };

  this.getMaxHitX = function () {
    return this.position.x + this.hitBounds.x + this.hitBounds.width;
  };

  this.getMinHitY = function () {
    return this.position.y + this.hitBounds.y;
  };

  this.getMaxHitY = function () {
    return this.position.y + this.hitBounds.y + this.hitBounds.height;
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

});
