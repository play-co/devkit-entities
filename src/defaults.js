import ui.resource.loader as loader;
var _imageMap = loader.getMap();

/**
 * Entity Defaults
 * TODO: return point and vector classes, perhaps from js.io Math.geom?
 */

exports = {
  getPoint: function () {
    return { x: 0, y: 0 };
  },
  getVector: function () {
    return { x: 0, y: 0 };
  },
  getBounds: function (config) {
    var bounds = {
      x: 0,
      y: 0,
      radius: 0,
      width: 0,
      height: 0
    };

    // default bounds to image or sprite frame size if available from config
    if (config) {
      var img = config.image;
      var url = config.url;
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
        bounds.width = map.w + map.marginLeft + map.marginRight;
        bounds.height = map.h + map.marginTop + map.marginBottom;
        bounds.radius = (bounds.width + bounds.height) / 4;
      }
    }

    return bounds;
  }
};
