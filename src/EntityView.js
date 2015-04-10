import ui.ImageView as ImageView;
import ui.SpriteView as SpriteView;

// entities module image path (for showing hit bounds)
var IMG_PATH = "addons/devkit-entities/images/";

exports = Class(SpriteView, function (supr) {

  this.init = function (opts) {
    this.updateHasAnimationFlag(opts);
    if (!this.hasAnimations) {
      opts.image = opts.url;
    }
    supr(this, "init", arguments);
  };

  this.resetAllAnimations = function (opts) {
    this.updateHasAnimationFlag(opts);
    // Only reset animations if we're actually animated
    if (this.hasAnimations) {
      supr(this, "resetAllAnimations", arguments);
      this.setImage(this._animations[opts.defaultAnimation].frames[0]);
    } else {
      this.setImage(opts.url);
    }
  };

  this.startAnimation = function (name, opts) {
    // Only start animation if we're actually animated
    if (this.hasAnimations && this._animations[name]) {
      supr(this, "startAnimation", arguments);
    }
  };

  this.updateHasAnimationFlag = function (opts) {
    // Safeguard flag to allow a SpriteView to act as a normal ImageView
    this.hasAnimations = SpriteView.allAnimations[opts.url] !== undefined;
  };

  this.reset = function (opts) {
    var v = this.view;
    var s = v.style;
    var b = this.viewBounds;
    s.x = this.x + b.x;
    s.y = this.y + b.y;
    s.zIndex = opts.zIndex !== void 0 ? opts.zIndex : s.zIndex;
    s.visible = true;

    // setImage is expensive, so only call it if we have to
    var image = opts.image;
    if (image && v.setImage && v.currImage !== image) {
      v.setImage(image);
      v.currImage = image;
    }
  };

  this.update = function (dt) {
    var s = this.view.style;
    var b = this.viewBounds;
    var xPrev = s.x;
    var yPrev = s.y;
    s.x = this.x + b.x;
    s.y = this.y + b.y;
    if(this.model.name == "SATPhysics"){
      this.model.updatePosition(this, s.x - xPrev, s.y - yPrev);
    }
  };

  /**
   * Entity View Dimensions
   */

  this.getX = this.getLeftX = this.getMinX = function () {
    return this.style.x + this.style.offsetX;
  };

  this.getRightX = this.getMaxX = function () {
    return this.getX() + this.style.width;
  };

  this.getY = this.getTopY = this.getMinY = function () {
    return this.style.y + this.style.offsetY;
  };

  this.getBottomY = this.getMaxY = function () {
    return this.getY() + this.style.height;
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
      this.hitBoundsView = new ImageView({ parent: this.view });
    } else {
      this.hitBoundsView.style.visible = true;
    }

    var hbvs = this.hitBoundsView.style;
    if (this.isCircle) {
      this.hitBoundsView.setImage(IMG_PATH + "shapeCircle.png");
      hbvs.x = -this.viewBounds.x + this.hitBounds.x - this.hitBounds.r;
      hbvs.y = -this.viewBounds.y + this.hitBounds.y - this.hitBounds.r;
      hbvs.width = 2 * this.hitBounds.r;
      hbvs.height = 2 * this.hitBounds.r;
    } else {
      this.hitBoundsView.setImage(IMG_PATH + "shapeRect.png");
      hbvs.x = -this.viewBounds.x + this.hitBounds.x;
      hbvs.y = -this.viewBounds.y + this.hitBounds.y;
      hbvs.width = this.hitBounds.w;
      hbvs.height = this.hitBounds.h;
    }
  };

  this.hideHitBounds = function () {
    if (this.hitBoundsView) {
      this.hitBoundsView.style.visible = false;
    }
  };

});
