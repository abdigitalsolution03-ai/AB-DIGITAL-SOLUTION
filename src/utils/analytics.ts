// Google Analytics / gtag utilities for React components
// Replace G-XXXXXXXXXX with your actual GA4 Measurement ID in index.html

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your GA4 Measurement ID

/**
 * Track a page view (call on route change)
 */
export function trackPageView(url: string, title?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: url,
      page_title: title,
      page_location: window.location.href,
    });
  }
}

/**
 * Track a custom event
 * @param eventName - Event name (e.g., 'contact_form_submit', 'cta_click', 'download_brochure')
 * @param params - Optional parameters (value, currency, item_id, etc.)
 */
export function trackEvent(eventName: string, params?: Record<string, string | number | boolean>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
}

/**
 * Track a conversion (e.g., form submission, purchase, signup)
 * @param conversionName - Conversion name (e.g., 'generate_lead', 'purchase', 'sign_up')
 * @param value - Optional monetary value
 * @param currency - Currency code (e.g., 'USD', 'INR')
 */
export function trackConversion(
  conversionName: string,
  value?: number,
  currency: string = 'INR'
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', conversionName, {
      value,
      currency,
    });
  }
}

/**
 * Track a button/link click
 * @param elementName - Name of the clicked element (e.g., 'hero_cta', 'nav_contact', 'footer_linkedin')
 * @param location - Where the element is located (e.g., 'hero', 'footer', 'header')
 */
export function trackClick(elementName: string, location?: string) {
  trackEvent('click', {
    element_name: elementName,
    location: location || 'unknown',
  });
}

/**
 * Track form interactions
 * @param formName - Name of the form (e.g., 'contact', 'newsletter', 'quote_request')
 * @param step - Form step (e.g., 'start', 'complete', 'error')
 * @param fieldName - Optional specific field that was interacted with
 */
export function trackFormInteraction(
  formName: string,
  step: 'start' | 'complete' | 'error' | 'field_focus' | 'field_blur',
  fieldName?: string
) {
  trackEvent('form_interaction', {
    form_name: formName,
    step,
    field_name: fieldName,
  });
}

/**
 * Track scroll depth
 * @param percentage - Scroll percentage (25, 50, 75, 100)
 */
export function trackScrollDepth(percentage: number) {
  trackEvent('scroll', {
    scroll_depth: percentage,
  });
}

/**
 * Track video play
 * @param videoTitle - Title of the video
 * @param videoUrl - URL of the video
 */
export function trackVideoPlay(videoTitle: string, videoUrl: string) {
  trackEvent('video_play', {
    video_title: videoTitle,
    video_url: videoUrl,
  });
}

/**
 * Track file download
 * @param fileName - Name of the downloaded file
 * @param fileUrl - URL of the file
 */
export function trackDownload(fileName: string, fileUrl: string) {
  trackEvent('file_download', {
    file_name: fileName,
    file_url: fileUrl,
  });
}

/**
 * Track search query
 * @param query - Search query
 * @param resultsCount - Number of results returned
 */
export function trackSearch(query: string, resultsCount: number) {
  trackEvent('search', {
    search_term: query,
    results_count: resultsCount,
  });
}

/**
 * Set user properties (e.g., after login/signup)
 * @param userId - User ID
 * @param properties - User properties (e.g., { user_type: 'client', plan: 'premium' })
 */
export function setUserProperties(userId: string, properties: Record<string, string | number | boolean>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('set', { user_id: userId });
    window.gtag('event', 'set_user_properties', properties);
  }
}

/**
 * Track timing (e.g., page load time, API response time)
 * @param name - Timing name
 * @param value - Time in milliseconds
 * @param category - Timing category
 */
export function trackTiming(name: string, value: number, category: string = 'performance') {
  trackEvent('timing_complete', {
    name,
    value,
    event_category: category,
  });
}

/**
 * Initialize enhanced measurement (scroll, video, file_download, etc.)
 * Call this once on app initialization if you want automatic enhanced measurement
 */
export function initEnhancedMeasurement() {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-XXXXXXXXXX', {
      enhanced_measurement: true,
    });
  }
}

export default {
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
};