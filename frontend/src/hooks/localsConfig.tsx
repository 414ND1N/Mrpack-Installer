import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import resourcesToBackend from "i18next-resources-to-backend"

i18n
.use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
.use(initReactI18next)
.init({
  lng: 'en', // Idioma predeterminado
  fallbackLng: 'en',
  ns: ['commons','menu', 'discover', 'installation', 'settings'],
  interpolation: {
    escapeValue: false, // React ya maneja la protección contra XSS
  }
})

i18n.on('failedLoading', (lng, ns, msg) => {
  console.error('Error loading translation:', lng, ns, msg);
})

i18n.on('languageChanged', (lng) => {
  console.log(`Language changed to: ${lng}`);
})

i18n.on('initialized', () => {
  console.log('i18n initialized with languages:', i18n.languages);
})

export default i18n