import .Entity;

/**
 * This class represents a group of recycled entities; styled after devkit's ViewPool
 * @class EntityPool
 */
exports = Class(function () {
  /**
   * Constructs EntityPool; called automatically when a new instance is created
   * @method EntityPool#init
   * @arg {object} [opts]
   * @arg {class} [opts.ctor=Entity] - The constructor of the class to manage in this pool
   * @arg {View} [opts.superview] - The parent view of all entities' views in this pool
   * @arg {number} [opts.initCount=0] - The number of entities to initialize immediately; if specified, the creation of new entities is logged to the console
   */
  this.init = function (opts) {
    opts = opts || {};

    this.entities = [];

    this._ctor = opts.ctor || Entity;
    if (typeof this._ctor !== 'function') {
      throw new Error('EntityPool opts.ctor must be a constructor function');
    }

    this._freeIndex = 0;
    this._superview = opts.superview || opts.parent;

    var initCount = opts.initCount || 0;
    for (var i = 0; i < initCount; i++) {
      this._create();
    }
    this._logCreation = initCount > 0;
  };

  /**
   * Returns a new or recycled entity, calls its reset function, and marks it active
   * @method EntityPool#obtain
   * @arg {object} [opts]
   * @see Entity#reset
   * @see EntityModel#reset
   * @see EntityView#reset
   * @returns {Entity}
   */
  this.obtain = function (opts) {
    var entity = null;
    var entities = this.entities;
    if (this._freeIndex < entities.length) {
      entity = entities[this._freeIndex];
    } else {
      entity = this._create();
    }

    this._freeIndex++;
    entity.reset(opts);
    return entity;
  };

  /**
   * Releases an entity back to the pool to be used again later
   * @method EntityPool#release
   * @arg {Entity} entity
   * @see Entity#destroy
   */
  this.release = function (entity) {
    var currIndex = entity._poolIndex;
    if (currIndex < this._freeIndex) {
      var entities = this.entities;
      var lastIndex = this._freeIndex - 1;
      var temp = entities[lastIndex];
      entities[currIndex] = temp;
      entities[lastIndex] = entity;
      temp._poolIndex = currIndex;
      entity._poolIndex = lastIndex;
      this._freeIndex = lastIndex;
    }
  };

  /**
   * Releases all entities back to the pool
   * @method EntityPool#reset
   * @see EntityPool#releaseAll
   */
  this.reset = function () {
    this.releaseAll();
  };

  /**
   * Updates all active entities in the pool
   * @method EntityPool#update
   * @arg {number} dt
   * @see Entity#update
   * @see EntityModel#update
   * @see EntityView#update
   */
  this.update = function (dt) {
    var entities = this.entities;
    for (var i = this._freeIndex - 1; i >= 0; i--) {
      entities[i].update(dt);
    }
  };

  /**
   * Releases all entities back to the pool; calls {@link Entity#destroy} on each active entity
   * @method EntityPool#releaseAll
   */
  this.releaseAll = function () {
    var entities = this.entities;
    for (var i = this._freeIndex - 1; i >= 0; i--) {
      entities[i].destroy();
    }
  };

  /**
   * Creates a new entity and adds it to the pool; logs creation if initCount was specified on pool init
   * @method EntityPool#_create
   * @returns {Entity}
   * @private
   */
  this._create = function () {
    var entities = this.entities;
    var entity = new this._ctor({
      superview: this._superview,
      visible: false,
      pool: this,
      poolIndex: entities.length
    });
    entities.push(entity);
    this._logCreation && logger.warn("Entity creation:", entity.uid);
    return entity;
  };

  /**
   * Returns the first entity in the group that collides with the provided entity
   * @method EntityPool#getFirstCollidingEntity
   * @arg {Entity} entity - The entity used in the collision tests
   * @returns {Entity}
   */
  this.getFirstCollidingEntity = function (entity) {
    var entities = this.entities;
    for (var i = this._freeIndex - 1; i >= 0; i--) {
      var test = entities[i];
      if (test.model.collidesWith(entity.model)) {
        return test;
      }
    }
  };

  /**
   * Returns all entities in the group that collide with the provided entity
   * @method EntityPool#getAllCollidingEntities
   * @arg {Entity} entity - The entity used in the collision tests
   * @returns {Entity[]}
   */
  this.getAllCollidingEntities = function (entity) {
    var entities = this.entities;
    var hits = [];
    for (var i = this._freeIndex - 1; i >= 0; i--) {
      var test = entities[i];
      if (test.model.collidesWith(entity.model)) {
        hits.push(test);
      }
    }
    return hits;
  };

  /**
   * Call a function on the first entity that collides with the provided entity
   * @method EntityPool#onFirstCollision
   * @arg {Entity} entity - The entity used in the collision tests
   * @arg {function} fn - The function to call when a collision is found; accepts the colliding entity as a parameter
   * @arg {object} [ctx] - The context with which to call the function
   */
  this.onFirstCollision = function (entity, fn, ctx) {
    var hit = this.getFirstCollidingEntity(entity);
    hit && fn.call(ctx, hit);
  };

  /**
   * Call a function on all entities that collides with the provided entity
   * @method EntityPool#onAllCollisions
   * @arg {Entity} entity - The entity used in the collision tests
   * @arg {function} fn - The function to call when a collision is found; accepts the colliding entity as a parameter
   * @arg {object} [ctx] - The context with which to call the function
   */
  this.onAllCollisions = function (entity, fn, ctx) {
    var entities = this.entities;
    for (var i = this._freeIndex - 1; i >= 0; i--) {
      var test = entities[i];
      if (test.model.collidesWith(entity.model)) {
        fn.call(ctx, test);
      }
    }
  };

  /**
   * Call a function on the first collision of each entity in this pool with an entity from the provided pool
   * @method EntityPool#onFirstPoolCollisions
   * @arg {EntityPool} pool - The entity pool used in the collision tests
   * @arg {function} fn - The function to call when a collision is found; accepts the two colliding entities as parameters
   * @arg {object} [ctx] - The context with which to call the function
   */
  this.onFirstPoolCollisions = function (pool, fn, ctx) {
    var entities = this.entities;
    for (var i = this._freeIndex - 1; i >= 0; i--) {
      var test = entities[i];
      var hit = pool.getFirstCollidingEntity(test);
      hit && fn.call(ctx, test, hit);
    }
  };

  /**
   * Call a function on all collisions of each entity in this pool with an entity from the provided pool
   * @method EntityPool#onAllPoolCollisions
   * @arg {EntityPool} pool - The entity pool used in the collision tests
   * @arg {function} fn - The function to call when a collision is found; accepts the two colliding entities as parameters
   * @arg {object} [ctx] - The context with which to call the function
   */
  this.onAllPoolCollisions = function (pool, fn, ctx) {
    var entities1 = this.entities;
    var entities2 = pool.entities;
    for (var i = this._freeIndex - 1; i >= 0; i--) {
      var test1 = entities1[i];
      for (var j = pool._freeIndex - 1; j >= 0; j--) {
        var test2 = entities2[j];
        if (test1.model.collidesWith(test2.model)) {
          fn.call(ctx, test1, test2);
        }
      }
    }
  };

  /**
   * Returns the number of active entities in this pool
   * @method EntityPool#getActiveCount
   * @returns {number}
   */
  this.getActiveCount = function () {
    return this._freeIndex;
  };

  /**
   * Returns the total number of entities in this pool, both active and inactive
   * @method EntityPool#getTotalCount
   * @returns {number}
   */
  this.getTotalCount = function () {
    return this.entities.length;
  };

  /**
   * Call a function on each active entity in the pool
   * @method EntityPool#forEachActiveEntity
   * @arg {function} fn - The function to call on each entity; accepts an entity and the entity's poolIndex as parameters
   * @arg {object} [ctx] - The context with which to call the function
   */
  this.forEachActiveEntity = function (fn, ctx) {
    var entities = this.entities;
    for (var i = this._freeIndex - 1; i >= 0; i--) {
      fn.call(ctx, entities[i], i);
    }
  };
});
