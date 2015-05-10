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
    supr(this, 'init', [opts]);

    /** The endpoint for this line
        @var {number} Shape#x2 */
    this.x2 = (opts.x2 !== undefined) ? opts.x2 : this.x;
    /** The endpoint for this line
        @var {number} Shape#y2 */
    this.y2 = (opts.y2 !== undefined) ? opts.y2 : this.y;

    utils.addReadOnlyProperty(this, 'adjX2', function() { return this.x2 + this.offsetX; });
    utils.addReadOnlyProperty(this, 'adjY2', function() { return this.y2 + this.offsetY; });

    utils.addReadOnlyObject(this, 'bounds', {
      minX: function () { return min(this.adjX, this.adjX2); },
      minY: function () { return min(this.adjY, this.adjY2); },
      maxX: function () { return max(this.adjX, this.adjX2); },
      maxY: function () { return max(this.adjY, this.adjY2); }
    });

    utils.addReadOnlyObject(this, 'center', {
      x: function () { return (this.adjX + this.adjX2) / 2; },
      y: function () { return (this.adjY + this.adjY2) / 2; }
    });
  };

  // TODO: test to see if this works
  this.contains = function(x, y) {
    // if this is vertical
    if (this.x === this.x2) {
      return x === this.adjX
          && y >= Math.min(this.adjY, this.adjY2)
          && y <= Math.max(this.adjY, this.adjY2);
    }
    // if this is horizonal
    if (this.y === this.y2) {
      return y === this.adjY
          && x >= Math.min(this.adjX, this.adjX2)
          && x <= Math.max(this.adjX, this.adjX2);
    }
    // match the gradients
    return (this.adjX - x) * (this.adjY - y) === (x - this.adjX2) * (y - this.adjY2);
  };

  this.getRandomPoint = function () {
    var dx = this.adjX2 - this.adjX;
    var dy = this.adjY2 - this.adjY;
    var rand = random();
    return {
      x: this.adjX + rand * dx,
      y: this.adjY + rand * dy
    };
  };
});
