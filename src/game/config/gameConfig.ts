/**
 * Game configuration constants for Craft Runner
 * Devoxx 2026 Edition - Accessible Endless Runner
 */

// Devoxx 2026 Color Palette (RGAA AAA compliant - contrast ratio >= 7:1)
export const COLORS = {
  // Primary Devoxx colors
  DEVOXX_BLUE: 0x1565c0,
  DEVOXX_ORANGE: 0xff6f00,
  DEVOXX_WHITE: 0xffffff,
  DEVOXX_BLACK: 0x212121,

  // Game-specific colors
  BACKGROUND: 0x0d47a1,
  PLAYER: 0x24292e, // GitHub dark
  PATTERN_GLOW: 0x4caf50,
  BUG_RED: 0xd32f2f,
  UI_TEXT: 0xffffff,
  UI_SHADOW: 0x000000,

  // Accessible indicators (shapes + colors for colorblind users)
  SUCCESS: 0x2e7d32,
  DANGER: 0xc62828,
  WARNING: 0xf57c00,
} as const;

// Hex string versions for CSS/Text
export const COLORS_HEX = {
  DEVOXX_BLUE: '#1565C0',
  DEVOXX_ORANGE: '#FF6F00',
  DEVOXX_WHITE: '#FFFFFF',
  DEVOXX_BLACK: '#212121',
  BACKGROUND: '#0D47A1',
  UI_TEXT: '#FFFFFF',
} as const;

// Game dimensions
export const GAME_CONFIG = {
  WIDTH: 1024,
  HEIGHT: 768,
  GROUND_HEIGHT: 100,
  PLAYER_START_X: 150,
  PLAYER_START_Y: 668 - 100, // HEIGHT - GROUND_HEIGHT - player height offset
} as const;

// Physics constants
export const PHYSICS = {
  GRAVITY: 800,
  JUMP_VELOCITY: -450,
  BASE_SCROLL_SPEED: 200,
  SPEED_INCREMENT: 0.1, // 10% per level
} as const;

// Scoring system
export const SCORING = {
  PATTERN_XP: 10,
  BONUS_PATTERN_XP: 15, // Self-referential bonus
  BUG_PENALTY: -20,
  XP_PER_LEVEL: 100,
  MAX_LEVEL: 4,
} as const;

// Spawn configuration
export const SPAWN = {
  PATTERN_INTERVAL_BASE: 2000, // ms
  BUG_INTERVAL_BASE: 3000, // ms
  INTERVAL_REDUCTION_PER_LEVEL: 0.15, // 15% faster per level
  MIN_INTERVAL: 500, // Never spawn faster than this
} as const;

// Software Craftsmanship Patterns
export const PATTERNS = [
  {
    id: 'solid',
    name: 'SOLID',
    description: 'Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion',
    color: 0x1565c0,
    icon: 'S',
  },
  {
    id: 'clean_code',
    name: 'Clean Code',
    description: 'Readable, maintainable, and well-structured code',
    color: 0x4caf50,
    icon: '✓',
  },
  {
    id: 'tdd',
    name: 'TDD',
    description: 'Test-Driven Development: Red, Green, Refactor',
    color: 0xff6f00,
    icon: 'T',
  },
  {
    id: 'ddd',
    name: 'DDD',
    description: 'Domain-Driven Design: Ubiquitous language, bounded contexts',
    color: 0x9c27b0,
    icon: 'D',
  },
  {
    id: 'pair_prog',
    name: 'Pair Programming',
    description: 'Two developers, one keyboard, better code',
    color: 0x00bcd4,
    icon: '⚡',
  },
  {
    id: 'refactoring',
    name: 'Refactoring',
    description: 'Improve code structure without changing behavior',
    color: 0xffc107,
    icon: 'R',
  },
  {
    id: 'ci_cd',
    name: 'CI/CD',
    description: 'Continuous Integration and Continuous Delivery',
    color: 0x795548,
    icon: '∞',
  },
  {
    id: 'code_review',
    name: 'Code Review',
    description: 'Peer review for quality and knowledge sharing',
    color: 0xe91e63,
    icon: '👁',
  },
] as const;

export type PatternId = (typeof PATTERNS)[number]['id'];

// Bug types (enemies)
export const BUGS = [
  { id: 'null_pointer', name: 'NullPointerException', icon: '∅' },
  { id: 'infinite_loop', name: 'Infinite Loop', icon: '∞' },
  { id: 'memory_leak', name: 'Memory Leak', icon: '💧' },
  { id: 'race_condition', name: 'Race Condition', icon: '🏃' },
] as const;

// Accessibility settings
export const A11Y = {
  FOCUS_OUTLINE_WIDTH: 3,
  FOCUS_OUTLINE_COLOR: COLORS.DEVOXX_ORANGE,
  REDUCED_MOTION_SPEED: 0.5,
  MIN_TOUCH_TARGET_SIZE: 44, // WCAG minimum
  ANNOUNCEMENT_DELAY: 100, // ms before announcing to screen reader
} as const;

// Level configuration
export const LEVELS = [
  { level: 1, name: 'Junior Developer', speedMultiplier: 1.0, spawnMultiplier: 1.0 },
  { level: 2, name: 'Mid Developer', speedMultiplier: 1.15, spawnMultiplier: 0.85 },
  { level: 3, name: 'Senior Developer', speedMultiplier: 1.3, spawnMultiplier: 0.7 },
  { level: 4, name: 'Staff Engineer', speedMultiplier: 1.5, spawnMultiplier: 0.55 },
] as const;
