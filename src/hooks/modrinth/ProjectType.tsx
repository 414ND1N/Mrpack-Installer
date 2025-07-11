export interface Project {
    id:                    string;
    game_versions:         string[];
    client_side:           Side;
    server_side:           Side;
    slug:                  string;
    project_type:          ProjectType;
    team:                  string;
    organization:          null;
    title:                 string;
    description:           string;
    body:                  string;
    body_url:              null;
    published:             Date;
    updated:               Date;
    approved:              Date;
    queued:                Date;
    status:                Status;
    requested_status:      Status;
    moderator_message:     null;
    license:               License;
    downloads:             number;
    follows:             number;
    categories:            string[];
    additional_categories: string[];
    loaders:               string[];
    versions:              string[];
    icon_url:              string;
    issues_url:            null | string;
    source_url:            null | string;
    wiki_url:              null | string;
    discord_url:           null | string;
    donation_urls:         DonationURL[];
    gallery:               Gallery[];
    color:                 number;
    thread_id:             string;
    monetization_status:   MonetizationStatus;
}

export enum Side {
    Required = "required",
    Unsupported = "unsupported",
}

export interface DonationURL {
    id:       string;
    platform: string;
    url:      string;
}

export interface Gallery {
    url:         string;
    raw_url:     string;
    featured:    boolean;
    title:       null | string;
    description: null | string;
    created:     Date;
    ordering:    number;
}

export interface License {
    id:   string;
    name: string;
    url:  null;
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
export enum Status {
    Approved = "approved",
    Unlisted = "unlisted",
}
