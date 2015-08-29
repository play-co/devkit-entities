import .Shape;
import ..utils;

var min = Math.min;
var max = Math.max;
var random = Math.random;
var readOnlyProp = utils.addReadOnlyProperty;

/**
 * This class represenets a line segment shape
 * @class Line
 * @extends Shape
 */
exports = Class(Shape, function () {
  var supr = Shape.prototype;

  /** @var {string} Line#name */
  this.name = "Line";

  /**
   * Constructs Line; called automatically when a new instance is created
   * @method Line#init
   * @arg {object} [opts]
   * @arg {number} [opts.x2]
   * @arg {number} [opts.y2]
   */
  this.init = function (opts) {
    opts = opts || {};
    supr.init.call(this, opts);

    /** The x-coordinate of the endpoint for this line
        @var {number} Line#x2 */
    this.x2 = (opts.x2 !== undefined) ? opts.x2 : this.x;
    /** The y-coordinate of the endpoint for this line
        @var {number} Line#y2 */
    this.y2 = (opts.y2 !== undefined) ? opts.y2 : this.y;
  };

  /** @var {number} Line#minX
      @readOnly */
  readOnlyProp(this, 'minX', function () { return min(this.x, this.x2); });
  /** @var {number} Line#maxX
      @readOnly */
  readOnlyProp(this, 'maxX', function () { return max(this.x, this.x2); });
  /** @var {number} Line#minY
      @readOnly */
  readOnlyProp(this, 'minY', function () { return min(this.y, this.y2); });
  /** @var {number} Line#maxY
      @readOnly */
  readOnlyProp(this, 'maxY', function () { return max(this.y, this.y2); });

  /** @var {number} Line#centerX
      @readOnly */
  readOnlyProp(this, 'centerX', function () { return (this.x + this.x2) / 2; });
  /** @var {number} Line#centerY
      @readOnly */
  readOnlyProp(this, 'centerY', function () { return (this.y + this.y2) / 2; });

  /**
   * Returns whether or not the provided point lies on the line
   * @method Line#contains
   * @arg {number} x
   * @arg {number} y
   * @returns {boolean}
   */
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

  /**
   * Returns a random point from on the line
   * @method Line#getRandomPoint
   * @returns {Point}
   */
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
