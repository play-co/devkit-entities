import ..EntityModel;
import .SAT;

exports = Class(EntityModel, function () {
  var supr = EntityModel.prototype;

  this.reset = function (opts) {
    supr.reset.call(this, opts);

    var pivot = new SAT.Vector(
      (opts.anchorX || 0) + opts.x,
      (opts.anchorY || 0) + opts.y);
    this.shape.setPivot(pivot);

    // Make sure that offsets are correct on the polygon (if it is one)
    if (this.shape instanceof SAT.Polygon) {
      var offset = new SAT.Vector((opts.offsetX || 0), (opts.offsetY || 0));
      this.shape.setOffset(offset);

      var scale = new SAT.Vector((opts.scale || 1), (opts.scale || 1));
      this.shape.setScale(scale);
    }
  };
});