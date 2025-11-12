import { useState, useEffect } from "react"
import { useTranslation } from 'react-i18next'

// Css
import "./Install.css"

// Componentes
// Sidebar ahora se monta globalmente desde el layout
import SectionsMinecraftComponent from "@/components/SectionsMinecraft/SectionsMinecraft"
import FileSelector from "@/components/FileSelector/FileSelector"
import { MrpackMetadata } from "@/interfaces/modrinth/MrPack"
// Hooks
import { MinecraftVersionFromDependencies } from "@/hooks/modrinth/mrpack"
import { InstallationModpackProps } from "@/interfaces/MrpackInstaller"
import { ProfileIcons } from '@/interfaces/minecraft/MinecraftLauncherIcons'
import { useGlobalMessage } from "@/context/GlobalMessageContext"

import { Dialog, DialogTrigger, DialogContent, DialogClose, DialogFooter, DialogHeader, DialogDescription } from "@/components/Dialog/Dialog"
import { MCButton, MCInput, MCSelect, MCSlider, MCAskButton } from "@/components/MC/MC"
import { Separator } from "@/components/Separator/separator"

function Install() {

    const { showMessage } = useGlobalMessage()
    const { t } = useTranslation(["installation", "commons"])
    const [minecraft_dir, setMinecraftDir] = useState<string>("")
    const [mrpackInfo, setMrpackInfo] = useState<MrpackMetadata | null>(null)
    const [personalizedConfig, setPersonalizedConfig] = useState<boolean>(false)
    const [openDialogConfig, setOpenDialogConfig] = useState<boolean>(false)
    const [installationConfig, setInstallationConfig] = useState<InstallationModpackProps>({
        type: "singleplayer", // Por defecto, tipo cliente
        installation_directory: "instances",
        minecraft_version: "latest", // Versión de Minecraft por defecto
        memory: {
            min: "2", // Memoria mínima por defecto
            max: "5"  // Memoria máxima por defecto
        },
        mrpack_path: "", // Ruta del archivo mrpack, inicialmente vacío
        profile_icon: ProfileIcons.Furnace // Icono del perfil, inicialmente vacío
    })

    useEffect(() => {
        (async () => {
            try {
                setMinecraftDir(await (window as any).backend.GetMinecraftDirectory())
            } catch (error) {
                console.error("Error al obtener el directorio de Minecraft:", error)
            }
        })()
    }, [])

    useEffect(() => {
        // Resetear la configuración de instalación cuando no hay un archivo seleccionado
        if (!mrpackInfo) {
            setInstallationConfig({
                type: "singleplayer", // Por defecto, tipo cliente
                installation_directory: "instances",
                minecraft_version: "latest", // Versión de Minecraft por defecto
                memory: {
                    min: "2", // Memoria mínima por defecto
                    max: "4"  // Memoria máxima por defecto
                },
                mrpack_path: "", // Ruta del archivo mrpack, inicialmente vacío
                profile_icon: ProfileIcons.Furnace // Icono del perfil, inicialmente vacío
            })
        }
    }, [mrpackInfo])

    // Funcion archivo
    const handleFile = async (file: File) => {
        // Aquí puedes manejar el archivo seleccionado
        console.log("Archivo seleccionado:", file)

        // Verificar si el archivo es un modpack válido
        if (!file?.name.endsWith(".mrpack")) {
            alert(t('sections.file.messages.error.invalid_mrpack_file'))
        }

        try {

            // const _data = await GetMrpackMedatadaInfo(file.path)
            const _data = await (window as any).backend.GetMrpackMedatadaInfo(file.path)
            console.log("Metadatos del modpack obtenidos:", _data)

            const _minecfraft_dir = minecraft_dir || await (window as any).backend.GetMinecraftDirectory()

            const _modpack_dir_name = `${_data.name.trim().replace(/\s+/g, "-").toLowerCase() || "modpack"}`
            const _modpack_directory = await (window as any).backend.PathJoin(_minecfraft_dir, "instances", _modpack_dir_name)
            const _minecraft_version = MinecraftVersionFromDependencies(_data.dependencies)

            setMrpackInfo(_data)
            setInstallationConfig((prevInfo) => ({
                ...prevInfo,
                minecraft_version: _minecraft_version, // versión obtenida buscando una dependencia con id "minecraft"
                mrpack_path: file.path,
                installation_directory: typeof _modpack_directory === "string"
                    ? _modpack_directory.replace(/^"(.*)"$/, "$1") // quitar comillas dobles alrededor si existen
                    : _modpack_directory
            }))

        } catch (error) {
            console.error("Error al obtener los metadatos del modpack:", error)
            // alert(t('sections.file.messages.error.invalid_modpack'))
            setInstallationConfig((prevInfo) => ({
                ...prevInfo,
                installation_directory: "instances", // Reiniciar la ruta de instalación del modpack
                mrpack_path: ""
            }))
            setMrpackInfo(null)
        }
    }

    const OpenFolder = async () => {
        try {
            const result = await (window as any).winConfig.ShowOpenDialog({
                defaultPath: minecraft_dir,
                title: t('sections.file.configuration.advanced.path.browse_title'),
                properties: ['openDirectory'],
                createDirectory: true,
                promptToCreate: true,
                message: t('sections.file.configuration.advanced.path.browse_description')
            })
            if (!result || result.canceled) return
            const selected = result.filePaths && result.filePaths[0]
            if (selected) {
                setInstallationConfig(prev => ({ ...prev, installation_directory: selected }))
            }
        } catch (error) {
            console.error("Error opening folder:", error)
        }
    }

    const StartInstallation = async () => {
        if (!mrpackInfo) {
            showMessage(t('sections.file.messages.error.no_file_selected'), { showClose: true })
            return
        }

        try {
            // Mostrar mensaje inicial y ocultar botón de cerrar durante la instalación
            showMessage(t('sections.file.messages.installation.starting'), { showClose: false })

            // Iniciar la instalación modpack y dependencias
            showMessage(t('sections.file.messages.installation.dependencies.installing'), { showClose: false })

            await (window as any).backend.StartMrpackInstallation(
                installationConfig,
                (status: string) => { showMessage(status, { showClose: false }) },
                undefined,  // cbMax               
                undefined,  // cbProgress
                (_: string) => { showMessage(t('sections.file.messages.installation.dependencies.finish'), { showClose: true }) },
                (status: string) => { showMessage(t('sections.file.messages.installation.error') + `: ${status}`, { showClose: true }) },
            )

            // Añadir el lanzador si es necesario
            if (installationConfig.type !== "serverside") {
                showMessage(t('sections.file.messages.installation.vanilla_launcher.adding'), { showClose: false })
                await (window as any).backend.AddVanillaLauncher(installationConfig)
                showMessage(t('sections.file.messages.installation.vanilla_launcher.finish'), { showClose: true })
            }

            showMessage(t('sections.file.messages.installation.finish'), { showClose: true })
        } catch (error) {
            showMessage(
                t('sections.file.messages.installation.error') +
                `: ${(error as Error).message}`,
                { showClose: true }
            )
        }

    }

    // secciones
    const sectionFromFile = (
        <>
            <section className="header">
                <p>{t('sections.mrpack_file.subtitle')}</p>
            </section>
            <section className='content'>

                <FileSelector AcceptExtensions={[".mrpack"]} FileCallback={handleFile} className="mc-style" />

                <section className={`installation-configuration ${installationConfig.mrpack_path != "" ? "active" : ""}`}>

                    <section className="mrpack-summary">

                        <div className="information">
                            {mrpackInfo ? <p>{t('sections.mrpack_file.information.summary.name')}: {mrpackInfo?.name || "NA"} </p> : null}
                            {mrpackInfo?.summary ? <p>{t('sections.mrpack_file.information.summary.description')}: {mrpackInfo?.summary || "NA"} </p> : null}
                            {installationConfig.minecraft_version ? <p>{t('sections.mrpack_file.information.summary.version')}: {installationConfig.minecraft_version || "NA"}</p> : null}
                        </div>
                        <div className="actions">
                            <Dialog>
                                <DialogTrigger>
                                    <MCButton>
                                        {t('actions.watch', { ns: 'commons' })} {t('sections.mrpack_file.information.list.label')}
                                    </MCButton>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        {t('sections.mrpack_file.information.list.label')}
                                    </DialogHeader>
                                    <DialogDescription>
                                        {t('sections.mrpack_file.information.list.description')}
                                    </DialogDescription>
                                    <Separator />
                                    {mrpackInfo?.files && mrpackInfo.files.length > 0 ? (
                                        <ul>
                                            {mrpackInfo.files
                                                ?.sort((a, b) => a.path.localeCompare(b.path)) // Order
                                                .map((file) => {
                                                    if (file.path) {
                                                        return <li key={file.path}>{file.path.split(".")[0].replace("/", " > ") || "unknown"}</li>
                                                    }
                                                })}
                                        </ul>
                                    ) : (
                                        <h2>{t('sections.mrpack_file.information.list.empty')}</h2>
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
                                <p>{t('sections.mrpack_file.configuration.advanced.activate')}</p>
                                <Dialog>
                                    <DialogTrigger>
                                        <MCAskButton />
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            {t('sections.mrpack_file.configuration.information.title')}
                                        </DialogHeader>
                                        <DialogDescription>
                                            {t('sections.mrpack_file.configuration.information.description')}
                                        </DialogDescription>
                                        <Separator />
                                        {t('sections.mrpack_file.configuration.advanced.path.label')}
                                        <DialogDescription>
                                            {t('sections.mrpack_file.configuration.advanced.path.description')}
                                        </DialogDescription>
                                        <Separator borderless={true}/>
                                        
                                        {t('sections.mrpack_file.configuration.advanced.memory.label')}
                                        <DialogDescription>
                                            {t('sections.mrpack_file.configuration.advanced.memory.description')}
                                        </DialogDescription>
                                        <DialogDescription>
                                            {t('sections.mrpack_file.configuration.advanced.memory.recommendation')}
                                        </DialogDescription>
                                        <Separator borderless={true}/>

                                        {t('sections.mrpack_file.configuration.profile.label')}
                                        <DialogDescription>
                                            {t('sections.mrpack_file.configuration.profile.description')}
                                        </DialogDescription>
                                        <Separator borderless={true}/>


                                        {t('sections.mrpack_file.configuration.type.label')}
                                        <DialogDescription>
                                            {t('sections.mrpack_file.configuration.type.description')}:
                                            <ul>
                                                <li><strong>{t('sections.mrpack_file.configuration.type.list.singleplayer')}:</strong> {t('sections.mrpack_file.configuration.type.list.singleplayer_description')}</li>
                                                <li><strong>{t('sections.mrpack_file.configuration.type.list.client')}:</strong> {t('sections.mrpack_file.configuration.type.list.client_description')}</li>
                                                <li><strong>{t('sections.mrpack_file.configuration.type.list.server')}:</strong> {t('sections.mrpack_file.configuration.type.list.server_description')}</li>
                                            </ul>
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
                            </div>

                            <Dialog open={openDialogConfig}>
                                <DialogContent>
                                    <DialogHeader>
                                        <h2>{t('sections.mrpack_file.configuration.advanced.title')}</h2>
                                    </DialogHeader>
                                    <p>{t('sections.mrpack_file.configuration.advanced.ask')}</p>
                                    <p>{t('sections.mrpack_file.configuration.advanced.activation_warning')}</p>

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
                                <h2 className="information-toggle">{t('sections.mrpack_file.configuration.advanced.path.label')}</h2>
                                <MCInput
                                    variant="default"
                                    className="path_input"
                                    placeholder={t('sections.mrpack_file.configuration.advanced.path.placeholder')}
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
                                <MCButton
                                    variant="ghost"
                                    className="path_search"
                                    onClick={OpenFolder}
                                >
                                    {t('actions.browse', { ns: 'commons' })}
                                </MCButton>
                            </div>

                            <div className={`memory ${installationConfig.type === "serverside" ? "inactive-component" : ""}`}>
                                <h2>{t('sections.mrpack_file.configuration.advanced.memory.label')}</h2>
                                <div className="memory-inputs">
                                    <MCInput
                                        className={`${installationConfig.type === "serverside" ? "inactive-component" : ""}`}
                                        placeholder={t('sections.mrpack_file.configuration.advanced.memory.min_placeholder')}
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
                                        className={`${installationConfig.type === "serverside" ? "inactive-component" : ""}`}
                                        placeholder={t('sections.mrpack_file.configuration.advanced.memory.max_placeholder')}
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
                        <div className={`icon-selector ${installationConfig.type === "serverside" ? "inactive-component" : ""}`}
                        >
                            <h2>{t('sections.mrpack_file.configuration.profile.label')}</h2>
                            <MCSelect
                                value={installationConfig.profile_icon}
                                onChange={(event) =>
                                    setInstallationConfig((prevInfo) => ({
                                        ...prevInfo,
                                        profile_icon: event.target.value as ProfileIcons
                                    }))
                                }
                            >
                                {Object.entries(ProfileIcons)
                                    .map(([key, value]) => ({
                                        key,
                                        value,
                                        label: t(`minecraft.launcher.profile.icons.${key}`, { ns: "commons" })
                                    }))
                                    .sort((a, b) => a.label.localeCompare(b.label))
                                    .map(({ key, value, label }) => (
                                        <option key={key} value={value}>
                                            {label}
                                        </option>
                                    ))}
                            </MCSelect>
                        </div>
                        <div className="type-selector">
                            <h2>{t('sections.mrpack_file.configuration.type.label')}</h2>
                            <MCSelect
                                value={installationConfig.type}
                                onChange={(event) =>
                                    setInstallationConfig((prevInfo) => ({
                                        ...prevInfo,
                                        type: event.target.value
                                    }))
                                }
                            >
                                <option value="singleplayer">{t('sections.mrpack_file.configuration.type.list.singleplayer')}</option>
                                <option value="clientside">{t('sections.mrpack_file.configuration.type.list.client')}</option>
                                <option value="serverside">{t('sections.mrpack_file.configuration.type.list.server')}</option>
                            </MCSelect>
                        </div>
                        <div className="installation-button">
                            <Dialog>
                                <DialogTrigger>
                                    <MCButton disabled={installationConfig.mrpack_path == ""} className="install">
                                        {t('sections.mrpack_file.configuration.install.button')}
                                    </MCButton>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <h2>{t('sections.mrpack_file.messages.installation.need_launcher_closed')}</h2>
                                    </DialogHeader>
                                    <Separator />
                                    <p>{t('sections.mrpack_file.messages.installation.need_launcher_closed_desc')}</p>

                                    <DialogFooter>
                                        <DialogClose>
                                            <MCButton
                                                onClick={() => StartInstallation()}
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
        <section className="install-container">
            <SectionsMinecraftComponent
                title={t('header.title')}
                sections={
                    [
                        {
                            id: "from-file",
                            title: t('sections.mrpack_file.title'),
                            content: sectionFromFile
                        }
                    ]
                }
            />
        </section>
    )

}

export default Install