# Common Phaser Game Patterns

## Platform Game Pattern

### Basic Setup
- Gravity enabled (usually y: 300-800)
- Player sprite with physics
- Platform group with static physics bodies
- Collision between player and platforms
- Keyboard controls for left/right movement and jumping

### Key Features
```javascript
// Player can only jump when touching ground
if (this.cursors.up.isDown && this.player.body.touching.down) {
    this.player.setVelocityY(-330);
}

// Create platforms
const platforms = this.physics.add.staticGroup();
platforms.create(400, 568, 'ground').setScale(2).refreshBody();
platforms.create(600, 400, 'ground');
```

## Top-Down Game Pattern

### Basic Setup
- No gravity (set to 0)
- 4-directional or 8-directional movement
- Velocity-based movement
- Optional world bounds

### Key Features
```javascript
// 4-directional movement
if (this.cursors.left.isDown) {
    this.player.setVelocityX(-160);
} else if (this.cursors.right.isDown) {
    this.player.setVelocityX(160);
} else {
    this.player.setVelocityX(0);
}

if (this.cursors.up.isDown) {
    this.player.setVelocityY(-160);
} else if (this.cursors.down.isDown) {
    this.player.setVelocityY(160);
} else {
    this.player.setVelocityY(0);
}
```

## Shooter Game Pattern

### Basic Setup
- Projectile group
- Enemy group
- Overlap detection for hits
- Score system

### Key Features
```javascript
// Shoot on spacebar
if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
    const bullet = this.bullets.create(
        this.player.x, 
        this.player.y, 
        'bullet'
    );
    bullet.setVelocityY(-300);
}

// Check for hits
this.physics.add.overlap(
    this.bullets, 
    this.enemies, 
    hitEnemy, 
    null, 
    this
);

function hitEnemy(bullet, enemy) {
    bullet.destroy();
    enemy.destroy();
    this.score += 10;
}
```

## Endless Runner Pattern

### Basic Setup
- Auto-scrolling background or obstacles
- Player with limited movement (usually vertical only)
- Obstacle generation loop
- Increasing difficulty over time

### Key Features
```javascript
// Spawn obstacles continuously
this.time.addEvent({
    delay: 1500,
    callback: spawnObstacle,
    callbackScope: this,
    loop: true
});

function spawnObstacle() {
    const obstacle = this.obstacles.create(800, 400, 'obstacle');
    obstacle.setVelocityX(-200);
}

// Clean up off-screen objects
this.obstacles.children.iterate((obstacle) => {
    if (obstacle && obstacle.x < -50) {
        obstacle.destroy();
    }
});
```

## Puzzle Game Pattern

### Basic Setup
- Grid-based layout
- Input on grid cells
- Match detection logic
- Animation for matches/clears

### Key Features
```javascript
// Create grid
for (let row = 0; row < 8; row++) {
    this.grid[row] = [];
    for (let col = 0; col < 8; col++) {
        const x = col * 64 + 32;
        const y = row * 64 + 32;
        const tile = this.add.sprite(x, y, 'tiles', randomFrame);
        tile.setInteractive();
        tile.on('pointerdown', () => selectTile(row, col));
        this.grid[row][col] = tile;
    }
}
```

## Card Game Pattern

### Basic Setup
- Card objects with data
- Hand container/group
- Drag and drop input
- Turn-based logic

### Key Features
```javascript
card.setInteractive({ draggable: true });

this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
    gameObject.x = dragX;
    gameObject.y = dragY;
});

this.input.on('dragend', (pointer, gameObject) => {
    // Check if card is in valid drop zone
    // Play card or return to hand
});
```

## Click/Tap Game Pattern (Clicker Games)

### Basic Setup
- Interactive target objects
- Click/tap detection
- Resource accumulation
- Upgrade system

### Key Features
```javascript
const target = this.add.sprite(400, 300, 'target');
target.setInteractive();

target.on('pointerdown', () => {
    this.clicks++;
    this.clicksText.setText('Clicks: ' + this.clicks);
    
    // Visual feedback
    this.tweens.add({
        targets: target,
        scaleX: 0.9,
        scaleY: 0.9,
        duration: 100,
        yoyo: true
    });
});
```

## Memory/Matching Game Pattern

### Basic Setup
- Grid of face-down cards
- Flip animation
- Match checking logic
- Win condition

### Key Features
```javascript
card.on('pointerdown', () => {
    if (this.flippedCards.length < 2 && !card.flipped) {
        card.flipCard();
        this.flippedCards.push(card);
        
        if (this.flippedCards.length === 2) {
            this.time.delayedCall(1000, checkMatch, [], this);
        }
    }
});

function checkMatch() {
    const [card1, card2] = this.flippedCards;
    if (card1.type === card2.type) {
        // Match found
        card1.matched = true;
        card2.matched = true;
    } else {
        // No match, flip back
        card1.flipBack();
        card2.flipBack();
    }
    this.flippedCards = [];
}
```

## Common UI Patterns

### Main Menu
```javascript
const playButton = this.add.text(400, 300, 'Play', {
    fontSize: '48px',
    fill: '#ffffff'
}).setOrigin(0.5);

playButton.setInteractive();
playButton.on('pointerdown', () => {
    this.scene.start('GameScene');
});

playButton.on('pointerover', () => {
    playButton.setStyle({ fill: '#ffff00' });
});

playButton.on('pointerout', () => {
    playButton.setStyle({ fill: '#ffffff' });
});
```

### Pause Menu
```javascript
// In create()
this.input.keyboard.on('keydown-ESC', () => {
    this.scene.pause();
    this.scene.launch('PauseScene');
});
```

### Health Bar
```javascript
class HealthBar {
    constructor(scene, x, y, maxHealth) {
        this.bar = scene.add.graphics();
        this.x = x;
        this.y = y;
        this.maxHealth = maxHealth;
        this.value = maxHealth;
        this.draw();
    }
    
    decrease(amount) {
        this.value -= amount;
        if (this.value < 0) this.value = 0;
        this.draw();
    }
    
    draw() {
        this.bar.clear();
        const width = 200;
        const height = 20;
        
        // Background
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, width, height);
        
        // Health
        const healthWidth = (this.value / this.maxHealth) * width;
        const color = this.value > 50 ? 0x00ff00 : 0xff0000;
        this.bar.fillStyle(color);
        this.bar.fillRect(this.x, this.y, healthWidth, height);
    }
}
```
