import .Shape;
import ..utils;

var min = Math.min;
var max = Math.max;
var random = Math.random;
var readOnlyProp = utils.addReadOnlyProperty;

exports = Class(Shape, function () {
  var supr = Shape.prototype;

  this.name = "Line";

  /**
    * Must define either {@link x2}, {@link y2}, or both.
    * @class Line
    * @extends Shape
    * @arg {Object} [opts]
    * @arg {Number} [opts.x]
    * @arg {Number} [opts.y]
    * @arg {Number} [opts.x2]
    * @arg {Number} [opts.y2]
    */
  this.init = function (opts) {
    opts = opts || {};
    supr.init.call(this, opts);

    /** The x-coordinate of the endpoint for this line
        @var {Number} Line#x2 */
    this.x2 = (opts.x2 !== undefined) ? opts.x2 : this.x;
    /** The y-coordinate of the endpoint for this line
        @var {Number} Line#y2 */
    this.y2 = (opts.y2 !== undefined) ? opts.y2 : this.y;
  };

  /** @var {Number} Line#minX
      @readOnly */
  readOnlyProp(this, 'minX', function () { return min(this.x, this.x2); });
  /** @var {Number} Line#maxX
      @readOnly */
  readOnlyProp(this, 'maxX', function () { return max(this.x, this.x2); });
  /** @var {Number} Line#minY
      @readOnly */
  readOnlyProp(this, 'minY', function () { return min(this.y, this.y2); });
  /** @var {Number} Line#maxY
      @readOnly */
  readOnlyProp(this, 'maxY', function () { return max(this.y, this.y2); });

  /** @var {Number} Line#centerX
      @readOnly */
  readOnlyProp(this, 'centerX', function () { return (this.x + this.x2) / 2; });
  /** @var {Number} Line#centerY
      @readOnly */
  readOnlyProp(this, 'centerY', function () { return (this.y + this.y2) / 2; });

  this.contains = function (x, y) {
    // vertical, horizontal, or otherwise?
    if (this.x === this.x2) {
      return x === this.x && y >= this.minY && y <= this.maxY;
    } else if (this.y === this.y2) {
      return y === this.y && x >= this.minX && x <= this.maxX;
    } else {
      return (this.x - x) * (this.y - y) === (x - this.x2) * (y - this.y2);
    }
  };

  this.getRandomPoint = function () {
    var dx = this.x2 - this.x;
    var dy = this.y2 - this.y;
    var pct = random();
    return {
      x: this.x + pct * dx,
      y: this.y + pct * dy
    };
  };
});
