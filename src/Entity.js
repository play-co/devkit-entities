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

});
