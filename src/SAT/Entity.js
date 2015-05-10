import ..Entity;

import ..EntityModel;
import ..EntityView;

exports = Class(Entity, function (supr) {

  this.modelClass = EntityModel;
  this.viewClass = EntityView;

  this.reset = function(opts) {
    opts.hitBounds = opts.satBounds || opts.hitBounds;
    supr(this, 'reset', [opts]);
  };

});