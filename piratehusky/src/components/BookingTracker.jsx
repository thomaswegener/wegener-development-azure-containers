import { useEffect } from 'react';
import { BOOKING_BUTTON_ID, trackEvent } from '../utils/analytics';

export default function BookingTracker() {
  useEffect(() => {
    let currentButton = null;

    const handleClick = () => {
      if (window.__bookingIgnoreNext) {
        window.__bookingIgnoreNext = false;
        return;
      }
      trackEvent('booking_open', { source: 'floating_button' });
    };

    const attachListener = () => {
      const button = document.getElementById(BOOKING_BUTTON_ID);
      if (!button || button === currentButton) return;
      if (currentButton) {
        currentButton.removeEventListener('click', handleClick);
      }
      currentButton = button;
      currentButton.addEventListener('click', handleClick);
    };

    attachListener();
    const observer = new MutationObserver(attachListener);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      if (currentButton) {
        currentButton.removeEventListener('click', handleClick);
      }
    };
  }, []);

  return null;
}

