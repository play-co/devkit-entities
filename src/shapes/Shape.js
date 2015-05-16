import ..utils;

var readOnlyProp = utils.addReadOnlyProperty;

exports = Class(function () {
  this.name = "Shape";

  /**
    * @class Shape
    * @param {Object} [opts]
    * @param {Number} [opts.x=0]
    * @param {Number} [opts.y=0]
    */
  this.init = function (opts) {
    opts = opts || {};

    /** @var {number} Shape#x */
    this.x = opts.x || 0;
    /** @var {number} Shape#y */
    this.y = opts.y || 0;
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
    * returns if arg x and y are on the shape
    * @func Shape#contains
    * @arg {Number} x
    * @arg {Number} y
    * @returns {Boolean} result
    */
  this.contains = function (x, y) {
    return x === this.x && y === this.y;
  };

  /**
    * Returns a random point from somewhere on this shape
    * @func Shape#getRandomPoint
    * @arg {Point} result - Point to use for storing data on.
    * @returns {Point} result
    */
  this.getRandomPoint = function () {
    return {
      x: this.x,
      y: this.y
    };
  };

  /**
    * Find the nearest point which is on the shape
    * @func Shape#getNearestPoint
    * @arg {Number} x
    * @arg {Number} y
    * @returns {Object} result
    * @returns {Number} result.x
    * @returns {Number} result.y
    * @returns {Number} result.dx
    * @returns {Number} result.dy
    * @todo not yet implemented
    */
  // this.getNearestPoint = function(x, y) {};
});
