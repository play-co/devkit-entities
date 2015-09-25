import .physics;
import .utils;
import .shapes.ShapeFactory as ShapeFactory;

var shapes = ShapeFactory.get();
var readOnlyProp = utils.addReadOnlyProperty;

/**
 * This class represents the default model for an entity's data
 * @class EntityModel
 */
exports = Class(function () {
  /** @var {string} EntityModel#name */
  this.name = "EntityModel";

  /**
   * Constructs EntityModel; called automatically when a new instance is created
   * @method EntityModel#init
   * @arg {object} opts - Used internally by {@link Entity}
   * @arg {Entity} opts.entity
   */
  this.init = function (opts) {
    this._shape = null;
    this._entity = opts.entity;
    this._offset = { x: 0, y: 0 };
    this._previous = { x: 0, y: 0 };
    this._velocity = { x: 0, y: 0 };
    this._acceleration = { x: 0, y: 0 };
  };

  /**
   * Initializes the model's hit shape
   * @method EntityModel#_initShape
   * @arg {object} opts - defines the shape type and properties
   * @private
   */
  this._initShape = function (opts) {
    this._shape = shapes.getShape(opts);
  };

  /**
   * Called by {@link Entity#reset} when the entity becomes active
   * @method EntityModel#reset
   * @arg {object} opts
   * @arg {number} [opts.x=0] - The horizontal coordinate of the entity in model-space
   * @arg {number} [opts.y=0] - The vertical coordinate of the entity in model-space
   * @arg {number} [opts.offsetX=0] - The horizontal offset of the entity in model-space
   * @arg {number} [opts.offsetY=0] - The vertical offset of the entity in model-space
   * @arg {number} [opts.width=0] - The width of the entity's hit bounds if opts.hitOpts.width is not defined
   * @arg {number} [opts.height=0] - The height of the entity's hit bounds if opts.hitOpts.height is not defined
   * @arg {number} [opts.vx=0] - The initial horizontal velocity of the entity
   * @arg {number} [opts.vy=0] - The initial vertical velocity of the entity
   * @arg {number} [opts.ax=0] - The initial horizontal acceleration of the entity
   * @arg {number} [opts.ay=0] - The initial vertical acceleration of the entity
   * @arg {object} [opts.hitOpts] - A set of properties to apply only to the hit bounds of an entity (and not its view); the opts object itself is used if no hitOpts is specified
   * @arg {number} [opts.hitOpts.offsetX=0] - The horizontal offset of the entity's hit bounds; overrides opts.offsetX
   * @arg {number} [opts.hitOpts.offsetY=0] - The vertical offset of the entity's hit bounds; overrides opts.offsetY
   * @arg {number} [opts.hitOpts.width=0] - The width of the entity's hit bounds; overrides opts.width
   * @arg {number} [opts.hitOpts.height=0] - The height of the entity's hit bounds; overrides opts.height
   * @arg {number} [opts.hitOpts.radius] - Makes the entity's hit bounds a circle instead of a rectangle and defines its radius
   */
  this.reset = function (opts) {
    var hitOpts = opts.hitOpts = opts.hitOpts || {};
    hitOpts.x = opts.x || 0;
    hitOpts.y = opts.y || 0;
    hitOpts.offsetX = hitOpts.offsetX || opts.offsetX || 0;
    hitOpts.offsetY = hitOpts.offsetY || opts.offsetY || 0;
    hitOpts.width = hitOpts.width || opts.width || 0;
    hitOpts.height = hitOpts.height || opts.height || 0;
    this._initShape(opts);

    this._offset.x = hitOpts.offsetX;
    this._offset.y = hitOpts.offsetY;
    this._previous.x = this.x;
    this._previous.y = this.y;
    this._velocity.x = opts.vx || 0;
    this._velocity.y = opts.vy || 0;
    this._acceleration.x = opts.ax || 0;
    this._acceleration.y = opts.ay || 0;

    // set position last since it's dependent on offset and shape
    this.x = hitOpts.x;
    this.y = hitOpts.y;
    return this._validate();
  };

  /**
   * Called by {@link Entity#update} each tick while the entity is active; moves the entity according to {@link Physics#step}
   * @method EntityModel#update
   * @arg {number} dt - the number of milliseconds elapsed since last update
   */
  this.update = function (dt) {
    this._previous.x = this.x;
    this._previous.y = this.y;
    physics.step(this, dt);
  };

  /**
   * Checks for a collision between this entity model and another; wraps {@link Physics#collide}
   * @method EntityModel#collidesWith
   * @arg {EntityModel} model - The other entity model used in the collision test
   * @returns {boolean} Whether or not this entity model is currently colliding with the provided entity model
   */
  this.collidesWith = function (model) {
    return physics.collide(this, model);
  };

  /**
   * Resolves a collision between this entity model and another by pushing them apart; wraps {@link Physics#resolveCollision}
   * @method EntityModel#resolveCollisionWith
   * @arg {EntityModel} model - The other entity model with which this entity model is currently colliding
   * @returns {number} The distance the two entity models were pushed apart
   */
  this.resolveCollisionWith = function (model) {
    return physics.resolveCollision(this, model);
  };

  /**
   * Checks to see if this entity model is fully contained within another; wraps {@link Physics#isInside}
   * @method EntityModel#isInside
   * @arg {EntityModel} model - The entity model that may or may not contain this entity model
   * @returns {boolean} Whether or not this entity model is fully contained within the provided entity model
   */
  this.isInside = function (model) {
    return physics.isInside(this, model);
  };

  /**
   * Warns if a model is improperly configured or broken in some way
   * @method EntityModel#_validate
   * @private
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
   * The entity's horizontal position in model-space; wraps {@link Shape#x} and {@link EntityModel#offsetX}
   * @var {number} EntityModel#x
   */
  Object.defineProperty(this, 'x', {
    enumerable: true,
    configurable: true,
    get: function () { return this._shape.x - this._offset.x; },
    set: function (value) { this._shape.x = value + this._offset.x; }
  });

  /**
   * The entity's vertical position in model-space; wraps {@link Shape#y} and {@link EntityModel#offsetY}
   * @var {number} EntityModel#y
   */
  Object.defineProperty(this, 'y', {
    enumerable: true,
    configurable: true,
    get: function () { return this._shape.y - this._offset.y; },
    set: function (value) { this._shape.y = value + this._offset.y; }
  });

  /**
   * The entity's horizontal offset in model-space
   * @var {number} EntityModel#offsetX
   */
  Object.defineProperty(this, 'offsetX', {
    enumerable: true,
    configurable: true,
    get: function () { return this._offset.x; },
    set: function (value) { this._offset.x = value; }
  });

  /**
   * The entity's vertical offset in model-space
   * @var {number} EntityModel#offsetY
   */
  Object.defineProperty(this, 'offsetY', {
    enumerable: true,
    configurable: true,
    get: function () { return this._offset.y; },
    set: function (value) { this._offset.y = value; }
  });

  /**
   * The entity's horizontal position last update
   * @var {number} EntityModel#previousX
   * @readOnly
   */
  readOnlyProp(this, 'previousX', function () { return this._previous.x; });

  /**
   * The entity's vertical position last update
   * @var {number} EntityModel#previousY
   * @readOnly
   */
  readOnlyProp(this, 'previousY', function () { return this._previous.y; });

  /**
   * The entity's horizontal velocity
   * @var {number} EntityModel#vx
   */
  Object.defineProperty(this, 'vx', {
    enumerable: true,
    configurable: true,
    get: function () { return this._velocity.x; },
    set: function (value) { this._velocity.x = value; }
  });

  /**
   * The entity's vertical velocity
   * @var {number} EntityModel#vy
   */
  Object.defineProperty(this, 'vy', {
    enumerable: true,
    configurable: true,
    get: function () { return this._velocity.y; },
    set: function (value) { this._velocity.y = value; }
  });

  /**
   * The entity's horizontal acceleration
   * @var {number} EntityModel#ax
   */
  Object.defineProperty(this, 'ax', {
    enumerable: true,
    configurable: true,
    get: function () { return this._acceleration.x; },
    set: function (value) { this._acceleration.x = value; }
  });

  /**
   * The entity's vertical acceleration
   * @var {number} EntityModel#ay
   */
  Object.defineProperty(this, 'ay', {
    enumerable: true,
    configurable: true,
    get: function () { return this._acceleration.y; },
    set: function (value) { this._acceleration.y = value; }
  });

  /**
   * Whether or not the entity can be moved by collisions; wraps {@link Shape#fixed}
   * @var {boolean} EntityModel#fixed
   */
  Object.defineProperty(this, 'fixed', {
    enumerable: true,
    configurable: true,
    get: function () { return this._shape.fixed; },
    set: function (value) { this._shape.fixed = value; }
  });

  /**
   * An instance of {@link Shape} representing the entity's hit bounds
   * @var {Shape} EntityModel#shape
   * @readOnly
   */
  readOnlyProp(this, 'shape', function () { return this._shape; });

  /**
   * The entity's hit width used for collisions; wraps {@link Rect#width}
   * @var {number} EntityModel#width
   */
  Object.defineProperty(this, 'width', {
    enumerable: false,
    configurable: true,
    get: function () { return this._shape.width; },
    set: function (value) { this._shape.width = value; }
  });

  /**
   * The entity's hit height used for collisions; wraps {@link Rect#height}
   * @var {number} EntityModel#height
   */
  Object.defineProperty(this, 'height', {
    enumerable: false,
    configurable: true,
    get: function () { return this._shape.height; },
    set: function (value) { this._shape.height = value; }
  });

  /**
   * The entity's hit radius used for collisions; wraps {@link Circle#radius}
   * @var {number} EntityModel#radius
   */
  Object.defineProperty(this, 'radius', {
    enumerable: false,
    configurable: true,
    get: function () { return this._shape.radius; },
    set: function (value) { this._shape.radius = value; }
  });

  /**
   * The entity's left-most x-coordinate for collisions; wraps {@link Shape#minX}
   * @var {number} EntityModel#minX
   * @readOnly
   */
  readOnlyProp(this, 'minX', function () { return this._shape.minX; });

  /**
   * The entity's right-most x-coordinate for collisions; wraps {@link Shape#maxX}
   * @var {number} EntityModel#maxX
   * @readOnly
   */
  readOnlyProp(this, 'maxX', function () { return this._shape.maxX; });

  /**
   * The entity's top-most y-coordinate for collisions; wraps {@link Shape#minY}
   * @var {number} EntityModel#minY
   * @readOnly
   */
  readOnlyProp(this, 'minY', function () { return this._shape.minY; });

  /**
   * The entity's bottom-most y-coordinate for collisions; wraps {@link Shape#maxY}
   * @var {number} EntityModel#maxY
   * @readOnly
   */
  readOnlyProp(this, 'maxY', function () { return this._shape.maxY; });
});
