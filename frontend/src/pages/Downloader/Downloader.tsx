import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MCButton, MCInput, MCSelect, MCCheckbox } from '@/components/MC/MC'
import SectionsMinecraftComponent from '@/components/SectionsMinecraft/SectionsMinecraft'
import { useGlobalMessage } from '@/context/GlobalMessageContext'
import { CollectionInfo } from '@/interfaces/modrinth/Collection'
import './Downloader.css'

function Downloader() {
    const { t } = useTranslation(['downloader', 'commons'])
    const { showMessage } = useGlobalMessage()

    const [collectionId, setCollectionId] = useState<string>('')
    const [version, setVersion] = useState<string>('')
    const [loader, setLoader] = useState<string>('fabric')
    const [directory, setDirectory] = useState<string>('')
    const [updateExisting, setUpdateExisting] = useState<boolean>(false)

    const OpenFolder = async () => {
        try {
            const result = await (window as any).winConfig.ShowOpenDialog({
                title: t('sections.collection.fields.browse_title'),
                properties: ['openDirectory'],
                createDirectory: true,
                promptToCreate: true,
                message: t('sections.collection.fields.browse_description')
            })
            if (!result || result.canceled) return
            const selected = result.filePaths && result.filePaths[0]
            if (selected) setDirectory(selected)
        } catch (error) {
            console.error("Error opening folder:", error)
        }
    }

    const downloadCollection = async () => {
        if (!collectionId || collectionId.trim().length === 0) {
            showMessage(t('sections.collection.messages.invalid_collection_id'), { showClose: true })
            return
        }

        if (!version || version.trim().length === 0 || !loader || loader.trim().length === 0 || !directory || directory.trim().length === 0) {
            showMessage(t('sections.collection.fields.incomplete_fields'), { showClose: true })
            return
        }

        showMessage(t('sections.collection.process.starting'), { showClose: false })
        try {
            showMessage(t('sections.collection.process.downloading'), { showClose: false })
            const result = await (window as any).backend.DownloadCollection(collectionId.trim(), version, loader, directory, updateExisting) as CollectionInfo
            showMessage(
                t('sections.collection.process.finished') +
                ` ${!result.ok ? t('sections.collection.process.download_completed_with_errors') :
                    `(${result.mods_downloaded.length} / ${result.mods_downloaded.length + result.mods_not_found.length} ` +
                    t('sections.collection.process.downloaded') + `)`
                }`,
                { showClose: true }
            )
        } catch (error) {
            console.error('downloadCollection error', error)
            showMessage(t('errors.header', { ns: 'commons' }) + `: ${(error as Error).message}`, { showClose: true })
        }
    }

    const section = (
        <>
            <section className="header">
                <p>{t('sections.collection.subtitle')}</p>
            </section>
            <section className="content">
                <div className="field">
                    <label>{t('sections.collection.fields.collectionId')}</label>
                    <MCInput value={collectionId} onChange={(e) => setCollectionId(e.target.value)} placeholder={t('sections.collection.fields.collectionIdPlaceholder')} />
                </div>

                <div className="row">
                    <div className="field">
                        <label>{t('sections.collection.fields.version')}</label>
                        <MCInput value={version} onChange={(e) => setVersion(e.target.value)} placeholder={t('sections.collection.fields.versionPlaceholder')} />
                    </div>
                    <div className="field">
                        <label>{t('sections.collection.fields.loader')}</label>
                        <MCSelect
                            onChange={(e) => {
                                setLoader(e.target.value)
                            }}
                        >
                            <option value="fabric">Fabric</option>
                            <option value="forge">Forge</option>
                            <option value="neoforge ">Neoforge </option>
                            <option value="quilt">Quilt</option>
                        </MCSelect>
                    </div>
                </div>

                <div className="field">
                    <label>{t('sections.collection.fields.directory')}</label>
                    <div className="row">
                        <MCInput value={directory} onChange={(e) => setDirectory(e.target.value)} placeholder={t('sections.collection.fields.directoryPlaceholder')} />
                        <MCButton
                            variant="ghost"
                            className="path_search"
                            onClick={OpenFolder}
                        >
                            {t('actions.browse', { ns: 'commons' })}
                        </MCButton>
                    </div>
                </div>

                <div className="update field">
                    <MCCheckbox
                        checked={updateExisting}
                        onChange={(e) => setUpdateExisting(e.target.checked)}
                        subtitle={t('sections.collection.fields.update')}
                    />
                </div>

                <div>
                    <MCButton onClick={downloadCollection}>
                        {t('sections.collection.download_button')}
                    </MCButton>
                </div>
            </section>
        </>
    )

    return (
        <section className="collection-container">
            <SectionsMinecraftComponent
                title={t('header.title')}
                sections={
                    [
                        { id: 'collection', title: t('sections.collection.title'), content: section }
                    ]
                }
            />
        </section>
    )
}

export default Downloader
