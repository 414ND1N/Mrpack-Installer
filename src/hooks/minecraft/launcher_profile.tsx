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
    Bookshelf = "Bookshelf",
    Brick = "Brick",
    Cake = "Cake",
    Carved_Pumpkin = "Carved_Pumpkin",
    Chest = "Chest",
    Clay = "Clay",
    Coal_Block = "Coal_Block",
    Coal_Ore = "Coal_Ore",
    Cobblestone = "Cobblestone",
    Crafting_Table = "Crafting_Table",
    Creeper_Head = "Creeper_Head",
    Diamond_Block = "Diamond_Block",
    Diamond_Ore = "Diamond_Ore",
    Dirt = "Dirt",
    Dirt_Podzol = "Dirt_Podzol",
    Dirt_Snow = "Dirt_Snow",
    Emerald_Block = "Emerald_Block",
    Emerald_Ore = "Emerald_Ore",
    Enchanting_Table = "Enchanting_Table",
    End_Stone = "End_Stone",
    Farmland = "Farmland",
    Furnace = "Furnace",
    Furnace_On = "Furnace_On",
    Glass = "Glass",
    Glazed_Terracotta_Light_Blue = "Glazed_Terracotta_Light_Blue",
    Glazed_Terracotta_Orange = "Glazed_Terracotta_Orange",
    Glazed_Terracotta_White = "Glazed_Terracotta_White",
    Glowstone = "Glowstone",
    Gold_Block = "Gold_Block",
    Gold_Ore = "Gold_Ore",
    Grass = "Grass",
    Gravel = "Gravel",
    Hardened_Clay = "Hardened_Clay",
    Ice_Packed = "Ice_Packed",
    Iron_Block = "Iron_Block",
    Iron_Ore = "Iron_Ore",
    Lapis_Ore = "Lapis_Ore",
    Leaves_Birch = "Leaves_Birch",
    Leaves_Jungle = "Leaves_Jungle",
    Leaves_Oak = "Leaves_Oak",
    Leaves_Spruce = "Leaves_Spruce",
    Lectern_Book = "Lectern_Book",
    Log_Acacia = "Log_Acacia",
    Log_Birch = "Log_Birch",
    Log_DarkOak = "Log_DarkOak",
    Log_Jungle = "Log_Jungle",
    Log_Oak = "Log_Oak",
    Log_Spruce = "Log_Spruce",
    Mycelium = "Mycelium",
    Nether_Brick = "Nether_Brick",
    Netherrack = "Netherrack",
    Obsidian = "Obsidian",
    Planks_Acacia = "Planks_Acacia",
    Planks_Birch = "Planks_Birch",
    Planks_DarkOak = "Planks_DarkOak",
    Planks_Jungle = "Planks_Jungle",
    Planks_Oak = "Planks_Oak",
    Planks_Spruce = "Planks_Spruce",
    Quartz_Ore = "Quartz_Ore",
    Red_Sand = "Red_Sand",
    Red_Sandstone = "Red_Sandstone",
    Redstone_Block = "Redstone_Block",
    Redstone_Ore = "Redstone_Ore",
    Sand = "Sand",
    Sandstone = "Sandstone",
    Skeleton_Skull = "Skeleton_Skull",
    Snow = "Snow",
    Soul_Sand = "Soul_Sand",
    Stone = "Stone",
    Stone_Andesite = "Stone_Andesite",
    Stone_Diorite = "Stone_Diorite",
    Stone_Granite = "Stone_Granite",
    TNT = "TNT",
    Water = "Water",
    Wool = "Wool",
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

