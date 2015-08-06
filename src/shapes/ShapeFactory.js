import ui.SpriteView as SpriteView;
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
    var viewOpts = opts.viewOpts || opts;
    if (!hitOpts.radius) {
      hitOpts.image = viewOpts.image;
      hitOpts.url = viewOpts.url;
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

    // TODO: This assumes image is a string. Should probably check for this?
    var imageId = opts.image || opts.url;
    if (!imageId) { return opts; }

    var map;

    // First check if sprite animation exists
    var spriteData = SpriteView.allAnimations[imageId];
    if (spriteData) {
      // Grab the first animation frame
      for (var prop in spriteData) {
        map = spriteData[prop][0];
        break;
      }
    } else {
      map = _imageMap[imageId];
    }

    // auto-size based on provided width and/or height
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
