import ui.ImageView as ImageView;
import ui.resource.loader as loader;
var _imageMap = loader.getMap();

import .EntityPhysics;
import .SAT;
import .SATPhysics;

// entities module image path (for showing hit bounds)
var IMG_PATH = "addons/devkit-entities/images/";

// global unique identifier incremented for each instance of Entity
var _uid = 1;

exports = Class(function() {
	/**
	 * Entity Prototype Properties
	 *
	 * ~ These properties are class-wide as opposed to instance-specific.
	 * Defining them on a per-instance basis could cause strange behavior when
	 * using EntityPool. For example, mixing different view classes in a single
	 * pool would mean that you don't know which view you'll get when you obtain
	 * an entity.
	 * ~ They should be overridden by subclasses, as needed. For example, if you
	 * want a set of entities that don't have views, just set your class's
	 * prototype's viewClass property to null.
	 */

	this.name = "Entity";
	this.viewClass = ImageView;

	/**
	 * Entity Initialization
	 *
	 * ~ The init function serves as a constructor function. It should be
	 * treated like a C++ header file, in that it should define all properties
	 * that will ever exist on an instance. Avoid changing the type of a
	 * property for best performance.
	 * ~ If you override init in a subclass, be sure to call the superclass's
	 * init from within your overriden function. For example:
	 *     Entity.prototype.init.call(this, opts);
	 * or using js.io's supr (which uses apply instead of call):
	 *     supr(this, 'init', [opts]);
	 */

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

		// collision directional flags
		this.collidedTop = false;
		this.collidedRight = false;
		this.collidedBottom = false;
		this.collidedLeft = false;

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

	/**
	 * Entity Lifecycle Interface
	 * ~ reset, update, release
	 *
	 * ~ You are encouraged to override these functions as needed, but you
	 * should almost always be sure to call the superclass function from
	 * within your overriden function.
	 *
	 * ~ When an Entity appears in a game, its reset function should
	 * should be called to set its primary point within the game-space and to
	 * apply its config. If you are using EntityPool, the reset function gets
	 * called automatically by the pool's obtain function, which takes the same
	 * parameters.
	 * ~ The resetView function gets called automatically by the reset function
	 * if a view exists.
	 *
	 * ~ While an Entity is active in your game, you should call its update
	 * function once per tick and pass in the time elapsed since the last tick,
	 * dt (delta time). If you're using EntityPool, you can just call the pool's
	 * update function, passing dt in the same way, and it will update all
	 * active entities within the pool.
	 * ~ The updateView function gets called automatically by the update
	 * function if a view exists.
	 *
	 * ~ Finally, when an entity's life is over, you can call the release
	 * function to hide it and make it inactive. If you're using an EntityPool,
	 * this call will recycle it back into the pool automatically.
	 */

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
		this.anchorX = config.anchorX || 0;
		this.anchorY = config.anchorY || 0;
		this.physics = config.physics || EntityPhysics;

		this.collidedTop = false;
		this.collidedRight = false;
		this.collidedBottom = false;
		this.collidedLeft = false;

		applyBoundsFromConfig(config.hitBounds, this.hitBounds, config, 'hit');
		applyBoundsFromConfig(config.viewBounds, this.viewBounds, config, 'view');

		if(this.physics.name == "SATPhysics"){
			this.rigidbody2d = null;
			if(this.isCircle){
				this.rigidbody2d = new SAT.Circle(
					new SAT.Vector(this.x + this.hitBounds.x, this.y + this.hitBounds.y), this.hitBounds.r);
			}else{
				this.rigidbody2d = new SAT.Box(new SAT.Vector(this.x + this.hitBounds.x, this.y + this.hitBounds.y), 
					this.hitBounds.w, this.hitBounds.h).toPolygon();
			}
			this.setAnchor(this.anchorX, this.anchorY);
		}

		this.view && this.resetView(config);
	};

	this.resetView = function(config) {
		var v = this.view;
		var s = v.style;
		var b = this.viewBounds;
		s.x = this.x + b.x;
		s.y = this.y + b.y;
		s.zIndex = config.zIndex !== void 0 ? config.zIndex : s.zIndex;
		s.visible = true;

		// setImage is expensive, so only call it if we have to
		var image = config.image;
		if (image && v.setImage && v.currImage !== image) {
			v.setImage(image);
			v.currImage = image;
		}
	};

	this.rotate = function(angle){
		this.view.style.r += angle;
		if(this.physics.name == "SATPhysics"){
			this.rigidbody2d.rotate(angle);
		}
	}

	this.setAnchor = function(x, y){
		this.anchorX = x;
		this.anchorY = y;
		this.view.updateOpts({
			anchorX: x,
			anchorY: y
		});
		if(this.physics.name == "SATPhysics"){
			this.rigidbody2d.setPivot(new SAT.Vector(this.x + x, this.y + y));
		}
	}

	this.update = function(dt) {
		this.xPrev = this.x;
		this.yPrev = this.y;
		this.physics.stepPosition(this, dt);
		this.view && this.updateView(dt);
	};

	this.updateView = function(dt) {
		var s = this.view.style;
		var b = this.viewBounds;
		var xPrev = s.x;
		var yPrev = s.y;
		s.x = this.x + b.x;
		s.y = this.y + b.y;
		if(this.physics.name == "SATPhysics"){
			this.physics.updatePosition(this, s.x - xPrev, s.y - yPrev);
		}
	};

	this.release = function() {
		this.pool && this.pool.release(this);
		this.view && (this.view.style.visible = false);
		if(this.physics.name == "SATPhysics"){
			this.rigidbody2d = null;
			delete this.rigidbody2d;
		}
	};

	/**
	 * Entity Physics Interface
	 *
	 * ~ The physics object is a reference to EntityPhysics by default.
	 * ~ By passing in or replacing your own physics object, you can change how
	 * an Entity behaves. If you do so, you will need to provide at least these
	 * 3 functions:
	 *     ~ stepPosition(entity, dt)
	 *         ~ steps the x and y coordinates of an entity according to
	 *         velocity and acceleration over the time elapsed, dt
	 *     ~ collide(entity1, entity2)
	 *         ~ returns a bool as to whether or not the entities are colliding
	 *     ~ resolveCollidingState(entity1, entity2)
	 *         ~ separates the entities, ensuring they are no longer colliding
	 *         ~ returns the total distance moved by the two entities
	 */

	this.collidesWith = function(entity, response) {
		var res = response || false;
		return this.physics.collide(this, entity, res);
	};

	/**
	 * Entity Hit Bounds Getters
	 */

	this.getHitX =
	this.getLeftHitX =
	this.getMinHitX = function() {
		return this.x + this.hitBounds.x;
	};

	this.getRightHitX =
	this.getMaxHitX = function() {
		return this.getHitX() + this.hitBounds.w;
	};

	this.getHitY =
	this.getTopHitY =
	this.getMinHitY = function() {
		return this.y + this.hitBounds.y;
	};

	this.getBottomHitY =
	this.getMaxHitY = function() {
		return this.getHitY() + this.hitBounds.h;
	};

	this.getHitRadius = function() {
		return this.hitBounds.r;
	};

	this.getHitWidth = function() {
		return this.hitBounds.w;
	};

	this.getHitHeight = function() {
		return this.hitBounds.h;
	};

	/**
	 * Entity View Bounds Getters
	 */

	this.getViewX =
	this.getLeftViewX =
	this.getMinViewX = function() {
		return this.x + this.viewBounds.x;
	};

	this.getRightViewX =
	this.getMaxViewX = function() {
		return this.getViewX() + this.viewBounds.w;
	};

	this.getViewY =
	this.getTopViewY =
	this.getMinViewY = function() {
		return this.y + this.viewBounds.y;
	};

	this.getBottomViewY =
	this.getMaxViewY = function() {
		return this.getViewY() + this.viewBounds.h;
	};

	this.getViewWidth = function() {
		return this.viewBounds.w;
	};

	this.getViewHeight = function() {
		return this.viewBounds.h;
	};

	/**
	 * Debugging Utilities
	 */

	this.showHitBounds = function() {
		if (!this.hitBoundsView) {
			this.hitBoundsView = new ImageView({ parent: this.view });
		} else {
			this.hitBoundsView.style.visible = true;
		}

		var hbvs = this.hitBoundsView.style;
		if (this.isCircle) {
			this.hitBoundsView.setImage(IMG_PATH + "shapeCircle.png");
			hbvs.x = -this.viewBounds.x + this.hitBounds.x - this.hitBounds.r;
			hbvs.y = -this.viewBounds.y + this.hitBounds.y - this.hitBounds.r;
			hbvs.width = 2 * this.hitBounds.r;
			hbvs.height = 2 * this.hitBounds.r;
		} else {
			this.hitBoundsView.setImage(IMG_PATH + "shapeRect.png");
			hbvs.x = -this.viewBounds.x + this.hitBounds.x;
			hbvs.y = -this.viewBounds.y + this.hitBounds.y;
			hbvs.width = this.hitBounds.w;
			hbvs.height = this.hitBounds.h;
		}
	};

	this.hideHitBounds = function() {
		if (this.hitBoundsView) {
			this.hitBoundsView.style.visible = false;
		}
	};
});

/**
 * Entity Bounds
 *
 * ~ Bounds are simple objects that support rectangles and circles, and how
 * they are offset from an Entity's primary point, x and y.
 * ~ If bounds aren't supplied in an Entity's config, default bounds will be
 * supplied. If you provide an image URL, the bounds will default to the size
 * of the image, and will be top-left aligned for rectangles or center-aligned
 * for circles.
 *
 * Rects:
 * ~ x and y are offsets to the top-left corner from the primary point
 * ~ r can be used for rotation but is not used by default
 * ~ w and h are width and height respectively
 *
 * Circles:
 * ~ x and y are offsets to the center point from the primary point
 * ~ r is the radius of the circle
 * ~ w and h are not used
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
			// circles are assumed to be centered, so offset our view
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
