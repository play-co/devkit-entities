import math.geom.Point as Point;
import math.geom.Vec2D as Vec2D;
import ui.resource.loader as loader;
var _imageMap = loader.getMap();

var min = Math.min;
var max = Math.max;
var abs = Math.abs;
var sqrt = Math.sqrt;

// this value helps resolve colliding state between entities
var COLLISION_OFFSET = 0.001;

/**
 * IMPORTANT NOTES:
 * ~ by default, collisions support circles and axis-aligned rectangles only
 * ~ these are NOT continuous collision detection algorithms, meaning a large
 *   value of dt could cause entities to pass through each other - it's up to the
 *   developer to manage the time step of his/her game to prevent this behavior
 */
exports = {
  /**
   * ~ REQUIRED
   * ~ step updates a model's position based on dt (delta time) and physics
   * ~ velocity is added half before update and half after, which helps
   *   mitigate lag spikes, for smoother, more frame-independent movements
   */
  step: function (model, dt) {
    var p = model.position;
    var v = model.velocity;
    var a = model.acceleration;

    p.x += dt * v.x / 2;
    v.x += dt * a.x;
    p.x += dt * v.x / 2;

    p.y += dt * v.y / 2;
    v.y += dt * a.y;
    p.y += dt * v.y / 2;
  },

  circleCollidesWithCircle: function (circ1, circ2) {
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

  circleCollidesWithRect: function (circ, rect) {
    var cx = circ.getHitX();
    var cy = circ.getHitY();
    var cr = circ.getHitRadius();
    var rwHalf = rect.getHitWidth() / 2;
    var rhHalf = rect.getHitHeight() / 2;
    var rx = rect.getHitX() + rwHalf;
    var ry = rect.getHitY() + rhHalf;
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

  rectCollidesWithRect: function (rect1, rect2) {
    var x1 = rect1.getHitX();
    var y1 = rect1.getHitY();
    var xf1 = x1 + rect1.getHitWidth();
    var yf1 = y1 + rect1.getHitHeight();
    var x2 = rect2.getHitX();
    var y2 = rect2.getHitY();
    var xf2 = x2 + rect2.getHitWidth();
    var yf2 = y2 + rect2.getHitHeight();
    return x1 <= xf2 && xf1 >= x2 && y1 <= yf2 && yf1 >= y2;
  },

  /**
   * ~ resolveCollidingCircles forces two circles apart based on their centers
   */
  resolveCollidingCircles: function (circ1, circ2) {
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

    // fixed entities cannot be moved by physics
    if (circ1.fixed && circ2.fixed) {
      dd = 0;
    } else if (circ1.fixed) {
      mult1 = 0;
      mult2 = 1;
    } else if (circ2.fixed) {
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
   *   hitting the side (missing the platform)
   */
  resolveCollidingCircleRect: function (circ, rect) {
    var cx = circ.getHitX();
    var cy = circ.getHitY();
    var cr = circ.getHitRadius();
    var rwHalf = rect.getHitWidth() / 2;
    var rhHalf = rect.getHitHeight() / 2;
    var rx = rect.getHitX() + rwHalf;
    var ry = rect.getHitY() + rhHalf;
    var dx = abs(cx - rx);
    var dy = abs(cy - ry);
    if (dx > rwHalf + cr || dy > rhHalf + cr || (circ.fixed && rect.fixed)) {
      // far case: circle's center too far or both entities are fixed
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

      // fixed entities cannot be moved by physics
      if (circ.fixed) {
        mult1 = 0;
        mult2 = 1;
      } else if (rect.fixed) {
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
   *   hitting the side (missing the platform)
   */
  resolveCollidingRects: function (rect1, rect2) {
    var x1 = rect1.getHitX();
    var y1 = rect1.getHitY();
    var w1 = rect1.getHitWidth();
    var h1 = rect1.getHitHeight();
    var xf1 = x1 + w1;
    var yf1 = y1 + h1;
    var mult1 = 0.5;
    var x2 = rect2.getHitX();
    var y2 = rect2.getHitY();
    var w2 = rect2.getHitWidth();
    var h2 = rect2.getHitHeight();
    var xf2 = x2 + w2;
    var yf2 = y2 + h2;
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

    // fixed entities cannot be moved by physics
    if (rect1.fixed && rect2.fixed) {
      dx = 0;
      dy = 0;
    } else if (rect1.fixed) {
      mult1 = 0;
      mult2 = 1;
    } else if (rect2.fixed) {
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
  },

  /**
   * ~ circleInsideCircle returns true if circ1 is fully contained in circ2
   */
  circleInsideCircle: function (circ1, circ2) {
    var x1 = circ1.getHitX();
    var y1 = circ1.getHitY();
    var r1 = circ1.getHitRadius();
    var x2 = circ2.getHitX();
    var y2 = circ2.getHitY();
    var r2 = circ2.getHitRadius();
    var dx = x2 - x1;
    var dy = y2 - y1;
    var dist = sqrt(dx * dx + dy * dy);
    return dist <= (r2 - r1);
  },

  /**
   * ~ circleInsideRect returns true if circ is fully contained in rect
   */
  circleInsideRect: function (circ, rect) {
    var cx = circ.getHitX();
    var cy = circ.getHitY();
    var cr = circ.getHitRadius();
    var origHitBounds = circ.hitBounds;
    circ.hitBounds = {
      x: cx - circ.x - cr,
      y: cy - circ.y - cr,
      w: 2 * cr,
      h: 2 * cr
    };

    var result = this.rectInsideRect(circ, rect);
    circ.hitBounds = origHitBounds;
    return result;
  },

  /**
   * ~ rectInsideCircle returns true if rect is fully contained in circ
   */
  rectInsideCircle: function (rect, circ) {
    var l = rect.getHitX();
    var r = l + rect.getHitWidth();
    var t = rect.getHitY();
    var b = t + rect.getHitHeight();
    return this.pointInsideCircle({ x: l, y: t }, circ)
        && this.pointInsideCircle({ x: r, y: t }, circ)
        && this.pointInsideCircle({ x: r, y: b }, circ)
        && this.pointInsideCircle({ x: l, y: b }, circ);
  },

  /**
   * ~ rectInsideRect returns true if rect1 is fully contained in rect2
   */
  rectInsideRect: function (rect1, rect2) {
    var l = rect1.getHitX();
    var r = l + rect1.getHitWidth();
    var t = rect1.getHitY();
    var b = t + rect1.getHitHeight();
    return this.pointInsideRect({ x: l, y: t }, rect2)
        && this.pointInsideRect({ x: r, y: t }, rect2)
        && this.pointInsideRect({ x: r, y: b }, rect2)
        && this.pointInsideRect({ x: l, y: b }, rect2);
  },

  /**
   * ~ pointInsideRect returns true if pt is contained in rect
   */
  pointInsideRect: function (pt, rect) {
    var x = rect.getHitX();
    var y = rect.getHitY();
    var xf = x + rect.getHitWidth();
    var yf = y + rect.getHitHeight();
    return pt.x >= x && pt.x <= xf && pt.y >= y && pt.y <= yf;
  },

  /**
   * ~ pointInsideCircle returns true if pt is contained in circ
   */
  pointInsideCircle: function (pt, circ) {
    var x = circ.getHitX();
    var y = circ.getHitY();
    var r = circ.getHitRadius();
    var dx = pt.x - x;
    var dy = pt.y - y;
    var dist = sqrt(dx * dx + dy * dy);
    return dist <= r;
  },

  /**
   * returns a new point
   */
  getPoint: function (x, y) {
    return new Point({
      x: x || 0,
      y: y || 0
    });
  },

  /**
   * returns a new vector
   */
  getVector: function (x, y) {
    return new Vec2D({
      x: x || 0,
      y: y || 0
    });
  },

  /**
   * returns a hit bounds object with defaults based on image or sprite url
   */
  getBounds: function (config) {
    var bounds = {
      x: 0,
      y: 0,
      radius: 0,
      width: 0,
      height: 0
    };

    // default bounds to image or sprite frame size if available from config
    if (config) {
      var img = config.image;
      var url = config.url;
      if (!img && url) {
        // support SpriteViews by finding the first animation match for url
        for (var prop in _imageMap) {
          if (prop.indexOf(url) >= 0) {
            img = prop;
            break;
          }
        }
      }

      var map = _imageMap[img];
      if (map) {
        bounds.width = map.w + map.marginLeft + map.marginRight;
        bounds.height = map.h + map.marginTop + map.marginBottom;
        bounds.radius = (bounds.width + bounds.height) / 4;
      }
    }

    return bounds;
  }

};
