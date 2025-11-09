interface CollectionDownloadInfo {
    collection_id:      string;
    mc_version:         string;
    loader:             string;
    ok:                 boolean;
    mods_downloaded:    string[];
    mods_not_found:     string[];
}
interface CollectionInfo {
    collection_id:      string;
    user:              string;
    name:               string;
    description:        string;
    projects:           string[];
    status:             string;
    created:            string;
    updated:            string;
    icon_url:          string;
}

interface ModsInCollectionInfo {
    collection_id:      string;
    mc_version:         string;
    loader:             string;
    available_mods:     string[];
    unavailable_mods:   string[];
}

export type {
    CollectionInfo,
    CollectionDownloadInfo,
    ModsInCollectionInfo
}