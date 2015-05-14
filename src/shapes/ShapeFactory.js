import ui.resource.loader as loader;
var _imageMap = loader.getMap();

import math.geom.Point as Point;
import math.geom.Vec2D as Vec2D;

import .Shape;
import .Rect;
import .Circle;

exports = Class(function () {
  /**
   * returns a new shape
   */
  this.getShape = function (opts) {
    if (!opts) {
      return new Shape();
    }

    if (opts.radius === undefined
        && (opts.width === undefined || opts.height === undefined))
    {
      this.applyDefaultBounds(opts);
    }

    if (opts.radius !== undefined) {
      return new Circle(opts);
    } else {
      return new Rect(opts);
    }
  };

  /**
   * returns a hit bounds object with defaults based on image or sprite url
   */
  this.applyDefaultBounds = function (opts) {
    // default bounds to image or sprite frame size if available from opts
    if (!opts) {
      return null;
    }

    var img = opts.image;
    var url = opts.url;
    if (!img && url) {
      // support SpriteViews by finding the first animation match for url
      for (var prop in _imageMap) {
        if (prop.indexOf(url) >= 0) {
          img = prop;
          break;
        }
      }
    }

    var map = _imageMap[img];
    if (map) {
      opts.width = opts.width || (map.w + map.marginLeft + map.marginRight);
      opts.height = opts.height || (map.h + map.marginTop + map.marginBottom);
    }

    return opts;
  };
});
