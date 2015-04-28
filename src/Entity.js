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

    // models are required
    this.model = new this.modelClass(opts);
    // views are optional
    this.view = this.viewClass ? new this.viewClass(opts) : null;

    // this flag indicates whether an entity is alive or dead
    this.active = false;

    // ignore these, passed automatically from EntityPool
    this.pool = opts.pool || null;
    this.poolIndex = opts.poolIndex || 0;
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
    this.view && this.view.reset(opts);
    this.active = true;
  };

  this.update = function (dt) {
    this.model.update(dt);
    this.view && this.view.update(dt);
  };

  this.destroy = function () {
    this.pool && this.pool.release(this);
    this.view && (this.view.style.visible = false);
    this.active = false;
  };

});
