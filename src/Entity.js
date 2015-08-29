import .EntityModel;
import .EntityView;
import .utils;

var _uid = 1;
var readOnlyProp = utils.addReadOnlyProperty;

/**
 * This class represenets a game element with a model, and optionally a view, a life-cycle, and physics
 * @class Entity
 */
var Entity = exports = Class(function () {
  /** @var {string} Entity#name */
  this.name = "Entity";
  /**
   * The class used to construct the model for each instance of Entity
   * @var {class} Entity#modelClass
   */
  this.modelClass = EntityModel;
  /**
   * The class used to construct the view for each instance of Entity
   * @var {class} Entity#viewClass
   */
  this.viewClass = EntityView;

  /**
   * Constructs Entity; called automatically when a new instance is created
   * @method Entity#init
   * @arg {object} [opts] - Used internally by {@link EntityPool} to manage recycling
   * @arg {EntityPool} [opts.pool]
   * @arg {number} [opts.poolIndex]
   */
  this.init = function (opts) {
    opts = opts || {};
    opts.entity = this;

    /**
     * Unique identifier for each entity instance
     * @var {string} Entity#uid
     */
    this.uid = this.name + _uid++;
    /**
     * Holds the entity's data, like position and hit bounds
     * @var {EntityModel} Entity#model
     */
    this.model = new this.modelClass(opts);
    /**
     * A devkit View used to render the entity to the screen
     * @var {EntityView} Entity#view
     */
    this.view = this.viewClass ? new this.viewClass(opts) : null;
    /**
     * Indicates whether the entity is active in the game or not
     * @var {boolean} Entity#active
     */
    this.active = false;
    /**
     * @var {EntityPool} Entity#_pool
     * @private
     */
    this._pool = opts.pool || null;
    /**
     * @var {number} Entity#_poolIndex
     * @private
     */
    this._poolIndex = opts.poolIndex || 0;
  };

  /**
   * Makes the entity active and sets its initial properties; if the entity belongs to a pool, it's called automatically by {@link EntityPool#obtain}
   * @method Entity#reset
   * @arg {object} [opts]
   * @see EntityModel#reset
   * @see EntityView#reset
   */
  this.reset = function (opts) {
    opts = opts || {};
    this.active = true;
    this.model.reset(opts);
    this.view && this.view.reset(opts);
  };

  /**
   * Should be called each tick on active entities; if the entity belongs to a pool, it's called automatically by {@link EntityPool#update}
   * @method Entity#update
   * @arg {number} dt - the number of milliseconds elapsed since last update
   * @see EntityModel#update
   * @see EntityView#update
   */
  this.update = function (dt) {
    this.model.update(dt);
    this.view && this.view.update(dt);
  };

  /**
   * Makes the entity inactive and hides its view; if the entity belongs to a pool, it's recycled via {@link EntityPool#release}
   * @method Entity#destroy
   */
  this.destroy = function () {
    this.active = false;
    this._pool && this._pool.release(this);
    if (this.view) {
      this.view.stopAnimation();
      this.view.style.visible = false;
    }
  };

  /**
   * The entity's horizontal position in model-space; wraps {@link EntityModel#x}
   * @var {number} Entity#x
   */
  Object.defineProperty(this, 'x', {
    enumerable: true,
    configurable: true,
    get: function () { return this.model.x; },
    set: function (value) { this.model.x = value; }
  });

  /**
   * The entity's vertical position in model-space; wraps {@link EntityModel#y}
   * @var {number} Entity#y
   */
  Object.defineProperty(this, 'y', {
    enumerable: true,
    configurable: true,
    get: function () { return this.model.y; },
    set: function (value) { this.model.y = value; }
  });

  /**
   * The entity's horizontal position last update; wraps {@link EntityModel#previousX}
   * @var {number} Entity#previousX
   * @readOnly
   */
  readOnlyProp(this, 'previousX', function () { return this.model.previousX; });

  /**
   * The entity's vertical position last update; wraps {@link EntityModel#previousY}
   * @var {number} Entity#previousY
   * @readOnly
   */
  readOnlyProp(this, 'previousY', function () { return this.model.previousY; });

  /**
   * The entity's horizontal velocity; wraps {@link EntityModel#vx}
   * @var {number} Entity#vx
   */
  Object.defineProperty(this, 'vx', {
    enumerable: true,
    configurable: true,
    get: function () { return this.model.vx; },
    set: function (value) { this.model.vx = value; }
  });

  /**
   * The entity's vertical velocity; wraps {@link EntityModel#vy}
   * @var {number} Entity#vy
   */
  Object.defineProperty(this, 'vy', {
    enumerable: true,
    configurable: true,
    get: function () { return this.model.vy; },
    set: function (value) { this.model.vy = value; }
  });

  /**
   * The entity's horizontal acceleration; wraps {@link EntityModel#ax}
   * @var {number} Entity#ax
   */
  Object.defineProperty(this, 'ax', {
    enumerable: true,
    configurable: true,
    get: function () { return this.model.ax; },
    set: function (value) { this.model.ax = value; }
  });

  /**
   * The entity's vertical acceleration; wraps {@link EntityModel#ay}
   * @var {number} Entity#ay
   */
  Object.defineProperty(this, 'ay', {
    enumerable: true,
    configurable: true,
    get: function () { return this.model.ay; },
    set: function (value) { this.model.ay = value; }
  });

  /**
   * The entity's hit width used for collisions; wraps {@link EntityModel#width} or {@link EntityModel#radius}
   * @var {number} Entity#width
   */
  Object.defineProperty(this, 'width', {
    enumerable: true,
    configurable: true,
    get: function () {
      return this.model.width || 2 * this.model.radius || 0;
    },
    set: function (value) {
      if (this.model.radius !== undefined) {
        this.model.radius = value / 2;
      } else {
        this.model.width = value;
      }
    }
  });

  /**
   * The entity's hit height used for collisions; wraps {@link EntityModel#height} or {@link EntityModel#radius}
   * @var {number} Entity#height
   */
  Object.defineProperty(this, 'height', {
    enumerable: true,
    configurable: true,
    get: function () {
      return this.model.height || 2 * this.model.radius || 0;
    },
    set: function (value) {
      if (this.model.radius !== undefined) {
        this.model.radius = value / 2;
      } else {
        this.model.height = value;
      }
    }
  });

  /**
   * The entity's left-most x-coordinate for collisions; wraps {@link EntityModel#minX}
   * @var {number} Entity#minX
   * @readOnly
   */
  readOnlyProp(this, 'minX', function () { return this.model.minX; });

  /**
   * The entity's right-most x-coordinate for collisions; wraps {@link EntityModel#maxX}
   * @var {number} Entity#maxX
   * @readOnly
   */
  readOnlyProp(this, 'maxX', function () { return this.model.maxX; });

  /**
   * The entity's top-most y-coordinate for collisions; wraps {@link EntityModel#minY}
   * @var {number} Entity#minY
   * @readOnly
   */
  readOnlyProp(this, 'minY', function () { return this.model.minY; });

  /**
   * The entity's bottom-most y-coordinate for collisions; wraps {@link EntityModel#maxY}
   * @var {number} Entity#maxY
   * @readOnly
   */
  readOnlyProp(this, 'maxY', function () { return this.model.maxY; });

  /**
   * Whether or not the entity can be moved by collisions; wraps {@link EntityModel#fixed}
   * @var {boolean} Entity#fixed
   */
  Object.defineProperty(this, 'fixed', {
    enumerable: true,
    configurable: true,
    get: function () { return this.model.fixed; },
    set: function (value) { this.model.fixed = value; }
  });

  /**
   * An instance of {@link Shape} representing the entity's hit bounds; wraps {@link EntityModel#shape}
   * @var {Shape} Entity#shape
   * @readOnly
   */
  readOnlyProp(this, 'shape', function () { return this.model.shape; });

  /**
   * The entity view's width; wraps {@link EntityView#width}
   * @var {number} Entity#viewWidth
   */
  Object.defineProperty(this, 'viewWidth', {
    enumerable: true,
    configurable: true,
    get: function () { return (this.view && this.view.style.width) || 0; },
    set: function (value) { this.view && (this.view.style.width = value); }
  });

  /**
   * The entity view's height; wraps {@link EntityView#height}
   * @var {number} Entity#viewHeight
   */
  Object.defineProperty(this, 'viewHeight', {
    enumerable: true,
    configurable: true,
    get: function () { return (this.view && this.view.style.height) || 0; },
    set: function (value) { this.view && (this.view.style.height = value); }
  });

  /**
   * The entity view's left-most x-coordinate; wraps {@link EntityView#minX}
   * @var {number} Entity#viewMinX
   * @readOnly
   */
  readOnlyProp(this, 'viewMinX', function () { return (this.view && this.view.minX) || 0; });

  /**
   * The entity view's right-most x-coordinate; wraps {@link EntityView#maxX}
   * @var {number} Entity#viewMaxX
   * @readOnly
   */
  readOnlyProp(this, 'viewMaxX', function () { return (this.view && this.view.maxX) || 0; });

  /**
   * The entity view's top-most y-coordinate; wraps {@link EntityView#minY}
   * @var {number} Entity#viewMinY
   * @readOnly
   */
  readOnlyProp(this, 'viewMinY', function () { return (this.view && this.view.minY) || 0; });

  /**
   * The entity view's bottom-most y-coordinate; wraps {@link EntityView#maxY}
   * @var {number} Entity#viewMaxY
   * @readOnly
   */
  readOnlyProp(this, 'viewMaxY', function () { return (this.view && this.view.maxY) || 0; });

  /**
   * Checks for a collision between this entity and another; wraps {@link EntityModel#collidesWith}
   * @method Entity#collidesWith
   * @arg {Entity} entity - The other entity used in the collision test
   * @returns {boolean} Whether or not this entity is currently colliding with the provided entity
   */
  this.collidesWith = function (entity) {
    return this.model.collidesWith(entity.model || entity);
  };

  /**
   * Resolves a collision between this entity and another by pushing them apart; wraps {@link EntityModel#resolveCollisionWith}
   * @method Entity#resolveCollisionWith
   * @arg {Entity} entity - The other entity with which this entity is currently colliding
   * @returns {number} The distance the two entities were pushed apart
   */
  this.resolveCollisionWith = function (entity) {
    return this.model.resolveCollisionWith(entity.model || entity);
  };

  /**
   * Checks to see if this entity is fully contained within another; wraps {@link EntityModel#isInside}
   * @method Entity#isInside
   * @arg {Entity} entity - The entity that may or may not contain this entity
   * @returns {boolean} Whether or not this entity is fully contained within the provided entity
   */
  this.isInside = function (entity) {
    return this.model.isInside(entity.model || entity);
  };
});

/**
 * Globally show all entities' hit bounds
 * @memberof Entity
 */
Entity.showHitBounds = function () {
  EntityView.prototype._debugDraw = true;
};

/**
 * Globally hide all entities' hit bounds
 * @memberof Entity
 */
Entity.hideHitBounds = function () {
  EntityView.prototype._debugDraw = false;
};
