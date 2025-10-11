import i18next from 'i18next';
import hi from './hi.json';
import en from './en.json';
import te from './te.json';
import { initReactI18next } from 'react-i18next';

i18next
  .use(initReactI18next)
  .init({
    debug: true,
    compatibilityJSON: 'v4',
    lng: 'en',
    fallbackLng: 'en',

    resources: {
      en: { translation: en },
      hi: { translation: hi },
      te: { translation: te },
    },

    ns: ['translation'],
    defaultNS: 'translation',

    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;