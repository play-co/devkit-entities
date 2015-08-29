import ..utils;

var readOnlyProp = utils.addReadOnlyProperty;

/**
 * This class represenets a basic shapes API to be extended
 * @class Shape
 */
exports = Class(function () {
  /** @var {string} Shape#name */
  this.name = "Shape";

  /**
   * Constructs Shape; called automatically when a new instance is created
   * @method Shape#init
   * @arg {object} [opts]
   * @arg {number} [opts.x=0]
   * @arg {number} [opts.y=0]
   * @arg {boolean} [opts.fixed=false] - Whether or not the shape can be moved by collisions
   */
  this.init = function (opts) {
    opts = opts || {};

    /** @var {number} Shape#x */
    this.x = opts.x || 0;
    /** @var {number} Shape#y */
    this.y = opts.y || 0;
    /**
     * Whether or not this shape can be moved by physics
     * @var {boolean} Shape#fixed
     */
    this.fixed = opts.fixed || false;
  };

  /** @var {number} Shape#minX
      @readOnly */
  readOnlyProp(this, 'minX', function () { return this.x; });
  /** @var {number} Shape#maxX
      @readOnly */
  readOnlyProp(this, 'maxX', function () { return this.x; });
  /** @var {number} Shape#minY
      @readOnly */
  readOnlyProp(this, 'minY', function () { return this.y; });
  /** @var {number} Shape#maxY
      @readOnly */
  readOnlyProp(this, 'maxY', function () { return this.y; });

  /** @var {number} Shape#centerX
      @readOnly */
  readOnlyProp(this, 'centerX', function () { return this.x; });
  /** @var {number} Shape#centerY
      @readOnly */
  readOnlyProp(this, 'centerY', function () { return this.y; });

  /**
   * Returns whether or not the provided point lies within the shape
   * @method Shape#contains
   * @arg {number} x
   * @arg {number} y
   * @returns {boolean}
   */
  this.contains = function (x, y) {
    return x === this.x && y === this.y;
  };

  /**
   * Returns a random point from within the shape
   * @method Shape#getRandomPoint
   * @returns {Point}
   */
  this.getRandomPoint = function () {
    return {
      x: this.x,
      y: this.y
    };
  };
});
