import .Shape;
import ..utils;

var random = Math.random;

/**
 * Rect Class - inherits Shape
 */
exports = Class(Shape, function () {
  this.name = "Rect";

  this.init = function (opts) {
    this.x = opts.x || 0;
    this.y = opts.y || 0;
    this.width = opts.width || 0;
    this.height = opts.height || 0;

    utils.addReadOnlyObject(this, 'bounds', {
      minX: function () { return this.x; },
      minY: function () { return this.y; },
      maxX: function () { return this.x + this.width; },
      maxY: function () { return this.y + this.height; }
    });

    utils.addReadOnlyObject(this, 'center', {
      x: function () { return this.x + this.width / 2; },
      y: function () { return this.y + this.height / 2; }
    });
  };

  this.getRandomPoint = function () {
    return {
      x: this.x + random() * this.width,
      y: this.y + random() * this.height
    };
  };

  utils.addReadOnlyProperty(this, 'top', function () {
    return this.y;
  });

  utils.addReadOnlyProperty(this, 'right', function () {
    return this.x + this.width;
  });

  utils.addReadOnlyProperty(this, 'bottom', function () {
    return this.y + this.height;
  });

  utils.addReadOnlyProperty(this, 'left', function () {
    return this.x;
  });
});
