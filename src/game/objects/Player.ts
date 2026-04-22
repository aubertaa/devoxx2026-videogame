import { GameObjects, Physics, Scene } from 'phaser';
import { COLORS, GAME_CONFIG, PHYSICS } from '../config/gameConfig';
import { shouldReduceMotion, getAnimationDuration } from '../utils/accessibility';

/**
 * Player class - GitHub Octocat character
 * Handles movement, jump mechanics, and visual representation
 */
export class Player extends GameObjects.Container {
  private body!: Physics.Arcade.Body;
  private playerGraphics!: GameObjects.Graphics;
  private isJumping = false;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y);

    this.createPlayerSprite();
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setupPhysics();
  }

  /**
   * Create pixel art GitHub Octocat sprite programmatically
   */
  private createPlayerSprite(): void {
    this.playerGraphics = this.scene.add.graphics();

    // Draw simplified Octocat (32x32 pixel art style)
    const size = 32;

    // Body (dark GitHub color)
    this.playerGraphics.fillStyle(COLORS.PLAYER, 1);
    this.playerGraphics.fillRoundedRect(-size / 2, -size / 2, size, size, 8);

    // Eyes (white)
    this.playerGraphics.fillStyle(COLORS.DEVOXX_WHITE, 1);
    this.playerGraphics.fillCircle(-6, -4, 5);
    this.playerGraphics.fillCircle(6, -4, 5);

    // Pupils (black)
    this.playerGraphics.fillStyle(COLORS.DEVOXX_BLACK, 1);
    this.playerGraphics.fillCircle(-4, -4, 2);
    this.playerGraphics.fillCircle(8, -4, 2);

    // Tentacles/legs (bottom)
    this.playerGraphics.fillStyle(COLORS.PLAYER, 1);
    for (let i = 0; i < 4; i++) {
      const xPos = -12 + i * 8;
      this.playerGraphics.fillRect(xPos, size / 2 - 4, 4, 8);
    }

    // Add glow effect for visibility
    this.playerGraphics.lineStyle(2, COLORS.DEVOXX_ORANGE, 0.5);
    this.playerGraphics.strokeRoundedRect(-size / 2 - 2, -size / 2 - 2, size + 4, size + 4, 10);

    this.add(this.playerGraphics);
  }

  /**
   * Setup physics body
   */
  private setupPhysics(): void {
    this.body = this.body as Physics.Arcade.Body;
    this.body.setSize(28, 36);
    this.body.setOffset(-14, -18);
    this.body.setCollideWorldBounds(true);
    this.body.setGravityY(PHYSICS.GRAVITY);
  }

  /**
   * Handle jump input
   */
  jump(): boolean {
    if (this.isOnGround()) {
      this.body.setVelocityY(PHYSICS.JUMP_VELOCITY);
      this.isJumping = true;
      this.playJumpAnimation();
      return true;
    }
    return false;
  }

  /**
   * Check if player is on the ground
   */
  isOnGround(): boolean {
    return this.body.blocked.down || this.body.touching.down;
  }

  /**
   * Play jump animation with accessibility consideration
   */
  private playJumpAnimation(): void {
    const duration = getAnimationDuration(200);

    if (!shouldReduceMotion()) {
      this.scene.tweens.add({
        targets: this,
        scaleY: 0.8,
        scaleX: 1.2,
        duration: duration / 2,
        yoyo: true,
        ease: 'Quad.easeOut',
      });
    }
  }

  /**
   * Update player state each frame
   */
  update(): void {
    // Reset jumping state when landing
    if (this.isJumping && this.isOnGround()) {
      this.isJumping = false;
      this.playLandAnimation();
    }

    // Keep player at fixed X position (endless runner style)
    this.x = GAME_CONFIG.PLAYER_START_X;
  }

  /**
   * Play landing animation
   */
  private playLandAnimation(): void {
    if (shouldReduceMotion()) return;

    const duration = getAnimationDuration(150);
    this.scene.tweens.add({
      targets: this,
      scaleY: 1.1,
      scaleX: 0.9,
      duration: duration / 2,
      yoyo: true,
      ease: 'Quad.easeOut',
    });
  }

  /**
   * Get physics body for collision detection
   */
  getBody(): Physics.Arcade.Body {
    return this.body;
  }

  /**
   * Play hit animation when colliding with bug
   * Uses single state change instead of repeated flashes for accessibility
   */
  playHitAnimation(): void {
    const duration = getAnimationDuration(300);

    // Single alpha change (no repeated flashing - accessibility safe)
    this.playerGraphics.setAlpha(0.3);
    this.scene.time.delayedCall(duration, () => {
      this.playerGraphics.setAlpha(1);
    });
  }

  /**
   * Play collect animation when getting pattern
   */
  playCollectAnimation(): void {
    if (shouldReduceMotion()) return;

    const duration = getAnimationDuration(200);
    this.scene.tweens.add({
      targets: this,
      scale: 1.2,
      duration: duration,
      yoyo: true,
      ease: 'Bounce.easeOut',
    });
  }
}
