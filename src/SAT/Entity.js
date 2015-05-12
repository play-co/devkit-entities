import ..Entity;

import .EntityModel as SATEntityModel;
import .EntityView as SATEntityView;
import .physics as SATPhysics;

var DEG_TO_RAD = (Math.PI / 180);

exports = Class(Entity, function(supr) {

  this.modelClass = SATEntityModel;
  this.viewClass = SATEntityView;

  this.init = function(opts) {
    opts = opts || {};
    opts.physics = SATPhysics;
    supr(this, 'init', [opts]);
  };

  this.reset = function(opts) {
    opts.hitBounds = opts.satBounds || opts.hitBounds;
    supr(this, 'reset', [opts]);
  };

  // expose rotation
  Object.defineProperty(this, 'r', {
    enumerable: true,
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