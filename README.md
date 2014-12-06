DevKit Entities Module
======================

Entity serves as a base class for game elements in DevKit. It provides functionality for coordinates in a game-space; circular and rectangular bounds for offsetting views and hitboxes; implicit view management; basic physics including velocity, acceleration, and collisions; and a lifecycle interface to easily facilitate entity pooling.

This module includes the Entity base class, EntityPhysics as a default physics component, and EntityPool to efficiently recycle entities.

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

Entity is intended to be the base class of any game element that exists in a 2D game-space. Here's an example of what a Bullet class that inherits Entity might look like:
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

When overriding a function that exists in the Entity class, you almost always want to call the super function, so that you keep the default behavior of entities intact. It's best to use `Entity.prototype._fn_name_.call()` to avoid array allocations incurred by using `.apply()`, especially if you have many instances of your class. In this example, I save a reference `sup` to the `Entity.prototype` for ease of use.

It's also important to note the differences between *Prototype Properties* and *Instance Properties*. In the above example, `name` is a *Prototype Property* shared by all instances of class Bullet, while `damage` is an *Instance Property* that may vary from bullet to bullet.

#### Instance Properties

TODO: ...

#### Prototype Properties

TODO: ...

### Entity Lifecycle

TODO: ...

### Entity Config

TODO: ...

## EntityPhysics.js

TODO: ...

## EntityPool.js

TODO: ...

## Example Game

TODO: Link
