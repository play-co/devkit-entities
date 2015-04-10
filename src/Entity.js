import .EntityModel;
import .EntityView;

var _uid = 1;

exports = Class(function () {
  /**
   * Entity Prototype Properties
   *
   * ~ These properties are class-wide as opposed to instance-specific.
   *  Defining them on a per-instance basis could cause strange behavior when
   *  using EntityPool. For example, mixing different view classes in a single
   *  pool would mean that you don't know which view you'll get when you obtain
   *  an entity.
   * ~ They should be overridden by subclasses, as needed. For example, if you
   *  want a set of entities that don't have views, just set your class's
   *  prototype's viewClass property to null.
   */
  this.name = "Entity";
  this.modelClass = EntityModel;
  this.viewClass = EntityView;

  /**
   * Entity Initialization
   *
   * ~ The init function serves as a constructor function. It should be
   *  treated like a C++ header file, in that it should define all properties
   *  that will ever exist on an instance. Avoid changing the type of a
   *  property for best performance.
   * ~ If you override init in a subclass, be sure to call the superclass's
   *  init from within your overriden function. For example:
   *    Entity.prototype.init.call(this, opts);
   *  or using js.io's supr (which uses apply instead of call):
   *    supr(this, 'init', [opts]);
   */
  this.init = function (opts) {
    opts = opts || {};
    opts.entity = this;

    // global unique IDs are helpful for logging and debugging
    this.uid = this.name + _uid++;

    // view and model components
    this.model = new this.modelClass(opts);
    this.view = new this.viewClass(opts);

    // pooling data passed automatically from EntityPool when used
    this.pool = opts.pool || null;
    this.poolIndex = opts.poolIndex || 0;
  };

  /**
   * Entity Lifecycle Interface
   * ~ reset, update, release
   *
   * ~ You are encouraged to override these functions as needed, but you
   *  should almost always be sure to call the superclass function from
   *  within your overriden function.
   *
   * ~ When an Entity appears in a game, its reset function should
   *  should be called to set its primary point within the game-space and to
   *  apply its config. If you are using EntityPool, the reset function gets
   *  called automatically by the pool's obtain function, which takes the same
   *  parameters.
   * ~ The resetView function gets called automatically by the reset function
   *  if a view exists.
   *
   * ~ While an Entity is active in your game, you should call its update
   *  function once per tick and pass in the time elapsed since the last tick,
   *  dt (delta time). If you're using EntityPool, you can just call the pool's
   *  update function, passing dt in the same way, and it will update all
   *  active entities within the pool.
   * ~ The updateView function gets called automatically by the update
   *  function if a view exists.
   *
   * ~ Finally, when an entity's life is over, you can call the release
   *  function to hide it and make it inactive. If you're using an EntityPool,
   *  this call will recycle it back into the pool automatically.
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
   */


  this.collidesWith = function (entity) {
    return this.model.collidesWith(entity.model);
  };

  this.resolveCollidingStateWith = function (entity) {
    return this.model.resolveCollidingStateWith(entity.model);
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
