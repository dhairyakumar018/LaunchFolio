/**
 * Simple analytics utility for tracking user events and page views.
 * In a real-world scenario, this would send data to Posthog, Mixpanel, or Google Analytics.
 */
class Analytics {
  constructor() {
    this.enabled = true;
    this.debug = true;
  }

  track(eventName, properties = {}) {
    if (!this.enabled) return;

    const eventData = {
      event: eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        path: window.location.pathname
      }
    };

    if (this.debug) {
      console.log('📊 [Analytics Event]:', eventName, eventData.properties);
    }

    // Example: send to your backend or 3rd party
    // fetch('/api/analytics', { method: 'POST', body: JSON.stringify(eventData) }).catch(() => {});
  }

  pageView(pageName) {
    this.track('page_view', { page: pageName });
  }
}

export const analytics = new Analytics();
