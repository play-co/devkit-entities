import ..EntityView as EntityView;

exports = Class(EntityView, function () {
  var supr = EntityView.prototype;

  this.name = "SATEntityView";

  this.render = function (ctx) {
    supr.render.call(this, ctx);

    if (this._debugDraw) {
      ctx.save();

      // remove offsets and scale
      var invScale = 1 / this.style.scale;
      ctx.translate(-this.minX, -this.minY);
      ctx.scale(invScale, invScale);

      // Draw debug lines
      var verts = this._entity.model.shape.calcPoints;
      if (verts.length > 0) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.moveTo(verts[0].x, verts[0].y);
        for (var i = 1; i < verts.length; i++) {
          ctx.lineTo(verts[i].x, verts[i].y);
        }
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }
  };

});
