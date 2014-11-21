import ui.ImageView as ImageView;
import ui.resource.loader as loader;
var _imageMap = loader.getMap();

import .EntityPhysics;

var _uid = 1;

exports = Class(function() {
	// default prototype properties, should usually be overridden by subclasses
	this.name = "Entity";
	this.viewClass = ImageView;

	this.init = function(opts) {
		// unique IDs are helpful for logging and debugging
		this.uid = this.name + _uid++;

		// primary position point
		this.x = 0;
		this.y = 0;

		// simple physics: velocity and acceleration
		this.vx = 0;
		this.vy = 0;
		this.ax = 0;
		this.ay = 0;

		// position from the previous frame
		this.xPrev = 0;
		this.yPrev = 0;

		// entities are either circles or rectangles
		this.isCircle = false;

		// anchored entities cannot be moved by physics
		this.isAnchored = false;

		// collision bounds, offset from primary point
		this.hitBounds = createBounds();

		// view bounds, offset from primary point
		this.viewBounds = createBounds();

		// entities optionally support views
		if (this.viewClass) {
			this.view = new this.viewClass(opts);

			// updating view bounds updates the view's style, but not vice-versa
			var vs = this.view.style;
			Object.defineProperties(this.viewBounds, {
				w: {
					enumerable: true,
					get: function() { return vs.width; },
					set: function(val) { vs.width = val; }
				},
				h: {
					enumerable: true,
					get: function() { return vs.height; },
					set: function(val) { vs.height = val; }
				}
			});
		} else {
			this.view = null;
		}

		// physics component
		this.physics = opts.physics || EntityPhysics;

		// EntityPool properties
		this.pool = opts.pool || null;
		this.poolIndex = opts.poolIndex || 0;
	};

	this.reset = function(x, y, config) {
		this.x = x || 0;
		this.y = y || 0;
		this.xPrev = this.x;
		this.yPrev = this.y;

		config = config || {};
		this.vx = config.vx || 0;
		this.vy = config.vy || 0;
		this.ax = config.ax || 0;
		this.ay = config.ay || 0;
		this.isCircle = config.isCircle || false;
		this.isAnchored = config.isAnchored || false;

		applyBoundsFromConfig(config.hitBounds, this.hitBounds, config, 'hit');
		applyBoundsFromConfig(config.viewBounds, this.viewBounds, config, 'view');

		this.view && this.resetView(config);
	};

	this.resetView = function(config) {
		var v = this.view;
		var s = v.style;
		var b = this.viewBounds;
		s.x = this.x + b.x;
		s.y = this.y + b.y;
		s.visible = true;

		// setImage is expensive, so only call it if we have to
		var image = config.image;
		if (image && v.setImage && v.currImage !== image) {
			v.setImage(image);
			v.currImage = image;
		}
	};

	this.update = function(dt) {
		this.xPrev = this.x;
		this.yPrev = this.y;
		this.physics.stepPosition(this, dt);
		this.view && this.updateView(dt);
	};

	this.updateView = function(dt) {
		var s = this.view.style;
		var b = this.viewBounds;
		s.x = this.x + b.x;
		s.y = this.y + b.y;
	};

	this.collidesWith = function(entity) {
		return this.physics.collide(this, entity);
	};

	this.resolveCollidingStateWith = function(entity) {
		return this.physics.resolveCollidingState(this, entity);
	};

	this.release = function() {
		this.pool.release(this);
		this.view && (this.view.style.visible = false);
	};
});

/**
 * Entity Bounds are simple objects that support rectangles and circles
 *
 * Rects:
 * x and y are offsets to the top-left corner from the primary point
 * r can be used for rotation but is not used by default
 * w and h are width and height respectively
 *
 * Circles:
 * x and y are offsets to the center point from the primary point
 * r is the radius of the circle
 * w and h are not used
 */

var createBounds =
exports.createBounds = function() {
	return { x: 0, y: 0, r: 0, w: 0, h: 0 };
};

var applyBounds =
exports.applyBounds = function(src, dest) {
	dest.x = src.x || 0;
	dest.y = src.y || 0;
	dest.r = src.r || 0;
	dest.w = src.w || 0;
	dest.h = src.h || 0;
};

var applyBoundsFromImage =
exports.applyBoundsFromImage = function(src, dest, config, type) {
	var b = _imageMap[config.image];
	dest.w = b.w + b.marginLeft + b.marginRight;
	dest.h = b.h + b.marginTop + b.marginBottom;
	if (config.isCircle) {
		// default radius based on average of image width and height
		if (!src) {
			dest.r = (dest.w + dest.h) / 4;
			// circle's are assumed to be centered, so offset our view
			if (type === 'view') {
				dest.x = -dest.w / 2;
				dest.y = -dest.h / 2;
			}
		}
	}
};

var applyBoundsFromConfig =
exports.applyBoundsFromConfig = function(src, dest, config, type) {
	applyBounds(src || createBounds(), dest);
	if (config.image && !dest.r && (!dest.w || !dest.h)) {
		applyBoundsFromImage(src, dest, config, type);
	}
};
