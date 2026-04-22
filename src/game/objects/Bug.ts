import Phaser from 'phaser';
import { COLORS, BUGS } from '../config/gameConfig';
import { shouldReduceMotion, getAnimationDuration } from '../utils/accessibility';

type BugConfig = (typeof BUGS)[number];

/**
 * Bug enemy class
 * Represents software bugs that reduce XP when hit
 */
export class Bug extends Phaser.GameObjects.Container {
  private body!: Phaser.Physics.Arcade.Body;
  private bugConfig: BugConfig;
  private graphics!: Phaser.GameObjects.Graphics;
  private label!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, bugType?: string) {
    super(scene, x, y);

    // Random bug type if not specified
    const bugIndex = bugType
      ? BUGS.findIndex((b) => b.id === bugType)
      : Phaser.Math.Between(0, BUGS.length - 1);
    this.bugConfig = BUGS[bugIndex >= 0 ? bugIndex : 0];

    this.createVisuals();
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setupPhysics();
    this.startAnimation();
  }

  /**
   * Create bug visual representation
   * Uses distinct shape (not just color) for accessibility
   */
  private createVisuals(): void {
    const size = 36;
    this.graphics = this.scene.add.graphics();

    // Spiky/angular shape for bugs (distinct from round patterns)
    this.graphics.fillStyle(COLORS.BUG_RED, 1);

    // Draw diamond/warning shape
    this.graphics.beginPath();
    this.graphics.moveTo(0, -size / 2); // Top
    this.graphics.lineTo(size / 2, 0); // Right
    this.graphics.lineTo(0, size / 2); // Bottom
    this.graphics.lineTo(-size / 2, 0); // Left
    this.graphics.closePath();
    this.graphics.fillPath();

    // X mark inside (universal danger symbol)
    this.graphics.lineStyle(3, COLORS.DEVOXX_WHITE, 1);
    const xSize = size / 4;
    this.graphics.beginPath();
    this.graphics.moveTo(-xSize, -xSize);
    this.graphics.lineTo(xSize, xSize);
    this.graphics.moveTo(xSize, -xSize);
    this.graphics.lineTo(-xSize, xSize);
    this.graphics.strokePath();

    // Warning border
    this.graphics.lineStyle(2, COLORS.DEVOXX_WHITE, 0.8);
    this.graphics.beginPath();
    this.graphics.moveTo(0, -size / 2 - 2);
    this.graphics.lineTo(size / 2 + 2, 0);
    this.graphics.lineTo(0, size / 2 + 2);
    this.graphics.lineTo(-size / 2 - 2, 0);
    this.graphics.closePath();
    this.graphics.strokePath();

    // Bug type indicator (small text below)
    this.label = this.scene.add.text(0, size / 2 + 8, this.bugConfig.icon, {
      fontSize: '14px',
      color: '#FFFFFF',
      fontFamily: 'Arial, sans-serif',
    });
    this.label.setOrigin(0.5);

    this.add([this.graphics, this.label]);
  }

  /**
   * Setup physics body
   */
  private setupPhysics(): void {
    this.body = this.body as Phaser.Physics.Arcade.Body;
    this.body.setSize(32, 32);
    this.body.setOffset(-16, -16);
    this.body.setAllowGravity(false);
  }

  /**
   * Start threatening animation
   */
  private startAnimation(): void {
    if (shouldReduceMotion()) return;

    const duration = getAnimationDuration(500);

    // Rotation wobble
    this.scene.tweens.add({
      targets: this,
      angle: 10,
      duration: duration,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Scale pulse (threatening)
    this.scene.tweens.add({
      targets: this,
      scale: 1.15,
      duration: duration * 0.6,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  /**
   * Set horizontal velocity (for scrolling)
   */
  setScrollSpeed(speed: number): void {
    this.body.setVelocityX(-speed);
  }

  /**
   * Get bug info
   */
  getBugName(): string {
    return this.bugConfig.name;
  }

  getBugId(): string {
    return this.bugConfig.id;
  }

  /**
   * Play hit animation and destroy
   */
  hit(): void {
    const duration = getAnimationDuration(200);

    // Stop movement
    this.body.setVelocity(0, 0);

    // Explode effect
    this.scene.tweens.add({
      targets: this,
      scale: 0,
      angle: 180,
      alpha: 0,
      duration: duration,
      ease: 'Quad.easeIn',
      onComplete: () => {
        this.destroy();
      },
    });

    this.createHitParticles();
  }

  /**
   * Create particle effect on hit
   */
  private createHitParticles(): void {
    if (shouldReduceMotion()) return;

    // Red warning particles
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const particle = this.scene.add.graphics();
      particle.fillStyle(COLORS.BUG_RED, 1);
      particle.fillRect(-3, -3, 6, 6);
      particle.setPosition(this.x, this.y);

      this.scene.tweens.add({
        targets: particle,
        x: this.x + Math.cos(angle) * 40,
        y: this.y + Math.sin(angle) * 40,
        alpha: 0,
        angle: 180,
        duration: getAnimationDuration(300),
        ease: 'Quad.easeOut',
        onComplete: () => particle.destroy(),
      });
    }
  }

  /**
   * Check if bug is off screen (for cleanup)
   */
  isOffScreen(): boolean {
    return this.x < -50;
  }
}
