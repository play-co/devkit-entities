import .Shape;
import ..utils;

var PI = Math.PI;
var TAU = 2 * PI;
var sin = Math.sin;
var cos = Math.cos;
var random = Math.random;

/**
 * Circle Class - inherits Shape
 */
exports = Class(Shape, function () {
  this.name = "Circle";

  this.init = function (opts) {
    this.x = opts.x || 0;
    this.y = opts.y || 0;
    this.radius = opts.radius || 0;

    utils.addReadOnlyObject(this, 'bounds', {
      minX: function () { return this.x; },
      minY: function () { return this.y; },
      maxX: function () { return this.x + 2 * this.radius; },
      maxY: function () { return this.y + 2 * this.radius; }
    });

    utils.addReadOnlyObject(this, 'center', {
      x: function () { return this.x + this.radius; },
      y: function () { return this.y + this.radius; }
    });
  };

  this.getRandomPoint = function () {
    var angle = random() * TAU;
    var radius = random() * this.radius;
    return {
      x: this.x + this.radius + radius * cos(angle),
      y: this.y + this.radius + radius * sin(angle)
    };
  };
});
