/// <reference types="vite-plugin-electron/electron-env" />

import { ipcRenderer, contextBridge } from 'electron'
import { CollectionInfo, CollectionDownloadInfo, ModsInCollectionInfo } from '@/interfaces/modrinth/Collection'
import { SearchHit } from '@/interfaces/modrinth/Hit'

declare namespace NodeJS {
  interface ProcessEnv {
    APP_ROOT: string
    VITE_PUBLIC: string
  }
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import('electron').IpcRenderer,
  electronAPI?: {
    invoke: (channel: string, ...args: unknown[]) => Promise<unknown>
    send: (channel: string, ...args: unknown[]) => void
    on: (channel: string, listener: (...args: unknown[]) => void) => void
    off: (channel: string, listener?: (...args: unknown[]) => void) => void
  },
  winConfig?: {
    getTheme: () => Promise<string>;
    getSystemTheme: () => Promise<string>;
    getFullscreen: () => Promise<boolean>;
    getLanguage: () => Promise<string>;
    getSystemLanguage: () => Promise<string>;
    setTheme: (theme: string) => Promise<void>;
    setFullscreen: (fullscreen: boolean) => Promise<void>;
    updateApp: () => Promise<void>;
    ckeckUpdate: () => Promise<boolean>;
    getVersion: () => Promise<string>;
  },
  backend?: {
    // Utils related
    GetVersion: () => Promise<string>;
    PathJoin: (...paths: string[]) => Promise<string>;
    PathExists: (path: string) => Promise<{exists: boolean,is_file: boolean }>;
    PathDelete: (path: string) => Promise<{ success: boolean, is_file: boolean, error?: string }>;
    IsModdedMinecraftDirectory: (directory: string) => Promise<boolean>;

    // Modrinth related
    FetchRandomProjects: (count: number) => Promise<unknown>;
    SearchProjects: (query?: string, facets?: string[][], index?: number, offset?: number, limit: number = 10) => Promise<SearchHit>;
    GetMrpackMedatadaInfo: (filePath: string) => Promise<unknown>;
    ShowOpenDialog: (options: Electron.OpenDialogOptions) => Promise<Electron.OpenDialogReturnValue>;
    GetMinecraftDirectory: () => Promise<string>;
    AddVanillaLauncher: (props: any) => Promise<string>;
    StartMrpackInstallation: (
      installationType: string,
      mrpackDirectory: string,
      profileDirectory: string,
      optionalFiles?: string[],
      cbStatus?: (status: string) => void,
      cbMax?: (max: number) => void,
      cbProgress?: (progress: number) => void,
      cbFinish?: (status: string) => void,
      cbError?: (error: string) => void
    ) => Promise<void>;
    DownloadCollection: (collectionId: string, version: string, loaders: string[], directory: string, updateExisting: boolean, log?: boolean) => Promise<CollectionDownloadInfo>;
    GetCollectionInfo: (collectionId: string) => Promise<CollectionInfo>;
    GetModsInCollectionInfo: (collectionId: string, version: string, loaders: string) => Promise<ModsInCollectionInfo>;
  }
}
