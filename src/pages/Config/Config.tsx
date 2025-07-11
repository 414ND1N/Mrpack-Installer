import { useState, useEffect } from "react"
import { ipcRenderer } from 'electron'

// Componentes
import Sidebar from "@/pages/Sidebar"
import SectionsMinecraftComponent from "@/components/SectionsMinecraft/SectionsMinecraft"

// Css
import "./Config.css"

const handleFullscreenToggle = (isFullscreen: boolean) => {
    ipcRenderer.invoke('set-fullscreen', isFullscreen);
}

const handleThemeChange = (theme: string) => {
    ipcRenderer.invoke('set-theme', theme);
    document.body.setAttribute("data-theme", theme);
}

const HandleUpdate = async () => {
    try {
        const result = await ipcRenderer.invoke("update-app")
        console.log(result)
    } catch (error) {
        console.error("Error durante la actualización:", error)
        console.error("Error durante la actualización:", error)
    }
}

function Config() {
    const [theme, setThemeState] = useState<string>("classic")
    const [fullscreen, setFullscreen] = useState<boolean>(false)
    const [updateStatus, setUpdateStatus] = useState<boolean>(false)
    
    const updateTheme = (newTheme: string) => {
        handleThemeChange(newTheme)
        setThemeState(newTheme)
    }

    const updateFullscreen = (isFullscreen: boolean) => {
        handleFullscreenToggle(isFullscreen)
        setFullscreen(isFullscreen)
    }

    useEffect(() => {
        const getInitialConfig = async () => {

            // Aplicar el tema al estado
            const savedTheme = await ipcRenderer.invoke('get-theme');
            if (savedTheme) {
                setThemeState(savedTheme)
            }
            // Aplicar el estado de pantalla completa
            const isFullscreen = await ipcRenderer.invoke('get-fullscreen');
            if (isFullscreen !== undefined) {
                setFullscreen(isFullscreen)
            }
            // Obtener el estado de actualización
            // ipcRenderer.on('updateMessage', (_, message) => {
                //     console.log("Mensaje de actualización recibido:", message)
                //     setUpdateStatus(message)
                // })
            const updateAvaliable = await ipcRenderer.invoke('check-update');
            if (updateAvaliable !== undefined) {
                setUpdateStatus(updateAvaliable)
            }
        }
        
        getInitialConfig();

    }, []);

    // Contenidos de las secciones
    const sectionApariencia = (
        <>
            <section className="header">
                <h2>Apariencia</h2>
                <p>Configura la apariencia de la aplicación a tus preferencias.</p>
            </section>
            <section className="content">
                <h3 className="subtitle">Temas</h3>

                <div className="themes-list">
                    <div className="item classic">
                        <div className="preview">

                            <div className="navbar">
                            </div>
                            <div className="card">
                                <div className="line"></div>
                                <div className="line secondary"></div>
                            </div>

                        </div>
                        <div className="information">
                            <input 
                                type="radio" name="theme" value="classic" 
                                checked={theme === "classic"} // Controlado por el estado
                                onChange={(e) => updateTheme(e.target.value)}
                            />
                            <h4>Clasico</h4>
                        </div>
                    </div>
                    <div className="item light">
                        <div className="preview">

                            <div className="navbar">
                            </div>
                            <div className="card">
                                <div className="line"></div>
                                <div className="line secondary"></div>
                            </div>

                        </div>
                        <div className="information">
                            <input 
                                type="radio" name="theme" value="light" 
                                checked={theme === "light"} // Controlado por el estado
                                onChange={(e) => updateTheme(e.target.value)}
                            />
                            <h4>Claro</h4>
                        </div>
                    </div>
                    <div className="item dark">
                        <div className="preview">
                            <div className="navbar">
                            </div>
                            <div className="card">
                                <div className="line"></div>
                                <div className="line secondary"></div>
                            </div>
                        </div>
                        <div className="information">
                            <input 
                                type="radio" name="theme" value="dark"
                                checked={theme === "dark"} // Controlado por el estado
                                onChange={(e) => updateTheme(e.target.value)}
                            />
                            <h4>OLED</h4>
                        </div>
                    </div>
                </div>

                <h3 className="subtitle">Comportamiento</h3>

                <div className="fullscreen-page">
                    <h4 className="subtitle">Activar pantalla completa</h4>

                    <div className="checkbox minecraft style-2">
                        <label className="switch">
                            <input 
                                type="checkbox"
                                onChange={(e) => updateFullscreen(e.target.checked)}
                                checked={fullscreen}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                </div>
            </section>
        </>
    )


    const sectionAcercaDe = (
        <>
            <section className="content">
                <div className="side-info">
                    <h2><strong>Mrpack Installer</strong></h2>
                    <p>
                        <strong>Mrpack Installer</strong> es una aplicación diseñada para simplificar la búsqueda y gestión de paquetes 
                        <a 
                            href="https://support.modrinth.com/en/articles/8802351-modrinth-modpack-format-mrpack"
                            target="_blank"
                            rel="noopener noreferrer"    
                        >
                            mrpack
                        </a>
                        de Modrinth.
                    </p>
                    <p>
                        Buscando la <strong>simplicidad</strong>, con un diseño que recuerda al estilo del launcher oficial de <strong>Minecraft</strong>.
                    </p>
                    <p>
                        Desarrollada por 
                        <a 
                            href="https://github.com/414ND1N"
                            target="_blank"
                            rel="noopener noreferrer"    
                        >
                            @ALANDLN
                        </a>.
                    </p>
                </div>

                <div className={`update-status ${ !updateStatus ? "disabled" : ""}`}>
                    <h3>Actualización disponible </h3>
                    <button className='minecraft updater' onClick={HandleUpdate}>
                        Descargar actualización
                    </button>
                </div>
            </section>
        </>
    )


    return (
        
        <main className="main-container">
            <Sidebar current_path="/Settings"/>
            <section className="settings-container">
                <SectionsMinecraftComponent
                    title="CONFIGURACIÓN"
                    sections={
                        [
                            {
                                id: "appearance",
                                title: "Apariencia",
                                content: sectionApariencia
                            },
                            {
                                id: "about",
                                title: "Acerca de",
                                content: sectionAcercaDe
                            }
                        ]
                    }
                />
            </section>
        </main>
    )

}

export default Config