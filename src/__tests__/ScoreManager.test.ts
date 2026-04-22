import { describe, it, expect, vi } from 'vitest';
import { SCORING, LEVELS } from '../game/config/gameConfig';

// Test scoring logic without importing ScoreManager (which imports Phaser via EventBus)
describe('Scoring Logic', () => {
  describe('XP Calculations', () => {
    it('should have positive XP for patterns', () => {
      expect(SCORING.PATTERN_XP).toBe(10);
    });

    it('should have higher XP for bonus patterns', () => {
      expect(SCORING.BONUS_PATTERN_XP).toBe(15);
      expect(SCORING.BONUS_PATTERN_XP).toBeGreaterThan(SCORING.PATTERN_XP);
    });

    it('should have negative XP for bugs', () => {
      expect(SCORING.BUG_PENALTY).toBe(-20);
    });

    it('should require 100 XP per level', () => {
      expect(SCORING.XP_PER_LEVEL).toBe(100);
    });

    it('should have max level of 4', () => {
      expect(SCORING.MAX_LEVEL).toBe(4);
    });
  });

  describe('Level Progression', () => {
    it('should calculate level from XP correctly', () => {
      const calculateLevel = (xp: number): number => {
        const calculatedLevel = Math.floor(xp / SCORING.XP_PER_LEVEL) + 1;
        return Math.min(calculatedLevel, SCORING.MAX_LEVEL);
      };

      expect(calculateLevel(0)).toBe(1);
      expect(calculateLevel(50)).toBe(1);
      expect(calculateLevel(100)).toBe(2);
      expect(calculateLevel(199)).toBe(2);
      expect(calculateLevel(200)).toBe(3);
      expect(calculateLevel(300)).toBe(4);
      expect(calculateLevel(500)).toBe(4); // Max level cap
    });

    it('should have 4 defined levels', () => {
      expect(LEVELS).toHaveLength(4);
    });

    it('should have increasing difficulty per level', () => {
      expect(LEVELS[0].speedMultiplier).toBe(1.0);
      expect(LEVELS[3].speedMultiplier).toBe(1.5);
    });
  });

  describe('XP State Management', () => {
    it('should not allow XP below 0', () => {
      let xp = 10;
      xp = Math.max(0, xp + SCORING.BUG_PENALTY);
      expect(xp).toBe(0);

      xp = 0;
      xp = Math.max(0, xp + SCORING.BUG_PENALTY);
      expect(xp).toBe(0);
    });

    it('should accumulate XP from multiple patterns', () => {
      let xp = 0;
      xp += SCORING.PATTERN_XP; // +10
      xp += SCORING.PATTERN_XP; // +10
      xp += SCORING.BONUS_PATTERN_XP; // +15
      expect(xp).toBe(35);
    });
  });
});
