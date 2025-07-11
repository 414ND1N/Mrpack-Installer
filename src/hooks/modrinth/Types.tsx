export interface MrpackInfo {
    metadata:           MrpackMetadata;
    // Dependen de otros valores
    optionalFiles?:     string[]; // List of optional file paths
    minecraftVersion:   string; // e.g., "1.20.2"
    loader?: {
        type: string; // e.g., "forge", "fabric"
        version: string; // e.g., "40.1.0"
    }
    overrides?: boolean; // If true, overrides will be applied
    client_overrides?: boolean; // If true, client files will override server files
    server_overrides?: boolean; // If true, server files will override client files
}

export interface MrpackMetadata {
    formatVersion:      string;
    game:               string;
    versionId:          string;
    name:               string;
    summary?:           string;
    files:              MrpackFile[];
    dependencies:       MrpackDependency[];
}

export interface MrpackDependency {
    id: string; // e.g., "minecraft", "forge"
    version: string; // e.g., "1.20.2", "40.1.0"
}

export interface MrpackFile {
    path:               string;
    hashes:             MrpackFileHashes;
    env?:               MrpackFileEnv;
    side ?:             MrpackFileSide;
    downloads ?:        string[];
    fileSize ?:         number;
}

interface MrpackFileEnv {
    client:             MrpackFileEnvValues;
    server:             MrpackFileEnvValues;
}

enum MrpackFileEnvValues {
    Required = "required",
    Optional = "optional",
    Unsupported = "unsupported",
}

interface MrpackFileHashes {
    sha1?:              string;
    sha512?:            string;
    [key: string]:      string | undefined;
}

enum MrpackFileSide {
    Required = "required",
    Unsupported = "unsupported",
}

export enum MrpackType {
    Client = "client",
    Server = "server",
}