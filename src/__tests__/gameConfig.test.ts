import { describe, it, expect } from 'vitest';
import { PATTERNS, BUGS, LEVELS, SCORING, COLORS } from '../game/config/gameConfig';

describe('Game Configuration', () => {
  describe('Patterns', () => {
    it('should have 8 software craftsmanship patterns', () => {
      expect(PATTERNS).toHaveLength(8);
    });

    it('should have unique pattern IDs', () => {
      const ids = PATTERNS.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(PATTERNS.length);
    });

    it('should include core patterns', () => {
      const ids = PATTERNS.map((p) => p.id);
      expect(ids).toContain('solid');
      expect(ids).toContain('clean_code');
      expect(ids).toContain('tdd');
    });
  });

  describe('Bugs', () => {
    it('should have bug types defined', () => {
      expect(BUGS.length).toBeGreaterThan(0);
    });

    it('should have unique bug IDs', () => {
      const ids = BUGS.map((b) => b.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(BUGS.length);
    });
  });

  describe('Levels', () => {
    it('should have 4 difficulty levels', () => {
      expect(LEVELS).toHaveLength(4);
    });

    it('should have increasing speed multipliers', () => {
      for (let i = 1; i < LEVELS.length; i++) {
        expect(LEVELS[i].speedMultiplier).toBeGreaterThan(LEVELS[i - 1].speedMultiplier);
      }
    });

    it('should have decreasing spawn multipliers (harder = faster spawns)', () => {
      for (let i = 1; i < LEVELS.length; i++) {
        expect(LEVELS[i].spawnMultiplier).toBeLessThan(LEVELS[i - 1].spawnMultiplier);
      }
    });
  });

  describe('Scoring', () => {
    it('should reward patterns with positive XP', () => {
      expect(SCORING.PATTERN_XP).toBeGreaterThan(0);
    });

    it('should give bonus patterns more XP', () => {
      expect(SCORING.BONUS_PATTERN_XP).toBeGreaterThan(SCORING.PATTERN_XP);
    });

    it('should penalize bugs with negative XP', () => {
      expect(SCORING.BUG_PENALTY).toBeLessThan(0);
    });

    it('should require XP for level up', () => {
      expect(SCORING.XP_PER_LEVEL).toBeGreaterThan(0);
    });
  });

  describe('Colors (Devoxx Theme)', () => {
    it('should have Devoxx blue defined', () => {
      expect(COLORS.DEVOXX_BLUE).toBeDefined();
    });

    it('should have Devoxx orange defined', () => {
      expect(COLORS.DEVOXX_ORANGE).toBeDefined();
    });
  });
});
