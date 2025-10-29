import { HashRouter, Routes, Route } from 'react-router'
import { ipcRenderer } from 'electron'
import { useEffect } from 'react'

// Estilos globales
import '@/styles/globales.css'
import '@/styles/variables.css'
import '@/styles/minecraft.css'

// Paginas
import Home from '@/pages/Home/Home.tsx'
import Discover from '@/pages/Discover/Discover.tsx'
import Install from '@/pages/Install/Install.tsx'
import Config from '@/pages/Config/Config.tsx'
import { useGlobalMessage } from "@/context/GlobalMessageContext"
import { useTranslation } from 'react-i18next'

function App() {

  const { showMessage } = useGlobalMessage();
  const { t, i18n } = useTranslation(['commons'])

  useEffect(() => {
    // Aplicar el tema al cargar la aplicación
    const getInitialConfig = async () => {
      try {
        const savedTheme = await ipcRenderer.invoke('get-theme')
        if (savedTheme) {
          document.body.setAttribute('data-theme', savedTheme)
        }

        const updateAvaliable = await ipcRenderer.invoke('check-update')
        if (updateAvaliable === true) {
          showMessage("Se ha encontrado una actualización disponible. Actualiza la aplicación para disfrutar de las últimas características y mejoras. Dirigite a la seccion de Configuración > Acerca De.");
          showMessage(`${t('update.avaliable', { ns: "commons" })} ${t('update.instructions', { ns: "commons" })}`);
        }

        const language = await ipcRenderer.invoke('get-language')
        if (language) {
          // Cambiar el idioma de la aplicación
          i18n.changeLanguage(language)
        }

      } catch (error) {
        console.error("Error al cargar la app:", error)
      }
    }

    getInitialConfig();
  }, [])

  return (
    <HashRouter >
      <Routes>
        <Route path={`/`} element={<Home />} />
        <Route path={`/Discover`} element={<Discover />} />
        <Route path={`/Install`} element={<Install />} />
        <Route path={`/Settings`} element={<Config />} />
      </Routes>
    </HashRouter>
  )
}

export default App
