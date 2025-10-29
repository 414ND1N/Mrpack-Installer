import { useState, useCallback } from "react"
import path from "path"
import { useTranslation } from 'react-i18next'

// Css
import "./Install.css"

// Componentes
import Sidebar from "@/pages/Sidebar"
import SectionsMinecraftComponent from "@/components/SectionsMinecraft/SectionsMinecraft"
import FileSelector from "@/components/FileSelector/FileSelector"
import Modal from "@/components/Modal/Modal"

// Hooks
import { GetMrpackMedatadaInfo, MinecraftVersionFromDependencies } from "@/hooks/modrinth/mrpack"
import { InstallationModpackProps } from "@/hooks/minecraft/minecraft"
import { ProfileIcons } from '@/interfaces/MinecraftLauncherIcons'
import { useGlobalMessage } from "@/context/GlobalMessageContext"

import { Dialog, DialogTrigger, DialogContent, DialogClose, DialogFooter } from "@/components/Dialog/Dialog"
import { toast } from "@/hooks/use-toast"

function Install() {

    const { showMessage, hideMessage } = useGlobalMessage()
    const { t } = useTranslation(["views", "commons"])

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
    const [openModal, setOpenModal] = useState<boolean>(false)

    // Funcion archivo
    const handleFile = async (file: File) => {
        // Aquí puedes manejar el archivo seleccionado
        console.log("Archivo seleccionado:", file)

        // Verificar si el archivo es un modpack válido
        if (!file?.name.endsWith(".mrpack")) {
            alert(t('install.sections.file.messages.error.invalid_mrpack_file'))

            toast({
                title: "Error",
                description: t('install.sections.file.messages.error.invalid_mrpack_file'),
                variant: "destructive",
            })

            setInstallationProgress(false)
            setInstallationConfig((prevInfo) => ({
                ...prevInfo,
                mrpack_info: undefined // Metadatos del modpack, inicialmente vacío
            }))

            return
        }

        try {

            const _data = await GetMrpackMedatadaInfo(file.path)
            const _modpack_dir_name = `${_data.name.trim().replace(/\s+/g, "-").toLowerCase() || "modpack"}`

            setInstallationConfig((prevInfo) => ({
                ...prevInfo,
                minecraft_version: MinecraftVersionFromDependencies(_data.dependencies), // versión obtenida buscando una dependencia con id "minecraft"
                mrpack_info: _data,
                mrpack_path: file.path,
                modpack_directory: path.join("instances", _modpack_dir_name)
            }))
            setInstallationProgress(true)

        } catch (error) {
            console.error("Error al obtener los metadatos del modpack:", error)
            // alert(t('install.sections.file.messages.error.invalid_modpack'))
            toast({
                title: "Cuidado",
                description: t('install.sections.file.messages.error.invalid_modpack'),
                variant: "destructive",
            })

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
                <h2>{t('install.sections.file.title')}</h2>
                <p>{t('install.sections.file.subtitle')}</p>
            </section>
            <section className='content'>

                <FileSelector AcceptExtensions={[".mrpack"]} FileCallback={handleFile} className="minecraft" />

                <section className={`installation-configuration ${installationProgress ? "active" : ""}`}>

                    <section className="mrpack-summary">
                        {installationConfig.mrpack_info ? <p>{t('install.sections.file.information.summary.name')}: {installationConfig.mrpack_info?.name || "NA"} </p> : null}
                        {installationConfig.mrpack_info?.summary ? <p>{t('install.sections.file.information.summary.description')}: {installationConfig.mrpack_info?.summary || "NA"} </p> : null}
                        {installationConfig.minecraft_version ? <p>{t('install.sections.file.information.summary.version')}: {installationConfig.minecraft_version || "NA"}</p> : null}
                    </section>

                    <section className="configuration">

                        <div className="toggle">
                            <div className="checkslider minecraft style-1">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => {
                                            // Confirma si el usuario quiere personalizar la configuración
                                            if (e.target.checked) {
                                                // Si se desmarca, reinicia la configuración a los valores por defecto
                                                if (
                                                    !window.confirm("Hazlo solo si sabes lo que estás haciendo.")
                                                ) {
                                                    return
                                                }
                                            }
                                            setPersonalizedConfig(e.target.checked)
                                        }}
                                        checked={personalizedConfig}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                            <p>{t('install.sections.file.configuration.advanced.activate')}</p>
                            <div className="information" onClick={() => setOpenModal(true)}>
                                <h1>?</h1>
                            </div>
                        </div>

                        <div className={`advanced-configuration ${personalizedConfig ? "active" : ""}`}>

                            <div className="path">
                                <p className="title">{t('install.sections.file.configuration.advanced.path.label')}</p>
                                <input
                                    type="text"
                                    className="minecraft input"
                                    placeholder={t('install.sections.file.configuration.advanced.path.placeholder')}
                                    value={installationConfig.installation_directory} // Ruta de instalación del modpack
                                    onChange={(event) => {
                                        const newPath = event.target.value.trim()
                                        if (!newPath || newPath.length === 0) {
                                            alert(t('install.sections.file.messages.error.invalid_path'))
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
                                <p>{t('install.sections.file.configuration.advanced.memory.label')}</p>
                                <div className="memory-inputs">
                                    <input
                                        type="text"
                                        className="minecraft input"
                                        placeholder={t('install.sections.file.configuration.advanced.memory.min_placeholder')}
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
                                    <input
                                        type="text"
                                        className="minecraft input"
                                        placeholder={t('install.sections.file.configuration.advanced.memory.max_placeholder')}
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
                        <div
                            className="icon-selector"
                            style={{ display: installationConfig.type === "server" ? "none" : "block" }}
                        >
                            <p>{t('install.sections.file.configuration.profile.label')}</p>
                            <select
                                className="minecraft"
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
                            </select>
                        </div>
                        <div className="type-selector">
                            <p>{t('install.sections.file.configuration.type.label')}</p>
                            <select
                                className="minecraft"
                                value={installationConfig.type}
                                onChange={(event) =>
                                    setInstallationConfig((prevInfo) => ({
                                        ...prevInfo,
                                        type: event.target.value
                                    }))
                                }
                            >
                                <option value="singleplayer">{t('install.sections.file.configuration.type.list.singleplayer')}</option>
                                <option value="client">{t('install.sections.file.configuration.type.list.client')}</option>
                                <option value="server">{t('install.sections.file.configuration.type.list.server')}</option>
                            </select>
                        </div>

                        <Dialog>
                            <DialogTrigger>
                                <button className="install minecraft"
                                    disabled={!installationProgress}
                                >
                                    {t('install.sections.file.configuration.install.button')}
                                </button>
                            </DialogTrigger>
                            <DialogContent className="minecraft">
                                <h2>{t('install.sections.file.messages.installation.need_launcher_closed')}</h2>
                                <p>{t('install.sections.file.configuration.install.dialog.description')}</p>

                                <DialogFooter>
                                    <DialogClose>
                                        <button
                                            className="minecraft"
                                            onClick={async () => {
                                                if (!installationConfig.mrpack_info) {
                                                    alert(t('install.sections.file.messages.error.no_file_selected'))
                                                    return
                                                }
                                                callBack(t('install.sections.file.messages.installation.starting'))

                                                console.log("Iniciando instalación con la siguiente configuración:", installationConfig)
                                                // InstallModpack(
                                                //     installationConfig, // Configuración de instalación del modpack
                                                //     callBack //callback
                                                // )
                                                hideMessage()
                                            }}
                                        >
                                            De acuerdo
                                        </button>
                                    </DialogClose>
                                    <DialogClose>
                                        <button className="minecraft">
                                            Cerrar
                                        </button>
                                    </DialogClose>
                                </DialogFooter>

                            </DialogContent>
                        </Dialog>

                    </section>

                </section>
            </section>
        </>
    )

    return (
        <main className="main-container">
            <Sidebar current_path="/Install" />
            <section className="install-container">
                <Modal IsOpen={openModal} onClick={() => setOpenModal(false)} size="medium">
                    <>
                        {installationConfig.mrpack_info?.files && installationConfig.mrpack_info.files.length > 0 ? (
                            <>
                                <h2>{t('install.sections.file.information.list.label')}</h2>
                                <ul>
                                    {installationConfig.mrpack_info.files
                                        ?.sort((a, b) => a.path.localeCompare(b.path)) // Order
                                        .map((file) => {
                                            if (file.path) {
                                                return <li key={file.path}>{file.path.split(".")[0].replace("/", " > ") || "unknown"}</li>
                                            }
                                        })}
                                </ul>
                            </>
                        ) : (
                            <h2>{t('install.sections.file.information.list.empty')}</h2>
                        )}
                    </>
                </Modal>
                <SectionsMinecraftComponent
                    title={t('install.header.title')}
                    sections={
                        [
                            {
                                id: "from-file",
                                title: t('install.sections.file.title'),
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