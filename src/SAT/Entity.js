import ..Entity;
import .EntityModel as SATEntityModel;
import .EntityView as SATEntityView;
import .physics as SATPhysics;

var DEG_TO_RAD = (Math.PI / 180);

exports = Class(Entity, function () {
  var supr = Entity.prototype;

  this.name = "SATEntity";
  this.modelClass = SATEntityModel;
  this.viewClass = SATEntityView;

  this.init = function(opts) {
    opts = opts || {};
    opts.physics = SATPhysics;
    supr.init.call(this, opts);
  };

  this.reset = function(opts) {
    // opts.hitBounds = opts.satBounds || opts.hitBounds;
    supr.reset.call(this, opts);
  };

  // expose rotation
  Object.defineProperty(this, 'r', {
    enumerable: true,
    configurable: true,
    get: function () {
      return this.view.style.r;
    },
    set: function (value) {
      this.view.style.r = value;
      this.model.shape.setAngle(value * DEG_TO_RAD);
    }
  });

  // expose scale
  Object.defineProperty(this, 'scale', {
    enumerable: true,
    configurable: true,
    get: function () {
      return this.view.style.scale;
    },
    set: function (value) {
      this.view.style.scale = value;
      var oldScaleVector = this.model.shape.scale;
      oldScaleVector.x = value;
      oldScaleVector.y = value;
      this.model.shape._recalc();
    }
  });

});