import .SAT;
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

		if(entity.isCircle){
			entity.rigidbody2d.pos.x = entity.x + entity.hitBounds.r;
			entity.rigidbody2d.pos.y = entity.y + entity.hitBounds.r;
		}else{
			entity.rigidbody2d.pos.x = entity.x;
			entity.rigidbody2d.pos.y = entity.y;
		}
	},
	/**
	 * ~ REQUIRED for Entity
	 * ~ collide defines how collisions behave and what data is returned
	 * ~ by default, returns a bool, and only works with circles and rects
	 */
	collide: function(entity1, entity2, response) {
		if (entity1.isCircle) {
			if (entity2.isCircle) {
				return this.circleCollidesWithCircle(entity1, entity2, response);
			} else {
				return this.circleCollidesWithRect(entity1, entity2, response);
			}
		} else {
			if (entity2.isCircle) {
				return this.circleCollidesWithRect(entity2, entity1, response);
			} else {
				return this.rectCollidesWithRect(entity1, entity2, response);
			}
		}
	},
	circleCollidesWithCircle: function(circ1, circ2, response) {
		return SAT.testCircleCircle(circ1.rigidbody2d, circ2.rigidbody2d, response);
	},
	circleCollidesWithRect: function(circ, rect, response) {
		return SAT.testCirclePolygon(circ.rigidbody2d, rect.rigidbody2d, response);
	},
	rectCollidesWithRect: function(rect1, rect2, response) {
		return SAT.testPolygonPolygon(rect1.rigidbody2d, rect2.rigidbody2d, response);
	}
};
