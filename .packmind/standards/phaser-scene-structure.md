# Phaser Scene Structure

All Phaser game scenes follow a consistent class structure with standardized lifecycle methods and Vue integration patterns.

## Scope

TypeScript files in `src/game/scenes/` that define Phaser Scene classes.

## Rules

* Extend `Phaser.Scene` (imported from 'phaser')
* Define scene key in constructor via `super('SceneName')`
* Implement `create()` method for scene initialization
* Use `EventBus.emit('current-scene-ready', this)` to notify Vue components when scene is ready
* Implement `changeScene()` method for scene transitions using `this.scene.start('TargetScene')`
* Declare typed class properties for cameras, backgrounds, and game objects
