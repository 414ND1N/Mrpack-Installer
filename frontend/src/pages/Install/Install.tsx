import { useState, useCallback } from "react"
// import path from "path"
import { useTranslation } from 'react-i18next'

// Css
import "./Install.css"

// Componentes
import Sidebar from "@/pages/Sidebar"
import SectionsMinecraftComponent from "@/components/SectionsMinecraft/SectionsMinecraft"
import FileSelector from "@/components/FileSelector/FileSelector"

// Hooks
import { MinecraftVersionFromDependencies } from "@/hooks/modrinth/mrpack"
import { InstallationModpackProps } from "@/hooks/minecraft/minecraft"
import { ProfileIcons } from '@/interfaces/MinecraftLauncherIcons'
import { useGlobalMessage } from "@/context/GlobalMessageContext"

import { Dialog, DialogTrigger, DialogContent, DialogClose, DialogFooter, DialogHeader, DialogDescription } from "@/components/Dialog/Dialog"
import { MCButton, MCInput, MCSelect, MCSlider, MCAskButton } from "@/components/MC/MC"
import { Separator } from "@/components/Separator/separator"

function Install() {

    const { showMessage, hideMessage } = useGlobalMessage()
    const { t } = useTranslation(["installation", "commons"])

    const [installationConfig, setInstallationConfig] = useState<InstallationModpackProps>({
        type: "singleplayer", // Por defecto, tipo cliente
        installation_directory: "instances",
        minecraft_version: "latest", // Versión de Minecraft por defecto
        memory: {
            max: "", // Memoria máxima por defecto
            min: "" // Memoria mínima por defecto
        },
        mrpack_path: "", // Ruta del archivo mrpack, inicialmente vacío
        profile_icon: ProfileIcons.Bedrock, // Icono del perfil, inicialmente vacío
        // translator: t
    })

    const [installationProgress, setInstallationProgress] = useState<boolean>(false)
    const [personalizedConfig, setPersonalizedConfig] = useState<boolean>(false)
    const [openDialogConfig, setOpenDialogConfig] = useState<boolean>(false)

    // Funcion archivo
    const handleFile = async (file: File) => {
        // Aquí puedes manejar el archivo seleccionado
        console.log("Archivo seleccionado:", file)

        // Verificar si el archivo es un modpack válido
        if (!file?.name.endsWith(".mrpack")) {
            alert(t('sections.file.messages.error.invalid_mrpack_file'))
            setInstallationProgress(false)
            setInstallationConfig((prevInfo) => ({
                ...prevInfo,
                mrpack_info: undefined // Metadatos del modpack, inicialmente vacío
            }))
        }

        try {

            // const _data = await GetMrpackMedatadaInfo(file.path)
            const _data = await (window as any).backend.GetMrpackMedatadaInfo(file.path)
            console.log("Metadatos del modpack obtenidos:", _data)

            const _modpack_dir_name = `${_data.name.trim().replace(/\s+/g, "-").toLowerCase() || "modpack"}`
            const _modpack_directory = await (window as any).backend.PathJoin("instances", _modpack_dir_name)
            const _minecraft_version = MinecraftVersionFromDependencies(_data.dependencies)

            setInstallationConfig((prevInfo) => ({
                ...prevInfo,
                minecraft_version: _minecraft_version, // versión obtenida buscando una dependencia con id "minecraft"
                mrpack_info: _data,
                mrpack_path: file.path,
                modpack_directory: _modpack_directory
            }))
            setInstallationProgress(true)

        } catch (error) {
            console.error("Error al obtener los metadatos del modpack:", error)
            // alert(t('sections.file.messages.error.invalid_modpack'))
            setInstallationConfig((prevInfo) => ({
                ...prevInfo,
                mrpack_info: undefined,         // Metadatos del modpack, inicialmente vacío
                modpack_directory: "instances" // Reiniciar la ruta de instalación del modpack
            }))
            setInstallationProgress(false)
        }
    }

    const callBack = useCallback((message: string) => {
        showMessage(message)
    }, [setInstallationProgress])

    // secciones
    const sectionFromFile = (
        <>
            <section className="header">
                <p>{t('sections.file.subtitle')}</p>
            </section>
            <section className='content'>

                <FileSelector AcceptExtensions={[".mrpack"]} FileCallback={handleFile} className="mc-style" />

                <section className={`installation-configuration ${installationProgress ? "active" : ""}`}>

                    <section className="mrpack-summary">
                        {installationConfig.mrpack_info ? <p>{t('sections.file.information.summary.name')}: {installationConfig.mrpack_info?.name || "NA"} </p> : null}
                        {installationConfig.mrpack_info?.summary ? <p>{t('sections.file.information.summary.description')}: {installationConfig.mrpack_info?.summary || "NA"} </p> : null}
                        {installationConfig.minecraft_version ? <p>{t('sections.file.information.summary.version')}: {installationConfig.minecraft_version || "NA"}</p> : null}
                    </section>

                    <section className="configuration">
                        <div className="toggle">

                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <MCSlider
                                    checked={personalizedConfig}
                                    onChange={(e) => {
                                        const checked = e.target.checked
                                        setOpenDialogConfig(checked)
                                        setPersonalizedConfig(checked)
                                    }}
                                />
                                <p>{t('sections.file.configuration.advanced.activate')}</p>
                                <Dialog>
                                    <DialogTrigger>
                                        <MCAskButton />
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            {t('sections.file.information.list.label')}
                                        </DialogHeader>
                                        <DialogDescription>
                                            {t('sections.file.information.list.description')}
                                        </DialogDescription>
                                        <Separator />
                                        {installationConfig.mrpack_info?.files && installationConfig.mrpack_info.files.length > 0 ? (
                                            <ul>
                                                {installationConfig.mrpack_info.files
                                                    ?.sort((a, b) => a.path.localeCompare(b.path)) // Order
                                                    .map((file) => {
                                                        if (file.path) {
                                                            return <li key={file.path}>{file.path.split(".")[0].replace("/", " > ") || "unknown"}</li>
                                                        }
                                                    })}
                                            </ul>
                                        ) : (
                                            <h2>{t('sections.file.information.list.empty')}</h2>
                                        )}
                                        <DialogFooter>
                                            <DialogClose>
                                                <MCButton>
                                                    {t('actions.close', { ns: 'commons' })}
                                                </MCButton>
                                            </DialogClose>
                                        </DialogFooter>

                                    </DialogContent>
                                </Dialog>
                            </div>

                            <Dialog open={openDialogConfig}>
                                <DialogContent>
                                    <DialogHeader>
                                        <h2>{t('sections.file.configuration.advanced.title')}</h2>
                                    </DialogHeader>
                                    <p>{t('sections.file.configuration.advanced.ask')}</p>
                                    <p>{t('sections.file.configuration.advanced.activation_warning')}</p>

                                    <DialogFooter>
                                        <MCButton onClick={() => {
                                            setPersonalizedConfig(true)
                                            setOpenDialogConfig(false)
                                        }}>
                                            {t('actions.accept', { ns: 'commons' })}
                                        </MCButton>
                                        <MCButton onClick={() => {
                                            setPersonalizedConfig(false)
                                            setOpenDialogConfig(false)
                                        }}>
                                            {t('actions.close', { ns: 'commons' })}
                                        </MCButton>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                        </div>

                        <div className={`advanced-configuration ${personalizedConfig ? "active" : ""}`}>

                            <div className="path">
                                <Dialog>
                                    <DialogTrigger>
                                        <a className="information-toggle">{t('sections.file.configuration.advanced.path.label')}</a>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            {t('sections.file.configuration.advanced.path.label')}
                                        </DialogHeader>
                                        <DialogDescription>
                                            {t('sections.file.configuration.advanced.path.description')}
                                        </DialogDescription>
                                        <DialogFooter>
                                            <DialogClose>
                                                <MCButton>
                                                    {t('actions.close', { ns: 'commons' })}
                                                </MCButton>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                <MCInput
                                    placeholder={t('sections.file.configuration.advanced.path.placeholder')}
                                    value={installationConfig.installation_directory} // Ruta de instalación del modpack
                                    onChange={(event) => {
                                        const newPath = event.target.value.trim()
                                        if (!newPath || newPath.length === 0) {
                                            alert(t('sections.file.messages.error.invalid_path'))
                                            return
                                        }
                                        setInstallationConfig((prevInfo) => ({
                                            ...prevInfo,
                                            installation_directory: newPath
                                        }))
                                    }}
                                />

                            </div>

                            <div className="memory">
                                <Dialog>
                                    <DialogTrigger>
                                        <a className="information-toggle">{t('sections.file.configuration.advanced.memory.label')}</a>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            {t('sections.file.configuration.advanced.memory.label')}
                                        </DialogHeader>
                                        <DialogDescription>
                                            {t('sections.file.configuration.advanced.memory.description')}
                                        </DialogDescription>
                                        <DialogFooter>
                                            <DialogClose>
                                                <MCButton>
                                                    {t('actions.close', { ns: 'commons' })}
                                                </MCButton>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                <div className="memory-inputs">
                                    <MCInput
                                        placeholder={t('sections.file.configuration.advanced.memory.min_placeholder')}
                                        value={installationConfig.memory.min}
                                        onChange={(event) =>
                                            setInstallationConfig((prevInfo) => ({
                                                ...prevInfo,
                                                memory: {
                                                    ...prevInfo.memory,
                                                    min: event.target.value
                                                }
                                            }))
                                        }
                                    />
                                    <MCInput
                                        placeholder={t('sections.file.configuration.advanced.memory.max_placeholder')}
                                        value={installationConfig.memory.max}
                                        onChange={(event) =>
                                            setInstallationConfig((prevInfo) => ({
                                                ...prevInfo,
                                                memory: {
                                                    ...prevInfo.memory,
                                                    max: event.target.value
                                                }
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="inputs">
                        <div className="icon-selector"
                            style={{ display: installationConfig.type === "server" ? "none" : "block" }}
                        >
                            <Dialog>
                                <DialogTrigger>
                                    <a className="information-toggle">{t('sections.file.configuration.profile.label')}</a>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        {t('sections.file.configuration.profile.label')}
                                    </DialogHeader>
                                    <DialogDescription>
                                        {t('sections.file.configuration.profile.description')}
                                    </DialogDescription>
                                    <DialogFooter>
                                        <DialogClose>
                                            <MCButton>
                                                {t('actions.close', { ns: 'commons' })}
                                            </MCButton>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <MCSelect
                                value={installationConfig.profile_icon}
                                onChange={(event) =>
                                    setInstallationConfig((prevInfo) => ({
                                        ...prevInfo,
                                        profile_icon: event.target.value as ProfileIcons
                                    }))
                                }
                            >
                                {Object.entries(ProfileIcons).map(([key, value]) => (
                                    <option key={key} value={value}>
                                        {t(`minecraft.launcher.profile.icons.${key}`, { ns: "commons" })}
                                    </option>
                                ))}
                            </MCSelect>
                        </div>
                        <div className="type-selector">
                            <Dialog>
                                <DialogTrigger>
                                    <a className="information-toggle">{t('sections.file.configuration.type.label')}</a>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                       {t('sections.file.configuration.type.label')}
                                    </DialogHeader>
                                    <DialogDescription>
                                        {t('sections.file.configuration.type.description')}:
                                    </DialogDescription>
                                    <Separator borderless={true}/>
                                    <ul>
                                        <li><strong>{t('sections.file.configuration.type.list.singleplayer')}:</strong> {t('sections.file.configuration.type.list.singleplayer_description')}</li>
                                        <li><strong>{t('sections.file.configuration.type.list.client')}:</strong> {t('sections.file.configuration.type.list.client_description')}</li>
                                        <li><strong>{t('sections.file.configuration.type.list.server')}:</strong> {t('sections.file.configuration.type.list.server_description')}</li>
                                    </ul>
                                    <DialogFooter>
                                        <DialogClose>
                                            <MCButton>
                                                {t('actions.close', { ns: 'commons' })}
                                            </MCButton>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <MCSelect
                                value={installationConfig.type}
                                onChange={(event) =>
                                    setInstallationConfig((prevInfo) => ({
                                        ...prevInfo,
                                        type: event.target.value
                                    }))
                                }
                            >
                                <option value="singleplayer">{t('sections.file.configuration.type.list.singleplayer')}</option>
                                <option value="client">{t('sections.file.configuration.type.list.client')}</option>
                                <option value="server">{t('sections.file.configuration.type.list.server')}</option>
                            </MCSelect>
                        </div>
                        <div className="installation-button">
                            <Dialog>
                                <DialogTrigger>
                                    <MCButton disabled={!installationProgress} className="install">
                                        {t('sections.file.configuration.install.button')}
                                    </MCButton>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <h2>{t('sections.file.messages.installation.need_launcher_closed')}</h2>
                                    </DialogHeader>
                                    <Separator/>
                                    <p>{t('sections.file.messages.installation.need_launcher_closed_desc')}</p>

                                    <DialogFooter>
                                        <DialogClose>
                                            <MCButton
                                                onClick={async () => {
                                                    if (!installationConfig.mrpack_info) {
                                                        alert(t('sections.file.messages.error.no_file_selected'))
                                                        return
                                                    }
                                                    callBack(t('sections.file.messages.installation.starting'))

                                                    console.log("Iniciando instalación con la siguiente configuración:", installationConfig)
                                                    // InstallModpack(
                                                    //     installationConfig, // Configuración de instalación del modpack
                                                    //     callBack //callback
                                                    // )
                                                    hideMessage()
                                                }}
                                            >
                                                {t('actions.accept', { ns: 'commons' })}
                                            </MCButton>
                                        </DialogClose>
                                        <DialogClose>
                                            <MCButton>
                                                {t('actions.close', { ns: 'commons' })}
                                            </MCButton>
                                        </DialogClose>
                                    </DialogFooter>

                                </DialogContent>
                            </Dialog>
                        </div>

                    </section>

                </section>
            </section>
        </>
    )

    return (
        <main className="main-container">
            <Sidebar current_path="/Install" />
            <section className="install-container">
                <SectionsMinecraftComponent
                    title={t('header.title')}
                    sections={
                        [
                            {
                                id: "from-file",
                                title: t('sections.file.title'),
                                content: sectionFromFile
                            }
                        ]
                    }
                />
            </section>
        </main>
    )

}

export default Install