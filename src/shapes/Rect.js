import .Shape;
import ..utils;

var random = Math.random;

exports = Class(Shape, function (supr) {
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
    supr(this, "init", [opts]);

    /** @var {number} Rect#width */
    this.width = opts.width || 0;
    /** @var {number} Rect#height */
    this.height = opts.height || 0;

    utils.addReadOnlyObject(this, 'bounds', {
      minX: function () { return this.adjX; },
      minY: function () { return this.adjY; },
      maxX: function () { return this.adjX + this.width; },
      maxY: function () { return this.adjY + this.height; }
    });

    utils.addReadOnlyObject(this, 'center', {
      x: function () { return this.adjX + this.width / 2; },
      y: function () { return this.adjY + this.height / 2; }
    });
  };

  this.contains = function (x, y) {
    return x >= this.left && x <= this.right
      && y >= this.top && y <= this.bottom;
  };

  this.getRandomPoint = function () {
    return {
      x: this.adjX + random() * this.width,
      y: this.adjY + random() * this.height
    };
  };

  /** @func Rect#top
      @returns {number} */
  utils.addReadOnlyProperty(this, 'top', function () {
    return this.adjY;
  });

  /** @func Rect#right
      @returns {number} */
  utils.addReadOnlyProperty(this, 'right', function () {
    return this.adjX + this.width;
  });

  /** @func Rect#bottom
      @returns {number} */
  utils.addReadOnlyProperty(this, 'bottom', function () {
    return this.adjY + this.height;
  });

  /** @func Rect#left
      @returns {number} */
  utils.addReadOnlyProperty(this, 'left', function () {
    return this.adjX;
  });
});
