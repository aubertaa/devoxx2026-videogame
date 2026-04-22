<!-- start: Packmind standards -->
# Packmind Standards

Before starting your work, make sure to review the coding standards relevant to your current task.

Always consult the sections that apply to the technology, framework, or type of contribution you are working on.

All rules and guidelines defined in these standards are mandatory and must be followed consistently.

Failure to follow these standards may lead to inconsistencies, errors, or rework. Treat them as the source of truth for how code should be written, structured, and maintained.

# Standard: Vue-Phaser Communication

Standardize Vue 3–Phaser 4 communication in TypeScript using the centralized `EventBus` (`src/game/EventBus.ts`), emitting `current-scene-ready`, managing subscriptions in `onMounted()`/`onUnmounted()`, using `toRaw()` for scene refs, and exposing `scene`/`game` via `defineExpose()` to ensure decoupled, predictable state updates and prevent reactivity and memory issues. :
* Emit `current-scene-ready` event from scenes when they are fully initialized
* Expose `scene` and `game` refs via `defineExpose()` in PhaserGame component for parent access
* Subscribe to EventBus events in Vue `onMounted()` lifecycle hook
* Unsubscribe from events in Vue `onUnmounted()` to prevent memory leaks
* Use `EventBus` from `src/game/EventBus.ts` for all Vue-Phaser communication
* Use `toRaw()` when accessing Phaser scene instances from Vue refs to avoid Vue reactivity proxy issues

Full standard is available here for further request: [Vue-Phaser Communication](.packmind/standards/vue-phaser-communication.md)

# Standard: Phaser Scene Structure

Standardize Phaser.Scene class structure in TypeScript with constructor scene keys via super('SceneName'), create() initialization, EventBus.emit('current-scene-ready', this) Vue notifications, changeScene() transitions using this.scene.start('TargetScene'), and typed properties for cameras/backgrounds/objects to improve consistency and reliable scene-to-Vue coordination. :
* Declare typed class properties for cameras, backgrounds, and game objects
* Define scene key in constructor via `super('SceneName')`
* Extend `Phaser.Scene` (imported from 'phaser')
* Implement `changeScene()` method for scene transitions using `this.scene.start('TargetScene')`
* Implement `create()` method for scene initialization
* Use `EventBus.emit('current-scene-ready', this)` to notify Vue components when scene is ready

Full standard is available here for further request: [Phaser Scene Structure](.packmind/standards/phaser-scene-structure.md)
<!-- end: Packmind standards -->