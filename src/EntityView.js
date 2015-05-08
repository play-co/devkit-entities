import ui.ImageView as ImageView;
import ui.SpriteView as SpriteView;

import .utils;

// entities module image path (for showing hit bounds)
var IMG_PATH = "addons/devkit-entities/images/";

exports = Class(SpriteView, function () {
  var supr = SpriteView.prototype;

  this.name = "EntityView";

  this.init = function (opts) {
    opts.autoSize = true;
    opts.tag = opts.tag || opts.entity.uid;
    this._entity = opts.entity;

    this._validateSprite(opts);
    if (!this.isSprite) {
      opts.image = opts.image || opts.url;
    }

    supr.init.call(this, opts);
  };

  this.reset = function (opts) {
    var s = this.style;
    var m = this._entity.model;
    var b = opts.viewBounds || m._physics.shapeFactory.applyDefaultBounds(opts);
    s.x = m.x;
    s.y = m.y;
    s.offsetX = opts.offsetX || s.offsetX || 0;
    s.offsetY = opts.offsetY || s.offsetY || 0;
    s.anchorX = opts.anchorX || s.anchorX || 0;
    s.anchorY = opts.anchorY || s.anchorY || 0;
    s.width = opts.width || b.width || s.width;
    s.height = opts.height || b.height || s.height;
    s.zIndex = opts.zIndex !== void 0 ? opts.zIndex : s.zIndex;
    s.visible = true;

    this.resetAllAnimations(opts);
  };

  this.update = function (dt) {
    var s = this.style;
    var m = this._entity.model;
    s.x = m.x;
    s.y = m.y;
  };

  /**
   * SpriteView Extensions
   */

  this.resetAllAnimations = function (opts) {
    this._validateSprite(opts);

    if (this.isSprite) {
      supr.resetAllAnimations.call(this, opts);
      this.setImage(this._animations[opts.defaultAnimation].frames[0]);
    } else {
      // setImage is expensive, so only call it if we have to
      var image = opts.image || opts.url;
      if (image && this.setImage && this._currImage !== image) {
        this.setImage(image);
        this._currImage = image;
      }
    }
  };

  this.startAnimation = function (name, opts) {
    if (this.isSprite && this._animations[name]) {
      supr.startAnimation.call(this, name, opts);
    }
  };

  this._validateSprite = function(opts) {
    this.isSprite = !!SpriteView.allAnimations[opts.url];
  };

  /**
   * Helpers
   */

  utils.addReadOnlyProperty(this, 'minX', function () {
   var s = this.style;
   return s.x + s.offsetX;
  });

  utils.addReadOnlyProperty(this, 'maxX', function () {
   var s = this.style;
   return s.x + s.offsetX + s.width;
  });

  utils.addReadOnlyProperty(this, 'minY', function () {
   var s = this.style;
   return s.y + s.offsetY;
  });

  utils.addReadOnlyProperty(this, 'maxY', function () {
   var s = this.style;
   return s.y + s.offsetY + s.height;
  });

  Object.defineProperty(this, 'width', {
    enumerable: true,
    get: function () { return this.style.width; },
    set: function (value) { this.style.width = value; }
  });

  Object.defineProperty(this, 'height', {
    enumerable: true,
    get: function () { return this.style.height; },
    set: function (value) { this.style.height = value; }
  });

  Object.defineProperty(this, 'visible', {
    enumerable: true,
    get: function () { return this.style.visible; },
    set: function (value) { this.style.visible = value; }
  });

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
    var m = this._entity.model;
    var shape = m.shape;
    var hbvs = this.hitBoundsView.style;
    if (shape.radius !== undefined) {
      var r = shape.radius;
      hbvs.x = -s.offsetX - r;
      hbvs.y = -s.offsetY - r;
      hbvs.width = 2 * r;
      hbvs.height = 2 * r;
      this.hitBoundsView.setImage(IMG_PATH + "shapeCircle.png");
    } else {
      hbvs.x = -s.offsetX + shape.x;
      hbvs.y = -s.offsetY + shape.y;
      hbvs.width = shape.width;
      hbvs.height = shape.height;
      this.hitBoundsView.setImage(IMG_PATH + "shapeRect.png");
    }
  };

  this.hideHitBounds = function () {
    if (this.hitBoundsView) {
      this.hitBoundsView.style.visible = false;
    }
  };

});
