import .Shape;
import ..utils;

var PI = Math.PI;
var TAU = 2 * PI;
var sin = Math.sin;
var cos = Math.cos;
var random = Math.random;
var sqrt = Math.sqrt;

/**
 * Circle Class - inherits Shape
 */
exports = Class(Shape, function (supr) {
  this.name = "Circle";

  this.init = function (opts) {
    supr(this, 'init', [opts]);

    this.radius = opts.radius || 0;

    utils.addReadOnlyObject(this, 'bounds', {
      minX: function () { return this.adjX - this.radius; },
      minY: function () { return this.adjY - this.radius; },
      maxX: function () { return this.adjX + this.radius; },
      maxY: function () { return this.adjY + this.radius; }
    });

    utils.addReadOnlyObject(this, 'center', {
      x: function () { return this.adjX + this.radius; },
      y: function () { return this.adjY + this.radius; }
    });
  };

  this.contains = function(x, y) {
    var dx = x - this.adjX;
    var dy = y - this.adjY;
    var dist = sqrt(dx * dx + dy * dy);
    return dist <= this.radius;
  };

  this.getRandomPoint = function () {
    var angle = random() * TAU;
    var radius = random() * this.radius;
    return {
      x: this.adjX + this.radius + radius * cos(angle),
      y: this.adjY + this.radius + radius * sin(angle)
    };
  };
});
