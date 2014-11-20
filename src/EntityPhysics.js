var abs = Math.abs;
var sqrt = Math.sqrt;

// this value helps resolve colliding state between entities
var COLLISION_OFFSET = 0.001;

/**
 * default collision functions support circles and axis-aligned rectangles,
 * optimized to support many calls within a single tick
 */
exports = {
	/**
	 * stepPosition updates an entity's position based on time passed
	 * velocity is added half before update and half after,
	 * providing smoother, more frame independent animations
	 */
	stepPosition: function(entity, dt) {
		entity.x += dt * entity.vx / 2;
		entity.vx += dt * entity.ax;
		entity.x += dt * entity.vx / 2;

		entity.y += dt * entity.vy / 2;
		entity.vy += dt * entity.ay;
		entity.y += dt * entity.vy / 2;
	},
	/**
	 * collides defines how collisions behave and what data is returned:
	 * by default, it returns a bool, and only works with circles and rects;
	 */
	collides: function(entity1, entity2) {
		if (entity1.isCircle) {
			if (entity2.isCircle) {
				return this.circleCollidesWithCircle(entity1, entity2);
			} else {
				return this.circleCollidesWithRect(entity1, entity2);
			}
		} else {
			if (entity2.isCircle) {
				return this.circleCollidesWithRect(entity2, entity1);
			} else {
				return this.rectCollidesWithRect(entity1, entity2);
			}
		}
	},
	/**
	 * circle and rect collision functions are needed by default collides
	 * other physics implementations may not need the same set of functions
	 */
	circleCollidesWithCircle: function(circ1, circ2) {
		var b1 = circ1.hitBounds;
		var x1 = circ1.x + b1.x;
		var y1 = circ1.y + b1.y;
		var r1 = b1.r;

		var b2 = circ2.hitBounds;
		var x2 = circ2.x + b2.x;
		var y2 = circ2.y + b2.y;
		var r2 = b2.r;

		var dx = x2 - x1;
		var dy = y2 - y1;
		var distSqrd = dx * dx + dy * dy;
		var distColl = r1 + r2;
		var distCollSqrd = distColl * distColl;

		return distSqrd <= distCollSqrd;
	},
	circleCollidesWithRect: function(circ, rect) {
		var cb = circ.hitBounds;
		var cx = circ.x + cb.x;
		var cy = circ.y + cb.y;
		var cr = cb.r;

		var rb = rect.hitBounds;
		var rwHalf = rb.w / 2;
		var rhHalf = rb.h / 2;
		var rx = rect.x + rb.x + rwHalf;
		var ry = rect.y + rb.y + rhHalf;

		var dx = abs(cx - rx);
		var dy = abs(cy - ry);

		if (dx > rwHalf + cr || dy > rhHalf + cr) {
			// far case: circle's center is too far from rect's center
			return false;
		} else if (dx <= rwHalf || dy <= rhHalf) {
			// close case: circle's center is close enough to rect's center
			return true;
		} else {
			// corner case: rect corner within a radius of the circle's center
			var dcx = dx - rwHalf;
			var dcy = dy - rhHalf;
			var cornerDistSqrd = dcx * dcx + dcy * dcy;
			return cornerDistSqrd <= cr * cr;
		}
	},
	rectCollidesWithRect: function(rect1, rect2) {
		var b1 = rect1.hitBounds;
		var x1 = rect1.x + b1.x;
		var y1 = rect1.y + b1.y;
		var xf1 = x1 + b1.w;
		var yf1 = y1 + b1.h;

		var b2 = rect2.hitBounds;
		var x2 = rect2.x + b2.x;
		var y2 = rect2.y + b2.y;
		var xf2 = x2 + b2.w;
		var yf2 = y2 + b2.h;

		return x1 <= xf2 && xf1 >= x2 && y1 <= yf2 && yf1 >= y2;
	},
	/**
	 * resolveCollidingState uses hitBounds and velocities to ensure that two
	 * provided entities are no longer colliding by pushing them apart;
	 * returns the time in milliseconds to step back to the initial collision;
	 * it ignores acceleration and assumes the entities are currently colliding;
	 * if velocities are to be changed, then do so after resolveCollidingState
	 */
	resolveCollidingState: function(entity1, entity2) {
		if (entity1.isCircle) {
			if (entity2.isCircle) {
				return this.resolveCollidingCircles(entity1, entity2);
			} else {
				return this.resolveCollidingCircleRect(entity1, entity2);
			}
		} else {
			if (entity2.isCircle) {
				return this.resolveCollidingCircleRect(entity2, entity1);
			} else {
				return this.resolveCollidingRects(entity1, entity2);
			}
		}
	},
	resolveCollidingCircles: function(circ1, circ2) {
		var b1 = circ1.hitBounds;
		var x1 = circ1.x + b1.x;
		var y1 = circ1.y + b1.y;
		var r1 = b1.r;
		var vx1 = circ1.vx;
		var vy1 = circ1.vy;
		var vMag1 = sqrt(vx1 * vx1 + vy1 * vy1);

		var b2 = circ2.hitBounds;
		var x2 = circ2.x + b2.x;
		var y2 = circ2.y + b2.y;
		var r2 = b2.r;
		var vx2 = circ2.vx;
		var vy2 = circ2.vy;
		var vMag2 = sqrt(vx2 * vx2 + vy2 * vy2);

		var dx = x2 - x1;
		var dy = y2 - y1;
		var dist = sqrt(dx * dx + dy * dy);
		var distColl = r1 + r2 + COLLISION_OFFSET;
		var dd = distColl - dist;

		var dt = 0;
		var vMagTotal = vMag1 + vMag2;
		// if there's no velocity, use distance instead
		if (vMagTotal === 0) {
			// if there's no distance, force a very small distance
			if (dist === 0) {
				dx = COLLISION_OFFSET;
				dist = COLLISION_OFFSET;
			}
			vx1 = dx;
			vy1 = dy;
			vMag1 = dist;
			vx2 = -dx;
			vy2 = -dy;
			vMag2 = dist;
			vMagTotal = vMag1 + vMag2;
		} else {
			dt = dd / vMagTotal;
		}

		circ1.x += dd * -(vx1 / vMagTotal);
		circ1.y += dd * -(vy1 / vMagTotal);
		circ2.x += dd * -(vx2 / vMagTotal);
		circ2.y += dd * -(vy2 / vMagTotal);

		return dt;
	},
	resolveCollidingCircleRect: function(circ, rect) {

	},
	resolveCollidingRects: function(rect1, rect2) {
		var b1 = rect1.hitBounds;
		var x1 = rect1.x + b1.x;
		var y1 = rect1.y + b1.y;
		var w1 = b1.w;
		var h1 = b1.h;
		var xf1 = x1 + w1;
		var yf1 = y1 + h1;
		var vx1 = rect1.vx;
		var vy1 = rect1.vy;
		var vMag1 = sqrt(vx1 * vx1 + vy1 * vy1);

		var b2 = rect2.hitBounds;
		var x2 = rect2.x + b2.x;
		var y2 = rect2.y + b2.y;
		var w2 = b2.w;
		var h2 = b2.h;
		var xf2 = x2 + w2;
		var yf2 = y2 + h2;
		var vx2 = rect2.vx;
		var vy2 = rect2.vy;
		var vMag2 = sqrt(vx2 * vx2 + vy2 * vy2);

		var dt = 0;


		return dt;
	}
};
