import { HashRouter, Routes, Route } from 'react-router'
import { useEffect } from 'react'

// Estilos globales
import '@/styles/globales.css'
import '@/styles/variables.css'

// Paginas
import Home from '@/pages/Home/Home.tsx'
import Discover from '@/pages/Discover/Discover.tsx'
import Install from '@/pages/Install/Install.tsx'
import Settings from '@/pages/Settings/Settings'
import { useGlobalMessage } from "@/context/GlobalMessageContext"
import { useTranslation } from 'react-i18next'

function App() {

  const { showMessage } = useGlobalMessage();
  const { t, i18n } = useTranslation(['commons'])

  useEffect(() => {
    // Aplicar el tema al cargar la aplicación
    const getInitialConfig = async () => {
      try {
        // const savedTheme = await ipcRenderer.invoke('get-theme')
        const savedTheme = await (window as any).winConfig?.getTheme()
        if (savedTheme) {

          if (savedTheme === 'system') {
            const systemTheme = await (window as any).winConfig?.getSystemTheme()
            document.body.setAttribute('data-theme', systemTheme)
          } else {
            document.body.setAttribute('data-theme', savedTheme)
          }
        }
        const savedLanguage = await (window as any).winConfig?.getLanguage()
        const language = savedLanguage || navigator.language.split('-')[0]; // Usar el idioma del navegador si no hay uno guardado
        if (language) {
          i18n.changeLanguage(language)
        }

        // const updateAvaliable = await ipcRenderer.invoke('check-update')
        const updateAvaliable = await (window as any).winConfig?.checkUpdate()
        if (updateAvaliable === true) {
          showMessage(`${t('update.avaliable', { ns: "commons" })} ${t('update.instructions', { ns: "commons" })}`);
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
        <Route path={`/Settings`} element={<Settings />} />
      </Routes>
    </HashRouter>
  )
}

export default App
