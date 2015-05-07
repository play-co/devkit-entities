import .Shape;
import ..utils;

var min = Math.min;
var max = Math.max;
var random = Math.random;

/**
 * Line Class - inherits Shape
 */
exports = Class(Shape, function () {
  this.name = "Line";

  this.init = function (opts) {
    this.x = opts.x || 0;
    this.y = opts.y || 0;
    this.x2 = opts.x2 || 0;
    this.y2 = opts.y2 || 0;

    utils.addReadOnlyObject(this, 'bounds', {
      minX: function () { return min(this.x, this.x2); },
      minY: function () { return min(this.y, this.y2); },
      maxX: function () { return max(this.x, this.x2); },
      maxY: function () { return max(this.y, this.y2); }
    });

    utils.addReadOnlyObject(this, 'center', {
      x: function () { return (this.x + this.x2) / 2; },
      y: function () { return (this.y + this.y2) / 2; }
    });
  };

  this.getRandomPoint = function () {
    var dx = this.x2 - this.x;
    var dy = this.y2 - this.y;
    return {
      x: this.x + random() * dx,
      y: this.y + random() * dy
    };
  };
});
