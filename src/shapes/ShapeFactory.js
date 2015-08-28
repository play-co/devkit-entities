import ui.SpriteView as SpriteView;
import ui.resource.loader as loader;
var _imageMap = loader.getMap();

import .Rect;
import .Circle;

/**
 * This singleton class creates and returns shapes and default entity opts based on provided opts.image or opts.url paths and dimensions
 * @class ShapeFactory
 */
var ShapeFactory = Class(function () {
  /**
   * Returns a new {@link Circle} or {@link Rect} based on provided opts; also applies defaults width and height if necessary
   * @method ShapeFactory#getShape
   * @arg {object} opts
   * @returns {Shape}
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
   * Adds width and height to an opts object if not defined based on image or sprite url
   * @method ShapeFactory#applyImageDimensions
   * @arg {object} opts
   * @returns {object}
   */
  this.applyImageDimensions = function (opts) {
    if (!opts) {
      return null;
    }

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
