# Packmind Standards Index

This standards index contains all available coding standards that can be used by AI agents (like Cursor, Claude Code, GitHub Copilot) to find and apply proven practices in coding tasks.

## Available Standards

- [Phaser Scene Structure](./standards/phaser-scene-structure.md) : Standardize Phaser.Scene class structure in TypeScript with constructor scene keys via super('SceneName'), create() initialization, EventBus.emit('current-scene-ready', this) Vue notifications, changeScene() transitions using this.scene.start('TargetScene'), and typed properties for cameras/backgrounds/objects to improve consistency and reliable scene-to-Vue coordination.
- [Vue-Phaser Communication](./standards/vue-phaser-communication.md) : Standardize Vue 3–Phaser 4 communication in TypeScript using the centralized `EventBus` (`src/game/EventBus.ts`), emitting `current-scene-ready`, managing subscriptions in `onMounted()`/`onUnmounted()`, using `toRaw()` for scene refs, and exposing `scene`/`game` via `defineExpose()` to ensure decoupled, predictable state updates and prevent reactivity and memory issues.


---

*This standards index was automatically generated from deployed standard versions.*