import ui.resource.loader as loader;
var _imageMap = loader.getMap();

import math.geom.Point as Point;
import math.geom.Vec2D as Vec2D;

exports = Class(function () {
  /**
   * returns a new shape
   */
  this.getShape = function (opts) {
    if (opts
        && opts.radius === undefined
        && (opts.width === undefined || opts.height === undefined)) {
      this.applyDefaultBounds(opts);
    }

    if (opts && opts.radius !== undefined) {
      return new Circle(opts);
    } else if (opts) {
      return new Rect(opts);
    } else {
      return new Shape();
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
      opts.radius = opts.radius || (opts.width + opts.height) / 4;
    }
  };
});