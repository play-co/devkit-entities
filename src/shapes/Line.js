import .Shape;
import ..utils;

var min = Math.min;
var max = Math.max;
var random = Math.random;

exports = Class(Shape, function (supr) {
  this.name = "Line";

  /**
    * Must define either {@link x2}, {@link y2}, or both.
    * @class Line
    * @extends Shape
    * @arg {Object} [opts]
    * @arg {number} [opts.x2]
    * @arg {number} [opts.y2]
    */
  this.init = function (opts) {
    opts = opts || {};
    supr(this, 'init', [opts]);

    /** The endpoint for this line
        @var {number} Shape#x2 */
    this.x2 = (opts.x2 !== undefined) ? opts.x2 : this.x;
    /** The endpoint for this line
        @var {number} Shape#y2 */
    this.y2 = (opts.y2 !== undefined) ? opts.y2 : this.y;

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

  // TODO: test to see if this works
  this.contains = function(x, y) {
    // if this is vertical
    if (this.x === this.x2) {
      return x === this.x
          && y >= Math.min(this.y, this.y2)
          && y <= Math.max(this.y, this.y2);
    }
    // if this is horizonal
    if (this.y === this.y2) {
      return y === this.y
          && x >= Math.min(this.x, this.x2)
          && x <= Math.max(this.x, this.x2);
    }
    // match the gradients
    return (this.x - x) * (this.y - y) === (x - this.x2) * (y - this.y2);
  };

  this.getRandomPoint = function () {
    var dx = this.x2 - this.x;
    var dy = this.y2 - this.y;
    var rand = random();
    return {
      x: this.x + rand * dx,
      y: this.y + rand * dy
    };
  };
});
