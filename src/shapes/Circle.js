import .Shape;
import ..utils;

var PI = Math.PI;
var TAU = 2 * PI;
var sin = Math.sin;
var cos = Math.cos;
var sqrt = Math.sqrt;
var random = Math.random;
var readOnlyProp = utils.addReadOnlyProperty;

/**
 * This class represenets a circle shape
 * @class Circle
 * @extends Shape
 */
exports = Class(Shape, function () {
  var supr = Shape.prototype;

  /** @var {string} Circle#name */
  this.name = "Circle";

  /**
   * Constructs Circle; called automatically when a new instance is created
   * @method Circle#init
   * @arg {object} [opts]
   * @arg {number} [opts.radius=0]
   */
  this.init = function (opts) {
    opts = opts || {};
    supr.init.call(this, opts);

    /** @var {number} Circle#radius */
    this.radius = opts.radius || 0;
  };

  /** @var {number} Circle#minX
      @readOnly */
  readOnlyProp(this, 'minX', function () { return this.x - this.radius; });
  /** @var {number} Circle#maxX
      @readOnly */
  readOnlyProp(this, 'maxX', function () { return this.x + this.radius; });
  /** @var {number} Circle#minY
      @readOnly */
  readOnlyProp(this, 'minY', function () { return this.y - this.radius; });
  /** @var {number} Circle#maxY
      @readOnly */
  readOnlyProp(this, 'maxY', function () { return this.y + this.radius; });

  /** @var {number} Circle#centerX
      @readOnly */
  readOnlyProp(this, 'centerX', function () { return this.x; });
  /** @var {number} Circle#centerY
      @readOnly */
  readOnlyProp(this, 'centerY', function () { return this.y; });

  /**
   * Returns whether or not the provided point lies within the circle
   * @method Circle#contains
   * @arg {number} x
   * @arg {number} y
   * @returns {boolean}
   */
  this.contains = function(x, y) {
    var dx = x - this.x;
    var dy = y - this.y;
    var dist = sqrt(dx * dx + dy * dy);
    return dist <= this.radius;
  };

  /**
   * Returns a random point from within the circle
   * @method Circle#getRandomPoint
   * @returns {Point}
   */
  this.getRandomPoint = function () {
    var angle = random() * TAU;
    var radius = random() * this.radius;
    return {
      x: this.x + radius * cos(angle),
      y: this.y + radius * sin(angle)
    };
  };
});
