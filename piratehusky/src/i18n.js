import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './i18n/en';
import no from './i18n/no';
import de from './i18n/de';
import fr from './i18n/fr';
import es from './i18n/es';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en,
      no,
      de,
      fr,
      es,
    },
    lng: 'en',            // Default language
    fallbackLng: 'en',    // If a key is missing, fall back to English
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
  });

export default i18n;
