import { useState, useEffect } from "react"
// import { ipcRenderer } from 'electron'


import { useGlobalMessage } from "@/context/GlobalMessageContext"

// Componentes
import SectionsMinecraftComponent from "@/components/SectionsMinecraft/SectionsMinecraft"
import i18n from '@/hooks/localsConfig'
import { useTranslation } from 'react-i18next'
import { MCButton, MCSelect, MCCheckbox } from "@/components/MC/MC"
import { Separator } from "@/components/Separator/separator"
// Css
import "./Settings.css"

function Settings() {
    const [theme, setThemeState] = useState<string>("classic")
    const [fullscreen, setFullscreen] = useState<boolean>(false)
    const [newUpdateAvailable, setNewUpdateAvailable] = useState<boolean>(false)
    const [language, setLanguage] = useState<string>('en')
    const [sysTheme, setSysTheme] = useState<string>("classic")
    const { showMessage } = useGlobalMessage()
    const { t } = useTranslation(['settings', 'commons'])

    useEffect(() => {
        (async () => {
            const currentSysTheme = await (window as any).winConfig.getSystemTheme()
            setSysTheme(currentSysTheme)
        })()
    }, [])

    const updateTheme = async (newTheme: string) => {
        await (window as any).winConfig.setTheme(newTheme)

        if (newTheme === 'system') {
            const sysTheme = await (window as any).winConfig.getSystemTheme()
            document.body.setAttribute("data-theme", sysTheme)
            setThemeState(newTheme)
            setSysTheme(sysTheme)
        } else {
            document.body.setAttribute("data-theme", newTheme)
            setThemeState(newTheme)
        }
    }

    const updateFullscreen = async (isFullscreen: boolean) => {
        await (window as any).winConfig.setFullscreen(isFullscreen)
        setFullscreen(isFullscreen)
    }

    const HandleUpdate = async () => {
        try {
            showMessage(t('sections.update.downloading'), { showClose: false })
            await (window as any).winConfig.updateApp()
            showMessage(t('sections.update.downloaded'))
        } catch (error) {
            showMessage(t('sections.update.download_error'), { showClose: true })
        }
    }

    const VerifyUpdate = async () => {
        try {
            const updateAvaliable = await (window as any).winConfig.checkUpdate()
            if (updateAvaliable === true) {
                setNewUpdateAvailable(updateAvaliable)
                showMessage(t('sections.update.update_available'), { showClose: true })
            }else{
                showMessage(t('sections.update.no_update_available'), { showClose: true })
            }
        } catch (error) {
            showMessage(t('sections.update.check_error'), { showClose: true })
        }
    }

    const updateLanguage = async (lang: string) => {
        if (lang === 'system') {
            const systemLang = await (window as any).winConfig.getSystemLanguage()
            i18n.changeLanguage(systemLang)
            setLanguage(lang)
            await (window as any).winConfig.setLanguage(lang)
        } else {
            i18n.changeLanguage(lang)
            setLanguage(lang)
            await (window as any).winConfig.setLanguage(lang)
        }
    }

    useEffect(() => {
        (async () => {

            // Aplicar el tema al estado
            const savedTheme = await (window as any).winConfig.getTheme()
            if (savedTheme) {
                setThemeState(savedTheme)
            }
            // Aplicar el estado de pantalla completa
            const isFullscreen = await (window as any).winConfig.getFullscreen()
            if (isFullscreen !== undefined) {
                setFullscreen(isFullscreen)
            }
            // Obtener el idioma
            const savedLanguage = await (window as any).winConfig.getLanguage()
            if (savedLanguage) {
                setLanguage(savedLanguage)
            }
        })()
    }, [])

    // Contenidos de las secciones
    const sectionGeneral = (
        <>
            <section className="header">
                <p>{t('sections.general.subtitle')}</p>
            </section>
            <Separator />
            <section className="content">

                <section className="theme">
                    <h3 className="subtitle">{t('sections.general.theme.title')}</h3>

                    <div className="themes-list">
                        <div className={`item ${sysTheme}`}>
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
                                    type="radio" name="system" value="system"
                                    checked={theme === "system"} // Controlado por el estado
                                    onChange={(e) => updateTheme(e.target.value)}
                                />
                                <h4>{t('sections.general.theme.list.system')}</h4>
                            </div>
                        </div>
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
                                <h4>{t('sections.general.theme.list.classic')}</h4>
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
                                <h4>{t('sections.general.theme.list.light')}</h4>
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
                                <h4>{t('sections.general.theme.list.oled')}</h4>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="language">
                    <h3 className="subtitle">{t('sections.general.language.title')}</h3>
                    <MCSelect
                        variant="block"
                        value={language}
                        onChange={(event) =>
                            updateLanguage(event.target.value)
                        }
                    >
                        <option value="system">{t('sections.general.language.list.system')}</option>
                        <option value="en">{t('sections.general.language.list.en')}</option>
                        <option value="es">{t('sections.general.language.list.es')}</option>
                    </MCSelect>

                </section>

                <section className="behavior">
                    <h3 className="subtitle">{t('sections.general.behavior.title')}</h3>

                    <MCCheckbox
                        checked={fullscreen}
                        onChange={(e) => updateFullscreen(e.target.checked)}
                        subtitle={t('sections.general.behavior.fullscreen.title')}
                    />
                </section>


            </section>
        </>
    )


    const sectionAcercaDe = (
        <>
            <section className="header">
                <p>{t('sections.about.subtitle')}</p>
            </section>
            <Separator />
            <section className="content">
                <div className="about">
                    <p>
                        <strong>{t('sections.about.side_info.description.part1')}</strong>{t('sections.about.side_info.description.part2')}
                        <a
                            href="https://support.modrinth.com/en/articles/8802351-modrinth-modpack-format-mrpack"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            mrpack
                        </a>
                        {t('sections.about.side_info.description.part3')}
                    </p>
                    <p>
                        {t('sections.about.side_info.simplicity.part1')} <strong>Minecraft</strong>.
                    </p>
                    <p>
                        {t('sections.about.side_info.developed_by.part1')}
                        <a
                            href="https://github.com/414ND1N"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            @ALANDLN
                        </a>.
                    </p>
                </div>
            </section>
        </>
    )

    const SectionUpdates = (
        <>
            <section className="header">
                <p>{t('sections.update.subtitle')}</p>
            </section>
            <Separator />
            <section className="content">
                <p>{t('sections.update.description')}</p>
                <div className={`update-status`}>
                    {
                        newUpdateAvailable ?
                        (
                            <MCButton
                                onClick={HandleUpdate}
                            >
                                {t('sections.update.button')}
                            </MCButton>
                        ):
                        (
                            <MCButton
                                onClick={VerifyUpdate}
                            >
                                {t('sections.update.button_no_update')}
                            </MCButton>
                        )
                    }
                </div>
            </section>
        </>
    )


    return (
        <section className="settings-container">
            <SectionsMinecraftComponent
                title={t('header.title')}
                sections={
                    [
                        {
                            id: "appearance",
                            title: t('sections.general.title'),
                            content: sectionGeneral
                        },
                        {
                            id: "about",
                            title: t('sections.about.title'),
                            content: sectionAcercaDe
                        },
                        {
                            id: "updates",
                            title: t('sections.update.title'),
                            content: SectionUpdates
                        }
                    ]
                }
            />
        </section>
    )

}

export default Settings