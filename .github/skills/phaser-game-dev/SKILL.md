---
name: phaser-game-dev
description: Create HTML5 games using Phaser 3 framework. Use this skill when the user wants to make a game, HTML game, Phaser game, 2D game, browser game, or mentions any game genre like platformer, shooter, puzzle, top-down, endless runner, or card game. Also trigger for requests to add game features, fix game code, or modify existing Phaser games.
---

# Phaser Game Development

Create engaging HTML5 games using the Phaser 3 framework with physics, animations, and interactive gameplay.

## Quick Start

### Creating a New Game

1. Start with the base template from `assets/game-template.html`
2. Identify the game type (platformer, top-down, shooter, puzzle, etc.)
3. Consult `references/game-patterns.md` for the appropriate pattern
4. Use `references/phaser-quick-reference.md` for Phaser API details
5. Build the game iteratively: setup → basic mechanics → features → polish

### Workflow for Game Creation

**Step 1: Understand Requirements**
- What type of game? (platformer, shooter, puzzle, top-down, etc.)
- What are the core mechanics? (jumping, shooting, matching, etc.)
- What assets are needed? (player, enemies, platforms, etc.)

**Step 2: Set Up Config**
- Choose appropriate dimensions (default: 800x600)
- Configure physics based on game type:
  - Platformer: `gravity: { y: 300 }` or higher
  - Top-down: `gravity: { y: 0 }`
  - Shooter: Varies based on orientation
- Set background color

**Step 3: Create Game Objects**
- Use simple colored rectangles or circles for prototyping
- Use `this.add.graphics()` to draw shapes when assets aren't available
- Implement player controls based on game type
- Add obstacles, enemies, or interactive elements

**Step 4: Implement Game Logic**
- Add collision/overlap detection
- Implement scoring system
- Add win/lose conditions
- Handle game states (playing, paused, game over)

**Step 5: Polish**
- Add visual feedback (tweens, particles)
- Implement sound effects (if requested)
- Add UI elements (score display, health bars, menus)
- Fine-tune physics and controls

## Asset Handling

### When Assets Are Not Provided

Games can be fully functional without image assets. Use these techniques:

**Graphics API for shapes:**
```javascript
const graphics = this.add.graphics();
graphics.fillStyle(0x00ff00, 1);
graphics.fillRect(0, 0, 50, 50); // Player square
graphics.fillCircle(25, 25, 15); // Enemy circle
```

**Text as placeholders:**
```javascript
const player = this.add.text(x, y, '🎮', { fontSize: '32px' });
this.physics.add.existing(player);
```

**Generate programmatic sprites:**
```javascript
// Create a simple colored rectangle sprite
const graphics = this.make.graphics({ x: 0, y: 0, add: false });
graphics.fillStyle(0xff0000);
graphics.fillRect(0, 0, 32, 32);
graphics.generateTexture('player', 32, 32);
graphics.destroy();

// Now use as sprite
const player = this.add.sprite(x, y, 'player');
```

### Using External Assets

When the user provides image URLs or wants to use specific assets:
```javascript
this.load.image('player', 'https://example.com/player.png');
this.load.spritesheet('enemy', 'url', { frameWidth: 32, frameHeight: 32 });
```

For local development, note that the file must be served via HTTP (not file://).

## Common Game Types

### Platformer
- Gravity enabled
- Player physics body
- Static platforms group
- Jump controls (only when on ground)
- See `references/game-patterns.md` for complete pattern

### Top-Down
- No gravity
- 4 or 8-directional movement
- Velocity-based controls
- Optional world bounds

### Shooter
- Projectile group
- Enemy spawning system
- Collision detection for hits
- Score tracking

### Puzzle
- Grid-based layout
- Click/touch interactions
- Match detection logic
- Win condition checking

### Endless Runner
- Auto-scrolling mechanics
- Procedural obstacle generation
- Distance-based scoring
- Increasing difficulty

## Important Phaser Concepts

### Scene Lifecycle Methods
- `preload()` - Load assets (runs once)
- `create()` - Initialize game (runs once after preload)
- `update(time, delta)` - Game loop (runs every frame)

### Physics
- Use `this.physics.add.sprite()` for movable objects with physics
- Use `this.physics.add.staticGroup()` for platforms/walls
- Use `this.physics.add.collider()` for collision between objects
- Use `this.physics.add.overlap()` for detection without collision

### Input
- `this.input.keyboard.createCursorKeys()` for arrow keys
- `this.input.keyboard.addKey()` for specific keys
- `gameObject.setInteractive()` + event listeners for click/touch
- Use `Phaser.Input.Keyboard.JustDown()` for single-press detection

## Best Practices

1. **Always use single-file HTML structure** - Include Phaser CDN and all code in one file
2. **Use Phaser CDN**: `https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js`
3. **Start simple** - Get basic mechanics working before adding complexity
4. **Use groups** - For multiple similar objects (enemies, bullets, collectibles)
5. **Clean up** - Destroy off-screen objects to improve performance
6. **Physics bounds** - Set `setCollideWorldBounds(true)` to keep objects on screen
7. **Debug mode** - Set `debug: true` in physics config during development

## References

- **Phaser API Quick Reference**: See `references/phaser-quick-reference.md` for detailed API documentation, common methods, and code snippets
- **Game Patterns**: See `references/game-patterns.md` for complete implementation patterns for different game types
- **Base Template**: Use `assets/game-template.html` as starting point for all games

## Common Issues and Solutions

**Problem**: Game doesn't start
- Check browser console for errors
- Ensure Phaser CDN is loaded
- Verify config object is properly formatted

**Problem**: Physics not working
- Ensure physics is enabled in config
- Use `this.physics.add.sprite()` not `this.add.sprite()` for physics objects
- Check that colliders/overlaps are set up correctly

**Problem**: Controls not responding
- Verify input is set up in `create()` not `preload()`
- Check update() function is reading input correctly
- For jump, ensure player is on ground (`body.touching.down`)

**Problem**: Objects fall through platforms
- Use `staticGroup()` for platforms
- Ensure collider is added between player and platforms
- For static platforms, call `.refreshBody()` after changing scale

## Creating Complete Games

When creating a complete game:
1. Always create a single, self-contained HTML file
2. Include clear comments explaining game mechanics
3. Implement basic UI (score, instructions)
4. Add win/lose conditions
5. Include restart functionality
6. Test all game mechanics work correctly
