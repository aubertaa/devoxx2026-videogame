# Create Phaser Scene

Scaffold a new Phaser scene with the standard project structure, including TypeScript typing, EventBus integration, and scene registration.

## When to Use

- Adding a new game state (e.g., pause menu, level select, credits)
- Creating a new gameplay level or area
- Building a new UI overlay scene

## Checkpoints

- What is the scene name (PascalCase, e.g., "LevelSelect")?
- Does this scene need Vue component communication?
- What scene should this transition to (if any)?

## Steps

### 1. Create Scene File

Create `src/game/scenes/{SceneName}.ts` with standard structure:

```typescript
import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class {SceneName} extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;

    constructor()
    {
        super('{SceneName}');
    }

    create()
    {
        this.camera = this.cameras.main;
        // Initialize scene objects here
        
        EventBus.emit('current-scene-ready', this);
    }

    changeScene()
    {
        this.scene.start('{NextScene}');
    }
}
```

### 2. Register Scene

Add import and registration in `src/game/main.ts`:

```typescript
import { {SceneName} } from './scenes/{SceneName}';

// Add to scene array in config
scene: [
    // ... existing scenes
    {SceneName}
]
```

### 3. Update Type Definitions (if needed)

If this scene has Vue-callable methods, update `src/App.vue` imports if needed.
