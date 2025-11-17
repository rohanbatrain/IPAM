/**
 * Analytics tracking utilities for landing page
 * Tracks CTA clicks, scroll depth, and engagement metrics
 */

export type CTAType = 'cloud' | 'self-hosted' | 'demo' | 'community';
export type CTALocation = 'hero' | 'header' | 'header-mobile' | 'deployment-section' | 'cta-section' | 'footer';

export interface CTAClickEvent {
  cta_type: CTAType;
  cta_location: CTALocation;
  timestamp: string;
  page_url: string;
}

export interface ScrollDepthEvent {
  depth_percentage: number;
  timestamp: string;
  page_url: string;
}

export interface SectionVisibilityEvent {
  section_name: string;
  visible: boolean;
  timestamp: string;
  page_url: string;
}

export interface TimeOnPageEvent {
  duration_seconds: number;
  timestamp: string;
  page_url: string;
}

/**
 * Track CTA button clicks
 */
export function trackCTAClick(ctaType: CTAType, ctaLocation: CTALocation): void {
  const event: CTAClickEvent = {
    cta_type: ctaType,
    cta_location: ctaLocation,
    timestamp: new Date().toISOString(),
    page_url: window.location.href,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] CTA Click:', event);
  }

  // Send to analytics service (placeholder for future integration)
  sendAnalyticsEvent('cta_click', event);

  // Store in localStorage for debugging
  storeEvent('cta_clicks', event);
}

/**
 * Track scroll depth milestones
 */
export function trackScrollDepth(depthPercentage: number): void {
  const event: ScrollDepthEvent = {
    depth_percentage: depthPercentage,
    timestamp: new Date().toISOString(),
    page_url: window.location.href,
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Scroll Depth:', event);
  }

  sendAnalyticsEvent('scroll_depth', event);
  storeEvent('scroll_depth', event);
}

/**
 * Track section visibility (when sections come into view)
 */
export function trackSectionVisibility(sectionName: string, visible: boolean): void {
  const event: SectionVisibilityEvent = {
    section_name: sectionName,
    visible,
    timestamp: new Date().toISOString(),
    page_url: window.location.href,
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Section Visibility:', event);
  }

  sendAnalyticsEvent('section_visibility', event);
  storeEvent('section_visibility', event);
}

/**
 * Track time spent on page
 */
export function trackTimeOnPage(durationSeconds: number): void {
  const event: TimeOnPageEvent = {
    duration_seconds: durationSeconds,
    timestamp: new Date().toISOString(),
    page_url: window.location.href,
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Time on Page:', event);
  }

  sendAnalyticsEvent('time_on_page', event);
  storeEvent('time_on_page', event);
}

/**
 * Send event to analytics service
 * This is a placeholder - integrate with your analytics provider (GA4, Mixpanel, etc.)
 */
function sendAnalyticsEvent(eventName: string, eventData: unknown): void {
  // Example: Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventData);
  }

  // Example: Custom analytics endpoint
  // Don't send analytics requests from public pages to avoid triggering auth redirects
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
    const isPublicPage = ['/', '/server-setup', '/download'].some(path => 
      window.location.pathname === path || 
      window.location.pathname.startsWith(path + '/')
    );
    
    if (!isPublicPage) {
      fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: eventName, data: eventData }),
        redirect: 'manual', // Don't follow redirects to avoid auth redirects
      }).catch((error) => {
        console.error('[Analytics] Failed to send event:', error);
      });
    }
  }
}

/**
 * Store event in localStorage for debugging and offline tracking
 */
function storeEvent(eventType: string, eventData: unknown): void {
  if (typeof window === 'undefined') return;

  try {
    const key = `ipam_analytics_${eventType}`;
    const existing = localStorage.getItem(key);
    const events = existing ? JSON.parse(existing) : [];
    
    // Keep only last 100 events per type
    events.push(eventData);
    if (events.length > 100) {
      events.shift();
    }
    
    localStorage.setItem(key, JSON.stringify(events));
  } catch (error) {
    // Silently fail if localStorage is not available
    console.error('[Analytics] Failed to store event:', error);
  }
}

/**
 * Get stored analytics events (for debugging)
 */
export function getStoredEvents(eventType: string): unknown[] {
  if (typeof window === 'undefined') return [];

  try {
    const key = `ipam_analytics_${eventType}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('[Analytics] Failed to retrieve events:', error);
    return [];
  }
}

/**
 * Clear stored analytics events
 */
export function clearStoredEvents(eventType?: string): void {
  if (typeof window === 'undefined') return;

  try {
    if (eventType) {
      localStorage.removeItem(`ipam_analytics_${eventType}`);
    } else {
      // Clear all analytics events
      const keys = Object.keys(localStorage).filter((key) => key.startsWith('ipam_analytics_'));
      keys.forEach((key) => localStorage.removeItem(key));
    }
  } catch (error) {
    console.error('[Analytics] Failed to clear events:', error);
  }
}
