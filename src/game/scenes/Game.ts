import { EventBus } from '../EventBus';
import {
  Scene,
  Cameras,
  GameObjects,
  Physics,
  Input,
  Time,
  Math as PhaserMath,
  Types,
} from 'phaser';
import { Player } from '../objects/Player';
import { Pattern } from '../objects/Pattern';
import { Bug } from '../objects/Bug';
import { ScoreManager } from '../systems/ScoreManager';
import { CodeAnalyzer } from '../systems/CodeAnalyzer';
import {
  COLORS,
  COLORS_HEX,
  GAME_CONFIG,
  PHYSICS,
  SPAWN,
  PATTERNS,
  SCORING,
  type PatternId,
} from '../config/gameConfig';
import {
  initAccessibility,
  announceGameEvent,
  cleanupAccessibility,
  shouldReduceMotion,
  getAnimationDuration,
} from '../utils/accessibility';

/**
 * Main Game Scene - Craft Runner Endless Runner
 * Devoxx 2026 Edition
 */
export class Game extends Scene {
  // Camera and background
  camera!: Cameras.Scene2D.Camera;
  backgroundTiles: GameObjects.TileSprite[] = [];
  ground!: GameObjects.TileSprite;
  groundBody!: Physics.Arcade.StaticGroup;

  // Game objects
  player!: Player;
  patterns!: GameObjects.Group;
  bugs!: GameObjects.Group;

  // Systems
  scoreManager!: ScoreManager;

  // UI elements
  xpText!: GameObjects.Text;
  levelText!: GameObjects.Text;
  progressBarBg!: GameObjects.Graphics;
  progressBarFill!: GameObjects.Graphics;
  pauseOverlay!: GameObjects.Container;

  // Input
  jumpKey!: Input.Keyboard.Key;
  pauseKey!: Input.Keyboard.Key;
  resumeKey!: Input.Keyboard.Key;
  quitKey!: Input.Keyboard.Key;

  // Game state
  isPaused = false;
  isGameOver = false;
  currentScrollSpeed = PHYSICS.BASE_SCROLL_SPEED;

  // Spawn timers
  patternTimer!: Time.TimerEvent;
  bugTimer!: Time.TimerEvent;

  // Spawn counter for bonus patterns
  patternSpawnCount = 0;

  constructor() {
    super('Game');
  }

  create(): void {
    // Initialize accessibility
    initAccessibility();

    // Setup camera
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(COLORS.BACKGROUND);

    // Create scrolling background layers
    this.createBackground();

    // Create ground platform
    this.createGround();

    // Create player
    this.createPlayer();

    // Create groups for collectibles and enemies
    this.patterns = this.add.group();
    this.bugs = this.add.group();

    // Initialize score manager
    this.scoreManager = new ScoreManager();

    // Create UI
    this.createUI();

    // Setup input
    this.setupInput();

    // Setup collisions
    this.setupCollisions();

    // Start spawning
    this.startSpawning();

    // Announce game start
    announceGameEvent('game_start');

    // Emit scene ready event for Vue integration
    EventBus.emit('current-scene-ready', this);

    // Listen for level up events to adjust speed
    EventBus.on('level-up', this.onLevelUp, this);
  }

  /**
   * Create parallax scrolling background
   */
  private createBackground(): void {
    const { WIDTH, HEIGHT, GROUND_HEIGHT } = GAME_CONFIG;

    // Create a simple graphics texture for background if not preloaded
    const bgGraphics = this.add.graphics();
    bgGraphics.fillStyle(COLORS.DEVOXX_BLUE, 0.3);
    bgGraphics.fillRect(0, 0, WIDTH, HEIGHT - GROUND_HEIGHT);
    bgGraphics.generateTexture('bg_layer', WIDTH, HEIGHT - GROUND_HEIGHT);
    bgGraphics.destroy();

    // Create scrolling background tile
    const bgTile = this.add.tileSprite(
      WIDTH / 2,
      (HEIGHT - GROUND_HEIGHT) / 2,
      WIDTH,
      HEIGHT - GROUND_HEIGHT,
      'bg_layer'
    );
    bgTile.setDepth(-10);
    this.backgroundTiles.push(bgTile);

    // Add decorative elements (code symbols floating in background)
    this.createBackgroundDecorations();
  }

  /**
   * Create floating code symbols in background
   */
  private createBackgroundDecorations(): void {
    // Skip animated decorations if user prefers reduced motion
    if (shouldReduceMotion()) return;

    const symbols = ['{ }', '< />', '( )', '[ ]', '//'];
    const { WIDTH, HEIGHT, GROUND_HEIGHT } = GAME_CONFIG;

    for (let i = 0; i < 10; i++) {
      const symbol = symbols[PhaserMath.Between(0, symbols.length - 1)];
      const x = PhaserMath.Between(0, WIDTH);
      const y = PhaserMath.Between(50, HEIGHT - GROUND_HEIGHT - 100);

      const text = this.add.text(x, y, symbol, {
        fontSize: '24px',
        color: COLORS_HEX.DEVOXX_WHITE,
        fontFamily: 'monospace',
      });
      text.setAlpha(0.15);
      text.setDepth(-5);

      // Slow drift animation (safe: < 3 flashes/second)
      this.tweens.add({
        targets: text,
        x: x - WIDTH - 100,
        duration: PhaserMath.Between(15000, 25000),
        repeat: -1,
        onRepeat: () => {
          text.x = WIDTH + 50;
          text.y = PhaserMath.Between(50, HEIGHT - GROUND_HEIGHT - 100);
        },
      });
    }
  }

  /**
   * Create ground platform with physics
   */
  private createGround(): void {
    const { WIDTH, HEIGHT, GROUND_HEIGHT } = GAME_CONFIG;

    // Create ground texture
    const groundGraphics = this.add.graphics();
    groundGraphics.fillStyle(COLORS.DEVOXX_BLACK, 1);
    groundGraphics.fillRect(0, 0, 64, GROUND_HEIGHT);
    groundGraphics.lineStyle(2, COLORS.DEVOXX_ORANGE, 1);
    groundGraphics.lineBetween(0, 0, 64, 0);
    groundGraphics.generateTexture('ground_tile', 64, GROUND_HEIGHT);
    groundGraphics.destroy();

    // Create scrolling ground
    this.ground = this.add.tileSprite(
      WIDTH / 2,
      HEIGHT - GROUND_HEIGHT / 2,
      WIDTH,
      GROUND_HEIGHT,
      'ground_tile'
    );
    this.ground.setDepth(0);

    // Create static physics body for ground collision
    this.groundBody = this.physics.add.staticGroup();
    const groundCollider = this.groundBody.create(
      WIDTH / 2,
      HEIGHT - GROUND_HEIGHT / 2,
      undefined
    ) as Physics.Arcade.Sprite;
    groundCollider.setVisible(false);
    groundCollider.setSize(WIDTH, GROUND_HEIGHT);
    groundCollider.refreshBody();
  }

  /**
   * Create player character
   */
  private createPlayer(): void {
    const { PLAYER_START_X, GROUND_HEIGHT } = GAME_CONFIG;
    const playerY = GAME_CONFIG.HEIGHT - GROUND_HEIGHT - 20;

    this.player = new Player(this, PLAYER_START_X, playerY);
  }

  /**
   * Create UI elements (XP, level, progress bar)
   */
  private createUI(): void {
    const padding = 20;

    // XP display
    this.xpText = this.add.text(padding, padding, 'XP: 0', {
      fontSize: '24px',
      color: COLORS_HEX.UI_TEXT,
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
    });
    this.xpText.setStroke('#000000', 4);
    this.xpText.setDepth(100);

    // Level display
    this.levelText = this.add.text(padding, padding + 35, 'Level 1: Junior Developer', {
      fontSize: '18px',
      color: COLORS_HEX.DEVOXX_ORANGE,
      fontFamily: 'Arial, sans-serif',
    });
    this.levelText.setStroke('#000000', 3);
    this.levelText.setDepth(100);

    // Progress bar background
    this.progressBarBg = this.add.graphics();
    this.progressBarBg.fillStyle(0x333333, 0.8);
    this.progressBarBg.fillRoundedRect(padding, padding + 65, 200, 16, 8);
    this.progressBarBg.setDepth(100);

    // Progress bar fill
    this.progressBarFill = this.add.graphics();
    this.progressBarFill.setDepth(100);
    this.updateProgressBar(0);

    // Create pause overlay (hidden initially)
    this.createPauseOverlay();
  }

  /**
   * Create pause overlay UI
   */
  private createPauseOverlay(): void {
    const { WIDTH, HEIGHT } = GAME_CONFIG;

    this.pauseOverlay = this.add.container(WIDTH / 2, HEIGHT / 2);

    // Semi-transparent background
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.7);
    bg.fillRect(-WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT);

    // Pause text
    const pauseText = this.add.text(0, -30, 'PAUSED', {
      fontSize: '48px',
      color: COLORS_HEX.DEVOXX_WHITE,
      fontFamily: 'Arial Black',
    });
    pauseText.setOrigin(0.5);
    pauseText.setStroke('#000000', 6);

    // Instructions for resume and quit
    const resumeInstr = this.add.text(0, 40, 'Press ENTER or ESC to resume', {
      fontSize: '20px',
      color: COLORS_HEX.DEVOXX_ORANGE,
      fontFamily: 'Arial, sans-serif',
    });
    resumeInstr.setOrigin(0.5);

    const quitInstr = this.add.text(0, 70, 'Press Q to quit to menu', {
      fontSize: '18px',
      color: COLORS_HEX.DEVOXX_WHITE,
      fontFamily: 'Arial, sans-serif',
    });
    quitInstr.setOrigin(0.5);

    this.pauseOverlay.add([bg, pauseText, resumeInstr, quitInstr]);
    this.pauseOverlay.setDepth(200);
    this.pauseOverlay.setVisible(false);
  }

  /**
   * Update progress bar display
   */
  private updateProgressBar(progress: number): void {
    const padding = 20;
    const barWidth = 200;
    const barHeight = 16;
    const fillWidth = Math.max(0, Math.min(progress, 100)) * (barWidth - 4) / 100;

    this.progressBarFill.clear();
    this.progressBarFill.fillStyle(COLORS.DEVOXX_ORANGE, 1);
    this.progressBarFill.fillRoundedRect(padding + 2, padding + 67, fillWidth, barHeight - 4, 6);
  }

  /**
   * Setup keyboard and pointer input
   */
  private setupInput(): void {
    // Jump with Space
    this.jumpKey = this.input.keyboard!.addKey(Input.Keyboard.KeyCodes.SPACE);

    // Pause with Escape
    this.pauseKey = this.input.keyboard!.addKey(Input.Keyboard.KeyCodes.ESC);

    // Resume with Enter (when paused)
    this.resumeKey = this.input.keyboard!.addKey(Input.Keyboard.KeyCodes.ENTER);

    // Quit to menu with Q (when paused)
    this.quitKey = this.input.keyboard!.addKey(Input.Keyboard.KeyCodes.Q);

    // Jump on pointer down (click/touch)
    this.input.on('pointerdown', () => {
      if (!this.isPaused && !this.isGameOver) {
        this.player.jump();
      }
    });
  }

  /**
   * Setup collision detection
   */
  private setupCollisions(): void {
    // Player collides with ground
    this.physics.add.collider(this.player, this.groundBody);

    // Player overlaps with patterns (collectibles)
    this.physics.add.overlap(
      this.player,
      this.patterns,
      this.collectPattern as Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    // Player overlaps with bugs (enemies)
    this.physics.add.overlap(
      this.player,
      this.bugs,
      this.hitBug as Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );
  }

  /**
   * Start spawning patterns and bugs
   */
  private startSpawning(): void {
    this.schedulePatternSpawn();
    this.scheduleBugSpawn();
  }

  /**
   * Schedule next pattern spawn
   */
  private schedulePatternSpawn(): void {
    const interval = Math.max(
      SPAWN.MIN_INTERVAL,
      SPAWN.PATTERN_INTERVAL_BASE * this.scoreManager.getSpawnMultiplier()
    );

    this.patternTimer = this.time.delayedCall(interval, () => {
      if (!this.isPaused && !this.isGameOver) {
        this.spawnPattern();
      }
      this.schedulePatternSpawn();
    });
  }

  /**
   * Schedule next bug spawn
   */
  private scheduleBugSpawn(): void {
    const interval = Math.max(
      SPAWN.MIN_INTERVAL,
      SPAWN.BUG_INTERVAL_BASE * this.scoreManager.getSpawnMultiplier()
    );

    this.bugTimer = this.time.delayedCall(interval, () => {
      if (!this.isPaused && !this.isGameOver) {
        this.spawnBug();
      }
      this.scheduleBugSpawn();
    });
  }

  /**
   * Spawn a pattern collectible
   */
  private spawnPattern(): void {
    const { WIDTH, HEIGHT, GROUND_HEIGHT } = GAME_CONFIG;

    this.patternSpawnCount++;

    // Every 4th pattern is a bonus pattern (self-referential from CodeAnalyzer)
    const isBonus = this.patternSpawnCount % 4 === 0;

    let patternId: PatternId;
    if (isBonus) {
      // Use CodeAnalyzer to get pattern type from actual codebase snippets
      patternId = CodeAnalyzer.getBonusPatternId();
    } else {
      // Random pattern type for normal patterns
      const patternIndex = PhaserMath.Between(0, PATTERNS.length - 1);
      patternId = PATTERNS[patternIndex].id;
    }

    // Random Y position (above ground, reachable by jump)
    const minY = 200;
    const maxY = HEIGHT - GROUND_HEIGHT - 80;
    const y = PhaserMath.Between(minY, maxY);

    const pattern = new Pattern(this, WIDTH + 50, y, patternId, isBonus);
    pattern.setScrollSpeed(this.currentScrollSpeed);
    this.patterns.add(pattern);
  }

  /**
   * Spawn a bug enemy
   */
  private spawnBug(): void {
    const { WIDTH, HEIGHT, GROUND_HEIGHT } = GAME_CONFIG;

    // Random Y position (mostly ground level, some flying)
    const isFlying = Math.random() < 0.3;
    const y = isFlying
      ? PhaserMath.Between(200, HEIGHT - GROUND_HEIGHT - 150)
      : HEIGHT - GROUND_HEIGHT - 40;

    const bug = new Bug(this, WIDTH + 50, y);
    bug.setScrollSpeed(this.currentScrollSpeed);
    this.bugs.add(bug);
  }

  /**
   * Handle pattern collection
   */
  private collectPattern(
    _player: GameObjects.GameObject,
    patternObj: GameObjects.GameObject
  ): void {
    const pattern = patternObj as Pattern;

    // Add XP
    this.scoreManager.collectPattern(
      pattern.getPatternId(),
      pattern.getPatternName(),
      pattern.isPatternBonus()
    );

    // Visual feedback
    this.player.playCollectAnimation();
    pattern.collect();

    // Update UI
    this.updateUI();
  }

  /**
   * Handle bug collision
   */
  private hitBug(
    _player: GameObjects.GameObject,
    bugObj: GameObjects.GameObject
  ): void {
    const bug = bugObj as Bug;

    // Subtract XP
    this.scoreManager.hitBug(bug.getBugName());

    // Visual feedback
    this.player.playHitAnimation();
    bug.hit();

    // Update UI
    this.updateUI();

    // Check for game over (optional: XP reaches 0)
    if (this.scoreManager.getXP() <= 0 && this.scoreManager.getScoreData().bugsHit >= 3) {
      this.gameOver();
    }
  }

  /**
   * Update UI elements
   */
  private updateUI(): void {
    const data = this.scoreManager.getScoreData();

    this.xpText.setText(`XP: ${data.xp}`);
    this.levelText.setText(`Level ${data.level}: ${data.levelName}`);
    this.updateProgressBar(data.levelProgress);
  }

  /**
   * Handle level up event
   */
  private onLevelUp(data: { level: number; speedMultiplier: number }): void {
    // Increase scroll speed
    this.currentScrollSpeed = PHYSICS.BASE_SCROLL_SPEED * data.speedMultiplier;

    // Update all active patterns and bugs with new speed
    this.patterns.getChildren().forEach((obj) => {
      (obj as Pattern).setScrollSpeed(this.currentScrollSpeed);
    });
    this.bugs.getChildren().forEach((obj) => {
      (obj as Bug).setScrollSpeed(this.currentScrollSpeed);
    });

    // Visual level up feedback
    this.flashLevelUp();
  }

  /**
   * Visual feedback for level up (respects reduced motion preference)
   */
  private flashLevelUp(): void {
    // Skip flash animation if user prefers reduced motion
    if (shouldReduceMotion()) return;

    const flash = this.add.graphics();
    flash.fillStyle(COLORS.DEVOXX_ORANGE, 0.3);
    flash.fillRect(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);
    flash.setDepth(150);

    // Single fade-out animation (no flashing - safe for photosensitivity)
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: getAnimationDuration(500),
      onComplete: () => flash.destroy(),
    });
  }

  /**
   * Toggle pause state
   */
  private togglePause(): void {
    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      this.physics.pause();
      this.pauseOverlay.setVisible(true);
    } else {
      this.physics.resume();
      this.pauseOverlay.setVisible(false);
    }
  }

  /**
   * Handle game over
   */
  private gameOver(): void {
    this.isGameOver = true;

    // Stop physics
    this.physics.pause();

    // Stop timers
    if (this.patternTimer) this.patternTimer.destroy();
    if (this.bugTimer) this.bugTimer.destroy();

    // Announce game over
    const finalScore = this.scoreManager.getScoreData();
    announceGameEvent('game_over', { score: finalScore.xp });

    // Emit game over data for Vue
    EventBus.emit('game-over', finalScore);

    // Transition to GameOver scene after delay
    this.time.delayedCall(1500, () => {
      this.changeScene();
    });
  }

  /**
   * Main update loop
   */
  update(_time: number, delta: number): void {
    if (this.isGameOver) return;

    // Handle pause input
    if (Input.Keyboard.JustDown(this.pauseKey)) {
      this.togglePause();
    }

    // When paused: Enter to resume, Q to quit
    if (this.isPaused) {
      if (Input.Keyboard.JustDown(this.resumeKey)) {
        this.togglePause();
      }
      if (Input.Keyboard.JustDown(this.quitKey)) {
        this.quitToMenu();
      }
      return;
    }

    // Handle jump input
    if (Input.Keyboard.JustDown(this.jumpKey)) {
      this.player.jump();
    }

    // Update player
    this.player.update();

    // Scroll background
    this.backgroundTiles.forEach((tile) => {
      tile.tilePositionX += (this.currentScrollSpeed * 0.3 * delta) / 1000;
    });
    this.ground.tilePositionX += (this.currentScrollSpeed * delta) / 1000;

    // Update distance
    this.scoreManager.addDistance((this.currentScrollSpeed * delta) / 1000);

    // Cleanup off-screen objects
    this.cleanupOffScreen();
  }

  /**
   * Remove objects that have scrolled off screen
   */
  private cleanupOffScreen(): void {
    // Cleanup patterns
    this.patterns.getChildren().forEach((obj) => {
      const pattern = obj as Pattern;
      if (pattern.isOffScreen()) {
        pattern.destroy();
      }
    });

    // Cleanup bugs
    this.bugs.getChildren().forEach((obj) => {
      const bug = obj as Bug;
      if (bug.isOffScreen()) {
        bug.destroy();
      }
    });
  }

  /**
   * Quit to main menu (from pause)
   */
  private quitToMenu(): void {
    // Cleanup
    EventBus.off('level-up', this.onLevelUp, this);
    cleanupAccessibility();

    this.scene.start('MainMenu');
  }

  /**
   * Change to GameOver scene
   */
  changeScene(): void {
    // Cleanup
    EventBus.off('level-up', this.onLevelUp, this);
    cleanupAccessibility();

    this.scene.start('GameOver');
  }
}
