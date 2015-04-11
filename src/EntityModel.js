import .defaults;
import .EntityPhysics;

exports = Class(function () {
  /**
   * ~ REQUIRED
   * ~ init is the constructor for each model instance
   */
  this.init = function (opts) {
    this.entity = opts.entity;
    this.physics = opts.physics || EntityPhysics;

    this.position = defaults.getPoint();
    this.previous = defaults.getPoint();
    this.velocity = defaults.getVector();
    this.acceleration = defaults.getVector();
    this.hitBounds = defaults.getBounds();

    this.isActive = false;
    this.isCircle = false;
    this.isFixed = false;
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

    var hitBounds = opts.hitBounds || defaults.getBounds(opts);
    this.hitBounds.x = hitBounds.x || 0;
    this.hitBounds.y = hitBounds.y || 0;
    this.hitBounds.radius = hitBounds.radius || 0;
    this.hitBounds.width = hitBounds.width || 0;
    this.hitBounds.height = hitBounds.height || 0;

    this.isActive = true;
    this.isCircle = opts.isCircle || false;
    this.isFixed = opts.isFixed || false;

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
    if (this.isCircle) {
      if (model.isCircle) {
        return this.physics.circleCollidesWithCircle(this, model);
      } else {
        return this.physics.circleCollidesWithRect(this, model);
      }
    } else {
      if (model.isCircle) {
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
   * ~ entities with isFixed = true are never moved
   * ~ returns total distance moved to separate the objects
   */
  this.resolveCollisionWith = function (model) {
    if (this.isCircle) {
      if (model.isCircle) {
        return this.physics.resolveCollidingCircles(this, model);
      } else {
        return this.physics.resolveCollidingCircleRect(this, model);
      }
    } else {
      if (model.isCircle) {
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
    if (this.isCircle) {
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

  this.getHitX = this.getLeftX = this.getMinX = function () {
    return this.position.x + this.hitBounds.x;
  };

  this.getRightX = this.getMaxX = function () {
    return this.getX() + this.getWidth();
  };

  this.getHitY = this.getTopY = this.getMinY = function () {
    return this.position.y + this.hitBounds.y;
  };

  this.getBottomY = this.getMaxY = function () {
    return this.getY() + this.getHeight();
  };

  this.getRadius = this.getHitRadius = function () {
    return this.hitBounds.radius;
  };

  this.getWidth = this.getHitWidth = function () {
    return this.hitBounds.width;
  };

  this.getHeight = this.getHitHeight = function () {
    return this.hitBounds.height;
  };
});
