---
applyTo: '**'
---
# Standard: Phaser Scene Structure

Standardize Phaser.Scene class structure in TypeScript with constructor scene keys via super('SceneName'), create() initialization, EventBus.emit('current-scene-ready', this) Vue notifications, changeScene() transitions using this.scene.start('TargetScene'), and typed properties for cameras/backgrounds/objects to improve consistency and reliable scene-to-Vue coordination. :
* Declare typed class properties for cameras, backgrounds, and game objects
* Define scene key in constructor via `super('SceneName')`
* Extend `Phaser.Scene` (imported from 'phaser')
* Implement `changeScene()` method for scene transitions using `this.scene.start('TargetScene')`
* Implement `create()` method for scene initialization
* Use `EventBus.emit('current-scene-ready', this)` to notify Vue components when scene is ready

Full standard is available here for further request: [Phaser Scene Structure](../../.packmind/standards/phaser-scene-structure.md)