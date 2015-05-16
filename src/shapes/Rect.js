import .Shape;
import ..utils;

var random = Math.random;
var readOnlyProp = utils.addReadOnlyProperty;

exports = Class(Shape, function () {
  var supr = Shape.prototype;

  this.name = "Rect";

  /**
    * @class Rect
    * @extends Shape
    *
    * @arg {Object} [opts]
    * @arg {Number} [opts.x]
    * @arg {Number} [opts.y]
    * @arg {Number} [opts.width=0]
    * @arg {Number} [opts.height=0]
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

  this.contains = function (x, y) {
    return x >= this.left && x <= this.right && y >= this.top && y <= this.bottom;
  };

  this.getRandomPoint = function () {
    return {
      x: this.x + random() * this.width,
      y: this.y + random() * this.height
    };
  };
});
