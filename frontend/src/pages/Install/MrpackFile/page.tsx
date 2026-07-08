import { useState, useEffect } from "react"
import { useTranslation } from 'react-i18next'

// Css
import "./page.css"

// Componentes
// Sidebar ahora se monta globalmente desde el layout
import SectionsMinecraftComponent from "@/components/SectionsMinecraft/SectionsMinecraft"
import FileSelector from "@/components/FileSelector/FileSelector"
import { MrpackMetadata, MrpackFile } from "@/interfaces/modrinth/MrPack"
// Hooks
import { MinecraftVersionFromDependencies } from "@/hooks/modrinth/mrpack"
import { InstallationModpackProps } from "@/interfaces/MrpackInstaller"
import { ProfileIcons } from '@/interfaces/minecraft/MinecraftLauncherIcons'
import { useGlobalMessage } from "@/context/GlobalMessageContext"

import { Dialog, DialogTitle, DialogTrigger, DialogContent, DialogClose, DialogFooter, DialogHeader, DialogDescription } from "@/components/Dialog/Dialog"
import { MCButton, MCInput, MCSelect, MCSlider, MCAskButton, MCCheckbox } from "@/components/MC/MC"
import { Separator } from "@/components/Separator/separator"

function Install() {

    const normalizeWindowsPath = (path: string) => path.replace(/^"(.*)"$/, "$1").replace(/[\\/]+/g, "/")

    const { showMessage } = useGlobalMessage()
    const { t } = useTranslation(["installation", "commons"])

    const [openDialogConfig, setOpenDialogConfig] = useState<boolean>(false)
    const [openDialogOptionalFiles, setOpenDialogOptionalFiles] = useState<boolean>(false)
    const [openDialogInstallation, setOpenDialogInstallation] = useState<boolean>(false)
    const [openDialogVanillaLauncher, setOpenDialogVanillaLauncher] = useState<boolean>(false)
    const [openDialogExistingFiles, setOpenDialogExistingFiles] = useState<boolean>(false)

    const [advancedConfig, SetAdvancedConfig] = useState<boolean>(false)
    const [existingModpackFiles, setExistingModpackFiles] = useState<boolean>(false)
    const [minecraft_dir, setMinecraftDir] = useState<string>("")
    const [mrpackMetadataInfo, setMrpackMetadataInfo] = useState<MrpackMetadata | null>(null)
    const [optionalFilesSelected, setOptionalFilesSelected] = useState<MrpackFile[]>([])
    const [selectedProfileIcon, setSelectedProfileIcon] = useState<string>(ProfileIcons.Furnace)
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
        if (!mrpackMetadataInfo) {
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
    }, [mrpackMetadataInfo])

    const getVisibleOptionalFiles = (files: MrpackFile[]) => {
        if (installationConfig.type === "singleplayer") {
            return files
        }

        const side = installationConfig.type === "clientside" ? "client" : "server"

        return files.filter((file) => {
            if (!file.env) return true
            return file.env[side] === "optional"
        })
    }

    // Funcion archivo
    const handleFile = async (file: File) => {
        // Verificar si el archivo es un modpack válido
        if (!file?.name.endsWith(".mrpack")) {
            showMessage(t('sections.mrpack_file.messages.error.invalid_mrpack_file'), { showClose: true })
        }

        try {
            const _data = await (window as any).backend.GetMrpackMedatadaInfo(file.path)

            const _minecfraft_dir = minecraft_dir || await (window as any).backend.GetMinecraftDirectory()

            const _modpack_dir_name = `${_data.name.trim().replace(/\s+/g, "-").toLowerCase() || "modpack"}`
            const _modpack_directory = await (window as any).backend.PathJoin(_minecfraft_dir, "instances", _modpack_dir_name)
            const _minecraft_version = MinecraftVersionFromDependencies(_data.dependencies)

            setMrpackMetadataInfo(_data)
            const _installation_directory = normalizeWindowsPath(_modpack_directory) // Normalizar la ruta para evitar problemas con barras repetidas en Windows

            setInstallationConfig((prevInfo) => ({
                ...prevInfo,
                minecraft_version: _minecraft_version, // versión obtenida buscando una dependencia con id "minecraft"
                mrpack_path: file.path,
                installation_directory: _installation_directory
            }))

            setExistingModpackFiles(
                await (window as any).backend.IsModdedMinecraftDirectory(_installation_directory) 
                === true
            )

        } catch (error) {
            console.error("Error al obtener los metadatos del modpack:", error)
            // alert(t('sections.mrpack_file.messages.error.invalid_modpack'))
            setInstallationConfig((prevInfo) => ({
                ...prevInfo,
                installation_directory: "instances", // Reiniciar la ruta de instalación del modpack
                mrpack_path: ""
            }))
            setMrpackMetadataInfo(null)
        }
    }

    const DeleteExistingPath = async () => {
        try {
            showMessage(t('sections.mrpack_file.messages.installation.existing_path_deleting'), { showClose: false })
            const result = await (window as any).backend.PathDelete(installationConfig.installation_directory)
            if (!result.success) {
                showMessage(t('sections.mrpack_file.messages.error.could_not_delete_existing_path') + `: ${result.error || "unknown error"}`, { showClose: true })
                throw new Error(result.error || "unknown error")
            }

            showMessage(t('sections.mrpack_file.messages.existing_path_deleted'), { showClose: false })
        } catch (error) {
            showMessage((error as Error).message, { showClose: true })
            throw error
        }
    }

    const OpenFolder = async () => {
        try {
            const result = await (window as any).winConfig.ShowOpenDialog({
                defaultPath: minecraft_dir,
                title: t('sections.mrpack_file.configuration.advanced.path.browse_title'),
                properties: ['openDirectory'],
                createDirectory: true,
                promptToCreate: true,
                message: t('sections.mrpack_file.configuration.advanced.path.browse_description')
            })
            if (!result || result.canceled) return
            const selected = result.filePaths && result.filePaths[0]
            if (selected) {

                if (selected === minecraft_dir) {
                    showMessage(t('sections.mrpack_file.messages.error.path_cannot_be_minecraft_directory'), { showClose: true })
                    return
                }
                setInstallationConfig(prev => ({ ...prev, installation_directory: selected }))
                setExistingModpackFiles(
                    await (window as any).backend.IsModdedMinecraftDirectory(selected) 
                    === true
                )
            }
        } catch (error) {
            console.error("Error opening folder:", error)
        }
    }

    const StartVanillaLauncherCreation = async () => {
        try {
            showMessage(t('sections.mrpack_file.messages.installation.vanilla_launcher.adding'), { showClose: false })
            await (window as any).backend.AddVanillaLauncher(installationConfig)
            showMessage(t('sections.mrpack_file.messages.installation.finish'), { showClose: true })
        } catch (error) {
            showMessage(
                t('sections.mrpack_file.messages.installation.error') +
                `: ${(error as Error).message}`,
                { showClose: true }
            )
        }
    }

    const AskForClosedLauncher = async (deletePreviousInstallation: boolean = false) => {
        if (installationConfig.type === "serverside") {
            StartInstallation(deletePreviousInstallation)
        } else {
            setOpenDialogInstallation(true)
        }
    }

    const StartInstallation = async (deletePreviousInstallation: boolean = false) => {
        if (!mrpackMetadataInfo) {
            showMessage(t('sections.mrpack_file.messages.error.no_file_selected'), { showClose: true })
            return
        }

        try {

            if (deletePreviousInstallation) {
                await DeleteExistingPath()
            }

            // Mostrar mensaje inicial y ocultar botón de cerrar durante la instalación
            showMessage(t('sections.mrpack_file.messages.installation.starting'), { showClose: false })

            // Iniciar la instalación modpack y dependencias
            showMessage(t('sections.mrpack_file.messages.installation.dependencies.installing'), { showClose: false })

            await (window as any).backend.StartMrpackInstallation(
                installationConfig.type,
                installationConfig.mrpack_path,
                installationConfig.installation_directory,
                optionalFilesSelected.map(file => file.path),
                (status: string) => { showMessage(status, { showClose: false }) },
                undefined,  // cbMax               
                undefined,  // cbProgress
                (_: string) => { showMessage(t('sections.mrpack_file.messages.installation.dependencies.finish'), { showClose: true }) },
                (status: string) => { showMessage(t('sections.mrpack_file.messages.installation.error') + `: ${status}`, { showClose: true }) },
            )

            // Añadir el lanzador si es necesario
            if (installationConfig.type !== "serverside") {
                setOpenDialogVanillaLauncher(true)
            } else {
                showMessage(t('sections.mrpack_file.messages.installation.finish'), { showClose: true })
            }

        } catch (error) {
            showMessage(
                t('sections.mrpack_file.messages.installation.error') +
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

                <Dialog open={openDialogExistingFiles} onOpenChange={(open) => setOpenDialogExistingFiles(open)}>
                    <DialogContent>
                        <DialogHeader>
                            {t('sections.mrpack_file.configuration.install.previous_installation.title')}
                        </DialogHeader>
                        <DialogDescription>
                            {t('sections.mrpack_file.configuration.install.previous_installation.description')}
                        </DialogDescription>
                        <DialogFooter>
                            <MCButton onClick={() => {
                                SetAdvancedConfig(true)
                                OpenFolder()
                                setOpenDialogExistingFiles(false)
                            }}>
                                {t('sections.mrpack_file.configuration.install.previous_installation.change_directory')}
                            </MCButton>
                            <MCButton onClick={() => {
                                AskForClosedLauncher(true)
                                setOpenDialogExistingFiles(false)
                            }}>
                                {t('sections.mrpack_file.configuration.install.previous_installation.delete_previous')}
                            </MCButton>
                            <MCButton onClick={() => {
                                AskForClosedLauncher()
                                setOpenDialogExistingFiles(false)
                            }}>
                                {t('sections.mrpack_file.configuration.install.previous_installation.no_delete')}
                            </MCButton>
                            <MCButton onClick={() => {
                                setOpenDialogExistingFiles(false)
                            }}>
                                {t('actions.cancel', { ns: 'commons' })}
                            </MCButton>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <section className={`installation-configuration ${installationConfig.mrpack_path != "" ? "active" : ""}`}>

                    <section className="mrpack-summary">

                        <div className="information">
                            {mrpackMetadataInfo ? <p>{t('sections.mrpack_file.information.summary.name')}: {mrpackMetadataInfo?.name || "NA"} </p> : null}
                            {mrpackMetadataInfo?.summary ? <p>{t('sections.mrpack_file.information.summary.description')}: {mrpackMetadataInfo?.summary || "NA"} </p> : null}
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
                                    <DialogHeader sticky={true}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            {t('sections.mrpack_file.information.list.label')}
                                            <DialogClose>
                                                <MCButton>
                                                    X
                                                </MCButton>
                                            </DialogClose>
                                        </div>
                                    </DialogHeader>
                                    <DialogDescription>
                                        {t('sections.mrpack_file.information.list.description')}
                                    </DialogDescription>
                                    <Separator />
                                    {mrpackMetadataInfo?.files && mrpackMetadataInfo.files.length > 0 ? (
                                        <ul>
                                            {mrpackMetadataInfo.files
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
                                </DialogContent>
                            </Dialog>
                        </div>
                    </section>

                    <section className="configuration">
                        <div className="toggle">

                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <MCSlider
                                    checked={advancedConfig}
                                    onChange={(e) => {
                                        const checked = e.target.checked
                                        setOpenDialogConfig(checked)
                                        SetAdvancedConfig(checked)
                                    }}
                                />
                                <p>{t('sections.mrpack_file.configuration.advanced.activate')}</p>
                                <Dialog>
                                    <DialogTrigger>
                                        <MCAskButton />
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader sticky={true}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                {t('sections.mrpack_file.configuration.information.title')}
                                                <DialogClose>
                                                    <MCButton>
                                                        X
                                                    </MCButton>
                                                </DialogClose>
                                            </div>
                                        </DialogHeader>
                                        <DialogDescription>
                                            {t('sections.mrpack_file.configuration.information.description')}
                                        </DialogDescription>
                                        <Separator />
                                        {t('sections.mrpack_file.configuration.advanced.path.label')}
                                        <DialogDescription>
                                            {t('sections.mrpack_file.configuration.advanced.path.description')}
                                        </DialogDescription>
                                        <Separator borderless={true} />

                                        {t('sections.mrpack_file.configuration.advanced.memory.label')}
                                        <DialogDescription>
                                            {t('sections.mrpack_file.configuration.advanced.memory.description')}
                                        </DialogDescription>
                                        <DialogDescription>
                                            {t('sections.mrpack_file.configuration.advanced.memory.recommendation')}
                                        </DialogDescription>
                                        <Separator borderless={true} />

                                        {t('sections.mrpack_file.configuration.profile.label')}
                                        <DialogDescription>
                                            {t('sections.mrpack_file.configuration.profile.description')}
                                        </DialogDescription>
                                        <Separator borderless={true} />


                                        {t('sections.mrpack_file.configuration.type.label')}
                                        <DialogDescription>
                                            {t('sections.mrpack_file.configuration.type.description')}:
                                            <ul>
                                                <li><strong>{t('sections.mrpack_file.configuration.type.list.singleplayer')}:</strong> {t('sections.mrpack_file.configuration.type.list.singleplayer_description')}</li>
                                                <li><strong>{t('sections.mrpack_file.configuration.type.list.client')}:</strong> {t('sections.mrpack_file.configuration.type.list.client_description')}</li>
                                                <li><strong>{t('sections.mrpack_file.configuration.type.list.server')}:</strong> {t('sections.mrpack_file.configuration.type.list.server_description')}</li>
                                            </ul>
                                        </DialogDescription>
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
                                            SetAdvancedConfig(true)
                                            setOpenDialogConfig(false)
                                        }}>
                                            {t('actions.accept', { ns: 'commons' })}
                                        </MCButton>
                                        <MCButton onClick={() => {
                                            SetAdvancedConfig(false)
                                            setOpenDialogConfig(false)
                                        }}>
                                            {t('actions.cancel', { ns: 'commons' })}
                                        </MCButton>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                        </div>

                        <div className={`advanced-configuration ${advancedConfig ? "active" : ""}`}>

                            <div className="path">
                                <h2 className="information-toggle">{t('sections.mrpack_file.configuration.advanced.path.label')}</h2>
                                <MCInput
                                    variant="default"
                                    className="path_input"
                                    placeholder={t('sections.mrpack_file.configuration.advanced.path.placeholder')}
                                    value={installationConfig.installation_directory} // Ruta de instalación del modpack
                                    readOnly
                                    // onChange={(event) => {
                                    //     const newPath = event.target.value.trim()
                                    //     if (!newPath || newPath.length === 0) {
                                    //         alert(t('sections.mrpack_file.messages.error.invalid_path'))
                                    //         return
                                    //     }

                                    //     setInstallationConfig((prevInfo) => ({
                                    //         ...prevInfo,
                                    //         installation_directory: newPath
                                    //     }))
                                    // }}
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
                                onChange={(event) => {
                                    setInstallationConfig((prevInfo) => ({
                                        ...prevInfo,
                                        profile_icon: event.target.value as ProfileIcons
                                    }))
                                    setSelectedProfileIcon(event.target.value)
                                }}
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
                            <MCButton
                                disabled={installationConfig.mrpack_path == ""}
                                className="install"
                                onClick={() => {
                                    if (mrpackMetadataInfo?.optionalFiles && getVisibleOptionalFiles(mrpackMetadataInfo.optionalFiles).length > 0) {
                                        setOpenDialogOptionalFiles(true)
                                    } else {
                                        if (existingModpackFiles){
                                          setOpenDialogExistingFiles(true)
                                        } else {
                                          AskForClosedLauncher()
                                        }
                                    }
                                }}
                            >
                                {t('sections.mrpack_file.configuration.install.button')}
                            </MCButton>
                        </div>
                    </section>
                    <Dialog open={openDialogOptionalFiles} onOpenChange={(open) => setOpenDialogOptionalFiles(open)}>
                        <DialogContent>
                            <DialogTitle>
                                {t('sections.mrpack_file.configuration.optional_files.title')}
                            </DialogTitle>
                            <Separator />
                            <p>
                                {t('sections.mrpack_file.configuration.optional_files.description')}
                            </p>
                            <Separator borderless={true} />
                            {
                                mrpackMetadataInfo?.optionalFiles && getVisibleOptionalFiles(mrpackMetadataInfo.optionalFiles).length > 0 ? (
                                    <ul className="optional-files-list">
                                        {getVisibleOptionalFiles(
                                            mrpackMetadataInfo.optionalFiles
                                                ?.sort((a, b) => a.path.localeCompare(b.path)) ?? []
                                        ).map((file) => {
                                            if (!file.path) return null
                                            if (file.path) {
                                                const isSelected = optionalFilesSelected.some(selectedFile => selectedFile.path === file.path)
                                                return (
                                                    <li key={file.path}>
                                                        <MCCheckbox
                                                            checked={isSelected}
                                                            onChange={() => {
                                                                setOptionalFilesSelected(prevSelected => {
                                                                    if (isSelected) {
                                                                        return prevSelected.filter(selectedFile => selectedFile.path !== file.path)
                                                                    }
                                                                    return [...prevSelected, file]
                                                                })
                                                            }}
                                                        />
                                                        <label>{file.path.split(".")[0].replace("/", " > ") || "unknown"}</label>
                                                    </li>
                                                )
                                            }
                                        })}
                                    </ul>
                                ) : (
                                    <h2>{t('sections.mrpack_file.information.list.empty')}</h2>
                                )
                            }
                            <DialogFooter>
                                <DialogClose>
                                    <MCButton
                                        className="install"
                                        onClick={() => {
                                            setOpenDialogOptionalFiles(false)
                                            if (existingModpackFiles){
                                                setOpenDialogExistingFiles(true)
                                            } else{
                                                AskForClosedLauncher()
                                            }
                                        }}
                                    >
                                        {t('actions.accept', { ns: 'commons' })}
                                    </MCButton>
                                </DialogClose>
                                <DialogClose>
                                    <MCButton
                                        onClick={() => {
                                            setOptionalFilesSelected([])
                                            setOpenDialogOptionalFiles(false)
                                        }}
                                    >
                                        {t('actions.cancel', { ns: 'commons' })}
                                    </MCButton>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={openDialogInstallation} onOpenChange={(open) => setOpenDialogInstallation(open)}>
                        <DialogContent>
                            <DialogHeader>
                                <h2>{t('sections.mrpack_file.messages.installation.need_launcher_closed')}</h2>
                            </DialogHeader>
                            <Separator />
                            <p>{t('sections.mrpack_file.messages.installation.need_launcher_closed_desc')}</p>

                            <DialogFooter>
                                <DialogClose>
                                    <MCButton
                                        onClick={() => {
                                            setOpenDialogInstallation(false)
                                            StartInstallation()
                                        }}
                                    >
                                        {t('actions.accept', { ns: 'commons' })}
                                    </MCButton>
                                </DialogClose>
                                <DialogClose>
                                    <MCButton
                                        onClick={() => {
                                            setOpenDialogOptionalFiles(false)
                                            setOpenDialogInstallation(false)
                                        }}
                                    >
                                        {t('actions.cancel', { ns: 'commons' })}
                                    </MCButton>
                                </DialogClose>
                            </DialogFooter>

                        </DialogContent>
                    </Dialog>
                    <Dialog open={openDialogVanillaLauncher} onOpenChange={(open) => setOpenDialogVanillaLauncher(open)}>
                        <DialogContent>
                            <DialogHeader>
                                <h2>{t('sections.mrpack_file.configuration.vanilla_launcher.ask')}</h2>

                            </DialogHeader>
                            <Separator />
                            <p>{t('sections.mrpack_file.configuration.vanilla_launcher.description')}</p>
                            <br></br>
                            <p>{t('sections.mrpack_file.configuration.vanilla_launcher.selected_icon')}: {t(`minecraft.launcher.profile.icons.${selectedProfileIcon}`, { ns: "commons" })}</p>

                            <DialogFooter>
                                <MCButton
                                    onClick={() => {
                                        setOpenDialogVanillaLauncher(false)
                                        StartVanillaLauncherCreation()
                                    }}
                                >
                                    {t('texts.yes', { ns: 'commons' })}
                                </MCButton>
                                <MCButton
                                    onClick={() => {
                                        setOpenDialogVanillaLauncher(false)
                                    }}
                                >
                                    {t('texts.no', { ns: 'commons' })}
                                </MCButton>
                            </DialogFooter>

                        </DialogContent>
                    </Dialog>

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