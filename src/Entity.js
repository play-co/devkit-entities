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
   * ~ properties and functions exposed for ease of use from the model and view
   */

  // expose x position
  Object.defineProperty(this, 'x', {
    enumerable: true,
    get: function () { return this.model.getX(); },
    set: function (value) { this.model.setX(value); }
  });

  // expose y position
  Object.defineProperty(this, 'y', {
    enumerable: true,
    get: function () { return this.model.getY(); },
    set: function (value) { this.model.setY(value); }
  });

  // expose x velocity
  Object.defineProperty(this, 'vx', {
    enumerable: true,
    get: function () { return this.model.getVelocityX(); },
    set: function (value) { this.model.setVelocityX(value); }
  });

  // expose y velocity
  Object.defineProperty(this, 'vy', {
    enumerable: true,
    get: function () { return this.model.getVelocityY(); },
    set: function (value) { this.model.setVelocityY(value); }
  });

  // expose x acceleration
  Object.defineProperty(this, 'ax', {
    enumerable: true,
    get: function () { return this.model.getAccelerationX(); },
    set: function (value) { this.model.setAccelerationX(value); }
  });

  // expose y acceleration
  Object.defineProperty(this, 'ay', {
    enumerable: true,
    get: function () { return this.model.getAccelerationY(); },
    set: function (value) { this.model.setAccelerationY(value); }
  });

  // expose left-most x-coordinate of the view
  this.getViewMinX = function () {
    return (this.view && this.view.getMinX()) || 0;
  };

  // expose right-most x-coordinate of the view
  this.getViewMaxX = function () {
    return (this.view && this.view.getMaxX()) || 0;
  };

  // expose top-most y-coordinate of the view
  this.getViewMinY = function () {
    return (this.view && this.view.getMinY()) || 0;
  };

  // expose bottom-most y-coordinate of the view
  this.getViewMaxY = function () {
    return (this.view && this.view.getMaxY()) || 0;
  };

  // expose the view width
  this.getViewWidth = function () {
    return (this.view && this.view.getWidth()) || 0;
  };

  // expose the view height
  this.getViewHeight = function () {
    return (this.view && this.view.getHeight()) || 0;
  };

});
