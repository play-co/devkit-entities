
exports = {
  /**
   * Adds a read-only property to an object
   */
  addReadOnlyProperty: function (ctx, name, getter) {
    Object.defineProperty(ctx, name, {
      enumerable: true,
      configurable: true,
      get: getter,
      set: function () {
        var ctxName = this.name ? this.name + " " : "";
        logger.warn(ctxName + name + " is read-only!");
      }
    });
  },

  /**
   * Adds a read-only object with read-only properties
   */
  addReadOnlyObject: function (ctx, name, props) {
    var obj = { name: name };

    this.addReadOnlyProperty(ctx, name, function () { return obj; });

    for (var prop in props) {
      this.addReadOnlyProperty(obj, prop, bind(ctx, props[prop]));
    }
  }
};
