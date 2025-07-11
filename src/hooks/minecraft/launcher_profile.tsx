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

export enum ProfileIcons {
    Bedrock = "Bedrock",
    Bookshelf = "Libreria",
    Brick = "Ladrillo",
    Cake = "Pastel",
    Carved_Pumpkin = "Calabaza tallada",
    Chest = "Cofre",
    Clay = "Archilla",
    Coal_Block = "Bloque de carbón",
    Coal_Ore = "Mineral carbón",
    Cobblestone = "Roca",
    Crafting_Table = "Mesa de trabajo",
    Creeper_Head = "Cabeza de Creeper",
    Diamond_Block = "Bloque de diamante",
    Diamond_Ore = "Mineral diamante",
    Dirt = "Tierra",
    Dirt_Podzol = "Podzol",
    Dirt_Snow = "Tierra con nieve",
    Emerald_Block = "Bloque de esmeralda",
    Emerald_Ore = "Mineral esmeralda",
    Enchanting_Table = "Mesa de encantamientos",
    End_Stone = "End Stone",
    Farmland = "Tierra cultivable",
    Furnace = "Horno",
    Furnace_On = "Horno encendido",
    Glass = "Cristal",
    Glazed_Terracotta_Light_Blue = "Terracota azul claro",
    Glazed_Terracotta_Orange = "Terracota naranja",
    Glazed_Terracotta_White = "Terracota blanca",
    Glowstone = "Piedra luminosa",
    Gold_Block = "Bloque de oro",
    Gold_Ore = "Mineral oro",
    Grass = "Césped",
    Gravel = "Grava",
    Hardened_Clay = "Arcilla endurecida",
    Ice_Packed = "Hielo compacto",
    Iron_Block = "Bloque de hierro",
    Iron_Ore = "Mineral hierro",
    Lapis_Ore = "Mineral lapislázuli",
    Leaves_Birch = "Hojas Abeto",
    Leaves_Jungle = "Hojas Jungla",
    Leaves_Oak = "Hojas Roble",
    Leaves_Spruce = "Hojas Pino",
    Lectern_Book = "Atril con libro",
    Log_Acacia = "Tronco Acacia",
    Log_Birch = "Tronco Abeto",
    Log_DarkOak = "Tronco Roble Oscuro",
    Log_Jungle = "Tronco Jungla",
    Log_Oak = "Tronco Roble",
    Log_Spruce = "Tronco Pino",
    Mycelium = "Mycelium",
    Nether_Brick = "Bloque de ladrillo del Nether",
    Netherrack = "Netherrack",
    Obsidian = "Obsidiana",
    Planks_Acacia = "Tablon de Acacia",
    Planks_Birch = "Tablon de Abeto",
    Planks_DarkOak = "Tablon de Roble Oscuro",
    Planks_Jungle = "Tablon de Jungla",
    Planks_Oak = "Tablon de Roble",
    Planks_Spruce = "Tablon de Pino",
    Quartz_Ore = "Mineral de cuarzo",
    Red_Sand = "Arena roja",
    Red_Sandstone = "Arenisca roja",
    Redstone_Block = "Bloque de redstone",
    Redstone_Ore = "Mineral de redstone",
    Sand = "Arena",
    Sandstone = "Arenisca",
    Skeleton_Skull = "Cabeza de esqueleto",
    Snow = "Nieve",
    Soul_Sand = "Arena del alma",
    Stone = "Piedra",
    Stone_Andesite = "Andesita",
    Stone_Diorite = "Diorita",
    Stone_Granite = "Granito",
    TNT = "Dinamita",
    Water = "Agua",
    Wool = "Lana",
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

