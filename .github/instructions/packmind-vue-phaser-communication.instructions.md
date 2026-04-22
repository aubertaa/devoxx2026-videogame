---
applyTo: '**'
---
# Standard: Vue-Phaser Communication

Standardize Vue 3–Phaser 4 communication in TypeScript using the centralized `EventBus` (`src/game/EventBus.ts`), emitting `current-scene-ready`, managing subscriptions in `onMounted()`/`onUnmounted()`, using `toRaw()` for scene refs, and exposing `scene`/`game` via `defineExpose()` to ensure decoupled, predictable state updates and prevent reactivity and memory issues. :
* Emit `current-scene-ready` event from scenes when they are fully initialized
* Expose `scene` and `game` refs via `defineExpose()` in PhaserGame component for parent access
* Subscribe to EventBus events in Vue `onMounted()` lifecycle hook
* Unsubscribe from events in Vue `onUnmounted()` to prevent memory leaks
* Use `EventBus` from `src/game/EventBus.ts` for all Vue-Phaser communication
* Use `toRaw()` when accessing Phaser scene instances from Vue refs to avoid Vue reactivity proxy issues

Full standard is available here for further request: [Vue-Phaser Communication](../../.packmind/standards/vue-phaser-communication.md)