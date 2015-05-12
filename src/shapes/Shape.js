import ..utils;

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

    this.offsetX = opts.offsetX || 0;
    this.offsetY = opts.offsetY || 0;

    utils.addReadOnlyProperty(this, 'adjX', function() { return this.x + this.offsetX; });
    utils.addReadOnlyProperty(this, 'adjY', function() { return this.y + this.offsetY; });

    // TODO: make the bounds properties on the shape, nothing is really gained from having
    //         one more dot in the way
    /**
     * @var {Object} Shape#bounds
     * @property {Number} minX
     * @property {Number} minY
     * @property {Number} maxX
     * @property {Number} maxY
     * @readOnly
     */
    utils.addReadOnlyObject(this, 'bounds', {
      minX: function () { return this.adjX; },
      minY: function () { return this.adjY; },
      maxX: function () { return this.adjX; },
      maxY: function () { return this.adjY; }
    });

    /**
     * @var {Object} Shape#center
     * @property {Number} x
     * @property {Number} y
     * @readOnly
     */
    utils.addReadOnlyObject(this, 'center', {
      x: function () { return this.adjX; },
      y: function () { return this.adjY; }
    });
  };

  /**
    * returns if arg x and y are on the shape
    * @func Shape#contains
    * @arg {Number} x
    * @arg {Number} y
    * @returns {Boolean} result
    */
  this.contains = function(x, y) {
    return x === this.adjX && y === this.adjY;
  };

  /**
    * Returns a random point from somewhere on this shape
    * @func Shape#getRandomPoint
    * @arg {Point} result - Point to use for storing data on.
    * @returns {Point} result
    */
  this.getRandomPoint = function () {
    return {
      x: this.adjX,
      y: this.adjY
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

  // this.translate = function(dx, dy) {};
  // this.rotate = function(deg, anchorX, anchorY) {};
  // this.scale = function(dScale, anchorX, anchorY) {};
});
