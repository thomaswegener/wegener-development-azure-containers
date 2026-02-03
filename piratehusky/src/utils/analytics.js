export const BOOKING_BUTTON_ID = 'ovbs-btnrAmxnqK3jlhQF2Y';

export function isAnalyticsReady() {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
}

export function trackEvent(name, params = {}) {
  if (!isAnalyticsReady()) return;
  window.gtag('event', name, params);
}

export function trackPageView({ title, path } = {}) {
  if (!isAnalyticsReady()) return;
  const pagePath = path || window.location.pathname;
  const pageLocation = window.location.href;
  const pageTitle = title || document.title;
  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_location: pageLocation,
    page_title: pageTitle,
  });
}

export function openBookingWidget(source = 'unknown') {
  const button = document.getElementById(BOOKING_BUTTON_ID);
  if (button) {
    window.__bookingIgnoreNext = true;
  }
  trackEvent('booking_open', { source });
  if (button) {
    button.click();
  } else {
    window.__bookingIgnoreNext = false;
    console.log('Booking button not yet loaded.');
  }
}

