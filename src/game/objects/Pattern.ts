import { GameObjects, Physics, Scene } from 'phaser';
import { PATTERNS, COLORS, type PatternId } from '../config/gameConfig';
import { shouldReduceMotion, getAnimationDuration } from '../utils/accessibility';

type PatternConfig = (typeof PATTERNS)[number];

/**
 * Pattern collectible class
 * Represents software craftsmanship patterns that give XP when collected
 */
export class Pattern extends GameObjects.Container {
  private body!: Physics.Arcade.Body;
  private patternConfig: PatternConfig;
  private graphics!: GameObjects.Graphics;
  private label!: GameObjects.Text;
  private isBonus: boolean;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    patternId: PatternId,
    isBonus = false
  ) {
    super(scene, x, y);

    const foundPattern = PATTERNS.find((p) => p.id === patternId);
    this.patternConfig = foundPattern ?? PATTERNS[0];
    this.isBonus = isBonus;

    this.createVisuals();
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setupPhysics();
    this.startAnimation();
  }

  /**
   * Create pattern visual representation
   */
  private createVisuals(): void {
    const size = 40;
    this.graphics = this.scene.add.graphics();

    // Outer ring - pattern color
    this.graphics.lineStyle(3, this.patternConfig.color, 1);
    this.graphics.strokeCircle(0, 0, size / 2);

    // Inner fill - semi-transparent
    this.graphics.fillStyle(this.patternConfig.color, 0.3);
    this.graphics.fillCircle(0, 0, size / 2 - 3);

    // Bonus indicator (star shape for self-referential patterns)
    if (this.isBonus) {
      this.graphics.lineStyle(2, COLORS.DEVOXX_ORANGE, 1);
      this.graphics.strokeCircle(0, 0, size / 2 + 5);
    }

    // Pattern icon/letter in center
    this.label = this.scene.add.text(0, 0, this.patternConfig.icon, {
      fontSize: '20px',
      color: '#FFFFFF',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
    });
    this.label.setOrigin(0.5);

    this.add([this.graphics, this.label]);
  }

  /**
   * Setup physics body
   */
  private setupPhysics(): void {
    this.body = this.body as Physics.Arcade.Body;
    this.body.setSize(36, 36);
    this.body.setOffset(-18, -18);
    this.body.setAllowGravity(false);
  }

  /**
   * Start floating/pulsing animation
   */
  private startAnimation(): void {
    if (shouldReduceMotion()) return;

    const duration = getAnimationDuration(1000);

    // Gentle floating
    this.scene.tweens.add({
      targets: this,
      y: this.y - 10,
      duration: duration,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Gentle pulse
    this.scene.tweens.add({
      targets: this,
      scale: 1.1,
      duration: duration * 0.8,
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
   * Get pattern info
   */
  getPatternId(): PatternId {
    return this.patternConfig.id;
  }

  getPatternName(): string {
    return this.patternConfig.name;
  }

  isPatternBonus(): boolean {
    return this.isBonus;
  }

  /**
   * Play collection animation and destroy
   */
  collect(): void {
    const duration = getAnimationDuration(300);

    // Stop movement
    this.body.setVelocity(0, 0);

    // Scale up and fade out
    this.scene.tweens.add({
      targets: this,
      scale: 1.5,
      alpha: 0,
      duration: duration,
      ease: 'Quad.easeOut',
      onComplete: () => {
        this.destroy();
      },
    });

    // Create particle effect
    this.createCollectParticles();
  }

  /**
   * Create particle effect on collection
   */
  private createCollectParticles(): void {
    if (shouldReduceMotion()) return;

    // Simple particle burst using graphics
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const particle = this.scene.add.graphics();
      particle.fillStyle(this.patternConfig.color, 1);
      particle.fillCircle(0, 0, 4);
      particle.setPosition(this.x, this.y);

      this.scene.tweens.add({
        targets: particle,
        x: this.x + Math.cos(angle) * 50,
        y: this.y + Math.sin(angle) * 50,
        alpha: 0,
        scale: 0,
        duration: getAnimationDuration(400),
        ease: 'Quad.easeOut',
        onComplete: () => particle.destroy(),
      });
    }
  }

  /**
   * Check if pattern is off screen (for cleanup)
   */
  isOffScreen(): boolean {
    return this.x < -50;
  }
}
