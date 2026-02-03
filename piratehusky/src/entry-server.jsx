import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';

import App from './App.jsx';
import i18n from './i18n.js';
import { AuthProvider } from './context/AuthContext.jsx';

export function render(url, { origin = 'https://piratehusky.no', lang = 'en' } = {}) {
  i18n.changeLanguage(lang);

  globalThis.__PRERENDER_ORIGIN = origin;
  globalThis.__PRERENDER_PATH = url;
  globalThis.__SEO_COLLECTOR = { value: null };

  const app = (
    <StaticRouter location={url}>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </I18nextProvider>
    </StaticRouter>
  );

  const html = renderToString(app);
  const seo = globalThis.__SEO_COLLECTOR.value;

  delete globalThis.__SEO_COLLECTOR;
  delete globalThis.__PRERENDER_PATH;
  delete globalThis.__PRERENDER_ORIGIN;

  return { html, seo };
}
