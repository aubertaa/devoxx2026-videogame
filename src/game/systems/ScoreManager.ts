import { SCORING, LEVELS } from '../config/gameConfig';
import { announceGameEvent, formatScoreAnnouncement, announce } from '../utils/accessibility';
import { EventBus } from '../EventBus';

/**
 * ScoreManager - Handles XP, levels, and progression
 * Single Responsibility: Only manages score-related state and logic
 */
export class ScoreManager {
  private xp = 0;
  private level = 1;
  private patternsCollected: string[] = [];
  private bugsHit = 0;
  private distance = 0;

  constructor() {
    this.reset();
  }

  /**
   * Reset all scores to initial state
   */
  reset(): void {
    this.xp = 0;
    this.level = 1;
    this.patternsCollected = [];
    this.bugsHit = 0;
    this.distance = 0;
  }

  /**
   * Add XP from collecting a pattern
   */
  collectPattern(patternId: string, patternName: string, isBonus = false): number {
    const xpGain = isBonus ? SCORING.BONUS_PATTERN_XP : SCORING.PATTERN_XP;
    this.xp += xpGain;
    this.patternsCollected.push(patternId);

    // Check for level up
    const newLevel = this.calculateLevel();
    if (newLevel > this.level) {
      this.levelUp(newLevel);
    }

    // Announce to screen reader
    announceGameEvent('pattern_collected', { pattern: patternName, xp: xpGain });

    // Emit event for UI updates
    EventBus.emit('score-changed', this.getScoreData());

    return xpGain;
  }

  /**
   * Subtract XP from hitting a bug
   */
  hitBug(bugName: string): number {
    const xpLoss = SCORING.BUG_PENALTY;
    this.xp = Math.max(0, this.xp + xpLoss); // Can't go below 0
    this.bugsHit++;

    // Announce to screen reader
    announceGameEvent('bug_hit', { xp: xpLoss });

    // Emit event for UI updates
    EventBus.emit('score-changed', this.getScoreData());

    return xpLoss;
  }

  /**
   * Calculate level based on XP
   */
  private calculateLevel(): number {
    const calculatedLevel = Math.floor(this.xp / SCORING.XP_PER_LEVEL) + 1;
    return Math.min(calculatedLevel, SCORING.MAX_LEVEL);
  }

  /**
   * Handle level up
   */
  private levelUp(newLevel: number): void {
    this.level = newLevel;
    const levelConfig = LEVELS[newLevel - 1];

    // Announce level up
    announceGameEvent('level_up', { level: newLevel });
    announce(`You are now a ${levelConfig.name}!`, 'assertive');

    // Emit level up event
    EventBus.emit('level-up', {
      level: newLevel,
      name: levelConfig.name,
      speedMultiplier: levelConfig.speedMultiplier,
    });
  }

  /**
   * Update distance traveled
   */
  addDistance(delta: number): void {
    this.distance += delta;
  }

  /**
   * Get current XP
   */
  getXP(): number {
    return this.xp;
  }

  /**
   * Get current level
   */
  getLevel(): number {
    return this.level;
  }

  /**
   * Get XP needed for next level
   */
  getXPForNextLevel(): number {
    if (this.level >= SCORING.MAX_LEVEL) {
      return 0; // Max level reached
    }
    return this.level * SCORING.XP_PER_LEVEL - this.xp;
  }

  /**
   * Get XP progress percentage to next level
   */
  getLevelProgress(): number {
    if (this.level >= SCORING.MAX_LEVEL) {
      return 100;
    }
    const xpInCurrentLevel = this.xp % SCORING.XP_PER_LEVEL;
    return (xpInCurrentLevel / SCORING.XP_PER_LEVEL) * 100;
  }

  /**
   * Get current level config
   */
  getLevelConfig(): (typeof LEVELS)[number] {
    return LEVELS[this.level - 1];
  }

  /**
   * Get speed multiplier for current level
   */
  getSpeedMultiplier(): number {
    return this.getLevelConfig().speedMultiplier;
  }

  /**
   * Get spawn multiplier for current level
   */
  getSpawnMultiplier(): number {
    return this.getLevelConfig().spawnMultiplier;
  }

  /**
   * Get all score data for display
   */
  getScoreData(): {
    xp: number;
    level: number;
    levelName: string;
    levelProgress: number;
    patternsCollected: number;
    uniquePatterns: number;
    bugsHit: number;
    distance: number;
  } {
    const uniquePatterns = new Set(this.patternsCollected).size;
    return {
      xp: this.xp,
      level: this.level,
      levelName: this.getLevelConfig().name,
      levelProgress: this.getLevelProgress(),
      patternsCollected: this.patternsCollected.length,
      uniquePatterns,
      bugsHit: this.bugsHit,
      distance: Math.floor(this.distance),
    };
  }

  /**
   * Get formatted announcement for screen readers
   */
  getAnnouncement(): string {
    return formatScoreAnnouncement(this.xp, this.level);
  }

  /**
   * Check if game should end (optional: can add game over conditions)
   */
  isGameOver(): boolean {
    // Game over if XP drops to 0 after having some XP
    // This is optional - can be removed for endless play
    return false;
  }
}
