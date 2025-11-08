interface CollectionInfo {
    collection_id:      string;
    mc_version:         string;
    loader:             string;
    ok:                 boolean;
    mods_downloaded:    string[];
    mods_not_found:     string[];
}

export type {
    CollectionInfo
}