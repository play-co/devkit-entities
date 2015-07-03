import ui.ImageView as ImageView;
import ui.SpriteView as SpriteView;

import .utils;
import .shapes.ShapeFactory as ShapeFactory;

var shapes = ShapeFactory.get();
var readOnlyProp = utils.addReadOnlyProperty;

exports = Class(SpriteView, function () {
  var supr = SpriteView.prototype;

  this.name = "EntityView";
  this._debugDraw = false;

  this.init = function (opts) {
    opts.tag = opts.tag || opts.entity.uid;
    this._entity = opts.entity;

    this._validateSprite(opts);
    if (!this.isSprite) {
      opts.image = opts.image || opts.url;
    }

    supr.init.call(this, opts);
  };

  this.reset = function (opts) {
    var viewOpts = opts.viewOpts = opts.viewOpts || opts;
    shapes.applyImageDimensions(viewOpts);

    this.clipRect = opts.clipRect || null;

    var model = this._entity.model;
    viewOpts.offsetX = viewOpts.offsetX || opts.offsetX || 0;
    viewOpts.offsetY = viewOpts.offsetY || opts.offsetY || 0;
    viewOpts.width = viewOpts.width || opts.width || 0;
    viewOpts.height = viewOpts.height || opts.height || 0;
    viewOpts.anchorX = viewOpts.anchorX !== undefined ? viewOpts.anchorX : viewOpts.width / 2;
    viewOpts.anchorY = viewOpts.anchorY !== undefined ? viewOpts.anchorY : viewOpts.height / 2;
    this.resetAllAnimations(viewOpts);
    this.updateOpts(viewOpts);

    var s = this.style;
    s.x = model.x;
    s.y = model.y;
    s.visible = true;
  };

  this.update = function (dt) {
    var model = this._entity.model;
    var s = this.style;
    s.x = model.x;
    s.y = model.y;
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
      this.setImage(opts.image || opts.url);
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

  readOnlyProp(this, 'minX', function () {
   var s = this.style;
   return s.x + s.offsetX;
  });

  readOnlyProp(this, 'maxX', function () {
   var s = this.style;
   return s.x + s.offsetX + s.width;
  });

  readOnlyProp(this, 'minY', function () {
   var s = this.style;
   return s.y + s.offsetY;
  });

  readOnlyProp(this, 'maxY', function () {
   var s = this.style;
   return s.y + s.offsetY + s.height;
  });

  Object.defineProperty(this, 'x', {
    enumerable: true,
    configurable: true,
    get: function () { return this.style.x; },
    set: function (value) { this.style.x = value; }
  });

  Object.defineProperty(this, 'y', {
    enumerable: true,
    configurable: true,
    get: function () { return this.style.y; },
    set: function (value) { this.style.y = value; }
  });

  Object.defineProperty(this, 'offsetX', {
    enumerable: true,
    configurable: true,
    get: function () { return this.style.offsetX; },
    set: function (value) { this.style.offsetX = value; }
  });

  Object.defineProperty(this, 'offsetY', {
    enumerable: true,
    configurable: true,
    get: function () { return this.style.offsetY; },
    set: function (value) { this.style.offsetY = value; }
  });

  Object.defineProperty(this, 'width', {
    enumerable: true,
    configurable: true,
    get: function () { return this.style.width; },
    set: function (value) { this.style.width = value; }
  });

  Object.defineProperty(this, 'height', {
    enumerable: true,
    configurable: true,
    get: function () { return this.style.height; },
    set: function (value) { this.style.height = value; }
  });

  Object.defineProperty(this, 'visible', {
    enumerable: true,
    configurable: true,
    get: function () { return this.style.visible; },
    set: function (value) { this.style.visible = value; }
  });

  /**
   * Debugging Utilities
   */

  this.showHitBounds = function () {
    this._debugDraw = true;
  };

  this.hideHitBounds = function () {
    this._debugDraw = false;
  };

  this.render = function (ctx) {

    if (this.clipRect) {
      ctx.save();
      ctx.clipRect(
        this.clipRect.x - this.style.offsetX,
        this.clipRect.y - this.style.offsetY,
        this.clipRect.width,
        this.clipRect.height
      );
    }

    supr.render.call(this, ctx);

    if (this.clipRect) { ctx.restore(); }

    if (this._debugDraw) {
      ctx.save();

      // remove flips if necessary
      if (this.style.flipX || this.style.flipY) {
        ctx.translate(
          this.style.flipX ? this.style.width / 2 : 0,
          this.style.flipY ? this.style.height / 2 : 0
        );

        ctx.scale(
          this.style.flipX ? -1 : 1,
          this.style.flipY ? -1 : 1
        );

        ctx.translate(
          this.style.flipX ? -this.style.width / 2 : 0,
          this.style.flipY ? -this.style.height / 2 : 0
        );
      }

      // remove offsets and scale
      var invScale = 1 / this.style.scale;
      ctx.translate(-this.minX, -this.minY);
      ctx.scale(invScale, invScale);

      // draw debug lines
      var model = this._entity.model;
      var shape = model.shape;
      ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
      if (shape.radius) {
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI, false);
        ctx.fill();
      } else if (shape.width && shape.height) {
        ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
      }

      ctx.restore();
    }
  };

});
