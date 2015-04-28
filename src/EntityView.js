import ui.ImageView as ImageView;
import ui.SpriteView as SpriteView;

// entities module image path (for showing hit bounds)
var IMG_PATH = "addons/devkit-entities/images/";

exports = Class(SpriteView, function () {
  var supr = SpriteView.prototype;

  this.init = function (opts) {
    opts.tag = opts.tag || this.uid;
    supr.init.call(this, opts);

    this.entity = opts.entity;
  };

  this.reset = function (opts) {
    var s = this.style;
    var m = this.entity.model;
    var b = opts.viewBounds || m.physics.getBounds(opts);
    s.x = m.getX();
    s.y = m.getY();
    s.offsetX = opts.offsetX || s.offsetX || 0;
    s.offsetY = opts.offsetY || s.offsetY || 0;
    s.width = opts.width || b.width || s.width;
    s.height = opts.height || b.height || s.height;
    s.zIndex = opts.zIndex !== void 0 ? opts.zIndex : s.zIndex;
    s.visible = true;

    // setImage is expensive, so only call it if we have to
    var image = opts.image;
    if (image && this.setImage && this.currImage !== image) {
      this.setImage(image);
      this.currImage = image;
    }
  };

  this.update = function (dt) {
    var s = this.style;
    var m = this.entity.model;
    s.x = m.getX();
    s.y = m.getY();
  };

  this.getMinX = function () {
    var s = this.style;
    return s.x + s.offsetX;
  };

  this.getMaxX = function () {
    var s = this.style;
    return s.x + s.offsetX + s.width;
  };

  this.getMinY = function () {
    var s = this.style;
    return s.y + s.offsetY;
  };

  this.getMaxY = function () {
    var s = this.style;
    return s.y + s.offsetY + s.height;
  };

  this.getWidth = function () {
    return this.style.width;
  };

  this.getHeight = function () {
    return this.style.height;
  };

  /**
   * Debugging Utilities
   */

  this.showHitBounds = function () {
    if (!this.hitBoundsView) {
      this.hitBoundsView = new ImageView({ parent: this });
    } else {
      this.hitBoundsView.style.visible = true;
    }

    var s = this.style;
    var m = this.entity.model;
    var hbvs = this.hitBoundsView.style;
    if (m.circle) {
      var r = m.getHitRadius();
      hbvs.x = -s.offsetX - r;
      hbvs.y = -s.offsetY - r;
      hbvs.width = 2 * r;
      hbvs.height = 2 * r;
      this.hitBoundsView.setImage(IMG_PATH + "shapeCircle.png");
    } else {
      hbvs.x = -s.offsetX + m.getMinHitX();
      hbvs.y = -s.offsetY + m.getMinHitY();
      hbvs.width = m.getHitWidth();
      hbvs.height = m.getHitHeight();
      this.hitBoundsView.setImage(IMG_PATH + "shapeRect.png");
    }
  };

  this.hideHitBounds = function () {
    if (this.hitBoundsView) {
      this.hitBoundsView.style.visible = false;
    }
  };

});
