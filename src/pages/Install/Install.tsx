import { useState, useCallback } from "react"
import path from "path"

// Componentes
import Sidebar from "@/pages/Sidebar"

// Css
import "./Install.css"

// Componentes
import SectionsMinecraftComponent from "@/components/SectionsMinecraft/SectionsMinecraft"
import FileSelector from "@/components/FileSelector/FileSelector"
import Modal from "@/components/Modal/Modal"

// Hooks
import { GetMrpackInfo } from "@/hooks/modrinth/mrpack"
import { InstallModpack, InstallationModpackProps } from "@/hooks/minecraft/minecraft"
import { ProfileIcons } from '@/hooks/minecraft/launcher_profile'
import { useGlobalMessage } from "@/context/GlobalMessageContext"

interface InstallationProgress {
    fileExists: boolean
    status: string
    message?: string // Mensaje opcional para mostrar información adicional
    error?: string
}

function Install() {

    const { showMessage } = useGlobalMessage();

    const [installationConfig, setInstallationConfig] = useState<InstallationModpackProps>({
        type: "singleplayer", // Por defecto, tipo cliente
        modpack_directory: "instances",
        minecraft_version: "latest", // Versión de Minecraft por defecto
        memory: {
            max: "", // Memoria máxima por defecto
            min: "" // Memoria mínima por defecto
        },
        mrpack_info: undefined, // Datos de mrpack, inicialmente vacío
        mrpack_path: "", // Ruta del archivo mrpack, inicialmente vacío
        profile_icon: ProfileIcons.Bedrock, // Icono del perfil, inicialmente vacío
    })

    const [installationProgress, setInstallationProgress] = useState<InstallationProgress>({
        fileExists: false, // Indica si el archivo ya existe
        status: 'pending', // Estado de la instalación
        message: "Esperando acción del usuario" // Estado inicial
    })

    const [personalizedConfig, setPersonalizedConfig] = useState<boolean>(false)
    const [openModal, setOpenModal] = useState<boolean>(false)

    // Funcion archivo
    const handleFile = async (file: File) => {
        // Aquí puedes manejar el archivo seleccionado
        console.log("Archivo seleccionado:", file)

        // Verificar si el archivo es un modpack válido
        if (! file?.name.endsWith(".mrpack")) {
            alert("El archivo seleccionado no es un modpack válido. Debe tener la extensión .mrpack")
            
            setInstallationProgress({
                fileExists: false, // Reiniciar el estado de archivo existente
                error: "El archivo seleccionado no es un modpack válido. Debe tener la extensión .mrpack",
                status: 'pending'
            })
            setInstallationConfig((prevInfo) => ({
                ...prevInfo,
                mrpack_info: undefined // Metadatos del modpack, inicialmente vacío
            }))

            return
        }

        try {
            
            const _data = await GetMrpackInfo(file.path)
            
            const _modpack_dir_name = `${_data.metadata?.name.trim().replace(/\s+/g, "-").toLowerCase() || "modpack"}-${_data.metadata?.formatVersion.toString().trim().toLowerCase() || "latest"}`
            
            setInstallationConfig((prevInfo) => ({
                ...prevInfo,
                minecraft_version: _data.minecraftVersion || "latest", // Versión de Minecraft del modpack
                mrpack_info: _data, // Metadatos del modpack, inicialmente vacío
                mrpack_path: file.path,
                modpack_directory: path.join("instances", _modpack_dir_name)
            }))
            setInstallationProgress((prevProgress) => ({
                ...prevProgress,
                fileExists: true, // Reiniciar el estado de archivo existente
                message: "Archivo seleccionado correctamente", // Actualizar el estado
                status:'pending'
            }))

        } catch (error) {
            console.error("Error al obtener los metadatos del modpack:", error)
            alert("Error al obtener los metadatos del modpack. Asegúrate de que el archivo sea un modpack válido.")

            setInstallationConfig((prevInfo) => ({
                ...prevInfo,
                mrpack_info: undefined, // Metadatos del modpack, inicialmente vacío
                modpack_directory: "instances" // Reiniciar la ruta de instalación del modpack
            }))
            setInstallationProgress((prevProgress) => ({
                ...prevProgress,
                fileExists: false, // Reiniciar el estado de archivo existente
                message: "Error al obtener los datos del modpack", // Actualizar el estado
                status: 'failed'
            }))
        }
    }

    const callBack = useCallback((message: string, status?: string) => {
        // setInstallationProgress((prevInfo) => ({
        //     ...prevInfo,
        //     message: message,
        //     status: status || 'pending',
        // }));
        showMessage(message)
    }, [setInstallationProgress]);

    // secciones
    const sectionFromFile = (
        <>
            <section className="header">
                <h2>Desde archivo <strong>mrpack</strong></h2>
                <p>Instala un modpack utilizando un archivo
                    <a
                        href="https://support.modrinth.com/en/articles/8802351-modrinth-modpack-format-mrpack"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="minecraft"
                    >
                        mrpack
                    </a>
                </p>
            </section>
            <section className={`content ${installationProgress.status}`}>

                <div className="status-message">
                    <h2>{installationProgress.message}</h2>
                </div>

                <FileSelector AcceptExtensions={[".mrpack"]} FileCallback={handleFile} className="minecraft" />

                <section className={`installation-configuration ${installationProgress.fileExists ? "active" : ""}`}>

                    <section className="mrpack-summary">
                        {installationConfig.mrpack_info?.metadata ? <p>Nombre: {installationConfig.mrpack_info.metadata?.name || "NA"} </p> : null}
                        {installationConfig.mrpack_info?.metadata?.summary ? <p>Descripción: {installationConfig.mrpack_info.metadata?.summary || "NA"} </p> : null}
                        {installationConfig.minecraft_version ? <p>Versión de Minecraft: {installationConfig.minecraft_version||"NA"}</p> : null}
                    </section>

                    <section className="configuration">

                        <div className="toggle">
                            <div className="checkbox minecraft style-1">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => {
                                            // Confirma si el usuario quiere personalizar la configuración
                                            if ( e.target.checked ) {
                                                // Si se desmarca, reinicia la configuración a los valores por defecto
                                                if (
                                                    !window.confirm("Hazlo solo si sabes lo que estás haciendo.")
                                                ){
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
                            <p>Activar configuración avanzada</p>
                            <div className="information" onClick={() => setOpenModal(true)}>
                                <h1>?</h1>
                            </div>
                        </div>

                        <div className={`advanced-configuration ${personalizedConfig ? "active" : ""}`}>

                            <div className="path">
                                <p className="title">Ubicación de instalación de modpack (respecto .minecraft)</p>
                                <input
                                    type="text"
                                    className="minecraft input"
                                    placeholder="Ruta de instalación del modpack"
                                    value={installationConfig.modpack_directory} // Ruta de instalación del modpack
                                    onChange={(event) => {

                                        const newPath = event.target.value.trim()
                                        if (!newPath || newPath.length === 0) {
                                            alert("Por favor, introduce una ruta válida.")
                                            return
                                        }
                                        setInstallationConfig((prevInfo) => ({
                                            ...prevInfo,
                                            modpack_directory: newPath
                                        }))
                                    }}
                                />
                            </div>

                            <div className="memory">
                                <p>Memoria asignada al juego</p>
                                <div className="memory-inputs">
                                    <input
                                        type="text"
                                        className="minecraft input"
                                        placeholder="Mínima en GB "
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
                                        placeholder="Máxima en GB"
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
                        <div className="type-selector">
                            <p>Tipo de instalación</p>
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
                                <option value="singleplayer">Singleplayer</option>
                                <option value="client">Cliente servidor</option>
                                <option value="server">Servidor</option>
                            </select>
                        </div>

                        <div 
                            className="icon-selector"
                            style={{ display: installationConfig.type === "server" ? "none" : "block" }}
                            >
                            <p>Icono del perfil</p>
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
                                    <option key={key} value={key}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button className="install minecraft"
                            disabled={!installationProgress.fileExists}
                            onClick={() => {
                                if (!installationConfig.mrpack_info) {
                                    alert("No se ha seleccionado un modpack válido.")
                                    return
                                }
                                alert("Debes de tener cerrado el lanzador de Minecraft para que la instalación se realice correctamente.")
                                callBack("Iniciando instalacion", "progress")
                                
                                InstallModpack (
                                    installationConfig, // Configuración de instalación del modpack
                                    callBack //callback
                                )
                                // .then(() => {
                                //     hideMessage()
                                // })
                            }}
                        >
                            Instalar
                        </button>
                    </section>

                </section>
            </section>
        </>
    )

    // const sectionFromUrl = (
    //     <>
    //         <section className="header">
    //             <h2>Desde url</h2>
    //             <p>Instala un modpack utiliando un enlace de
    //                 <a
    //                     href="https://modrinth.com/modpacks"
    //                     target="_blank"
    //                     rel="noopener noreferrer"
    //                     className="minecraft"
    //                 >
    //                     Modrinth
    //                 </a>
    //             </p>
    //         </section>
    //         <section className="content">

    //         </section>
    //     </>
    // )

    return (
        <main className="main-container">
            <Sidebar current_path="/Install"/>
            <section className="install-container">
                <Modal IsOpen={openModal} onClick={() => setOpenModal(false)} size="medium">
                    <>
                        <h2>Archivos del modpack</h2>
                        <ul>
                            {installationConfig.mrpack_info?.metadata.files
                                ?.sort((a, b) => a.path.localeCompare(b.path)) // Order
                                .map((file) => {
                                    if (file.path) {
                                        return <li key={file.path}>{file.path.split(".")[0].replace("/", " > ") || "unknown"}</li>
                                    }
                                })}
                        </ul>
                    </>
                </Modal>
                <SectionsMinecraftComponent
                    title="INSTALACIÓN DE MODPACKS"
                    sections={
                        [
                            {
                                id: "from-file",
                                title: "Archivo",
                                content: sectionFromFile
                            }
                            // , {
                            //     id: "from-url",
                            //     title: "Enlace",
                            //     content: sectionFromUrl
                            // }
                        ]
                    }
                />
            </section>
        </main>
    )

}

export default Install