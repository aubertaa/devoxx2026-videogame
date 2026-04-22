import { LEVELS, PHYSICS, SPAWN, SCORING } from '../config/gameConfig';
import { EventBus } from '../EventBus';

/**
 * Level configuration type
 */
export interface LevelConfig {
  level: number;
  name: string;
  speedMultiplier: number;
  spawnMultiplier: number;
}

/**
 * Level change event data
 */
export interface LevelChangeEvent {
  previousLevel: number;
  newLevel: number;
  levelConfig: LevelConfig;
}

/**
 * LevelManager - Manages level transitions and difficulty scaling
 * Single Responsibility: Only handles level state and difficulty multipliers
 */
export class LevelManager {
  private currentLevel: number = 1;

  constructor() {
    this.reset();
  }

  /**
   * Reset to initial level
   */
  reset(): void {
    this.currentLevel = 1;
  }

  /**
   * Get current level number
   */
  getLevel(): number {
    return this.currentLevel;
  }

  /**
   * Get current level configuration
   */
  getLevelConfig(): LevelConfig {
    return { ...LEVELS[this.currentLevel - 1] };
  }

  /**
   * Get level configuration for a specific level
   */
  getLevelConfigFor(level: number): LevelConfig | null {
    const index = level - 1;
    if (index < 0 || index >= LEVELS.length) {
      return null;
    }
    return { ...LEVELS[index] };
  }

  /**
   * Get current level name
   */
  getLevelName(): string {
    return this.getLevelConfig().name;
  }

  /**
   * Set level directly (typically called in response to ScoreManager's level calculation)
   */
  setLevel(newLevel: number): boolean {
    // Validate level bounds
    if (newLevel < 1 || newLevel > SCORING.MAX_LEVEL) {
      return false;
    }

    // No change needed
    if (newLevel === this.currentLevel) {
      return false;
    }

    const previousLevel = this.currentLevel;
    this.currentLevel = newLevel;
    const levelConfig = this.getLevelConfig();

    // Emit level change event via EventBus
    const eventData: LevelChangeEvent = {
      previousLevel,
      newLevel,
      levelConfig,
    };
    EventBus.emit('level-changed', eventData);

    return true;
  }

  /**
   * Get speed multiplier for current level
   * Used to scale game object velocities
   */
  getSpeedMultiplier(): number {
    return this.getLevelConfig().speedMultiplier;
  }

  /**
   * Get spawn rate multiplier for current level
   * Lower values = faster spawning (more difficult)
   */
  getSpawnMultiplier(): number {
    return this.getLevelConfig().spawnMultiplier;
  }

  /**
   * Calculate actual scroll speed based on base speed and level multiplier
   */
  getScrollSpeed(): number {
    return PHYSICS.BASE_SCROLL_SPEED * this.getSpeedMultiplier();
  }

  /**
   * Calculate pattern spawn interval for current level
   */
  getPatternSpawnInterval(): number {
    const interval = SPAWN.PATTERN_INTERVAL_BASE * this.getSpawnMultiplier();
    return Math.max(interval, SPAWN.MIN_INTERVAL);
  }

  /**
   * Calculate bug spawn interval for current level
   */
  getBugSpawnInterval(): number {
    const interval = SPAWN.BUG_INTERVAL_BASE * this.getSpawnMultiplier();
    return Math.max(interval, SPAWN.MIN_INTERVAL);
  }

  /**
   * Check if at max level
   */
  isMaxLevel(): boolean {
    return this.currentLevel >= SCORING.MAX_LEVEL;
  }

  /**
   * Get max level number
   */
  getMaxLevel(): number {
    return SCORING.MAX_LEVEL;
  }

  /**
   * Get all available levels configuration
   */
  getAllLevels(): LevelConfig[] {
    return LEVELS.map((level) => ({ ...level }));
  }

  /**
   * Get difficulty description for current level
   */
  getDifficultyInfo(): {
    level: number;
    name: string;
    speedPercent: number;
    spawnRatePercent: number;
  } {
    const config = this.getLevelConfig();
    return {
      level: config.level,
      name: config.name,
      speedPercent: Math.round(config.speedMultiplier * 100),
      spawnRatePercent: Math.round((1 / config.spawnMultiplier) * 100),
    };
  }
}
