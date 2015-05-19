import ui.resource.loader as loader;
var _imageMap = loader.getMap();

import .Rect;
import .Circle;

var ShapeFactory = Class(function () {
  /**
   * returns a new shape
   */
  this.getShape = function (opts) {
    var hitOpts = opts.hitOpts;
    if (!hitOpts.radius) {
      hitOpts.image = opts.image || viewOpts.image;
      hitOpts.url = opts.url || viewOpts.url;
      this.applyImageDimensions(hitOpts);
    }

    if (hitOpts.radius) {
      return new Circle(hitOpts);
    } else {
      return new Rect(hitOpts);
    }
  };

  /**
   * returns a hit bounds object with defaults based on image or sprite url
   */
  this.applyImageDimensions = function (opts) {
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

    // auto-size based on provided width and/or height
    var map = _imageMap[img || url];
    if (map) {
      var imgWidth = map.w + map.marginLeft + map.marginRight;
      var imgHeight = map.h + map.marginTop + map.marginBottom;
      if (!opts.width && !opts.height) {
        opts.width = imgWidth;
        opts.height = imgHeight;
      } else if (!opts.width) {
        var scale = opts.height / imgHeight;
        opts.width = scale * imgWidth;
      } else if (!opts.height) {
        var scale = opts.width / imgWidth;
        opts.height = scale * imgHeight;
      }
    }

    return opts;
  };
});

// class exposed for inheritance
exports = ShapeFactory;

// used as a singleton
var _instance = new ShapeFactory();
exports.get = function () {
  return _instance;
};
