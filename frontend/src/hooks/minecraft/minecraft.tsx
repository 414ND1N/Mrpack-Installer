// import os from 'os'
// import path from 'path'
// import fs from 'fs'

// import VanillaServers from "@/hooks/minecraft/vanilla_servers.json"
// import { DownloadMarpackFiles } from '@/hooks/modrinth/mrpack'
import { MrpackMetadata } from '@/interfaces/modrinth/MrPack'
// import Launch, { LaunchOPTS } from "@/hooks/minecraft-java-core/src/Launch"
// import Downloader from "@/hooks/minecraft-java-core/src/utils/Downloader"
// import { AddLauncherProfile} from '@/hooks/minecraft/launcher_profile'
import { ProfileIcons } from '@/interfaces/MinecraftLauncherIcons'
import { TFunction } from 'i18next'

type LoaderType = "fabric" | "forge" | "quilt" | "liteloader" | "vanilla" | "other"

export interface InstallationModpackProps {
    type: string,                       // Por defecto, tipo cliente
    installation_directory: string,          // Directorio donde se instalará el modpack, por defecto el directorio de Minecraft
    memory: {
        max: string,                    // Memoria máxima por defecto
        min: string                     // Memoria mínima por defecto
    },
    mrpack_path: string                 // Ruta del archivo mrpackData, inicialmente vacío
    profile_icon?: ProfileIcons         // Icono del perfil del lanzador, inicialmente vacío
    minecraft_version: string,          // Versión de Minecraft por defecto
    mrpack_info?: MrpackMetadata,           // Metadatos del modpack, inicialmente vacío
    // translator: TFunction            // Función de traducción, opcional
}


/*
* Instalar un modpack desde un archivo mrpack y sus dependencias
* @param props Opciones de instalación del modpack (opcional)
* @param callback Función de callback para manejar el estado de la instalación (opcional)
*/
export const InstallModpack = async ( props: InstallationModpackProps, callback: Function = (() => {})): Promise<void> => {

    console.log('Instalando modpack con los props:', props)

    // Verificar si es necesario un lanzador
    // const _loader_found = props.mrpack_info?.loader || undefined
    // const _loader_type = _loader_found?.type.split("-")[0] as LoaderType || null // Asignar el tipo de lanzador si se encuentra
    // const _loader_build = _loader_found?.version || 'latest' // Asignar la build del lanzador si se encuentra, por defecto 'latest'

    
    // let _memory_min = props.memory.min // Memoria mínima por defecto
    // let _memory_max = props.memory.max // Memoria máxima por defecto

    // // Si no tienen G o M, agregar G por defecto
    // if (!_memory_min.endsWith('G') ) {
    //     _memory_min += 'G'; // Asignar G por defecto si no tiene G o M
    // }
    // if (!_memory_max.endsWith('G')) {
    //     _memory_max += 'G'; // Asignar G por defecto si no tiene G o M
    // }
    // // Verificar que tengan formato correcto
    // if (!/^\d+[MG]$/.test(_memory_min)) {
    //     _memory_min = "2G"; // Asignar valor por defecto si no es válido
    // }
    // if (!/^\d+[MG]$/.test(_memory_max)) {
    //     _memory_max = "3G"; // Asignar valor por defecto si no es válido
    // }

    // // Verificar que la memoria máxima sea mayor o igual a la mínima
    // if (parseInt(_memory_max) < parseInt(_memory_min)) {
    //     _memory_max = _memory_min; // Asignar memoria máxima igual a la mínima si es menor
    // }

    // const _java_args = `-Xmx${_memory_max} -Xms${_memory_min}`

    // const _install_props = {
    //     callback: callback , // Función de callback para manejar el estado de la instalación
    //     minecraft_version: props.minecraft_version, // Versión de Minecraft del modpack
    //     memory: props.memory, // Opciones de memoria para el modpack
    //     loader: {
    //         path: props.modpack_directory, // Ruta donde se instalará el modpack
    //         type: _loader_type, // Tipo de lanzador (forge, fabric, etc.)
    //         build: _loader_build, // Build del lanzador
    //         enable: _loader_found !== undefined // Si el lanzador está habilitado
    //     },
    //     translator: props.translator, // Función de traducción,
    //     java_args: _java_args
    // }

    // if (props.type === "client" || props.type === "singleplayer") {
    //     // Instalar minecraft, loader y archivos mrpack
        
    //     /* INSTALACION MINECRAFT */

    //     // Instalar Minecraft y lanzador
    //     console.log('Instalando Minecraft y lanzador con las opciones:', _install_props)
    //     const { minecraftLoader } = await InstallMinecraft(_install_props)

    //     /* CREACIÓN PERFIL PARA LANZADORES */
        
    //     callback(props.translator('install.sections.file.messages.installation.adding_profile'))


    //     const _icon = props.profile_icon || ProfileIcons.Bedrock
    //     const _last_version_id = minecraftLoader.id
    //     const _name = props.mrpack_info?.metadata?.name || "Modpack"
    //     const _profiles_json = path.join(getMinecraftDirectory(), "launcher_profiles.json")
    //     const _game_dir = path.join(getMinecraftDirectory(), props.modpack_directory)
        

    //     // Crear el perfil del lanzador
    //     try {
    //         await AddLauncherProfile(_profiles_json, _icon, _last_version_id, _name, _game_dir, `-Xmx${_memory_max} -Xms${_memory_min}`)

    //     } catch (error) {
    //         console.error('Error al añadir el perfil del lanzador:', error)
    //         callback(props.translator('install.sections.file.messages.error.adding_profile'))
    //         throw error
    //     }
    // } else { // servidor
    //     await InstallServer(_install_props)
    // }

    // /* INSTALACION ARCHVOS MRPACK */
    // callback(props.translator('install.sections.file.messages.installation.downloading_mods'))
    // await DownloadMarpackFiles(props.mrpack_path, path.join(getMinecraftDirectory(), props.modpack_directory), props.type || 'singleplayer')

    // callback(props.translator('install.sections.file.messages.installation.finish'))
}

export interface InstallaMinecraftProps {
    callback: Function; // Función de callback para manejar el estado de la instalación
    minecraft_version: string; // Versión de Minecraft del modpack (opcional, por defecto 'latest')
    memory?: {
        min?: string; // Memoria mínima (opcional, por defecto "2G")
        max?: string; // Memoria máxima (opcional, por defecto "3G")
    } // Opciones de memoria para el modpack (opcional)
    loader: {
        path: string; // Ruta del lanzador (opcional)
        type: LoaderType; // Tipo de lanzador (forge, fabric, etc.)
        build: string; // Build del lanzador (opcional)
        enable: boolean; // Si el lanzador está habilitado (opcional, por defecto true)
    }, // Si el lanzador está habilitado (opcional, por defecto true)
    translator: TFunction,
    java_args: string
}

/*
* Instalar Minecraft y sus dependencias
* @param props Opciones de instalación de Minecraft
*/
const InstallMinecraft = async (props: InstallaMinecraftProps): Promise<any> => {

    /*
        Instalar un modpack desde un archivo mrpack y sus dependencias

        :param props: Opciones de instalación del modpack (opcional)
    */
    // try {
    //     /* INSTALACION MINECRAFT */
        
    //     props.callback(props.translator('install.sections.file.messages.installation.dependencies'))
        
    //     const _launcher_options : LaunchOPTS = {
    //         path: getMinecraftDirectory(), // Ruta donde se instalará el modpack
    //         version: props.minecraft_version, // Versión de Minecraft del modpack
    //         loader: {
    //             path: "./", // Directorio actual para funcionar con launcher oficial de Minecraft
    //             type: props.loader?.type, // Tipo de lanzador (forge, fabric, etc.)
    //             build: props.loader?.build || 'latest', // Build del lanzador
    //             enable: props.loader.enable, // Si el lanzador está habilitado
    //         },
    //         authenticator: null, // Autenticador (puede ser null si no se requiere autenticación)
    //         mcp: null,
    //         memory: {
    //             min: props.memory?.min || '2G', // Memoria mínima
    //             max: props.memory?.max || '3G', // Memoria máxima
    //         },
    //         verify: false, // Verificación de archivos
    //         ignored: [], // Archivos ignorados
    //         JVM_ARGS: [], // Argumentos de la JVM
    //         GAME_ARGS: [], // Argumentos del juego
    //         java: {
    //             path: undefined,                     // Custom JVM path
    //             version: undefined,                  // Explicit Java version
    //             type: 'jre',                    // jre | jdk
    //         },
    //         screen: {
    //             width: undefined,                  // Ancho de la pantalla
    //             height: undefined,                 // Alto de la pantalla
    //             fullscreen: false,                 // Pantalla completa
    //         },
    //     }
        
    //     // Instalar lanzador si es necesario
    //     const _launch_object = new Launch(_launcher_options)
        
    //     let data_download: any = await _launch_object.DownloadGame();
    //     let { minecraftJson, minecraftLoader, minecraftVersion, minecraftJava } = data_download
        
    //     console.log('Instalación de Minecraft y lanzador completada:', {
    //         minecraftJson,
    //         minecraftLoader,
    //         minecraftVersion,
    //         minecraftJava
    //     })
            
    //     props.callback(props.translator('install.sections.file.messages.installation.finish_dependencies'))

    //     return data_download

    // } catch (error) {
    //     console.error('Error installing mrpack:', error)
    //     props.callback(props.translator('install.sections.file.messages.error.adding_dependencies'))
    //     throw error
    // }
}

/* 
* Instalar un servidor de Minecraft y sus dependencias
* @param props Opciones de instalación de Minecraft
*/
const InstallServer = async (props: InstallaMinecraftProps): Promise<void> => { 

    // try {
    //     props.callback(props.translator('install.sections.file.messages.installation.server_dependencies'))

    //     const _serverUrl = VanillaServers[props.minecraft_version]
    //     const _serverFolder = path.join(getMinecraftDirectory(), props.loader.path)

    //     // Download the server jar file
    //     const _downloader = new Downloader()
    //     await _downloader.downloadFile(_serverUrl, _serverFolder, 'server.jar') // Ensure async handling

    //     console.log(`Server jar downloaded to: ${_serverFolder}`)
    //     props.callback(props.translator('install.sections.file.messages.installation.finish_server_dependencies'))


    //     // TODO: Download loader dependencies

    //     // Create server start script
    //     const _startScriptPath = path.join(_serverFolder, "start.bat.txt")
    //     const _startScriptContent = `java ${props.java_args} -jar server.jar nogui`

    //     try {
    //         await fs.promises.writeFile(_startScriptPath, _startScriptContent, "utf8")
    //         console.log(`Start script created at: ${_startScriptPath}`)
    //         props.callback(props.translator('install.sections.file.messages.installation.finish_start_script'))
    //     } catch (error) {
    //         console.error("Error creating start script:", error)
    //         props.callback(props.translator('install.sections.file.messages.error.creating_start_script'))
    //         throw error;
    //     }

    // } catch (error) {
    //     console.error('Error downloading server jar:', error)
    //     props.callback(props.translator('install.sections.file.messages.error.adding_dependencies'))
    //     throw error;
    // }
}


export const getMinecraftDirectory = (): string => {

    // // Obtener el directorio de Minecraft del usuario

    // if (os.platform() === 'win32') {
    //     return path.join(os.homedir(), "AppData", "Roaming", ".minecraft").replace(/\\/g, path.sep)
    // }

    // if (os.platform() === "darwin") {
    //     return path.join(os.homedir(), "Library", "Application", "Support", "minecraft").replace(/\\/g, path.sep)
    // }

    // if (os.platform() === "linux") {
    //     return path.join(os.homedir(), ".minecraft").replace(/\\/g, path.sep)
    // }

    // throw new Error(`${os.platform()} is not supported!`)

    return (window as any).modules.path.join((window as any).modules.os.homedir(), ".minecraft")
}