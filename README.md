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

### Inheriting `Entity`

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

It's also important to note the differences between *Prototype Properties* and *Instance Properties*. In the above example, `name` is a *Prototype Property* shared by all instances of class `Bullet`, while `damage` is an *Instance Property* that may vary from bullet to bullet.

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

TODO: ...

### Entity Config

TODO: ...

### Entity Bounds

TODO: ...

## EntityPhysics.js

TODO: ...

## EntityPool.js

TODO: ...

## Example Game

TODO: Link
