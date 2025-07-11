import { HashRouter , Routes, Route } from 'react-router'
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

function App() {

  useEffect(() => {
    // Aplicar el tema al cargar la aplicación
    
    const getConfig = async () => {
      const savedTheme = await ipcRenderer.invoke('get-theme');
      if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
      }
    }

    getConfig();


  }, []);

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
