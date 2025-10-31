import { MrpackMetadata } from '@/interfaces/modrinth/MrPack'
import { ProfileIcons } from '@/interfaces/minecraft/MinecraftLauncherIcons'

export interface InstallationModpackProps {
    type: string,                   // Por defecto, tipo cliente
    installation_directory: string, // Directorio donde se instalará el modpack, por defecto el directorio de Minecraft
    memory: {
        max: string,                // Memoria máxima por defecto
        min: string                 // Memoria mínima por defecto
    },
    mrpack_path: string             // Ruta del archivo mrpackData, inicialmente vacío
    profile_icon?: ProfileIcons     // Icono del perfil del lanzador, inicialmente vacío
    minecraft_version: string,      // Versión de Minecraft por defecto
    mrpack_info?: MrpackMetadata    // Metadatos del modpack, inicialmente vacío
}