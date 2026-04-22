import { PatternId } from '../config/gameConfig';

/**
 * Code snippet from the game's own source code
 */
export interface CodeSnippet {
  code: string;
  pattern: PatternId;
  description: string;
  sourceFile: string;
}

/**
 * Detected pattern in the codebase
 */
export interface DetectedPattern {
  patternId: PatternId;
  count: number;
  snippets: CodeSnippet[];
}

/**
 * CodeAnalyzer - Self-referential system that analyzes the game's own source code
 * to generate bonus patterns. This creates a meta-game where players collect
 * patterns that actually exist in the codebase they're playing.
 */
export class CodeAnalyzer {
  /**
   * Static list of real code snippets found in the game's source code
   * Each snippet demonstrates a software craftsmanship pattern
   */
  private static readonly CODE_SNIPPETS: CodeSnippet[] = [
    // SOLID Principles
    {
      code: `class ScoreManager {
  // Single Responsibility: Only manages score-related state and logic
  private xp = 0;
  private level = 1;
}`,
      pattern: 'solid',
      description: 'Single Responsibility Principle - ScoreManager only handles scoring',
      sourceFile: 'src/game/systems/ScoreManager.ts',
    },
    {
      code: `export class Player extends Phaser.GameObjects.Container {
  // Player handles only player-specific logic
  private isJumping = false;
  jump(): boolean { ... }
}`,
      pattern: 'solid',
      description: 'Single Responsibility - Player class handles only player behavior',
      sourceFile: 'src/game/objects/Player.ts',
    },
    {
      code: `export class Pattern extends Phaser.GameObjects.Container {
  // Encapsulates all pattern collectible logic
  private patternConfig: PatternConfig;
  collect(): void { ... }
}`,
      pattern: 'solid',
      description: 'Open/Closed - Pattern class is open for extension via config',
      sourceFile: 'src/game/objects/Pattern.ts',
    },

    // Clean Code
    {
      code: `EventBus.emit('current-scene-ready', this);`,
      pattern: 'clean_code',
      description: 'Event-driven communication with meaningful event names',
      sourceFile: 'src/game/scenes/Game.ts',
    },
    {
      code: `export function announceGameEvent(
  event: 'pattern_collected' | 'bug_hit' | 'level_up',
  details?: Record<string, string | number>
): void`,
      pattern: 'clean_code',
      description: 'Type-safe function with descriptive parameters',
      sourceFile: 'src/game/utils/accessibility.ts',
    },
    {
      code: `const COLORS = {
  DEVOXX_BLUE: 0x1565c0,
  DEVOXX_ORANGE: 0xff6f00,
  // RGAA AAA compliant - contrast ratio >= 7:1
} as const;`,
      pattern: 'clean_code',
      description: 'Named constants with meaningful names and documentation',
      sourceFile: 'src/game/config/gameConfig.ts',
    },
    {
      code: `private playJumpAnimation(): void {
  const duration = getAnimationDuration(200);
  if (!shouldReduceMotion()) {
    this.scene.tweens.add({ ... });
  }
}`,
      pattern: 'clean_code',
      description: 'Small, focused functions with single purpose',
      sourceFile: 'src/game/objects/Player.ts',
    },
    {
      code: `formatScoreAnnouncement(xp: number, level: number): string {
  return \`Score: \${xp} XP, Level \${level}\`;
}`,
      pattern: 'clean_code',
      description: 'Pure function with clear input/output',
      sourceFile: 'src/game/utils/accessibility.ts',
    },

    // TDD (Test-Driven Development)
    {
      code: `- name: Run tests
  run: npm run test:ci

- name: Build
  run: npm run build`,
      pattern: 'tdd',
      description: 'Tests run before build in CI pipeline',
      sourceFile: '.github/workflows/deploy.yml',
    },
    {
      code: `// vitest.config.ts
// Test configuration for the project`,
      pattern: 'tdd',
      description: 'Vitest test framework configuration',
      sourceFile: 'vitest.config.ts',
    },

    // DDD (Domain-Driven Design)
    {
      code: `export const PATTERNS = [
  { id: 'solid', name: 'SOLID', description: 'Single Responsibility...' },
  { id: 'clean_code', name: 'Clean Code', description: 'Readable...' },
  { id: 'tdd', name: 'TDD', description: 'Test-Driven Development...' },
];`,
      pattern: 'ddd',
      description: 'Domain-specific entities with ubiquitous language',
      sourceFile: 'src/game/config/gameConfig.ts',
    },
    {
      code: `export const BUGS = [
  { id: 'null_pointer', name: 'NullPointerException', icon: '∅' },
  { id: 'infinite_loop', name: 'Infinite Loop', icon: '∞' },
  { id: 'memory_leak', name: 'Memory Leak', icon: '💧' },
];`,
      pattern: 'ddd',
      description: 'Domain objects using developer terminology',
      sourceFile: 'src/game/config/gameConfig.ts',
    },
    {
      code: `export const LEVELS = [
  { level: 1, name: 'Junior Developer', speedMultiplier: 1.0 },
  { level: 2, name: 'Mid Developer', speedMultiplier: 1.15 },
  { level: 3, name: 'Senior Developer', speedMultiplier: 1.3 },
  { level: 4, name: 'Staff Engineer', speedMultiplier: 1.5 },
];`,
      pattern: 'ddd',
      description: 'Bounded context with career progression domain',
      sourceFile: 'src/game/config/gameConfig.ts',
    },
    {
      code: `export type PatternId = (typeof PATTERNS)[number]['id'];`,
      pattern: 'ddd',
      description: 'Type-safe domain identifiers derived from config',
      sourceFile: 'src/game/config/gameConfig.ts',
    },

    // Pair Programming
    {
      code: `Co-authored-by: Copilot <copilot@github.com>`,
      pattern: 'pair_prog',
      description: 'Human-AI pair programming collaboration',
      sourceFile: 'git commit messages',
    },
    {
      code: `// PhaserGame.vue - Vue-Phaser bridge
defineExpose({ scene, game });
// Exposes refs for parent component collaboration`,
      pattern: 'pair_prog',
      description: 'Component collaboration through exposed refs',
      sourceFile: 'src/PhaserGame.vue',
    },

    // Refactoring
    {
      code: `// Before: Inline constants
// After: Extracted to config
export const PHYSICS = {
  GRAVITY: 800,
  JUMP_VELOCITY: -450,
  BASE_SCROLL_SPEED: 200,
} as const;`,
      pattern: 'refactoring',
      description: 'Extract constants to configuration object',
      sourceFile: 'src/game/config/gameConfig.ts',
    },
    {
      code: `private setupPhysics(): void {
  this.body = this.body as Phaser.Physics.Arcade.Body;
  this.body.setSize(28, 36);
  this.body.setCollideWorldBounds(true);
  this.body.setGravityY(PHYSICS.GRAVITY);
}`,
      pattern: 'refactoring',
      description: 'Extract Method - Physics setup in dedicated method',
      sourceFile: 'src/game/objects/Player.ts',
    },
    {
      code: `// Extracted accessibility utilities
export function shouldReduceMotion(): boolean {
  return prefersReducedMotion;
}

export function getAnimationDuration(baseDuration: number): number {
  return prefersReducedMotion ? baseDuration * 0.1 : baseDuration;
}`,
      pattern: 'refactoring',
      description: 'Extract utility functions for reusability',
      sourceFile: 'src/game/utils/accessibility.ts',
    },

    // CI/CD
    {
      code: `name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:`,
      pattern: 'ci_cd',
      description: 'Automated deployment on push to main',
      sourceFile: '.github/workflows/deploy.yml',
    },
    {
      code: `jobs:
  build:
    steps:
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm run test:ci
      - name: Build
        run: npm run build`,
      pattern: 'ci_cd',
      description: 'CI pipeline with install, test, build steps',
      sourceFile: '.github/workflows/deploy.yml',
    },
    {
      code: `concurrency:
  group: 'pages'
  cancel-in-progress: true`,
      pattern: 'ci_cd',
      description: 'Concurrency control to prevent duplicate deployments',
      sourceFile: '.github/workflows/deploy.yml',
    },
    {
      code: `- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: './dist'`,
      pattern: 'ci_cd',
      description: 'Artifact management in deployment pipeline',
      sourceFile: '.github/workflows/deploy.yml',
    },

    // Code Review
    {
      code: `// EventBus - Decoupled communication
// Reviewed pattern: Prevents tight coupling between Vue and Phaser
export const EventBus = new Events.EventEmitter();`,
      pattern: 'code_review',
      description: 'Architectural decision documented for reviewers',
      sourceFile: 'src/game/EventBus.ts',
    },
    {
      code: `/**
 * ScoreManager - Handles XP, levels, and progression
 * Single Responsibility: Only manages score-related state and logic
 */`,
      pattern: 'code_review',
      description: 'JSDoc comments explaining design decisions',
      sourceFile: 'src/game/systems/ScoreManager.ts',
    },
    {
      code: `// RGAA AAA compliant - contrast ratio >= 7:1
// Accessibility requirements documented`,
      pattern: 'code_review',
      description: 'Compliance requirements documented in code',
      sourceFile: 'src/game/config/gameConfig.ts',
    },
    {
      code: `onMounted(() => {
  EventBus.on('current-scene-ready', (scene_instance) => { ... });
});

onUnmounted(() => {
  if (game.value) {
    game.value.destroy(true);
  }
});`,
      pattern: 'code_review',
      description: 'Lifecycle cleanup pattern - prevents memory leaks',
      sourceFile: 'src/PhaserGame.vue',
    },
  ];

  /**
   * Get a random code snippet from the game's source code
   */
  static getRandomCodeSnippet(): CodeSnippet {
    const index = Math.floor(Math.random() * this.CODE_SNIPPETS.length);
    return this.CODE_SNIPPETS[index];
  }

  /**
   * Get a random code snippet for a specific pattern type
   */
  static getRandomSnippetForPattern(patternId: PatternId): CodeSnippet | null {
    const snippets = this.CODE_SNIPPETS.filter((s) => s.pattern === patternId);
    if (snippets.length === 0) return null;
    const index = Math.floor(Math.random() * snippets.length);
    return snippets[index];
  }

  /**
   * Get the pattern ID for a given snippet (for bonus pattern spawning)
   */
  static getBonusPatternId(): PatternId {
    const snippet = this.getRandomCodeSnippet();
    return snippet.pattern;
  }

  /**
   * Get all detected patterns in the codebase with their snippets
   */
  static getAllDetectedPatterns(): DetectedPattern[] {
    const patternMap = new Map<PatternId, CodeSnippet[]>();

    // Group snippets by pattern
    for (const snippet of this.CODE_SNIPPETS) {
      const existing = patternMap.get(snippet.pattern) || [];
      existing.push(snippet);
      patternMap.set(snippet.pattern, existing);
    }

    // Convert to array of DetectedPattern
    const detected: DetectedPattern[] = [];
    patternMap.forEach((snippets, patternId) => {
      detected.push({
        patternId,
        count: snippets.length,
        snippets,
      });
    });

    // Sort by count descending
    return detected.sort((a, b) => b.count - a.count);
  }

  /**
   * Get all snippets for a specific pattern
   */
  static getSnippetsForPattern(patternId: PatternId): CodeSnippet[] {
    return this.CODE_SNIPPETS.filter((s) => s.pattern === patternId);
  }

  /**
   * Get total count of snippets
   */
  static getTotalSnippetCount(): number {
    return this.CODE_SNIPPETS.length;
  }

  /**
   * Get pattern IDs that have at least one snippet
   */
  static getAvailablePatternIds(): PatternId[] {
    const ids = new Set<PatternId>();
    for (const snippet of this.CODE_SNIPPETS) {
      ids.add(snippet.pattern);
    }
    return Array.from(ids);
  }

  /**
   * Check if a pattern has real code snippets in the codebase
   */
  static hasSnippetsForPattern(patternId: PatternId): boolean {
    return this.CODE_SNIPPETS.some((s) => s.pattern === patternId);
  }

  /**
   * Get a formatted display string for a snippet (for UI display)
   */
  static formatSnippetForDisplay(snippet: CodeSnippet): string {
    const lines = snippet.code.split('\n');
    const preview = lines.slice(0, 3).join('\n');
    const ellipsis = lines.length > 3 ? '\n...' : '';
    return `${preview}${ellipsis}`;
  }
}
