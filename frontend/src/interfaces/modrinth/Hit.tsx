export interface SearchHit {
    hits: Hit[];
    offset: number;
    limit: number;
    total_hits: number;
}


export interface Hit {
    project_id:             string;
    project_type:           ProjectType;
    slug?:                  string;
    author:                 string;
    title:                  string;
    description?:           string;
    categories?:            Category[];
    client_side?:           SideSupport;
    server_side?:           SideSupport;
    downloads:              number;
    icon_url?:              string;
    color?:                 number;
    thread_id?:             string;
    monetization_status?:   MonetizationStatus;
    display_categories?:    string[];
    versions:               string[];
    follows:                number;
    date_created:           Date;
    date_modified:          Date;
    latest_version?:        string;
    license?:               string;
    gallery?:               string[];
    featured_gallery?:      string;
    offset?:                number;
    limit?:                 number;
    total_hits?:            number;
}

export enum SideSupport {
    Required = "required",
    Unsupported = "unsupported",
}

export enum MonetizationStatus {
    Monetized = "monetized",
    Demonetized = "demonetized",
    ForceDemonetized = "force-demonetized",
}

export enum ProjectType {
    Mod = "mod",
    Modpack = "modpack",
    Resourcepack = "resourcepack",
    Shaderpack = "shaderpack",
    World = "world",
    Plugin = "plugin",
}

export enum ProjectIndex {
    Relevance = "relevance",
    Downloads = "downloads",
    Follows = "follows",
    Newest = "newest",
    Updated = "updated",
}

export enum Category {
    Adventure = "adventure",
    Cursed = "cursed",
    Decoration = "decoration",
    Economy = "economy",
    Equipement = "equipement",
    Food = "food",
    GameMechanics = "game-mechanics",
    Magic = "magic",
    Management = "management",
    Minigame = "minigame",
    Mobs = "mobs",
    Optimization = "optimization",
    Social = "social",
    Storage = "storage",
    Technology = "technology",
    Transportation = "transportation",
    Utility = "utility",
    WorldGeneration = "world-generation",

    Fabric = "fabric",
    Forge = "forge",
    NeoForge = "neoforge",
    Quilt = "quilt",
    Velocity = "velocity",
    Bungeecord = "bungeecord",
    Waterfall = "waterfall",
    Bukkit = "bukkit",
    Paper = "paper",
    Spigot = "spigot",
}

export enum HitSide {
    ClientSide = "client-side",
    ServerSide = "server-side",
}