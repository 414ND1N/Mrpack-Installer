import { useState, useEffect } from "react"
import { useTranslation } from 'react-i18next'
import i18n from '@/hooks/localsConfig'
import { MCSelect, MCCheckbox } from "@/components/MC/MC"
import { Separator } from "@/components/Separator/separator"

function GeneralSettings() {
    const [theme, setThemeState] = useState<string>("classic")
    const [fullscreen, setFullscreen] = useState<boolean>(false)
    const [language, setLanguage] = useState<string>('en')
    const [sysTheme, setSysTheme] = useState<string>("classic")
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

    return (
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
                                    checked={theme === "system"}
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
                                    checked={theme === "classic"}
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
                                    checked={theme === "light"}
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
                                    checked={theme === "dark"}
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
}

export default GeneralSettings
