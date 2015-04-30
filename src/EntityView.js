import ui.ImageView as ImageView;
import ui.SpriteView as SpriteView;

// entities module image path (for showing hit bounds)
var IMG_PATH = "addons/devkit-entities/images/";

exports = Class(SpriteView, function () {
  var supr = SpriteView.prototype;

  this.init = function (opts) {
    opts.autoSize = true;
    opts.tag = opts.tag || opts.entity.uid;
    this.entity = opts.entity;

    this.validateSprite(opts);
    if (!this.isSprite) {
      opts.image = opts.image || opts.url;
    }

    this._bindEntity(this.entity);

    supr.init.call(this, opts);
  };

  /**
   * ~ _bindEntity modifies the entity instance for convenient access to view
   *   properties and behavior
   */
  this._bindEntity = function (entity) {
    var view = this;

    // expose useful view functions
    entity.getViewMinX = bind(view, 'getMinX');
    entity.getViewMaxX = bind(view, 'getMaxX');
    entity.getViewMinY = bind(view, 'getMinY');
    entity.getViewMaxY = bind(view, 'getMaxY');
    entity.getViewWidth = bind(view, 'getWidth');
    entity.getViewHeight = bind(view, 'getHeight');
    entity.isVisible = bind(view, 'isVisible');
    entity.showHitBounds = bind(view, 'showHitBounds');
    entity.hideHitBounds = bind(view, 'hideHitBounds');
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

  /**
   * SpriteView Extensions
   */

  this.resetAllAnimations = function (opts) {
    this.validateSprite(opts);

    if (this.isSprite) {
      supr.resetAllAnimations.call(this, opts);
      this.setImage(this._animations[opts.defaultAnimation].frames[0]);
    } else {
      this.setImage(opts.image || opts.url);
    }
  };

  this.startAnimation = function (name, opts) {
    if (this.isSprite && this._animations[name]) {
      supr.startAnimation.call(this, name, opts);
    }
  };

  this.validateSprite = function(opts) {
    this.isSprite = !!SpriteView.allAnimations[opts.url];
  };

  /**
   * Getters
   */

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

  this.isVisible = function () {
    return this.style.visible;
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
      hbvs.x = -s.offsetX + m.getHitX();
      hbvs.y = -s.offsetY + m.getHitY();
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
