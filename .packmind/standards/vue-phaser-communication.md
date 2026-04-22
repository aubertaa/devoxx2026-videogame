# Vue-Phaser Communication

Cross-framework communication between Vue components and Phaser scenes uses a centralized EventBus pattern for decoupled, predictable state updates.

## Scope

TypeScript and Vue files handling communication between Vue 3 components and Phaser 4 game scenes.

## Rules

* Use `EventBus` from `src/game/EventBus.ts` for all Vue-Phaser communication
* Emit `current-scene-ready` event from scenes when they are fully initialized
* Subscribe to EventBus events in Vue `onMounted()` lifecycle hook
* Unsubscribe from events in Vue `onUnmounted()` to prevent memory leaks
* Use `toRaw()` when accessing Phaser scene instances from Vue refs to avoid Vue reactivity proxy issues
* Expose `scene` and `game` refs via `defineExpose()` in PhaserGame component for parent access
