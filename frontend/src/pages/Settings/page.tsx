import { useTranslation } from 'react-i18next'

// Componentes
import SectionsMinecraftComponent from "@/components/SectionsMinecraft/SectionsMinecraft"
import GeneralSettings from './General/page'
import AboutSettings from './About/page'
import UpdatesSettings from './Updates/page'

// Css
import "./page.css"

function Settings() {
    const { t } = useTranslation(['settings', 'commons'])


    return (
        <section className="settings-container">
            <SectionsMinecraftComponent
                title={t('header.title')}
                sections={
                    [
                        {
                            id: "appearance",
                            title: t('sections.general.title'),
                            content: <GeneralSettings />
                        },
                        {
                            id: "about",
                            title: t('sections.about.title'),
                            content: <AboutSettings />
                        },
                        {
                            id: "updates",
                            title: t('sections.update.title'),
                            content: <UpdatesSettings />
                        }
                    ]
                }
            />
        </section>
    )
}

export default Settings