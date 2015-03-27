 * Using SAT (https://github.com/jriecken/sat-js) to detect the collision.
 * Base on devkit-entities (https://github.com/gameclosure/devkit-entities#v0.2.5).
 
## Changelog

- Adding SATPhysics component
- Adding rotate and setAnchor (pivot point) function on Entity
- Supporting detect collision with rotation on any pivot (using SATPhysics)
- Changing response object on EntityPool

## Next features
- Easy to change code to support polygon. Ex: Triangle,...

## Installation and Imports

Add devkit-entities to dependencies in your game's manifest.json:
```
  devkit install https://github.com/tuanna222/devkit-entities.git
```
Import to your project:
```
  import entities.Entity as Entity;
  import entities.SATPhysics as SATPhysics;//if using SATPhysics as custom physics. Default: EntityPhysics
```

## Example
```
var Enemy = Class(Entity, function() {
	var sup = Entity.prototype;
	this.name = "Item";
	this.viewClass = SpriteView;
	
	
	this.update = function(dt) {
		sup.update.call(this, dt);
		//this.setAnchor(5, 5);  rotating around (x, y) 
		this.rotate(Math.PI / 80);
	};
});
```
Add `physics: SATPhysics` to opts param to create Entity:
```
		var opts = {
			...
			physics: SATPhysics,
			isCircle: true,
			...
		}
```
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
		console.log("collision response", response);//SAT.Response
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

####Entity New Methods
 * `setAnchor(x, y)` - Set (x, y) pivot point from origin position of entity. Ex: entity.x = 10, entity.y = 10, setAnchor(5, 5) causing rotate around (15, 15) point on xy axis.
 * `rotate(radians)` - Rotating this entity around anchor point 

####Collision Response Properties

    a - The first object in the collision.
	a.entity - The first Entity in the collision
    b - The second object in the collison.
	b.entity - The second Entity in the collision
    overlap - Magnitude of the overlap on the shortest colliding axis.
    overlapN - The shortest colliding axis (unit-vector)
    overlapV - The overlap vector (i.e. overlapN.scale(overlap, overlap)). If this vector is subtracted from the position of a, a and b will no longer be colliding.
    aInB - Whether the first object is completely inside the second.
    bInA - Whether the second object is completely inside the first.

