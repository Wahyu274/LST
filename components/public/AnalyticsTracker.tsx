'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    // We only want to track page views on public paths.
    // If it's an admin path, we ignore it, though the public layout only wraps public paths.
    
    const trackPageView = async () => {
      try {
        await fetch('/api/public/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventType: 'PAGE_VIEW',
            path: pathname,
          }),
        });
      } catch (error) {
        console.error('Failed to track page view:', error);
      }
    };

    trackPageView();
  }, [pathname]);

  return null;
}
