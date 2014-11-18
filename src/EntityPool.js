import .Entity;

exports = Class(function() {
	this.init = function(opts) {
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

	this.obtain = function(x, y, config) {
		var entity = null;
		var entities = this.entities;
		if (this._freeIndex < entities.length) {
			entity = entities[this._freeIndex];
		} else {
			entity = this._create();
		}
		this._freeIndex++;
		entity.reset(x, y, config);
		return entity;
	};

	this.release = function(entity) {
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

	this.reset = function() {
		this.releaseAll();
	};

	this.update = function(dt) {
		var entities = this.entities;
		for (var i = this._freeIndex - 1; i >= 0; i--) {
			entities[i].update(dt);
		}
	};

	this.releaseAll = function() {
		var entities = this.entities;
		for (var i = this._freeIndex - 1; i >= 0; i--) {
			entities[i].release();
		}
	};

	/**
	 * return first from this pool to collide with entity
	 */
	this.getFirstCollidingEntity = function(entity) {
		var collidingEntity = null;
		var entities = this.entities;
		for (var i = this._freeIndex - 1; i >= 0; i--) {
			var testEntity = entities[i];
			if (testEntity.collidesWith(entity)) {
				collidingEntity = testEntity;
				break;
			}
		}
		return collidingEntity;
	};

	/**
	 * return array from this pool that collide with entity
	 */
	this.getAllCollidingEntities = function(entity) {
		var collidingEntities = [];
		var entities = this.entities;
		for (var i = this._freeIndex - 1; i >= 0; i--) {
			var testEntity = entities[i];
			if (testEntity.collidesWith(entity)) {
				collidingEntities.push(testEntity);
			}
		}
		return collidingEntities;
	};

	/**
	 * call a fn on the first from this pool to collide with entity
	 */
	this.onFirstCollision = function(entity, fn, ctx) {
		var collidingEntity = this.getFirstCollidingEntity(entity);
		collidingEntity && fn.call(ctx, collidingEntity);
	};

	/**
	 * call a fn on all from this pool to collide with entity
	 */
	this.onAllCollisions = function(entity, fn, ctx) {
		var entities = this.entities;
		for (var i = this._freeIndex - 1; i >= 0; i--) {
			var testEntity = entities[i];
			if (testEntity.collidesWith(entity)) {
				fn.call(ctx, testEntity);
			}
		}
	};

	/**
	 * call a fn for each first collision with another pool's entity
	 */
	this.onFirstPoolCollisions = function(pool, fn, ctx) {
		var entities = this.entities;
		for (var i = this._freeIndex - 1; i >= 0; i--) {
			var testEntity = entities[i];
			var collidingEntity = pool.getFirstCollidingEntity(testEntity);
			collidingEntity && fn.call(ctx, testEntity, collidingEntity);
		}
	};

	/**
	 * call a fn for all collisions with another pool's entities
	 */
	this.onAllPoolCollisions = function(pool, fn, ctx) {
		var entities = this.entities;
		for (var i = this._freeIndex - 1; i >= 0; i--) {
			var iEntity = entities[i];
			for (var j = pool._freeIndex - 1; j >= 0; j--) {
				var jEntity = pool.entities[j];
				if (iEntity.collidesWith(jEntity)) {
					fn.call(ctx, iEntity, jEntity);
				}
			}
		}
	};

	this.getActiveCount = function() {
		return this._freeIndex;
	};

	this.getTotalCount = function() {
		return this.entities.length;
	};

	this.forEachActiveEntity = function(fn, ctx) {
		var entities = this.entities;
		for (var i = this._freeIndex - 1; i >= 0; i--) {
			fn.call(ctx, entities[i], i);
		}
	};

	this._create = function() {
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
});
