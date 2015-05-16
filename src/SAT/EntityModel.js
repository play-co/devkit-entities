import ..EntityModel;
import .SAT;
import .ShapeFactory;

var shapes = ShapeFactory.get();

exports = Class(EntityModel, function () {
  var supr = EntityModel.prototype;

  this.name = "SATEntityModel";

  this._initShape = function (opts) {
    this._shape = shapes.getShape(opts);
  };

  this.reset = function (opts) {
    supr.reset.call(this, opts);

    var pivot = new SAT.Vector(
      (opts.anchorX || 0) + opts.x,
      (opts.anchorY || 0) + opts.y);
    this._shape.setPivot(pivot);

    // Make sure that offsets are correct on the polygon (if it is one)
    if (this._shape instanceof SAT.Polygon) {
      var offset = new SAT.Vector((opts.offsetX || 0), (opts.offsetY || 0));
      this._shape.setOffset(offset);

      var scale = new SAT.Vector((opts.scale || 1), (opts.scale || 1));
      this._shape.setScale(scale);
    }
  };
});
