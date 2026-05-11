import { useTranslation } from 'react-i18next'
import { Separator } from "@/components/Separator/separator"

function AboutSettings() {
    const { t } = useTranslation(['settings', 'commons'])

    return (
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
}

export default AboutSettings
