import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'

i18n
.use(initReactI18next)
.use(Backend) // Carga los recursos desde el backend
.init({
  lng: 'es', // Idioma predeterminado
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React ya maneja la protección contra XSS
  },
})

export default i18n