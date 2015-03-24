## Changelog

Using SAT (https://github.com/jriecken/sat-js) to detect the collision.
Base on devkit-entities (https://github.com/gameclosure/devkit-entities#v0.2.5).
- Supporting rectangle with rotation
- Adding more rotate and setAnchor
- Changing response object on EntityPool

## Next features
- Easy to change code to support polygon. Ex: Triangle.

## Installation and Imports

Add devkit-entities to dependencies in your game's manifest.json:
```
  devkit install https://github.com/tuanna222/devkit-entities.git
```
Import to your project:
```
  import entities.Entity as Entity;
```

DevKit Entities Module
======================

`Entity` serves as a base class for game elements in DevKit. It provides functionality for coordinates in a game-space; circular and rectangular bounds for offsetting views and hitboxes; implicit view management; basic physics including velocity, acceleration, and collisions; and a lifecycle interface to easily facilitate pooling.

This module includes the [Entity](https://github.com/gameclosure/devkit-entities/blob/master/src/Entity.js) base class, [EntityPhysics](https://github.com/gameclosure/devkit-entities/blob/master/src/EntityPhysics.js) as a default physics component, and [EntityPool](https://github.com/gameclosure/devkit-entities/blob/master/src/EntityPool.js) to efficiently recycle entities.

## Installation and Imports

Add devkit-entities to dependencies in your game's manifest.json:
```
  "dependencies": {
    "devkit-entities": "https://github.com/gameclosure/devkit-entities#v0.2.4"
  },
```

Feel free to change the `v0.2.4` to a tag or branch of entities, then run `devkit install` within your game's directory. Once installed, you can import any of the entity files into your game code:
```
  import entities.Entity as Entity;
```

## Example
```
	this.tick = function(dt) {
		if(this.running !== true) return;
		// speed up or slow down the passage of time
		dt = Math.min(1 * dt, 100);
		// update entities
		this.player.update(dt);//Player Entity
		this.enemies.update(dt);//Enemy EntityPool
		//collision
		this.enemies.onAllCollisions(this.player, this.onColision, this);
	}

	this.onColision = function(response){
		console.log("collision===========", response);//SAT.Response
		//response.a.entity -> Enemy Entity
		//response.b.entity -> Player Entity
	}
```

## Instance Properties
#### Entity Properties

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

####Entity Bounds

    x - type: number - the x offset from the entity's primary point; for rectangles, this is the offset to the left-side, but for circles, this is the offset to the center
    y - type: number - the y offset from the entity's primary point; for rectangles, this is the offset to the top-side, but for circles, this is the offset to the center
    r - type: number - radius, used only for circles
    w - type: number - width, used only for rectangles
    h - type: number - height, used only for rectangles


#### Response Properties

    a - The first object in the collision.
	a.entity - The first Entity in the collision
    b - The second object in the collison.
	b.entity - The second Entity in the collision
    overlap - Magnitude of the overlap on the shortest colliding axis.
    overlapN - The shortest colliding axis (unit-vector)
    overlapV - The overlap vector (i.e. overlapN.scale(overlap, overlap)). If this vector is subtracted from the position of a, a and b will no longer be colliding.
    aInB - Whether the first object is completely inside the second.
    bInA - Whether the second object is completely inside the first.

