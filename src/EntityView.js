import ui.ImageView as ImageView;
import ui.SpriteView as SpriteView;

import .utils;
import .shapes.ShapeFactory as ShapeFactory;

var shapes = ShapeFactory.get();
var readOnlyProp = utils.addReadOnlyProperty;

/**
 * This class represents the default view used to render an entity to devkit's view hierarchy
 * @class EntityView
 */
exports = Class(SpriteView, function () {
  var supr = SpriteView.prototype;

  /** @var {string} EntityView#name */
  this.name = "EntityView";
  /**
   * Enables rendering hit bounds as red transparent shapes
   * @var {boolean} EntityView#_debugDraw
   * @private
   */
  this._debugDraw = false;

  /**
   * Constructs EntityView; called automatically when a new instance is created
   * @method EntityView#init
   * @arg {object} opts - Used internally by {@link Entity}
   * @arg {Entity} opts.entity
   */
  this.init = function (opts) {
    opts.tag = opts.tag || opts.entity.uid;
    this._entity = opts.entity;

    this._validateSprite(opts);
    if (!this.isSprite) {
      opts.image = opts.image || opts.url;
    }

    supr.init.call(this, opts);
  };

  /**
   * Called by {@link Entity#reset} when the entity becomes active
   * @method EntityView#reset
   * @arg {object} opts
   * @arg {number} [opts.offsetX=0] - The horizontal offset of the entity in view-space
   * @arg {number} [opts.offsetY=0] - The vertical offset of the entity in view-space
   * @arg {number} [opts.width=0] - The width of the entity's view if opts.viewOpts.width is not defined
   * @arg {number} [opts.height=0] - The height of the entity's view if opts.viewOpts.height is not defined
   * @arg {Rect} [opts.clipRect] - A rectangle used to clip the rendering of the view
   * @arg {object} [opts.viewOpts] - A set of properties to apply only to the view of an entity (and not its hit bounds); accepts any devkit View style property; the opts object itself is used if no viewOpts is specified
   * @arg {number} [opts.viewOpts.offsetX=0] - The horizontal offset of the entity's view; overrides opts.offsetX
   * @arg {number} [opts.viewOpts.offsetY=0] - The vertical offset of the entity's view; overrides opts.offsetY
   * @arg {number} [opts.viewOpts.anchorX=width/2] - The horizontal anchor of the entity's view; used as a pivot point for rotation and scaling
   * @arg {number} [opts.viewOpts.anchorY=height/2] - The vertical anchor of the entity's view; used as a pivot point for rotation and scaling
   * @arg {number} [opts.viewOpts.width] - The width of the entity's view; overrides opts.width
   * @arg {number} [opts.viewOpts.height] - The height of the entity's view; overrides opts.height
   * @arg {number} [opts.viewOpts.scale=1] - Multiplier to modify the entity's view dimensions around the anchor point
   * @arg {number} [opts.viewOpts.scaleX=1] - Multiplier to modify the entity's view width around anchorX
   * @arg {number} [opts.viewOpts.scaleY=1] - Multiplier to modify the entity's view height around anchorY
   * @arg {number} [opts.viewOpts.opacity=1] - The transparency of an entity's view, from 0 (invisible) to 1 (opaque)
   * @arg {string} [opts.viewOpts.compositeOperation=''] - A JavaScript canvas context globalCompositeOperation; try 'lighter' for a bright blend effect
   * @arg {string} [opts.viewOpts.image] - Resource path to a static image to display the entity; i.e. 'resources/images/ninja.png'
   * @arg {string} [opts.viewOpts.url] - Resource path to the subject of a sprite animation; i.e. 'resources/images/ninja' where an example sprite frame is 'resources/images/ninja_run_0001.png'; as described in devkit {@link http://docs.gameclosure.com/api/ui-spriteview.html#overview SpriteView docs}
   * @arg {string} [opts.viewOpts.defaultAnimation] - The default sprite animation action; i.e. 'run' where an example sprite frame is 'resources/images/ninja_run_0001.png'
   * @arg {boolean} [opts.viewOpts.loop] - Whether or not to loop the defaultAnimation of a sprite
   * @arg {boolean} [opts.viewOpts.autoStart] - Whether or not to start the defaultAnimation immediately
   * @arg {number} [opts.viewOpts.frameRate] - The frames-per-second of the sprite animation
   */
  this.reset = function (opts) {
    // reset debugDraw to the prototype value if set on instance
    if (this.hasOwnProperty('_debugDraw')) {
      delete this._debugDraw;
    }

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
    viewOpts.scale = viewOpts.scale !== undefined ? viewOpts.scale : 1;
    viewOpts.scaleX = viewOpts.scaleX !== undefined ? viewOpts.scaleX : 1;
    viewOpts.scaleY = viewOpts.scaleY !== undefined ? viewOpts.scaleY : 1;
    viewOpts.opacity = viewOpts.opacity !== undefined ? viewOpts.opacity : 1;
    viewOpts.compositeOperation = viewOpts.compositeOperation || "";
    this.resetAllAnimations(viewOpts);
    this.updateOpts(viewOpts);

    var s = this.style;
    s.x = model.x;
    s.y = model.y;
    s.visible = true;
  };

  /**
   * Called by {@link Entity#update} each tick while the entity is active; moves the view according to {@link EntityModel}'s position
   * @method EntityView#update
   * @arg {number} dt - the number of milliseconds elapsed since last update
   */
  this.update = function (dt) {
    var model = this._entity.model;
    var s = this.style;
    s.x = model.x;
    s.y = model.y;
  };

  /**
   * Reloads the sprite animation frames for this view; override's devkit's SpriteView resetAllAnimations; if not an animated sprite, just sets a static image
   * @method EntityView#resetAllAnimations
   * @arg {object} opts
   * @arg {string} opts.url - Path to the animation subject; as described in devkit {@link http://docs.gameclosure.com/api/ui-spriteview.html#overview SpriteView docs}
   * @arg {string} [opts.defaultAnimation] - Animation name, or action, to play or loop
   * @arg {boolean} [opts.autoStart=false] - Whether or not to animate immediately
   * @arg {number} [opts.frameRate=15] - Frames per second to update the sprite
   * @arg {boolean} [opts.loop=true] - Whether or not to loop defaultAnimation
   * @arg {string} [opts.image] - Sets a static image if there are no valid sprite animations provided
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

  /**
   * Starts a sprite animation; override's devkit's SpriteView startAnimation
   * @method EntityView#startAnimation
   * @arg {string} name - The name of the sprite action to play
   * @arg {object} [opts]
   * @arg {boolean} [opts.loop=false] - Whether or not to loop this animation action
   * @arg {number} [opts.iterations=1] - Number of times to play this animation before stopping if loop is not true
   * @arg {function} [opts.callback] - Called when this animation stops if loop is not true
   * @arg {number} [opts.frame=0] - Frame number on which to start the animation
   * @arg {boolean} [opts.randomFrame=false] - Whether or not to start on a random frame
   */
  this.startAnimation = function (name, opts) {
    if (this.isSprite && this._animations[name]) {
      supr.startAnimation.call(this, name, opts);
    }
  };

  /**
   * Confirms whether the provided opts reference a valid devkit sprite animation
   * @method EntityView#_validateSprite
   * @arg {object} opts
   * @private
   */
  this._validateSprite = function(opts) {
    this.isSprite = !!SpriteView.allAnimations[opts.url];
  };

  /**
   * The view's left-most x-coordinate
   * @var {number} EntityView#minX
   * @readOnly
   */
  readOnlyProp(this, 'minX', function () {
   var s = this.style;
   return s.x + s.offsetX;
  });

  /**
   * The view's right-most x-coordinate
   * @var {number} EntityView#maxX
   * @readOnly
   */
  readOnlyProp(this, 'maxX', function () {
   var s = this.style;
   return s.x + s.offsetX + s.width;
  });

  /**
   * The view's top-most y-coordinate
   * @var {number} EntityView#minY
   * @readOnly
   */
  readOnlyProp(this, 'minY', function () {
   var s = this.style;
   return s.y + s.offsetY;
  });

  /**
   * The view's bottom-most y-coordinate
   * @var {number} EntityView#maxY
   * @readOnly
   */
  readOnlyProp(this, 'maxY', function () {
   var s = this.style;
   return s.y + s.offsetY + s.height;
  });

  /**
   * The view's horizontal position in view-space
   * @var {number} EntityView#x
   */
  Object.defineProperty(this, 'x', {
    enumerable: true,
    configurable: true,
    get: function () { return this.style.x; },
    set: function (value) { this.style.x = value; }
  });

  /**
   * The view's vertical position in view-space
   * @var {number} EntityView#y
   */
  Object.defineProperty(this, 'y', {
    enumerable: true,
    configurable: true,
    get: function () { return this.style.y; },
    set: function (value) { this.style.y = value; }
  });

  /**
   * The view's horizontal offset in view-space
   * @var {number} EntityView#offsetX
   */
  Object.defineProperty(this, 'offsetX', {
    enumerable: true,
    configurable: true,
    get: function () { return this.style.offsetX; },
    set: function (value) { this.style.offsetX = value; }
  });

  /**
   * The view's vertical offset in view-space
   * @var {number} EntityView#offsetY
   */
  Object.defineProperty(this, 'offsetY', {
    enumerable: true,
    configurable: true,
    get: function () { return this.style.offsetY; },
    set: function (value) { this.style.offsetY = value; }
  });

  /**
   * The view's width
   * @var {number} EntityView#width
   */
  Object.defineProperty(this, 'width', {
    enumerable: true,
    configurable: true,
    get: function () { return this.style.width; },
    set: function (value) { this.style.width = value; }
  });

  /**
   * The view's height
   * @var {number} EntityView#height
   */
  Object.defineProperty(this, 'height', {
    enumerable: true,
    configurable: true,
    get: function () { return this.style.height; },
    set: function (value) { this.style.height = value; }
  });

  /**
   * Whether or not the view should render each frame
   * @var {boolean} EntityView#visible
   */
  Object.defineProperty(this, 'visible', {
    enumerable: true,
    configurable: true,
    get: function () { return this.style.visible; },
    set: function (value) { this.style.visible = value; }
  });

  /**
   * Show this entity's hit bounds on view render
   * @method EntityView#showHitBounds
   */
  this.showHitBounds = function () {
    this._debugDraw = true;
  };

  /**
   * Hide this entity's hit bounds on view render
   * @method EntityView#hideHitBounds
   */
  this.hideHitBounds = function () {
    this._debugDraw = false;
  };

  /**
   * Devkit custom render function for clipping and drawing hit bounds
   * @method EntityView#render
   * @private
   */
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
      ctx.translate(this.style.anchorX, this.style.anchorY);
      ctx.scale(invScale, invScale);
      ctx.translate(-this.minX - this.style.anchorX, -this.minY - this.style.anchorY);

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
