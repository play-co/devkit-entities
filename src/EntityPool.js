import .Entity;

exports = Class(function () {

  this.init = function (opts) {
    opts = opts || {};

    this.entities = [];
    this._ctor = opts.ctor || Entity;
    this._freeIndex = 0;
    this._superview = opts.superview || opts.parent;

    var initCount = opts.initCount || 0;
    for (var i = 0; i < initCount; i++) {
      this._create();
    }
    this._logCreation = initCount > 0;
  };

  /**
   * Primary Pool API
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

  this.release = function (entity) {
    var currIndex = entity.poolIndex;
    if (currIndex < this._freeIndex) {
      var entities = this.entities;
      var lastIndex = this._freeIndex - 1;
      var temp = entities[lastIndex];
      entities[currIndex] = temp;
      entities[lastIndex] = entity;
      temp.poolIndex = currIndex;
      entity.poolIndex = lastIndex;
      this._freeIndex = lastIndex;
    }
  };

  this.reset = function () {
    this.releaseAll();
  };

  this.update = function (dt) {
    var entities = this.entities;
    for (var i = this._freeIndex - 1; i >= 0; i--) {
      entities[i].update(dt);
    }
  };

  this.releaseAll = function () {
    var entities = this.entities;
    for (var i = this._freeIndex - 1; i >= 0; i--) {
      entities[i].release();
    }
  };

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
   * Pool Utilities and Wrappers
   */

  /**
   * getFirstCollidingEntity
   *  ~ returns first from this pool to collide with entity
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
   * getAllCollidingEntities
   *  ~ return array of entities from this pool that collide with entity
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
   * onFirstCollision
   *  ~ call a fn on the first entity from this pool that collides with entity
   */
  this.onFirstCollision = function (entity, fn, ctx) {
    var hit = this.getFirstCollidingEntity(entity);
    hit && fn.call(ctx, hit);
  };

  /**
   * onAllCollisions
   *  ~ call a fn on all entities from this pool that collide with entity
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
   * onFirstPoolCollisions
   *  ~ call a fn for each first collision with another pool's entity
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
   * onAllPoolCollisions
   *  ~ call a fn for all collisions with another pool's entities
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

  this.getActiveCount = function () {
    return this._freeIndex;
  };

  this.getTotalCount = function () {
    return this.entities.length;
  };

  this.forEachActiveEntity = function (fn, ctx) {
    var entities = this.entities;
    for (var i = this._freeIndex - 1; i >= 0; i--) {
      fn.call(ctx, entities[i], i);
    }
  };

});
