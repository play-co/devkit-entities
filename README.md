Devkit Entities Module
======================

`Entity` serves as a base class for game elements in devkit. It provides functionality for coordinates in a game-space; circular and rectangular bounds for offsetting views and hitboxes; implicit view management; basic physics including velocity, acceleration, and collisions; and a lifecycle interface to easily facilitate pooling.

## Installation and Imports

Run this command to install devkit-entities as a dependency in your project:
```
  devkit install https://github.com/gameclosure/devkit-entities.git
```

Once installed, you can import classes from this module like this:
```
  import entities.Entity as Entity;
```

## Docs

We use JSDoc to generate documentation, here's the latest: [devkit-entities docs](http://docgen.js.io/gameclosure/devkit-entities/branch/master/).

## Examples

Open source examples built on devkit with this module:

 * [Scene.js](http://www.gameclosure.com/devkit-scene) (devkit-entities v0.5.0)
 * [Drone Swarm](https://github.com/weebygames/swarm) (devkit-entities v0.2.4)