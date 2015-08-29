import .Shape;
import ..utils;

var random = Math.random;
var readOnlyProp = utils.addReadOnlyProperty;

/**
 * This class represenets an axis-aligned rectangle shape
 * @class Rect
 * @extends Shape
 */
exports = Class(Shape, function () {
  var supr = Shape.prototype;

  /** @var {string} Rect#name */
  this.name = "Rect";

  /**
   * Constructs Rect; called automatically when a new instance is created
   * @method Rect#init
   * @arg {object} [opts]
   * @arg {number} [opts.width=0]
   * @arg {number} [opts.height=0]
   */
  this.init = function (opts) {
    opts = opts || {};
    supr.init.call(this, opts);

    /** @var {number} Rect#width */
    this.width = opts.width || 0;
    /** @var {number} Rect#height */
    this.height = opts.height || 0;
  };

  /** @var {number} Rect#minX
      @readOnly */
  readOnlyProp(this, 'minX', function () { return this.x; });
  /** @var {number} Rect#maxX
      @readOnly */
  readOnlyProp(this, 'maxX', function () { return this.x + this.width; });
  /** @var {number} Rect#minY
      @readOnly */
  readOnlyProp(this, 'minY', function () { return this.y; });
  /** @var {number} Rect#maxY
      @readOnly */
  readOnlyProp(this, 'maxY', function () { return this.y + this.height; });

  /** @var {number} Rect#centerX
      @readOnly */
  readOnlyProp(this, 'centerX', function () { return this.x + this.width / 2; });
  /** @var {number} Rect#centerY
      @readOnly */
  readOnlyProp(this, 'centerY', function () { return this.y + this.height / 2; });

  /** @var {number} Rect#top
      @readOnly */
  readOnlyProp(this, 'top', function () { return this.y; });
  /** @var {number} Rect#right
      @readOnly */
  readOnlyProp(this, 'right', function () { return this.x + this.width; });
  /** @var {number} Rect#bottom
      @readOnly */
  readOnlyProp(this, 'bottom', function () { return this.y + this.height; });
  /** @var {number} Rect#left
      @readOnly */
  readOnlyProp(this, 'left', function () { return this.x; });

  /**
   * Returns whether or not the provided point lies within the rectangle
   * @method Rect#contains
   * @arg {number} x
   * @arg {number} y
   * @returns {boolean}
   */
  this.contains = function (x, y) {
    return x >= this.left && x <= this.right && y >= this.top && y <= this.bottom;
  };

  /**
   * Returns a random point from within the rectangle
   * @method Rect#getRandomPoint
   * @returns {Point}
   */
  this.getRandomPoint = function () {
    return {
      x: this.x + random() * this.width,
      y: this.y + random() * this.height
    };
  };
});
