import .SAT;
import ..shapes.ShapeFactory as ShapeFactory;

var PI = Math.PI;
var TAU = 2 * PI;
var random = Math.random;

var SATShapeFactory = Class(ShapeFactory, function () {
  // Ensure that all points are SAT points
  this.getPoints = function(points) {
    var res = [];

    for (var i = 0; i < points.length; ++i) {
      var pt = points[i];
      if (pt instanceof SAT.Vector) {
        res.push(pt);
      } else {
        res.push(new SAT.Vector(pt.x, pt.y));
      }
    }
    return res;
  };

  /**
   * returns a new shape, requires opts.x, opts.y
   */
  this.getShape = function (opts) {
    opts = opts || {};
    var pos = SAT.Vector(opts.x || 0, opts.y || 0);

    if (opts.width !== undefined && opts.height !== undefined) {
      res = new SAT.Box(pos, opts.width, opts.height).toPolygon();
    } else if (opts.radius !== undefined) {
      res = new SAT.Circle(pos, opts.radius);
    } else if (opts.verticies !== undefined) {
      // Need to make sure that all the verts are SAT points
      var verts = this.getPoints(opts.verticies);
      res = new SAT.Polygon(pos, verts);
    } else {
      // Default, if we couldnt figure something out
      res = new SAT.Circle(pos, 1);
    }

    // Add some of the expected functionality?
    if (res instanceof SAT.Polygon) {
      // Polygons
      res.contains = function(x, y) {
        // debugger
        return SAT.pointInPolygon(new SAT.Vector(x, y), res);
      };

      res.getRandomPoint = function() {
        // TODO: make this better
        var pt = this.points[Math.floor(random() * this.points.length)];
        return { x: pt.x, y: pt.y };
      }.bind(res);
    } else {
      // Circles
      res.contains = function(x, y) {
        return SAT.pointInCircle(new SAT.Vector(x, y), res);
      };

      res.getRandomPoint = function() {
        var angle = random() * TAU;
        var radius = random() * this.r;
        return {
          x: this.pos.x + this.r + radius * cos(angle),
          y: this.pos.y + this.r + radius * sin(angle)
        };
      }.bind(res);
    }

    Object.defineProperty(res, 'x', {
      get: function() { return res.pos.x; },
      set: function(value) { res.pos.x = value; }
    });
    Object.defineProperty(res, 'y', {
      get: function() { return res.pos.y; },
      set: function(value) { res.pos.y = value; }
    });

    return res;
  };
});

// class exposed for inheritance
exports = SATShapeFactory;

// used as a singleton
var _instance = new SATShapeFactory();
exports.get = function () {
  return _instance;
};
