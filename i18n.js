import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    lng: 'es', // default language - Spanish
    fallbackLng: 'es',
    supportedLngs: ['en', 'es', 'pt'], // add your supported languages
    ns: ['translation'], // your namespace(s)
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n