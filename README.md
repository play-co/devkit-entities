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

TODO: ...

#### Entity Prototype Properties

TODO: ...

## EntityPhysics.js

TODO: ...

## EntityPool.js

TODO: ...

## Example Game

TODO: Link
