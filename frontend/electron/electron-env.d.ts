/// <reference types="vite-plugin-electron/electron-env" />

import { ipcRenderer, contextBridge } from 'electron'
import { CollectionInfo, CollectionDownloadInfo, ModsInCollectionInfo } from '@/interfaces/modrinth/Collection'

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
    fetchRandomProjects: (count: number) => Promise<unknown>;
    searchProjects: (count: number, type?: string, querry?: string, offset?: number) => Promise<unknown>;
    GetMrpackMedatadaInfo: (filePath: string) => Promise<unknown>;
    PathJoin: (...paths: string[]) => Promise<string>;
    ShowOpenDialog: (options: Electron.OpenDialogOptions) => Promise<Electron.OpenDialogReturnValue>;
    GetMinecraftDirectory: () => Promise<string>;
    AddVanillaLauncher: (props: any) => Promise<string>;
    StartMrpackInstallation: (
      props: any,
      cbStatus?: (status: string) => void,
      cbMax?: (max: number) => void,
      cbProgress?: (progress: number) => void,
      cbFinish?: (status: string) => void,
      cbError?: (status: string) => void
    ) => Promise<void>;
    DownloadCollection: (
      collectionId: string,
      version: string,
      loader: string,
      directory: string,
      updateExisting: boolean
    ) => Promise<CollectionDownloadInfo>;
    GetCollectionInfo: (collectionId:string) => Promise<CollectionInfo>;
    GetModsInCollectionInfo: (collectionId:string, version:string, loader: string) => Promise<ModsInCollectionInfo>;
  }
}
