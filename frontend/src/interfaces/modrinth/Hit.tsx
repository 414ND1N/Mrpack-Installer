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
    categories?:            string[];
    client_side?:           Side;
    server_side?:           Side;
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

export enum Side {
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
