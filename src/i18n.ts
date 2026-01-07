import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { vi } from './locales/vi';
import { en } from './locales/en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      vi: vi,
      en: en
    },
    lng: "vi",
    fallbackLng: "vi",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;