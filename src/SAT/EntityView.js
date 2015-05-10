import ..EntityView as EntityView;

exports = Class(EntityView, function(supr) {

  this.render = function (ctx) {
    supr(this, 'render', [ctx]);

    if (this.debugDraw) {
      ctx.save();
      ctx.translate(-this.style.offsetX, -this.style.offsetY);

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