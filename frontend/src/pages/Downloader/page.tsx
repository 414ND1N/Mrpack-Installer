import { useTranslation } from 'react-i18next'
import SectionsMinecraftComponent from '@/components/SectionsMinecraft/SectionsMinecraft'

import DownloadCollectionView from '@/pages/Downloader/Collection/page'

function Downloader() {
    const { t } = useTranslation(['downloader', 'commons'])

    return (
        <section className="collection-container">
            <SectionsMinecraftComponent
                title={t('header.title')}
                sections={
                    [
                        { id: 'collection', title: t('sections.collection.title'), content: <DownloadCollectionView/> }
                    ]
                }
            />
        </section>
    )
}

export default Downloader
