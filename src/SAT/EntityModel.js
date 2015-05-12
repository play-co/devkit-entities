
import ..EntityModel;
import .SAT;

exports = Class(EntityModel, function (supr) {

  this.reset = function(opts) {
    supr(this, 'reset', [opts]);

    this.shape.setPivot(new SAT.Vector(
        (opts.anchorX || 0) + opts.x, (opts.anchorY || 0) + opts.y
      ));

    // Make sure that offsets are correct on the polygon (if it is one)
    if (this.shape instanceof SAT.Polygon) {
      this.shape.setOffset(new SAT.Vector(
          (opts.offsetX || 0), (opts.offsetY || 0)
        ));

      this.shape.setScale(new SAT.Vector(
          (opts.scale || 1), (opts.scale || 1)
        ));
    }
  };
});