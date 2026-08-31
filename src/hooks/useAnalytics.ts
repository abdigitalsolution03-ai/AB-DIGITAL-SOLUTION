import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  trackPageView,
  trackEvent,
  trackConversion,
  trackClick,
  trackFormInteraction,
  trackScrollDepth,
  trackVideoPlay,
  trackDownload,
  trackSearch,
  setUserProperties,
  trackTiming,
  initEnhancedMeasurement,
} from '@/utils/analytics';

// Initialize enhanced measurement on app load
export function useAnalyticsInit() {
  useEffect(() => {
    // Initialize enhanced measurement (scroll, video, file_download, etc.)
    // Note: This requires the gtag config in index.html to have enhanced_measurement: true
    // We can also manually trigger some measurements
    
    let maxScroll = 0;
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      if (scrollPercent > 0 && scrollPercent % 25 === 0 && scrollPercent > (window as any).__lastTrackedScroll) {
        // Track scroll depth at 25%, 50%, 75%, 100%
        if ([25, 50, 75, 100].includes(scrollPercent)) {
          // We'll track this via a custom event
        }
        (window as any).__lastTrackedScroll = scrollPercent;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}

/**
 * Hook for tracking page views on route changes
 */
export function usePageTracking() {
  const location = useLocation();
  
  useEffect(() => {
    // Track page view on route change
    // Small delay to ensure gtag is loaded
    setTimeout(() => {
      const title = document.title;
      // Import dynamically to avoid circular dependency
      import('@/utils/analytics').then(({ trackPageView }) => {
        trackPageView(location.pathname + location.search, document.title);
      });
    }, 0);
  }, [location]);
}

/**
 * Hook for tracking clicks, form interactions, etc.
 * Returns an object with tracking functions
 */
export function useTracking() {
  return {
    trackEvent: (eventName: string, params?: Record<string, string | number | boolean>) => {
      import('@/utils/analytics').then(({ trackEvent }) => trackEvent);
    },
    trackClick: (elementName: string, location?: string) => {
      import('@/utils/analytics').then(({ trackClick }) => trackClick(elementName, location));
    },
    trackConversion: (conversionName: string, value?: number, currency?: string) => {
      import('@/utils/analytics').then(({ trackConversion }) => trackConversion(conversionName, value, currency));
    },
    trackForm: (formName: string, step: 'start' | 'complete' | 'error' | 'field_focus' | 'field_blur', fieldName?: string) => {
      import('@/utils/analytics').then(({ trackFormInteraction }) => trackFormInteraction(formName, step, fieldName));
    },
    trackDownload: (fileName: string, fileUrl: string) => {
      import('@/utils/analytics').then(({ trackDownload }) => trackDownload(fileName, fileUrl));
    },
    trackVideoPlay: (videoTitle: string, videoUrl: string) => {
      import('@/utils/analytics').then(({ trackVideoPlay }) => trackVideoPlay(videoTitle, videoUrl));
    },
    trackSearch: (query: string, resultsCount: number) => {
      import('@/utils/analytics').then(({ trackSearch }) => trackSearch(query, resultsCount));
    },
    trackTiming: (name: string, value: number, category?: string) => {
      import('@/utils/analytics').then(({ trackTiming }) => trackTiming(name, value, category));
    },
  };
}

// Convenience hook for form tracking
export function useFormTracking(formName: string) {
  return {
    onFormStart: () => import('@/utils/analytics').then(({ trackFormInteraction }) => trackFormInteraction(formName, 'start')),
    onFormComplete: () => import('@/utils/analytics').then(({ trackFormInteraction }) => trackFormInteraction(formName, 'complete')),
    onFormError: () => import('@/utils/analytics').then(({ trackFormInteraction }) => trackFormInteraction(formName, 'error')),
    onFieldFocus: (fieldName: string) => import('@/utils/analytics').then(({ trackFormInteraction }) => trackFormInteraction(formName, 'field_focus', fieldName)),
    onFieldBlur: (fieldName: string) => import('@/utils/analytics').then(({ trackFormInteraction }) => trackFormInteraction(formName, 'field_blur', fieldName)),
  };
}

// Convenience hook for click tracking
export function useClickTracking() {
  return (elementName: string, location?: string) => {
    import('@/utils/analytics').then(({ trackClick }) => trackClick(elementName, location));
  };
}

export type {
  // Re-export types if needed
} from '@/utils/analytics';