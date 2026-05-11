import { useState, useEffect } from "react"
import { useTranslation } from 'react-i18next'
import { useGlobalMessage } from "@/context/GlobalMessageContext"
import { MCButton } from "@/components/MC/MC"
import { Separator } from "@/components/Separator/separator"

function UpdatesSettings() {
    const [newUpdateAvailable, setNewUpdateAvailable] = useState<boolean>(false)
    const { showMessage } = useGlobalMessage()
    const { t } = useTranslation(['settings', 'commons'])

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

    useEffect(() => {
        (async () => {
            // Verificar si hay actualizaciones disponibles
            const updateAvaliable = await (window as any).winConfig.checkUpdate()
            setNewUpdateAvailable(updateAvaliable ?? false)
        })()
    }, [])

    return (
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
}

export default UpdatesSettings
