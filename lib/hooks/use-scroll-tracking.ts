/**
 * Hook for tracking scroll depth and section visibility
 */

import { useEffect, useRef } from 'react';
import { trackScrollDepth, trackSectionVisibility, trackTimeOnPage } from '@/lib/utils/analytics';

interface UseScrollTrackingOptions {
  /**
   * Scroll depth milestones to track (e.g., [25, 50, 75, 100])
   */
  depthMilestones?: number[];
  
  /**
   * Sections to track visibility for
   */
  sectionIds?: string[];
  
  /**
   * Whether to track time on page
   */
  trackTime?: boolean;
}

/**
 * Hook to track scroll depth, section visibility, and time on page
 */
export function useScrollTracking(options: UseScrollTrackingOptions = {}) {
  const {
    depthMilestones = [25, 50, 75, 100],
    sectionIds = [],
    trackTime = true,
  } = options;

  const trackedDepths = useRef<Set<number>>(new Set());
  const trackedSections = useRef<Set<string>>(new Set());
  const startTime = useRef<number>(Date.now());
  const lastTimeTracked = useRef<number>(0);

  useEffect(() => {
    // Track scroll depth
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercentage = Math.round(
        ((scrollTop + windowHeight) / documentHeight) * 100
      );

      // Track depth milestones
      depthMilestones.forEach((milestone) => {
        if (scrollPercentage >= milestone && !trackedDepths.current.has(milestone)) {
          trackedDepths.current.add(milestone);
          trackScrollDepth(milestone);
        }
      });
    };

    // Track section visibility using Intersection Observer
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5, // Section is considered visible when 50% is in viewport
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.id;
        const isVisible = entry.isIntersecting;

        // Track when section becomes visible for the first time
        if (isVisible && !trackedSections.current.has(sectionId)) {
          trackedSections.current.add(sectionId);
          trackSectionVisibility(sectionId, true);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe sections
    sectionIds.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    // Track time on page every 30 seconds
    let timeInterval: NodeJS.Timeout | null = null;
    if (trackTime) {
      timeInterval = setInterval(() => {
        const currentTime = Date.now();
        const elapsedSeconds = Math.round((currentTime - startTime.current) / 1000);
        
        // Only track if at least 30 seconds have passed since last tracking
        if (elapsedSeconds - lastTimeTracked.current >= 30) {
          lastTimeTracked.current = elapsedSeconds;
          trackTimeOnPage(elapsedSeconds);
        }
      }, 30000); // Check every 30 seconds
    }

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      if (timeInterval) {
        clearInterval(timeInterval);
        
        // Track final time on page when component unmounts
        const finalTime = Math.round((Date.now() - startTime.current) / 1000);
        if (finalTime > lastTimeTracked.current) {
          trackTimeOnPage(finalTime);
        }
      }
    };
  }, [depthMilestones, sectionIds, trackTime]);

  return {
    // Expose methods to manually track if needed
    trackDepth: (depth: number) => {
      if (!trackedDepths.current.has(depth)) {
        trackedDepths.current.add(depth);
        trackScrollDepth(depth);
      }
    },
    trackSection: (sectionId: string, visible: boolean) => {
      if (visible && !trackedSections.current.has(sectionId)) {
        trackedSections.current.add(sectionId);
        trackSectionVisibility(sectionId, visible);
      }
    },
  };
}
