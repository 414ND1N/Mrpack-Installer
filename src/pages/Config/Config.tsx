import { useState, useEffect } from "react"
import { ipcRenderer } from 'electron'


import { useGlobalMessage } from "@/context/GlobalMessageContext"

// Componentes
import Sidebar from "@/pages/Sidebar"
import SectionsMinecraftComponent from "@/components/SectionsMinecraft/SectionsMinecraft"
import i18n from '@/hooks/localsConfig'
import { useTranslation } from 'react-i18next'

// Css
import "./Config.css"

function Config() {
    const [theme, setThemeState] = useState<string>("classic")
    const [fullscreen, setFullscreen] = useState<boolean>(false)
    const [updateStatus, setUpdateStatus] = useState<boolean>(false)
    const [language, setLanguage] = useState<string>('en')
    const { showMessage } = useGlobalMessage()
    const { t } = useTranslation(['views'])

    const updateTheme = async (newTheme: string) => {
        await ipcRenderer.invoke('set-theme', newTheme)
        document.body.setAttribute("data-theme", newTheme)
        setThemeState(newTheme)
    }

    const updateFullscreen = async (isFullscreen: boolean) => {
        await ipcRenderer.invoke('set-fullscreen', isFullscreen)
        setFullscreen(isFullscreen)
    }

    const HandleUpdate = async () => {
        try {
            showMessage("Descargando actualización...")
            await ipcRenderer.invoke("update-app")
            showMessage("Actualización descargada. Debes de reiniciar la aplicación para aplicar los cambios.")
        } catch (error) {
            console.error("Error durante la actualización:", error)
        }
    }

    const updateLanguage = async (lang: string) => {
        await ipcRenderer.invoke('set-language', lang)
        i18n.changeLanguage(lang)
        setLanguage(lang)
    }

    useEffect(() => {
        const getInitialConfig = async () => {

            // Aplicar el tema al estado
            const savedTheme = await ipcRenderer.invoke('get-theme')
            if (savedTheme) {
                setThemeState(savedTheme)
            }
            // Aplicar el estado de pantalla completa
            const isFullscreen = await ipcRenderer.invoke('get-fullscreen')
            if (isFullscreen !== undefined) {
                setFullscreen(isFullscreen)
            }
            // Obtener el estado de actualización
            const updateAvaliable = await ipcRenderer.invoke('check-update')
            if (updateAvaliable !== undefined) {
                setUpdateStatus(updateAvaliable)
            }
            // Obtener el idioma
            const savedLanguage = await ipcRenderer.invoke('get-language')
            if (savedLanguage) {
                setLanguage(savedLanguage)
            }
        }
        
        getInitialConfig()

    }, [])

    // Contenidos de las secciones
    const sectionGeneral = (
        <>
            <section className="header">
                <h2>{t('settings.sections.general.title')}</h2>
                <p>{t('settings.sections.general.subtitle')}</p>
            </section>
            <section className="content">

                <section className="theme">
                    <h3 className="subtitle">{t('settings.sections.general.theme.title')}</h3>

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
                                <h4>{t('settings.sections.general.theme.list.classic')}</h4>
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
                                <h4>{t('settings.sections.general.theme.list.light')}</h4>
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
                                <h4>{t('settings.sections.general.theme.list.oled')}</h4>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="language">
                    <h3 className="subtitle">{t('settings.sections.general.language.title')}</h3>

                    <select
                        className="minecraft style-2"
                        value={language}
                        onChange={(event) =>
                            updateLanguage(event.target.value)
                        }
                    >
                        <option value="en">{t('settings.sections.general.language.list.en')}</option>
                        <option value="es">{t('settings.sections.general.language.list.es')}</option>
                    </select>
                </section>

                <section className="behavior">
                    <h3 className="subtitle">{t('settings.sections.general.behavior.title')}</h3>

                    <div className="checkbox minecraft">
                        <input 
                            type="checkbox"
                            onChange={(e) => updateFullscreen(e.target.checked)}
                            checked={fullscreen}
                        />
                        <h4 className="subtitle">{t('settings.sections.general.behavior.fullscreen.title')}</h4>
                    </div>
                        
                </section>


            </section>
        </>
    )


    const sectionAcercaDe = (
        <>
            <section className="header">
                <h2>{t('settings.sections.about.title')}</h2>
                <p>{t('settings.sections.about.subtitle')}</p>
            </section>
            <section className="content">
                <div className="about">
                    <p>
                        <strong>{t('settings.sections.about.side_info.description.part1')}</strong>{t('settings.sections.about.side_info.description.part2')}
                        <a 
                            href="https://support.modrinth.com/en/articles/8802351-modrinth-modpack-format-mrpack"
                            target="_blank"
                            rel="noopener noreferrer"    
                        >
                            mrpack
                        </a>
                        {t('settings.sections.about.side_info.description.part3')}
                    </p>
                    <p>
                        {t('settings.sections.about.side_info.simplicity.part1')} <strong>Minecraft</strong>.
                    </p>
                    <p>
                        {t('settings.sections.about.side_info.developed_by.part1')}
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
                    <h3>{t('settings.sections.about.side_info.update.title')}</h3>
                    <button className='minecraft updater' onClick={HandleUpdate}>
                        {t('settings.sections.about.side_info.update.button')}
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
                                title: t('settings.sections.general.title'),
                                content: sectionGeneral
                            },
                            {
                                id: "about",
                                title: t('settings.sections.about.title'),
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