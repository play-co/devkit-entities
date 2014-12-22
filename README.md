DevKit Entities Module
======================

`Entity` serves as a base class for game elements in DevKit. It provides functionality for coordinates in a game-space; circular and rectangular bounds for offsetting views and hitboxes; implicit view management; basic physics including velocity, acceleration, and collisions; and a lifecycle interface to easily facilitate entity pooling.

This module includes the `Entity` base class, `EntityPhysics` as a default physics component, and `EntityPool` to efficiently recycle entities.

## Installation and Imports

Add devkit-entities to dependencies in your game's manifest.json:
```
  "dependencies": {
    "devkit-entities": "https://github.com/gameclosure/devkit-entities#v0.2.1"
  },
```

Feel free to change the `v0.2.1` to a tag or branch of entities, then run `devkit install` within your game's directory. Once installed, you can import any of the entity files into your game code:
```
  import entities.Entity as Entity;
```

## Entity.js

### Inheriting Entity

`Entity` is intended to be the base class of any game element that exists in a 2D game-space. Here's an example of what a `Bullet` class that inherits `Entity` might look like:
```
var Bullet = Class(Entity, function() {
	var sup = Entity.prototype;

	this.name = "Bullet";

	this.init = function(opts) {
		sup.init.call(this, opts);

		this.damage = 1;
		this.isHoming = false;
	};
});
```

When overriding a function that exists in the `Entity` class, you almost always want to call the super function, so that you keep the default behavior of entities intact. It's best to use `Entity.prototype._fn_name_.call()` to avoid array allocations incurred by using `.apply()`, especially if you have many instances of your class. In this example, I save a reference `sup` to the `Entity.prototype` for ease of use.

It's also important to note the differences between **Prototype Properties** and **Instance Properties**. In the above example, `name` is a **Prototype Property** shared by all instances of class `Bullet`, while `damage` is an **Instance Property** that may vary from bullet to bullet.

#### Instance Properties

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
 * `isCircle` - type: `boolean` - entities are considered rectangles by default, but they can also be circles; `EntityPhysics` uses this flag for collisions
 * `isAnchored` - type: `boolean` - anchored entities are immovable; `EntityPhysics` will not attempt to move entities with this flag set to `true`
 * `hitBounds` - type: `object` - a bounds object that represents the collision shape of an entity; used by `EntityPhysics` to offset the position and size of the entity in collisions
 * `viewBounds` - type: `object` - a bounds object that represents the view shape of an entity; used by `Entity` to offset the position and size of the entity's view
 * `view` - type: `object` - a reference to the entity's view, if the class has a `viewClass` constructor defined
 * `physics` - type: `object` - a reference to the entity's physics component, defaults to `EntityPhysics`
 * `pool` - type: `object` - a reference to the entity's `EntityPool`, if it's being pooled; this is managed automatically and should be ignored
 * `poolIndex` - type: `number` - the index of the entity in its pool, if it's being pooled; this is managed automatically and should be ignored


#### Prototype Properties

These class-wide properties are shared by all instances of a given class:

 * `name` - type: `string` - aids in constructing a unique identifier for each instance of the class; useful for debugging
 * `viewClass` - type: `object` - defaults to `ImageView`; must either be `null` or a class constructor that inherits from `View`; this property determines what type of view to construct and attach to each instance of the class

### Entity Lifecycle

The following functions determine how and when your entities live and die. You are encouraged to override these functions as needed, but you should almost always be sure to call the superclass function from within your overriden function.

#### `reset(x, y, config)`
When an `Entity` appears in a game, its `reset` function should should be called to set its primary point within the game-space and to apply its config. If you are using `EntityPool`, the `reset` function gets called automatically by the pool's `obtain` function, which takes the same parameters. The `resetView` function gets called automatically by the `reset` function if the instance's `view` property is not `null`.

#### `update(dt)`
While an `Entity` is active in your game, you should call its `update` function once per tick and pass in the time elapsed since the last tick, `dt` (delta time). If you're using `EntityPool`, you can just call the pool's `update` function, passing `dt` in the same way, and it will update all active entities within the pool. The `updateView` function gets called automatically by the `update` function if the instance's `view` property is not `null`.

#### `release()`
Finally, when the life of an `Entity` is over, you can call the `release` function to hide it and make it inactive. If you're using an `EntityPool`, this call will recycle it back into the pool automatically.

### Entity Config

The third parameter of the `reset` function is a config object containing initial values to apply to an instance of `Entity`. If you're pooling entities, it's the third parameter of your pool's `obtain` function. Each property has reasonable defaults, and if you supply an `image` property, the entity's view and hit bounds will default to the dimensions of the image asset. Here's an example config object for our hypothetical `Bullet` class:
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

### Entity Bounds

The view and hit bounds used by entities are objects with only 5 properties. They support both rectangles and circles for hit bounds, but it's important to note that view bounds are always rectangular because DevKit views are always rectangular. To match DevKit view usage, rectangular bounds' offsets determine the top-left corner. Circular bounds' offsets determine the center point.  Each bounds object has the following properties:

 * `x` - type: `number` - the x offset from the entity's primary point; for rectangles, this is the offset to the left-side, but for circles, this is the offset to the center
 * `y` - type: `number` - the y offset from the entity's primary point; for rectangles, this is the offset to the top-side, but for circles, this is the offset to the center
 * `r` - type: `number` - radius, used only for circles
 * `w` - type: `number` - width, used only for rectangles
 * `h` - type: `number` - height, used only for rectangles

## EntityPhysics.js

Each instance of `Entity` has a physics object reference that defaults to `EntityPhysics`. It defines how the entities move and collide. Entities have a `collidesWith` function to detect collisions with other entities, and a `resolveCollidingStateWith` function to resolve collisions by pushing colliding entities apart. Both of these functions rely on the physics object for their behavior. On each call to update, entities also call the physics object's `stepPosition` function to move according to velocity and acceleration. By swapping out the physics object, you can write your own custom physics and behaviors. Instances of `EntityPool` also provide several ways to detect collisions between pools (see the class's code for more details).

## EntityPool.js

It can be expensive to create and throw away objects, especially those as complicated as entities with DevKit views. Instead, it's best to use pools to manage their creation and recycling. `EntityPool`, similar to DevKit's `ViewPool` class, serves this purpose for entities. See the **Entity Lifecycle** section above for more information on obtaining and recycling entities with `EntityPool`.

## Example Game

TODO: Link
