import { useEffect, useRef } from 'react';
import { trackPageView } from '../utils/analytics';

const SITE_NAME = 'Pirate Husky';
const DEFAULT_DESCRIPTION =
  'Family-run husky kennel offering dog sledding, husky hikes, kayaking, skiing, and Arctic stays in Finnmark, Norway.';

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => {
    if (value == null) return;
    element.setAttribute(key, value);
  });
}

function upsertLink(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('link');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => {
    if (value == null) return;
    element.setAttribute(key, value);
  });
}

export default function Seo({
  title,
  description,
  image,
  path,
  type = 'website',
  noIndex = false,
  jsonLd,
}) {
  const lastTrackedPath = useRef(null);

  const isServer = typeof window === 'undefined';
  const origin = isServer
    ? globalThis.__PRERENDER_ORIGIN || 'https://piratehusky.no'
    : window.location.origin;
  const resolvedPath = path || (isServer ? globalThis.__PRERENDER_PATH || '/' : window.location.pathname);
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const metaDescription = description || DEFAULT_DESCRIPTION;
  const url = new URL(resolvedPath, origin).toString();
  const resolvedImage = image ? new URL(image, origin).toString() : null;

  if (isServer && globalThis.__SEO_COLLECTOR) {
    globalThis.__SEO_COLLECTOR.value = {
      title: fullTitle,
      description: metaDescription,
      url,
      type,
      image: resolvedImage,
      noIndex,
    };
  }

  useEffect(() => {
    document.title = fullTitle;
    upsertMeta('meta[name="description"]', {
      name: 'description',
      content: metaDescription,
    });

    const robotsElement = document.head.querySelector('meta[name="robots"]');
    if (noIndex) {
      upsertMeta('meta[name="robots"]', {
        name: 'robots',
        content: 'noindex, nofollow',
      });
    } else if (robotsElement) {
      robotsElement.remove();
    }

    upsertLink('link[rel="canonical"]', {
      rel: 'canonical',
      href: url,
    });

    upsertMeta('meta[property="og:title"]', {
      property: 'og:title',
      content: fullTitle,
    });
    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: metaDescription,
    });
    upsertMeta('meta[property="og:type"]', {
      property: 'og:type',
      content: type,
    });
    upsertMeta('meta[property="og:url"]', {
      property: 'og:url',
      content: url,
    });

    if (resolvedImage) {
      upsertMeta('meta[property="og:image"]', {
        property: 'og:image',
        content: resolvedImage,
      });
    }

    upsertMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: resolvedImage ? 'summary_large_image' : 'summary',
    });
    upsertMeta('meta[name="twitter:title"]', {
      name: 'twitter:title',
      content: fullTitle,
    });
    upsertMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: metaDescription,
    });
    if (resolvedImage) {
      upsertMeta('meta[name="twitter:image"]', {
        name: 'twitter:image',
        content: resolvedImage,
      });
    }

    if (lastTrackedPath.current !== resolvedPath) {
      trackPageView({ title: fullTitle, path: resolvedPath });
      lastTrackedPath.current = resolvedPath;
    }
  }, [fullTitle, metaDescription, resolvedImage, resolvedPath, type, url, noIndex]);

  if (!jsonLd) return null;
  const items = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
  return (
    <>
      {items.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
