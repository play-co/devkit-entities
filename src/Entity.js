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

    this.uid = this.name + _uid++;

    this.model = new this.modelClass(opts);
    this.view = new this.viewClass(opts);

    // ignore these, passed automatically from EntityPool
    this.pool = opts.pool || null;
    this.poolIndex = opts.poolIndex || 0;
  };

  /**
   * Entity Lifecycle Interface
   * ~ reset, update, release
   *   ~ reset is called when an entity becomes active
   *   ~ update is called once each tick on each active entity
   *   ~ release makes an entity inactive and hides it
   */
  this.reset = function (opts) {
    this.model.reset(opts);
    this.view.reset(opts);
  };

  this.update = function (dt) {
    this.model.update(dt);
    this.view.update(dt);
  };

  this.release = function () {
    this.pool && this.pool.release(this);
    this.view.style.visible = false;
  };

  /**
   * Entity-Model-Physics Interface
   * ~ collidesWith, resolveCollidingStateWith
   *   ~ collidesWith returns whether or not two entities are overlapping
   *   ~ resolveCollisionWith pushes two overlapping entities apart
   */
  this.collidesWith = function (entity) {
    return this.model.collidesWith(entity.model);
  };

  this.resolveCollisionWith = function (entity) {
    return this.model.resolveCollisionWith(entity.model);
  };

  /**
   * Debugging Utilities
   */
  this.showHitBounds = function () {
    this.view && this.view.showHitBounds();
  };

  this.hideHitBounds = function () {
    this.view && this.view.hideHitBounds();
  };
});
