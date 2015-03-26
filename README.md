DevKit Entities Module
======================

`Entity` serves as a base class for game elements in DevKit. It provides functionality for coordinates in a game-space; circular and rectangular bounds for offsetting views and hitboxes; implicit view management; basic physics including velocity, acceleration, and collisions; and a lifecycle interface to easily facilitate pooling.

This module includes the [Entity](https://github.com/gameclosure/devkit-entities/blob/master/src/Entity.js) base class, [EntityPhysics](https://github.com/gameclosure/devkit-entities/blob/master/src/EntityPhysics.js) as a default physics component, and [EntityPool](https://github.com/gameclosure/devkit-entities/blob/master/src/EntityPool.js) to efficiently recycle entities. Thanks to [@tuanna222](https://github.com/tuanna222) for adding [SATPhysics](https://github.com/gameclosure/devkit-entities/blob/master/src/SATPhysics.js) based on [SAT.js](https://github.com/jriecken/sat-js) as an optional advanced physics implementation.

## Installation and Imports

Run this command to install devkit-entities as a dependency in your project:
```
  devkit install https://github.com/gameclosure/devkit-entities.git
```

Once installed, you can import classes from this module like this:
```
  import entities.Entity as Entity;
```

## Entity.js

#### Inheriting Entity

`Entity` is intended to be the base class of any game element that exists in a 2D game-space. Here's an example of what a `Bullet` class that inherits `Entity` might look like:
```
var Bullet = Class(Entity, function() {
    var sup = Entity.prototype;
    this.name = "Bullet";

    this.init = function(opts) {
        sup.init.call(this, opts);
        this.damage = 1;
    };
});
```

When overriding a function that exists in the `Entity` class, you almost always want to call the super function, so that you keep the default behavior of entities intact. It's best to use `Entity.prototype._fn_name_.call()` to avoid array allocations incurred by using `.apply()`, especially if you have many instances of the class. In this example, I save a reference `sup` to the `Entity.prototype`.

It's also important to note the differences between **Prototype Properties** and **Instance Properties**. In the above example, `name` is a **Prototype Property** shared by all instances of class `Bullet`, while `damage` is an **Instance Property** that may vary from bullet to bullet.

##### Instance Properties

Each instance of a class that inherits `Entity` will have its own value for the following properties:

 * `uid` - type: `string` - unique identifier
 * `x` - type: `number` - x-coordinate in game-space
 * `y` - type: `number` - y-coordinate in game-space
 * `vx` - type: `number` - velocity in the x-direction
 * `vy` - type: `number` - velocity in the y-direction
 * `ax` - type: `number` - acceleration in the x-direction
 * `ay` - type: `number` - acceleration in the y-direction
 * `xPrev` - type: `number` - x-coordinate from the previous frame (last update)
 * `yPrev` - type: `number` - y-coordinate from the previous frame (last update)
 * `anchorX` - type: `number` - offset along the x-axis from the primary point to the anchor point; rotation and scaling in Devkit are calculated from this point
 * `anchorY` - type: `number` - offset along the y-axis from the primary point to the anchor point; rotation and scaling in Devkit are calculated from this point
 * `isCircle` - type: `boolean` - entities are considered rectangles by default, but they can also be circles; `EntityPhysics` uses this flag for collisions
 * `isAnchored` - type: `boolean` - anchored entities are immovable; `EntityPhysics` will not attempt to move entities with this flag set to `true`
 * `hitBounds` - type: `object` - a bounds object that represents the collision shape of an entity; used by `EntityPhysics` to offset the position and size of the entity in collisions
 * `viewBounds` - type: `object` - a bounds object that represents the view shape of an entity; used by `Entity` to offset the position and size of the entity's view
 * `view` - type: `object` - a reference to the entity's view, if the class has a `viewClass` constructor defined
 * `physics` - type: `object` - a reference to the entity's physics component, defaults to `EntityPhysics`
 * `pool` - type: `object` - a reference to the entity's `EntityPool`, if it's being pooled; this is managed automatically and should be ignored
 * `poolIndex` - type: `number` - the index of the entity in its pool, if it's being pooled; this is managed automatically and should be ignored


##### Prototype Properties

These class-wide properties are shared by all instances of a given class:

 * `name` - type: `string` - aids in constructing a unique identifier for each instance of the class; useful for debugging
 * `viewClass` - type: `object` - defaults to `ImageView`; must either be `null` or a class constructor that inherits from `View`; this property determines what type of view to construct and attach to each instance of the class

#### Entity Lifecycle

The following functions determine how and when your entities live and die. You are encouraged to override these functions as needed, but you should almost always be sure to call the superclass function from within your overriden function, as described in the **Inheriting Entity** section above.

##### `reset(x, y, config)`
When an `Entity` should appear, call its `reset` function to set its primary point within the game-space and to apply its config. When using `EntityPool`, the `reset` function gets called automatically by the pool's `obtain` function, which takes the same parameters. The `resetView` function gets called automatically by the `reset` function if the instance's `view` property is not `null`.

##### `update(dt)`
While an `Entity` is active, call its `update` function once per tick and pass in the time elapsed since the last tick, `dt` (delta time). When using `EntityPool`, call the pool's `update` function, passing `dt` in the same way, and it will update all active entities within the pool. The `updateView` function gets called automatically by the `update` function if the instance's `view` property is not `null`.

##### `release()`
Finally, when the life of an `Entity` is over, call the `release` function to hide it and make it inactive. When using an `EntityPool`, this call will recycle it back into the pool automatically.

#### Entity Config

The third parameter of the `reset` function is a config object. When pooling entities, it's the third parameter of the pool's `obtain` function. Each configurable property has reasonable defaults, and if supplied an `image` property, the entity's view and hit bounds will default to the dimensions of the image asset. Here's an example config object for our hypothetical `Bullet` class:
```
{
    isCircle: true,
    vx: 0,
    vy: -1.25,
    hitBounds: {
        x: 0,
        y: 0,
        r: BULLET_SIZE / 2
    },
    viewBounds: {
        x: -BULLET_SIZE / 2,
        y: -BULLET_SIZE / 2,
        w: BULLET_SIZE,
        h: BULLET_SIZE
    },
    image: "resources/images/game/shapeCircle.png"
}
```

#### Entity Bounds

The view and hit bounds used by entities are objects with only 5 properties. They support both rectangles and circles for hit bounds, but it's important to note that view bounds are always rectangular because DevKit views are always rectangular. To match DevKit view usage, rectangular bounds' offsets determine the top-left corner. Circular bounds' offsets determine the center point. Each bounds object has the following properties:

 * `x` - type: `number` - the x offset from the entity's primary point; for rectangles, this is the offset to the left-side, but for circles, this is the offset to the center
 * `y` - type: `number` - the y offset from the entity's primary point; for rectangles, this is the offset to the top-side, but for circles, this is the offset to the center
 * `r` - type: `number` - radius, used only for circles by default; can be used for rotation by rectangles and other polygons (`SATPhysics` only)
 * `w` - type: `number` - width, used only for rectangles
 * `h` - type: `number` - height, used only for rectangles

## EntityPhysics.js

Each instance of `Entity` has a physics object reference that defaults to `EntityPhysics`. It defines how the entities move and collide. Entities' `collidesWith` function detects collisions with other entities, and their `resolveCollidingStateWith` function resolves collisions by pushing entities apart. Both of these functions rely on the physics object for their behavior. On each call to update, entities also call the physics object's `stepPosition` function, which moves entities based on their velocity and acceleration. By swapping out the physics object, you can write your own custom physics and behaviors. Instances of `EntityPool` also provide several ways to detect collisions between pools (see [EntityPool](https://github.com/gameclosure/devkit-entities/blob/master/src/EntityPool.js) for more details). This simple default physics implementation is designed to be fast and lightweight; it currently only supports circles and axis-aligned rectangles (no rotation).

## EntityPool.js

It can be expensive to create and throw away objects, especially those as complicated as entities with DevKit views. Instead, it's best to use pools to manage their creation and recycling. `EntityPool`, similar to DevKit's `ViewPool` class, serves this purpose for entities. See the **Entity Lifecycle** section above for more information on obtaining and recycling entities with `EntityPool`.

## SATPhysics.js

To use more advanced physics, import and pass in `SATPhysics` to the constructor of any `Entity`. This physics implementation supports circles, rotated rectangles, and any convex polygons. This code is less tested and may have issues, so please contribute any fixes or issues you find!

Creating entities with `SATPhysics`:
```
import entities.SATPhysics as SATPhysics;

var Bullet = Class(Entity, function() {
    var sup = Entity.prototype;
    this.name = "Bullet";

    this.init = function(opts) {
        opts.physics = SATPhysics;
        sup.init.call(this, opts);
        this.damage = 1;
    };
});
```

#### Collision Response Properties

The API for `SAT.js` is slightly different since it provides more collision information. The `collidesWith` function takes a `response` object as its second parameter, which gets populated by `SATPhysics`. These are the properties provided:

 * `a` - the first object in the collision
 * `a.entity` - the first `Entity` in the collision
 * `b` - the second object in the collison
 * `b.entity` - the second `Entity` in the collision
 * `overlap` - magnitude of the overlap on the shortest colliding axis
 * `overlapN` - the shortest colliding axis (unit-vector)
 * `overlapV` - the overlap vector (i.e. overlapN.scale(overlap, overlap)); if this vector is subtracted from the position of a, a and b will no longer be colliding
 * `aInB` - whether the first object is completely inside the second
 * `bInA` - whether the second object is completely inside the first

## Examples

Open-source example(s) built on DevKit with this module:

 * [Drone Swarm](https://github.com/weebygames/swarm)