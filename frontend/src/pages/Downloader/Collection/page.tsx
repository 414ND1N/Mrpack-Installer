import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MCButton, MCInput, MCSelect, MCCheckbox } from '@/components/MC/MC'
import { useGlobalMessage } from '@/context/GlobalMessageContext'
import { CollectionDownloadInfo, ModsInCollectionInfo } from '@/interfaces/modrinth/Collection'
import { Dialog, DialogContent, DialogClose, DialogFooter, DialogHeader, DialogDescription } from "@/components/Dialog/Dialog"
import { Separator } from "@/components/Separator/separator"
import { OpenFolder } from '@/hooks/ui/OpenFolder'
import './page.css'

const VERSION_PARTS = {
    major: 1,
    minor: 0,
    patch: 0,
}

function DownloadCollectionView() {
    const { t } = useTranslation(['downloader', 'commons'])
    const { showMessage, hideMessage } = useGlobalMessage()

    const [collectionId, setCollectionId] = useState<string>('')
    const [versionParts, setVersionParts] = useState({
        major: VERSION_PARTS.major.toString(),
        minor: VERSION_PARTS.minor.toString(),
        patch: VERSION_PARTS.patch.toString(),
    })
    const [loader, setLoader] = useState<string>('fabric')
    const [selectedLoaders, setSelectedLoaders] = useState<string[]>([])
    const loaderChipsRef = useRef<HTMLDivElement | null>(null)

    const version = `${versionParts.major}.${versionParts.minor}.${versionParts.patch}`
    const isVersionComplete = Object.values(versionParts).every(value => value.trim().length > 0)

    const updateVersionPart = (part: keyof typeof versionParts, value: string) => {
        setVersionParts(prev => ({ ...prev, [part]: value }))
    }

    const addLoader = () => {
        const value = loader && loader.trim()
        if (!value) return
        if (!selectedLoaders.includes(value)) setSelectedLoaders(prev => [...prev, value])
    }

    const removeLoader = (value: string) => {
        setSelectedLoaders(prev => prev.filter(l => l !== value))
    }

    const handleLoaderChipsWheel = (event: React.WheelEvent<HTMLDivElement>) => {
        const container = loaderChipsRef.current
        if (!container) return

        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return

        event.preventDefault()
        container.scrollLeft += event.deltaY
    }

    const [directory, setDirectory] = useState<string>('')
    const [updateExisting, setUpdateExisting] = useState<boolean>(false)
    const [modsInCollection, setModsInCollection] = useState<ModsInCollectionInfo | null>(null)

    const DownloadCollection = async () => {
        if (!collectionId || collectionId.trim().length === 0) {
            showMessage(t('sections.collection.messages.invalid_collection_id'), { showClose: true })
            return
        }

        if (!isVersionComplete || selectedLoaders.length === 0 || !directory || directory.trim().length === 0) {
            showMessage(t('sections.collection.fields.incomplete_fields'), { showClose: true })
            return
        }

        showMessage(t('sections.collection.process.starting'), { showClose: false })
        try {
            showMessage(t('sections.collection.process.downloading'), { showClose: false })
            const result = await (window as any).backend.DownloadCollection(
                collectionId.trim(),
                version,
                selectedLoaders,
                directory,
                updateExisting,
                true,
            ) as CollectionDownloadInfo
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

    const GetModsInCollection = async () => {
        try {

            setModsInCollection(null)
            if (!collectionId || collectionId.trim().length === 0) {
                showMessage(t('sections.collection.messages.invalid_collection_id'), { showClose: true })
                return
            }

            if (!isVersionComplete || selectedLoaders.length === 0) {
                showMessage(t('sections.collection.fields.incomplete_fields'), { showClose: true })
                return
            }

            showMessage(t('sections.collection.verify.listing'), { showClose: false })
            const result = await (window as any).backend.GetModsInCollectionInfo(
                collectionId.trim(),
                version,
                selectedLoaders.join(','),
            ) as ModsInCollectionInfo
            setModsInCollection(result)
            hideMessage()
        } catch (error) {
            console.error('getModsInCollection error', error)
            showMessage(t('errors.header', { ns: 'commons' }) + `: ${(error as Error).message}`, { showClose: true })
            setModsInCollection(null)
        }
    }


    return (
        <>
            <section className="header">
                <p>{t('sections.collection.subtitle')}</p>
            </section>
            <section className="content">
                <div className="field id">
                    <label>{t('sections.collection.fields.collectionId')}</label>
                    <MCInput value={collectionId} onChange={(e) => setCollectionId(e.target.value)} placeholder={t('sections.collection.fields.collectionIdPlaceholder')} />
                </div>

                <div className="row second-row">
                    <div className="field version">
                        <label>{t('sections.collection.fields.version')}</label>
                        <div className="buttons">
                            <div className="version-selectors" aria-label={t('sections.collection.fields.version')}>
                                <MCInput
                                    type="number"
                                    variant="solid"
                                    min={1}
                                    step={1}
                                    className="version-number-input"
                                    value={versionParts.major}
                                    onChange={(e) => updateVersionPart('major', e.target.value)}
                                />
                                <span className="version-separator">.</span>
                                <MCInput
                                    type="number"
                                    variant="solid"
                                    min={0}
                                    step={1}
                                    className="version-number-input"
                                    value={versionParts.minor}
                                    onChange={(e) => updateVersionPart('minor', e.target.value)}
                                />
                                <span className="version-separator">.</span>
                                <MCInput
                                    type="number"
                                    variant="solid"
                                    min={0}
                                    step={1}
                                    className="version-number-input"
                                    value={versionParts.patch}
                                    onChange={(e) => updateVersionPart('patch', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="field loader">
                        <label>{t('sections.collection.fields.loader')}</label>
                        <div
                            ref={loaderChipsRef}
                            className="loader-chips"
                            onWheel={handleLoaderChipsWheel}
                        >
                            {selectedLoaders.map((l) => (
                                <span key={l} className="loader-chip">
                                    <span>{l}</span>
                                    <button type="button" onClick={() => removeLoader(l)}>✕</button>
                                </span>
                            ))}
                        </div>
                        <div className="loader-actions">
                            <MCSelect
                                value={loader}
                                className="loader-select"
                                onChange={(e) => {
                                    setLoader(e.target.value)
                                }}
                            >
                                <option value="fabric">Fabric</option>
                                <option value="forge">Forge</option>
                                <option value="neoforge">Neoforge</option>
                                <option value="quilt">Quilt</option>
                                <option value="datapack">Datapack</option>
                                <option value="velocity">Velocity</option>
                                <option value="bungeecord">Bungeecord</option>
                                <option value="waterfall">Waterfall</option>
                                <option value="bukkit">Bukkit</option>
                                <option value="paper">Paper</option>
                                <option value="spigot">Spigot</option>
                                <option value="minecraft">{t('projects.resourcepack', { ns: 'commons' })}</option>
                            </MCSelect>
                            <MCButton 
                                className="loader-add-button"
                                onClick={addLoader}>{t('actions.add', { ns: 'commons' })}
                            </MCButton>
                        </div>
                    </div>
                </div>

                <div className="field destination">
                    <label>{t('sections.collection.fields.directory')}</label>
                    <div className="row">
                        <MCInput value={directory} onChange={(e) => setDirectory(e.target.value)} placeholder={t('sections.collection.fields.directoryPlaceholder')} />
                        <MCButton
                            variant="ghost"
                            className="path_search"
                            onClick={
                                async () => {
                                    const selected = await OpenFolder(
                                        t('sections.collection.fields.browse_title'),
                                        t('sections.collection.fields.browse_description')
                                    )
                                    if (selected) setDirectory(selected)
                                }
                            }
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
                    <div className="row">
                        <MCButton
                            onClick={GetModsInCollection}
                        >
                            {t('sections.collection.verify.button')}
                        </MCButton>
                        <MCButton
                            onClick={DownloadCollection}
                        >
                            {t('sections.collection.fields.download_button')}
                        </MCButton>
                    </div>
                </div>
            </section>
            <Dialog open={modsInCollection !== null} onOpenChange={(open) => { if (!open) setModsInCollection(null) }}>
                <DialogContent>
                    <DialogHeader>
                        {t('sections.collection.verify.header')}
                    </DialogHeader>
                    <DialogDescription>
                        {t('sections.collection.verify.description')} ( {loader} - {version} )
                    </DialogDescription>
                    <Separator />
                    {modsInCollection ? (
                        <>
                            <h1>{t('sections.collection.verify.compatible_mods')} - {modsInCollection.available_mods.length}</h1>
                            <ul>
                                {modsInCollection.available_mods.length > 0 ? (
                                    modsInCollection.available_mods.map((mod: string) => (
                                        <li key={mod}>
                                            {mod}
                                        </li>
                                    ))
                                ) : (
                                    <li>{t('sections.collection.verify.no_mods')}</li>
                                )}
                            </ul>
                            <Separator borderless={true} />
                            <h1>{t('sections.collection.verify.incompatible_mods')} - {modsInCollection.unavailable_mods.length}</h1>
                            <ul>
                                {modsInCollection.unavailable_mods.length > 0 ? (
                                    modsInCollection.unavailable_mods.map((mod: string) => (
                                        <li key={mod}>
                                            {mod}
                                        </li>
                                    ))
                                ) : (
                                    <li>{t('sections.collection.verify.no_mods')}</li>
                                )}
                            </ul>
                        </>
                    ) : (
                        <h2>{t('sections.collection.verify.no_mods')}</h2>
                    )}
                    <DialogFooter>
                        <DialogClose>
                            <MCButton
                                onClick={() => setModsInCollection(null)}
                            >
                                {t('actions.close', { ns: 'commons' })}
                            </MCButton>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default DownloadCollectionView
