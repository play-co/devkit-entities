import .EntityModel;
import .EntityView;

var _uid = 1;

exports = Class(function () {
  /**
   * Entity Prototype Properties
   * ~ these properties are class-wide, not instance-specific
   */
  this.name = "Entity";
  this.modelClass = EntityModel;
  this.viewClass = EntityView;

  /**
   * Entity Initialization
   * ~ init is the constructor for each instance
   */
  this.init = function (opts) {
    opts = opts || {};
    opts.entity = this;

    // unique identifier for each entity instance
    this.uid = this.name + _uid++;

    this.model = new this.modelClass(opts);
    this.view = new this.viewClass(opts);

    // this flag indicates whether an entity is alive or dead
    this.active = false;

    // ignore these, passed automatically from EntityPool
    this._pool = opts.pool || null;
    this._poolIndex = opts.poolIndex || 0;
  };

  /**
   * Entity Lifecycle Interface
   * ~ reset, update, destroy
   *   ~ reset is called when an entity becomes active
   *   ~ update is called once each tick on each active entity
   *   ~ destroy makes an entity inactive, hiding and releasing it, if possible
   */
  this.reset = function (opts) {
    this.model.reset(opts);
    this.view.reset(opts);
    this.active = true;
  };

  this.update = function (dt) {
    this.model.update(dt);
    this.view.update(dt);
  };

  this.destroy = function () {
    this._pool && this._pool.release(this);
    this.view.style.visible = false;
    this.active = false;
  };

  /**
   * Public API Extensions
   * ~ properties exposed for ease of use from the model and view
   */

  // expose x position
  Object.defineProperty(this, 'x', {
    enumerable: true,
    get: function () { return this.model.x; },
    set: function (value) { this.model.x = value; }
  });

  // expose y position
  Object.defineProperty(this, 'y', {
    enumerable: true,
    get: function () { return this.model.y; },
    set: function (value) { this.model.y = value; }
  });

  // expose read-only previous x position
  utils.addReadOnlyProperty(this, 'previousX', function () {
    return this.model.previousX;
  });

  // expose read-only previous y position
  utils.addReadOnlyProperty(this, 'previousY', function () {
    return this.model.previousY;
  });

  // expose x velocity
  Object.defineProperty(this, 'vx', {
    enumerable: true,
    get: function () { return this.model.vx; },
    set: function (value) { this.model.vx = value; }
  });

  // expose y velocity
  Object.defineProperty(this, 'vy', {
    enumerable: true,
    get: function () { return this.model.vy; },
    set: function (value) { this.model.vy = value; }
  });

  // expose x acceleration
  Object.defineProperty(this, 'ax', {
    enumerable: true,
    get: function () { return this.model.ax; },
    set: function (value) { this.model.ax = value; }
  });

  // expose y acceleration
  Object.defineProperty(this, 'ay', {
    enumerable: true,
    get: function () { return this.model.ay; },
    set: function (value) { this.model.ay = value; }
  });

  // expose the model's physical shape,
  utils.addReadOnlyProperty(this, 'shape', function () {
    return this.model.shape;
  });

  // expose the view width
  Object.defineProperty(this, 'viewWidth', {
    enumerable: true,
    get: function () { return (this.view && this.view.style.width) || 0; },
    set: function (value) { this.view && (this.view.style.width = value); }
  });

  // expose the view height
  Object.defineProperty(this, 'viewHeight', {
    enumerable: true,
    get: function () { return (this.view && this.view.style.height) || 0; },
    set: function (value) { this.view && (this.view.style.height = value); }
  });

  // expose read-only left-most x-coordinate of the view
  utils.addReadOnlyProperty(this, 'viewMinX', function () {
    return (this.view && this.view.minX) || 0;
  });

  // expose read-only right-most x-coordinate of the view
  utils.addReadOnlyProperty(this, 'viewMaxX', function () {
    return (this.view && this.view.maxX) || 0;
  });

  // expose read-only top-most y-coordinate of the view
  utils.addReadOnlyProperty(this, 'viewMinY', function () {
    return (this.view && this.view.minY) || 0;
  });

  // expose read-only bottom-most y-coordinate of the view
  utils.addReadOnlyProperty(this, 'viewMaxY', function () {
    return (this.view && this.view.maxY) || 0;
  });

});
