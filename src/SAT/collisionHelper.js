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
  // anchor (pivot) point, offset from the primary point
  // this.anchorX = 0;
  // this.anchorY = 0;

  // this.rotate = function (dr) {
  //   this.view.style.r += dr;
  //   if (this.rigidBody && this.rigidBody.rotate) {
  //     this.rigidBody.rotate(dr);
  //   }
  // };

  // this.setAnchor = function (x, y) {
  //   this.anchorX = x || 0;
  //   this.anchorY = y || 0;
  //   if (this.view) {
  //     this.view.style.anchorX = this.anchorX;
  //     this.view.style.anchorY = this.anchorY;
  //   }
  //   if (this.rigidBody && this.rigidBody.setPivot) {
  //     this.rigidBody.setPivot(new SAT.Vector(this.x + x, this.y + y));
  //   }
  // }

  /**
   * ~ REQUIRED for Entity
   * ~ stepPosition updates an entity's position based on dt (delta time)
   * ~ velocity is added half before update and half after, which helps
   * mitigate lag spikes, for smoother, more frame independent animations
   */
  stepPosition: function (entity, dt) {
    entity.x += dt * entity.vx / 2;
    entity.vx += dt * entity.ax;
    entity.x += dt * entity.vx / 2;

    entity.y += dt * entity.vy / 2;
    entity.vy += dt * entity.ay;
    entity.y += dt * entity.vy / 2;
  },

  updatePosition: function (entity, dx, dy){
    if(dx == 0 && dy == 0){
      return;
    }
    entity.rigidbody2d.pos.x += dx;
    entity.rigidbody2d.pos.y += dy;
  },

  /**
   * ~ REQUIRED for Entity
   * ~ collide defines how collisions behave and what data is returned
   * ~ by default, returns a bool, and only works with circles and rects
   */
  collide: function (entity1, entity2, response) {
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

  circleCollidesWithCircle: function (circ1, circ2, response) {
    return SAT.testCircleCircle(circ1.rigidbody2d, circ2.rigidbody2d, response);
  },

  circleCollidesWithRect: function (circ, rect, response) {
    return SAT.testCirclePolygon(circ.rigidbody2d, rect.rigidbody2d, response);
  },

  rectCollidesWithRect: function (rect1, rect2, response) {
    return SAT.testPolygonPolygon(rect1.rigidbody2d, rect2.rigidbody2d, response);
  },

  /**
   * ~ REQUIRED for Entity
   * ~ resolveCollidingState uses hit bounds to guarantee that two entities
   * are no longer colliding by pushing them apart
   * ~ entities with isAnchored true are never moved
   * ~ returns total distance moved to separate the objects
   */
  resolveCollidingState: function (entity1, entity2) {
    // see collisionHelper.resolveCollision
  },

  /**
   * ~ resolveCollidingCircles forces two circles apart based on their centers
   */
  resolveCollidingCircles: function (circ1, circ2) {
    // see collisionHelper
  },

  /**
   * ~ resolveCollidingCircleRect forces apart a circle and rect
   * ~ good default collision behavior for landing on a platforms vs.
   * hitting the side (missing the platform)
   */
  resolveCollidingCircleRect: function (circ, rect) {
    // See collisionHelper
  },

  /**
   * ~ resolveCollidingRects forces two rects apart, but only in one direction
   * ~ good default collision behavior for landing on a platforms vs.
   * hitting the side (missing the platform)
   */
  resolveCollidingRects: function (rect1, rect2) {
    // See collisionHelper
  },

  /**
   * ~ REQUIRED for Entity
   * ~ used by advanced physics implementations, like SATPhysics
   */
  getRigidBody: function (entity) {
    var vec = new SAT.Vector(entity.getHitX(), entity.getHitY());
    if (entity.isCircle) {
      return new SAT.Circle(vec, entity.getHitRadius());
    } else {
      var box = new SAT.Box(vec, entity.getHitWidth(), entity.getHitHeight());
      return box.toPolygon();
    }
  }
};
