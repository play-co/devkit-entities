DevKit Entities Module
======================

Entity serves as a base class for game elements in DevKit. It provides functionality for coordinates in a game-space; circular and rectangular bounds for offsetting views and hitboxes; implicit view management; basic physics including velocity, acceleration, and collisions; and a lifecycle interface to easily facilitate entity pooling.

This module includes the Entity base class, EntityPhysics as a default physics component, and EntityPool to efficiently recycle entities.

## Installation and Imports

Just add devkit-entities to your dependencies in your game's manifest.json, like this:
```
  "dependencies": {
    "devkit-entities": "https://github.com/gameclosure/devkit-entities#v0.2.1"
  },
```

Change the `v0.2.1` to whatever tag of entities you want to use. Once this is in place, run `devkit install` within your game project's directory. Once you've installed devkit-entities, you can now import any of the entity files, like this:
```
  import entities.Entity as Entity;
```

## Entity.js

TODO: ...

### Inheriting Entity

TODO: ...

## EntityPhysics.js

TODO: ...

## EntityPool.js

TODO: ...
