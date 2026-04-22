/**
 * Accessibility utilities for RGAA AAA compliance
 * Handles screen reader announcements, reduced motion, and keyboard navigation
 */

let liveRegion: HTMLElement | null = null;
let prefersReducedMotion = false;

/**
 * Initialize accessibility features
 */
export function initAccessibility(): void {
  createLiveRegion();
  detectReducedMotion();
}

/**
 * Create ARIA live region for screen reader announcements
 */
function createLiveRegion(): void {
  if (typeof document === 'undefined') return;

  // Remove existing live region if present
  const existing = document.getElementById('game-announcer');
  if (existing) {
    existing.remove();
  }

  liveRegion = document.createElement('div');
  liveRegion.id = 'game-announcer';
  liveRegion.setAttribute('role', 'status');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');

  // Visually hidden but accessible to screen readers
  Object.assign(liveRegion.style, {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: '0',
  });

  document.body.appendChild(liveRegion);
}

/**
 * Announce message to screen readers
 */
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  if (!liveRegion) {
    createLiveRegion();
  }

  if (liveRegion) {
    liveRegion.setAttribute('aria-live', priority);
    // Clear and set to trigger announcement
    liveRegion.textContent = '';
    setTimeout(() => {
      if (liveRegion) {
        liveRegion.textContent = message;
      }
    }, 100);
  }
}

/**
 * Detect user preference for reduced motion
 */
function detectReducedMotion(): void {
  if (typeof window === 'undefined') return;

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  prefersReducedMotion = mediaQuery.matches;

  mediaQuery.addEventListener('change', (event: MediaQueryListEvent) => {
    prefersReducedMotion = event.matches;
  });
}

/**
 * Check if user prefers reduced motion
 */
export function shouldReduceMotion(): boolean {
  return prefersReducedMotion;
}

/**
 * Get animation duration based on reduced motion preference
 * Returns 0 to disable animations when reduced motion is preferred
 */
export function getAnimationDuration(baseDuration: number): number {
  return prefersReducedMotion ? 0 : baseDuration;
}

/**
 * Format score for screen reader
 */
export function formatScoreAnnouncement(xp: number, level: number): string {
  return `Score: ${xp} XP, Level ${level}`;
}

/**
 * Announce game event
 */
export function announceGameEvent(
  event: 'pattern_collected' | 'bug_hit' | 'level_up' | 'game_over' | 'game_start',
  details?: Record<string, string | number>
): void {
  const messages: Record<string, string> = {
    pattern_collected: `Collected ${details?.pattern || 'pattern'}! Plus ${details?.xp || 10} XP`,
    bug_hit: `Bug collision! Lost ${Math.abs(Number(details?.xp) || 20)} XP`,
    level_up: `Level up! Now level ${details?.level || 2}`,
    game_over: `Game over! Final score: ${details?.score || 0} XP`,
    game_start: 'Game started! Use Space or click to jump. Collect patterns, avoid bugs!',
  };

  announce(messages[event] || event, event === 'game_over' ? 'assertive' : 'polite');
}

/**
 * Clean up accessibility features
 */
export function cleanupAccessibility(): void {
  if (liveRegion && liveRegion.parentNode) {
    liveRegion.parentNode.removeChild(liveRegion);
    liveRegion = null;
  }
}
