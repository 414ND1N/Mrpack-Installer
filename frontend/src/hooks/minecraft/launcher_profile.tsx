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