import .physics;
import .utils;
import .shapes.ShapeFactory as ShapeFactory;

var shapes = ShapeFactory.get();
var readOnlyProp = utils.addReadOnlyProperty;

exports = Class(function () {
  this.name = "EntityModel";

  /**
   * ~ REQUIRED
   * ~ init is the constructor for each model instance
   */
  this.init = function (opts) {
    // public props
    this.fixed = false;

    // private props
    this._shape = null;
    this._entity = opts.entity;
    this._offset = { x: 0, y: 0 };
    this._previous = { x: 0, y: 0 };
    this._velocity = { x: 0, y: 0 };
    this._acceleration = { x: 0, y: 0 };
  };

  this._initShape = function (opts) {
    this._shape = shapes.getShape(opts);
  };

  /**
   * ~ REQUIRED
   * ~ reset is called when an entity becomes active
   */
  this.reset = function (opts) {
    var hitOpts = opts.hitOpts = opts.hitOpts || {};
    hitOpts.x = opts.x || 0;
    hitOpts.y = opts.y || 0;
    hitOpts.offsetX = hitOpts.offsetX || opts.offsetX || 0;
    hitOpts.offsetY = hitOpts.offsetY || opts.offsetY || 0;
    hitOpts.width = hitOpts.width || opts.width || 0;
    hitOpts.height = hitOpts.height || opts.height || 0;
    this._initShape(hitOpts);

    this.fixed = hitOpts.fixed || false;
    this._offset.x = hitOpts.offsetX;
    this._offset.y = hitOpts.offsetY;
    this._previous.x = this.x;
    this._previous.y = this.y;
    this._velocity.x = opts.vx || 0;
    this._velocity.y = opts.vy || 0;
    this._acceleration.x = opts.ax || 0;
    this._acceleration.y = opts.ay || 0;
    return this._validate();
  };

  /**
   * ~ REQUIRED
   * ~ update is called each tick while an entity is active
   */
  this.update = function (dt) {
    this._previous.x = this.x;
    this._previous.y = this.y;
    physics.step(this, dt);
  };

  /**
   * ~ REQUIRED
   * ~ collidesWith defines how collisions are detected
   * ~ by default, only works with circles and axis-aligned rectangles
   */
  this.collidesWith = function (model) {
    return physics.collide(this, model);
  };

  /**
   * ~ REQUIRED
   * ~ resolveCollisionWith guarantees that two models are not colliding
   *   by pushing them apart
   * ~ shapes with fixed = true are never moved
   * ~ returns total distance moved to separate the objects
   */
  this.resolveCollisionWith = function (model) {
    return physics.resolveCollision(this, model);
  };

  /**
   * ~ REQUIRED
   * ~ isInside is used to determine if one entity is fully contained by another
   * ~ by default, returns a bool, and only works with circles and rects
   */
  this.isInside = function (model) {
    return physics.isInside(this, model);
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
    configurable: true,
    get: function () { return this._shape.x - this._offset.x; },
    set: function (value) { this._shape.x = value + this._offset.x; }
  });

  // expose y position
  Object.defineProperty(this, 'y', {
    enumerable: true,
    configurable: true,
    get: function () { return this._shape.y - this._offset.y; },
    set: function (value) { this._shape.y = value + this._offset.y; }
  });

  // expose x offset
  Object.defineProperty(this, 'offsetX', {
    enumerable: true,
    configurable: true,
    get: function () { return this._offset.x; },
    set: function (value) { this._offset.x = value; }
  });

  // expose y offset
  Object.defineProperty(this, 'offsetY', {
    enumerable: true,
    configurable: true,
    get: function () { return this._offset.y; },
    set: function (value) { this._offset.y = value; }
  });

  // expose read-only previous x position
  readOnlyProp(this, 'previousX', function () { return this._previous.x; });

  // expose read-only previous y position
  readOnlyProp(this, 'previousY', function () { return this._previous.y; });

  // expose x velocity
  Object.defineProperty(this, 'vx', {
    enumerable: true,
    configurable: true,
    get: function () { return this._velocity.x; },
    set: function (value) { this._velocity.x = value; }
  });

  // expose y velocity
  Object.defineProperty(this, 'vy', {
    enumerable: true,
    configurable: true,
    get: function () { return this._velocity.y; },
    set: function (value) { this._velocity.y = value; }
  });

  // expose x acceleration
  Object.defineProperty(this, 'ax', {
    enumerable: true,
    configurable: true,
    get: function () { return this._acceleration.x; },
    set: function (value) { this._acceleration.x = value; }
  });

  // expose y acceleration
  Object.defineProperty(this, 'ay', {
    enumerable: true,
    configurable: true,
    get: function () { return this._acceleration.y; },
    set: function (value) { this._acceleration.y = value; }
  });

  // expose read-only shape
  readOnlyProp(this, 'shape', function () { return this._shape; });

  // expose shape width as a hidden collision helper
  Object.defineProperty(this, 'width', {
    enumerable: false,
    configurable: true,
    get: function () { return this._shape.width; },
    set: function (value) { this._shape.width = value; }
  });

  // expose shape height as a hidden collision helper
  Object.defineProperty(this, 'height', {
    enumerable: false,
    configurable: true,
    get: function () { return this._shape.height; },
    set: function (value) { this._shape.height = value; }
  });

  // expose shape radius as a hidden collision helper
  Object.defineProperty(this, 'radius', {
    enumerable: false,
    configurable: true,
    get: function () { return this._shape.radius; },
    set: function (value) { this._shape.radius = value; }
  });

});
