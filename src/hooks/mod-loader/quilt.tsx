interface QuiltMinecraftVersion {
    version: string
    stable: boolean
}

interface QuiltLoader {
    separator: string
    build: string
    maven: string
    version: string
}

export const get_all_minecraft_versions = async (): Promise<QuiltMinecraftVersion[]> => {
    const QUILT_MINECARFT_VERSIONS_URL = "https://meta.quiltmc.org/v3/versions/game"

    // Obtener todas las versiones de Minecraft compatibles con Fabric desde la API oficial
    try {
        const response = await fetch(QUILT_MINECARFT_VERSIONS_URL)
        if (!response.ok) {
            throw new Error(`Error fetching Minecraft versions: ${response.statusText}`)
        }
        const versions: QuiltMinecraftVersion[] = await response.json()
        return versions.map((version) => ({
            version: version.version,
            stable: version.stable
        }))
    } catch (error) {
        console.error('Error fetching Minecraft versions:', error)
        throw error
    }
}

export const get_stable_minecraft_versions = async () : Promise<string[]> => {

    const _minecraft_versions = get_all_minecraft_versions().then((versions) => {
        // Filtrar las versiones estables
        return versions.filter(version => version.stable).map(version => version.version)
    })

    return _minecraft_versions
}

export const get_latest_minecraft_version = async () : Promise<string> => {
    
    const versions = await get_all_minecraft_versions()
    return versions[0].version
}

export const get_latest_stable_minecraft_version = async () : Promise<string> => {
    
    const versions = await get_stable_minecraft_versions()
    return versions[0]
}

export const is_minecraft_version_supported = async (version: string): Promise<boolean> => {
    const versions = await get_all_minecraft_versions()
    return versions.some(v => v.version === version)
}

export const get_all_loader_versions = async (): Promise<QuiltLoader[]> => {
    const QUILT_LOADER_VERSIONS_URL = "https://meta.quiltmc.org/v3/versions/loader"
    // Obtener todas las versiones de Fabric Loader desde la API oficial
    try {
        const response = await fetch(QUILT_LOADER_VERSIONS_URL)
        if (!response.ok) {
            throw new Error(`Error fetching Fabric Loader versions: ${response.statusText}`)
        }
        const versions: QuiltLoader[] = await response.json()
        return versions
    } catch (error) {
        console.error('Error fetching Fabric Loader versions:', error)
        throw error
    }
}

export const get_latest_loader_version = async (): Promise<string> => {
    const versions = await get_all_loader_versions()
    return versions[0].version
}

export const get_latest_installer_version = async (): Promise<string> => {
    const QUILT_INSTALLER_MAVEN_URL = "https://maven.quiltmc.org/repository/release/org/quiltmc/quilt-installer/maven-metadata.xml"
    try {
        const response = await fetch(QUILT_INSTALLER_MAVEN_URL)
        if (!response.ok) {
            throw new Error(`Error fetching Fabric Installer version: ${response.statusText}`)
        }
        const xmlText = await response.text()
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(xmlText, "application/xml")
        const latestVersion = xmlDoc.querySelector("versioning > latest")?.textContent
        if (!latestVersion) {
            throw new Error("Latest version not found in metadata")
        }
        return latestVersion
    } catch (error) {
        console.error('Error fetching Fabric Installer version:', error)
        throw error
    }
}