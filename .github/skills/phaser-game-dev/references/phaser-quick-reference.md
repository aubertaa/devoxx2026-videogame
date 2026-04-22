# Phaser 3 Quick Reference

## Core Concepts

### Scene Lifecycle
- `preload()` - Load assets before game starts
- `create()` - Initialize game objects, runs once after preload
- `update(time, delta)` - Game loop, runs every frame

### Common Scene Methods
- `this.add.*` - Add game objects (sprites, text, graphics)
- `this.physics.add.*` - Add physics bodies and colliders
- `this.input.*` - Handle keyboard, mouse, touch input
- `this.time.*` - Timers and delayed calls
- `this.sound.*` - Audio playback
- `this.cameras.main.*` - Camera controls

## Asset Loading

```javascript
// In preload()
this.load.image('key', 'path/to/image.png');
this.load.spritesheet('key', 'path/to/spritesheet.png', { 
    frameWidth: 32, 
    frameHeight: 32 
});
this.load.audio('key', 'path/to/audio.mp3');
this.load.atlas('key', 'texture.png', 'texture.json');
```

## Game Objects

### Sprites
```javascript
// Create sprite
const sprite = this.add.sprite(x, y, 'key');

// With physics
const sprite = this.physics.add.sprite(x, y, 'key');
sprite.setVelocity(100, 200);
sprite.setBounce(0.5);
sprite.setCollideWorldBounds(true);
```

### Text
```javascript
this.add.text(x, y, 'Hello World', {
    fontSize: '32px',
    fill: '#ffffff',
    fontFamily: 'Arial',
    stroke: '#000000',
    strokeThickness: 4
});
```

### Graphics (Shapes)
```javascript
const graphics = this.add.graphics();
graphics.fillStyle(0xff0000, 1); // color, alpha
graphics.fillRect(x, y, width, height);
graphics.fillCircle(x, y, radius);
graphics.lineStyle(2, 0x00ff00, 1);
graphics.strokeRect(x, y, width, height);
```

## Animations

```javascript
// Create animation in create()
this.anims.create({
    key: 'walk',
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1 // -1 for loop
});

// Play animation
sprite.anims.play('walk');
```

## Input Handling

### Keyboard
```javascript
// Create keyboard cursors
this.cursors = this.input.keyboard.createCursorKeys();

// In update()
if (this.cursors.left.isDown) {
    player.setVelocityX(-160);
}

// Specific keys
const spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
    // Jump action
}
```

### Mouse/Touch
```javascript
this.input.on('pointerdown', (pointer) => {
    console.log(pointer.x, pointer.y);
});

// Make object interactive
sprite.setInteractive();
sprite.on('pointerdown', () => {
    // Click handler
});
```

## Physics

### Arcade Physics
```javascript
// Enable physics on game object
this.physics.add.existing(sprite);

// Add collider between two objects/groups
this.physics.add.collider(player, platforms);

// Add overlap detection (no collision)
this.physics.add.overlap(player, coins, collectCoin, null, this);

function collectCoin(player, coin) {
    coin.destroy();
}
```

### Velocity and Movement
```javascript
sprite.setVelocity(x, y);
sprite.setVelocityX(100);
sprite.setAcceleration(x, y);
sprite.setDrag(100); // Friction
sprite.setMaxVelocity(200);
```

## Groups

```javascript
// Create group
const enemies = this.physics.add.group();

// Add to group
enemies.create(x, y, 'enemy');

// Configure all members
enemies.children.iterate((enemy) => {
    enemy.setBounce(1);
    enemy.setVelocity(Phaser.Math.Between(-200, 200), 20);
});
```

## Timers

```javascript
// Delayed call
this.time.delayedCall(1000, () => {
    console.log('1 second passed');
}, [], this);

// Repeating timer
this.time.addEvent({
    delay: 500,
    callback: () => {
        console.log('Every 0.5 seconds');
    },
    loop: true
});
```

## Camera

```javascript
// Follow a sprite
this.cameras.main.startFollow(player);

// Set camera bounds
this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);

// Zoom
this.cameras.main.setZoom(1.5);

// Shake effect
this.cameras.main.shake(500, 0.01);

// Flash effect
this.cameras.main.flash(250);
```

## Tweens (Animations)

```javascript
this.tweens.add({
    targets: sprite,
    x: 400,
    y: 300,
    alpha: 0.5,
    duration: 1000,
    ease: 'Power2',
    yoyo: true,
    repeat: -1
});
```

## Particles

```javascript
const particles = this.add.particles('particle');
const emitter = particles.createEmitter({
    speed: 100,
    scale: { start: 1, end: 0 },
    blendMode: 'ADD'
});

// Follow a sprite
emitter.startFollow(sprite);
```

## Audio

```javascript
// In preload()
this.load.audio('music', 'assets/music.mp3');

// In create()
const music = this.sound.add('music', { loop: true });
music.play();

// Sound effects
const jumpSound = this.sound.add('jump');
jumpSound.play();
```

## Utility Functions

### Random Numbers
```javascript
Phaser.Math.Between(min, max); // Random integer
Phaser.Math.FloatBetween(min, max); // Random float
```

### Distance
```javascript
const distance = Phaser.Math.Distance.Between(x1, y1, x2, y2);
```

### Angle
```javascript
const angle = Phaser.Math.Angle.Between(x1, y1, x2, y2);
sprite.rotation = angle;
```

## Common Patterns

### Player Movement
```javascript
update() {
    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-160);
        this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(160);
        this.player.anims.play('right', true);
    } else {
        this.player.setVelocityX(0);
        this.player.anims.play('idle');
    }
    
    if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(-330);
    }
}
```

### Score/HUD
```javascript
// In create()
this.score = 0;
this.scoreText = this.add.text(16, 16, 'Score: 0', {
    fontSize: '32px',
    fill: '#000'
});

// Update score
this.score += 10;
this.scoreText.setText('Score: ' + this.score);
```

### Game Over/Restart
```javascript
gameOver() {
    this.physics.pause();
    this.add.text(400, 300, 'Game Over', {
        fontSize: '64px',
        fill: '#ff0000'
    }).setOrigin(0.5);
    
    // Restart after delay
    this.time.delayedCall(2000, () => {
        this.scene.restart();
    });
}
```
