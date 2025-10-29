import { readFile, writeFile} from 'fs/promises';

export interface LauncherProfile {
    profiles: { [key: string]: Profile };
    settings: Settings;
    version:  number;
}

export interface Profile {
    created:       string;
    icon:          string;
    lastUsed:      string;
    lastVersionId: string;
    name:          string;
    type:          string;
    gameDir?:      string;
    javaArgs?:     string;
}

export interface Settings {
    crashAssistance:  boolean;
    enableAdvanced:   boolean;
    enableAnalytics:  boolean;
    enableHistorical: boolean;
    enableReleases:   boolean;
    enableSnapshots:  boolean;
    keepLauncherOpen: boolean;
    profileSorting:   string;
    showGameLog:      boolean;
    showMenu:         boolean;
    soundOn:          boolean;
}

export const GetLauncherProfile = async (path: string): Promise<LauncherProfile> => {
    try {
        const fileContent = await readFile(path, 'utf-8')
        const profile: LauncherProfile = JSON.parse(fileContent)
        return profile
    } catch (error) {
        console.error('Error reading launcher profile:', error)
        throw error
    }
}

export const BackupLauncherProfile = async (path: string): Promise<void> => {
    try {
        const fileContent = await readFile(path, 'utf-8')
       
        // Crea una copia del archivo original en caso de que se necesite restaurar
        const backupPath = `${path}.backup`; 
        await writeFile(backupPath, fileContent, 'utf-8');

    } catch (error) {
        console.error('Error reading launcher profile:', error)
        throw error
    }
}

export const AddLauncherProfile = async (
    path : string, icon: string, lastVersionId: string, name: string, gameDir: string, javaArgs?: string
): Promise<void> => {
    try {
        const launcherProfile = await GetLauncherProfile(path);

        const newProfile: Profile = {
            created: new Date().toISOString(),
            icon,
            lastUsed: new Date().toISOString(),
            lastVersionId,
            name,
            type: "custom",
            gameDir,
            javaArgs
        };

        console.log("Añadiendo nuevo perfil al launcher profile:", newProfile)
        // Verificar si el perfil ya existe
        if (launcherProfile.profiles[name]) {
            console.warn(`El perfil "${name}" ya existe. Se actualizará.`)
        }

        // Crea una copia del archivo original en caso de que se necesite restaurar
        await BackupLauncherProfile(path)

        // Añadir el nuevo perfil al objeto launcherProfile
        const profile_key = name.replace(/\s+/g, '-').toLowerCase(); // Normalizar el nombre del perfil para usarlo como clave
        launcherProfile.profiles[profile_key] = newProfile;

        const updatedProfileJson = JSON.stringify(launcherProfile, null, 2)
        await writeFile(path, updatedProfileJson, 'utf-8')

    } catch (error) {
        console.error('Error writing launcher profile:', error)
        throw error
    }
}

