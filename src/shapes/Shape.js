import ..utils;

/**
 * Shape Base Class
 */
exports = Class(function () {
  this.name = "Shape";

  this.init = function (opts) {
    this.x = opts.x || 0;
    this.y = opts.y || 0;

    utils.addReadOnlyObject(this, 'bounds', {
      minX: function () { return this.x; },
      minY: function () { return this.y; },
      maxX: function () { return this.x; },
      maxY: function () { return this.y; }
    });

    utils.addReadOnlyObject(this, 'center', {
      x: function () { return this.x; },
      y: function () { return this.y; }
    });
  };

  this.contains = function(x, y) {
    return x === this.x && y === this.y;
  };

  this.getRandomPoint = function () {
    return {
      x: this.x,
      y: this.y
    };
  };
});

/*

Shape Interface
- name: i.e. "Circle" or "Rect"
- x: x-coordinate
- y: y-coordinate
- bounds: read-only object w minX, minY, maxX, maxY properties
- center: read-only object w x and y properties
- getRandomPoint: returns a random point within the shape
- contains: returns if arg x and y are on the shape

Shape Interface (Maybe TODO)
- translate
- rotate
- scale

*/
