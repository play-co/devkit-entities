var min = Math.min;
var max = Math.max;
var abs = Math.abs;
var sqrt = Math.sqrt;

// this value helps resolve colliding state between entities
var COLLISION_OFFSET = 0.001;

/**
 * IMPORTANT NOTES:
 * ~ all required functions to interface with Entity are labeled
 * ~ by default, collisions support circles and axis-aligned rectangles only
 * ~ these are NOT continuous collision detection algorithms, meaning a large
 * value of dt could cause entities to pass through each other - it's up to the
 * developer to manage the time step of his/her game to prevent this behavior
 */
exports = {
	/**
	 * ~ REQUIRED for Entity
	 * ~ stepPosition updates an entity's position based on dt (delta time)
	 * ~ velocity is added half before update and half after, which helps
	 * mitigate lag spikes, for smoother, more frame independent animations
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
	 * ~ REQUIRED for Entity
	 * ~ collide defines how collisions behave and what data is returned
	 * ~ by default, returns a bool, and only works with circles and rects
	 */
	collide: function(entity1, entity2) {
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
	circleCollidesWithCircle: function(circ1, circ2) {
		var x1 = circ1.getHitX();
		var y1 = circ1.getHitY();
		var r1 = circ1.getHitRadius();
		var x2 = circ2.getHitX();
		var y2 = circ2.getHitY();
		var r2 = circ2.getHitRadius();

		var dx = x2 - x1;
		var dy = y2 - y1;
		var distSqrd = dx * dx + dy * dy;
		var distColl = r1 + r2;
		var distCollSqrd = distColl * distColl;

		return distSqrd <= distCollSqrd;
	},
	circleCollidesWithRect: function(circ, rect) {
		var cx = circ.getHitX();
		var cy = circ.getHitY();
		var cr = circ.getHitRadius();
		var rwHalf = rect.getHitWidth() / 2;
		var rhHalf = rect.getHitHeight() / 2;
		var rx = rect.getMinHitX() + rwHalf;
		var ry = rect.getMinHitY() + rhHalf;

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
		var x1 = rect1.getMinHitX();
		var y1 = rect1.getMinHitY();
		var xf1 = rect1.getMaxHitX();
		var yf1 = rect1.getMaxHitY();
		var x2 = rect2.getMinHitX();
		var y2 = rect2.getMinHitY();
		var xf2 = rect2.getMaxHitX();
		var yf2 = rect2.getMaxHitY();

		return x1 <= xf2 && xf1 >= x2 && y1 <= yf2 && yf1 >= y2;
	},
	/**
	 * ~ REQUIRED for Entity
	 * ~ resolveCollidingState uses hit bounds to guarantee that two entities
	 * are no longer colliding by pushing them apart
	 * ~ entities with isAnchored true are never moved
	 * ~ returns total distance moved to separate the objects
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
	/**
	 * ~ resolveCollidingCircles forces two circles apart based on their centers
	 */
	resolveCollidingCircles: function(circ1, circ2) {
		var x1 = circ1.getHitX();
		var y1 = circ1.getHitY();
		var r1 = circ1.getHitRadius();
		var mult1 = 0.5;
		var x2 = circ2.getHitX();
		var y2 = circ2.getHitY();
		var r2 = circ2.getHitRadius();
		var mult2 = 0.5;

		var dx = x2 - x1;
		var dy = y2 - y1;
		var dist = sqrt(dx * dx + dy * dy);
		var distColl = r1 + r2 + COLLISION_OFFSET;

		// if concentric, force a very small distance
		if (dist === 0) {
			dx = COLLISION_OFFSET;
			dist = COLLISION_OFFSET;
		}

		var dd = distColl - dist;

		// anchored entities cannot be moved by physics
		if (circ1.isAnchored && circ2.isAnchored) {
			dd = 0;
		} else if (circ1.isAnchored) {
			mult1 = 0;
			mult2 = 1;
		} else if (circ2.isAnchored) {
			mult1 = 1;
			mult2 = 0;
		}

		circ1.x += mult1 * dd * -(dx / dist);
		circ1.y += mult1 * dd * -(dy / dist);
		circ2.x += mult2 * dd * (dx / dist);
		circ2.y += mult2 * dd * (dy / dist);

		return dd;
	},
	/**
	 * ~ resolveCollidingCircleRect forces apart a circle and rect
	 * ~ good default collision behavior for landing on a platforms vs.
	 * hitting the side (missing the platform)
	 */
	resolveCollidingCircleRect: function(circ, rect) {
		var cx = circ.getHitX();
		var cy = circ.getHitY();
		var cr = circ.getHitRadius();
		var rwHalf = rect.getHitWidth() / 2;
		var rhHalf = rect.getHitHeight() / 2;
		var rx = rect.getMinHitX() + rwHalf;
		var ry = rect.getMinHitY() + rhHalf;
		var dx = abs(cx - rx);
		var dy = abs(cy - ry);
		if (dx > rwHalf + cr || dy > rhHalf + cr
			|| (circ.isAnchored && rect.isAnchored))
		{
			// far case: circle's center too far or both entities are anchored
			return 0;
		} else if (dx <= rwHalf || dy <= rhHalf) {
			// close case: treat the circle like another rect, then resolve
			var origHitBounds = circ.hitBounds;
			circ.hitBounds = {
				x: cx - circ.x - cr,
				y: cy - circ.y - cr,
				w: 2 * cr,
				h: 2 * cr
			};

			var dd = this.resolveCollidingRects(rect, circ);
			circ.hitBounds = origHitBounds;
			return dd;
		} else {
			// corner case: the two meet at a rect corner, push them away
			var mult1 = 0.5;
			var mult2 = 0.5;
			// get the right corner point
			var nx = cx < rx ? rx - rwHalf : rx + rwHalf;
			var ny = cy < ry ? ry - rhHalf : ry + rhHalf;
			dx = nx - cx;
			dy = ny - cy;
			var dist = sqrt(dx * dx + dy * dy);
			var distColl = cr + COLLISION_OFFSET;
			var dd = distColl - dist;

			// anchored entities cannot be moved by physics
			if (circ.isAnchored) {
				mult1 = 0;
				mult2 = 1;
			} else if (rect.isAnchored) {
				mult1 = 1;
				mult2 = 0;
			}

			circ.x += mult1 * dd * -(dx / dist);
			circ.y += mult1 * dd * -(dy / dist);
			rect.x += mult2 * dd * (dx / dist);
			rect.y += mult2 * dd * (dy / dist);

			return dd;
		}
	},
	/**
	 * ~ resolveCollidingRects forces two rects apart, but only in one direction
	 * ~ good default collision behavior for landing on a platforms vs.
	 * hitting the side (missing the platform)
	 */
	resolveCollidingRects: function(rect1, rect2) {
		var x1 = rect1.getMinHitX();
		var y1 = rect1.getMinHitY();
		var w1 = rect1.getHitWidth();
		var h1 = rect1.getHitHeight();
		var xf1 = rect1.getMaxHitX();
		var yf1 = rect1.getMaxHitY();
		var mult1 = 0.5;
		var x2 = rect2.getMinHitX();
		var y2 = rect2.getMinHitY();
		var w2 = rect2.getHitWidth();
		var h2 = rect2.getHitHeight();
		var xf2 = rect2.getMaxHitX();
		var yf2 = rect2.getMaxHitY();
		var mult2 = 0.5;

		// find shallowest collision overlap, positive value means no overlap
		var dx = 1;
		var dx1 = x1 - xf2;
		var dx2 = x2 - xf1;
		if (dx1 <= 0 && dx2 <= 0) {
			dx = max(dx1, dx2) - COLLISION_OFFSET;
		} else if (dx1 <= 0) {
			dx = dx1 - COLLISION_OFFSET;
		} else if (dx2 <= 0) {
			dx = dx2 - COLLISION_OFFSET;
		}

		var dy = 1;
		var dy1 = y1 - yf2;
		var dy2 = y2 - yf1;
		if (dy1 <= 0 && dy2 <= 0) {
			dy = max(dy1, dy2) - COLLISION_OFFSET;
		} else if (dy1 <= 0) {
			dy = dy1 - COLLISION_OFFSET;
		} else if (dy2 <= 0) {
			dy = dy2 - COLLISION_OFFSET;
		}

		// step out in only one direction, pick the smallest overlap
		if (dx <= 0 && dy <= 0) {
			if (dx > dy) {
				dy = 0;
			} else {
				dx = 0;
			}
		} else if (dx <= 0) {
			dy = 0;
		} else if (dy <= 0) {
			dx = 0;
		} else {
			// there was no collision to begin with
			dx = 0;
			dy = 0;
		}

		// anchored entities cannot be moved by physics
		if (rect1.isAnchored && rect2.isAnchored) {
			dx = 0;
			dy = 0;
		} else if (rect1.isAnchored) {
			mult1 = 0;
			mult2 = 1;
		} else if (rect2.isAnchored) {
			mult1 = 1;
			mult2 = 0;
		}

		// dx and dy are never positive; so fix signs here based on rect centers
		var cx1 = x1 + w1 / 2;
		var cx2 = x2 + w2 / 2;
		var cy1 = y1 + h1 / 2;
		var cy2 = y2 + h2 / 2;
		var sign = (dx && cx1 > cx2) || (dy && cy1 > cy2) ? -1 : 1;
		rect1.x += mult1 * sign * dx;
		rect1.y += mult1 * sign * dy;
		rect2.x += mult2 * sign * -dx;
		rect2.y += mult2 * sign * -dy;

		// one of these will always be 0, so this is also the delta distance
		return dx + dy;
	}
};
