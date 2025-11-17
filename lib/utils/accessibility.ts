/**
 * Accessibility utility functions for the IPAM Frontend
 */

/**
 * Generate a unique ID for ARIA relationships
 * @param prefix - Optional prefix for the ID
 * @returns A unique ID string
 */
export function generateAriaId(prefix: string = 'aria'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if an element is focusable
 * @param element - The element to check
 * @returns True if the element is focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  if (element.tabIndex < 0) return false;
  if (element.hasAttribute('disabled')) return false;
  if (element.getAttribute('aria-disabled') === 'true') return false;

  const focusableElements = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ];

  return focusableElements.some((selector) => element.matches(selector));
}

/**
 * Get all focusable elements within a container
 * @param container - The container element
 * @returns Array of focusable elements
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors)).filter(
    (element) => {
      return (
        element.offsetWidth > 0 &&
        element.offsetHeight > 0 &&
        !element.hasAttribute('aria-hidden')
      );
    }
  );
}

/**
 * Trap focus within a container (useful for modals)
 * @param container - The container element
 * @returns Cleanup function to remove the trap
 */
export function trapFocus(container: HTMLElement): () => void {
  const focusableElements = getFocusableElements(container);
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable?.focus();
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  // Focus the first element
  firstFocusable?.focus();

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Announce a message to screen readers
 * @param message - The message to announce
 * @param politeness - The ARIA live politeness level
 */
export function announceToScreenReader(
  message: string,
  politeness: 'polite' | 'assertive' = 'polite'
): void {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('role', 'status');
  liveRegion.setAttribute('aria-live', politeness);
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  liveRegion.textContent = message;

  document.body.appendChild(liveRegion);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(liveRegion);
  }, 5000);
}

/**
 * Check if reduced motion is preferred
 * @returns True if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if high contrast mode is enabled
 * @returns True if high contrast is preferred
 */
export function prefersHighContrast(): boolean {
  return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Get the contrast ratio between two colors
 * @param color1 - First color in hex format
 * @param color2 - Second color in hex format
 * @returns The contrast ratio
 */
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = ((rgb >> 16) & 0xff) / 255;
    const g = ((rgb >> 8) & 0xff) / 255;
    const b = (rgb & 0xff) / 255;

    const [rs, gs, bs] = [r, g, b].map((c) => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if a color combination meets WCAG contrast requirements
 * @param foreground - Foreground color in hex
 * @param background - Background color in hex
 * @param level - WCAG level ('AA' or 'AAA')
 * @param size - Text size ('normal' or 'large')
 * @returns True if the contrast meets requirements
 */
export function meetsContrastRequirements(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal'
): boolean {
  const ratio = getContrastRatio(foreground, background);

  const requirements = {
    AA: { normal: 4.5, large: 3 },
    AAA: { normal: 7, large: 4.5 },
  };

  return ratio >= requirements[level][size];
}

/**
 * Create a focus trap for modal dialogs
 * @param element - The modal element
 * @param onEscape - Optional callback for Escape key
 * @returns Cleanup function
 */
export function createFocusTrap(
  element: HTMLElement,
  onEscape?: () => void
): () => void {
  const previouslyFocused = document.activeElement as HTMLElement;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && onEscape) {
      event.preventDefault();
      onEscape();
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  const cleanupTrap = trapFocus(element);

  return () => {
    cleanupTrap();
    document.removeEventListener('keydown', handleKeyDown);
    previouslyFocused?.focus();
  };
}

/**
 * Ensure an element is visible in the viewport
 * @param element - The element to scroll into view
 * @param options - Scroll options
 */
export function ensureVisible(
  element: HTMLElement,
  options: ScrollIntoViewOptions = { behavior: 'smooth', block: 'nearest' }
): void {
  if (prefersReducedMotion()) {
    options.behavior = 'auto';
  }
  element.scrollIntoView(options);
}

/**
 * Get accessible name for an element
 * @param element - The element
 * @returns The accessible name
 */
export function getAccessibleName(element: HTMLElement): string {
  // Check aria-label
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;

  // Check aria-labelledby
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement) return labelElement.textContent || '';
  }

  // Check associated label
  if (element instanceof HTMLInputElement) {
    const label = document.querySelector(`label[for="${element.id}"]`);
    if (label) return label.textContent || '';
  }

  // Check title
  const title = element.getAttribute('title');
  if (title) return title;

  // Check text content
  return element.textContent || '';
}
