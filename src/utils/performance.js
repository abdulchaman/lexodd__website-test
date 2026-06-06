const routeImports = {
  '/': () => import('../components/pages/Home'),
  '/how-we-work': () => import('../components/pages/HowWeWork'),
  '/case-studies': () => import('../components/pages/CaseStudiesMain'),
  '/white-papers': () => import('../components/pages/WhitePapersMain'),
  '/industries': () => import('../components/pages/IndustrySingle'),
  '/careers': () => import('../components/pages/Careers'),
  '/open-roles': () => import('../components/pages/OpenRoles'),
  '/tech-stack': () => import('../components/pages/TechStack'),
  '/contact': () => import('../components/pages/ContactPage')
};

export const prefetchRoute = (path) => {
  const key = Object.keys(routeImports).find((route) => path === route || path.startsWith(`${route}/`));
  if (key) routeImports[key]();
};

export const prefetchCriticalRoutes = () => {
  const run = () => ['/how-we-work', '/case-studies', '/white-papers', '/contact'].forEach(prefetchRoute);
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(run, { timeout: 2500 });
  } else {
    window.setTimeout(run, 1800);
  }
};

export const installLinkPrefetch = () => {
  const prefetched = new Set();
  const prefetchFromEvent = (event) => {
    const anchor = event.target.closest?.('a[href^="/"]');
    if (!anchor) return;

    const url = new URL(anchor.href, window.location.origin);
    if (url.origin !== window.location.origin || prefetched.has(url.pathname)) return;

    prefetched.add(url.pathname);
    prefetchRoute(url.pathname);
  };

  document.addEventListener('pointerenter', prefetchFromEvent, { capture: true, passive: true });
  document.addEventListener('touchstart', prefetchFromEvent, { capture: true, passive: true });
};

export const registerServiceWorker = () => {
  if (!('serviceWorker' in navigator) || import.meta.env.DEV) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('Service worker registration failed:', error);
    });
  });
};

export const reportWebVitals = () => {
  if (!('PerformanceObserver' in window)) return;

  const sendMetric = (metric) => {
    window.dispatchEvent(new CustomEvent('lexodd-web-vital', { detail: metric }));
  };

  try {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lcp = entries[entries.length - 1];
      if (lcp) sendMetric({ name: 'LCP', value: lcp.startTime });
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    new PerformanceObserver((entryList) => {
      entryList.getEntries().forEach((entry) => {
        if (!entry.hadRecentInput) sendMetric({ name: 'CLS', value: entry.value });
      });
    }).observe({ type: 'layout-shift', buffered: true });

    new PerformanceObserver((entryList) => {
      entryList.getEntries().forEach((entry) => {
        sendMetric({ name: 'INP', value: entry.duration || entry.processingStart - entry.startTime });
      });
    }).observe({ type: 'event', buffered: true, durationThreshold: 40 });
  } catch {
    // Older browsers do not support every observer type. Ignore gracefully.
  }
};
