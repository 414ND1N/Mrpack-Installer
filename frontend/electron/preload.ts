import { ipcRenderer, contextBridge } from 'electron'

import {
  GetMrpackMedatadaInfo,
  GetMrpackInfo,
  StartMrpackInstallation,
  DownloadCollection,
  GetCollectionInfo,
  GetModsInCollectionInfo,
  FetchRandomProjects,
  SearchProjects
} from './api/modrinth'

import {
  PathJoin
} from './api/utils'

import {
  GetMinecraftDirectory,
  AddVanillaLauncher
} from './api/minecraft'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('electronAPI', {
  invoke: (channel: string, ...args: unknown[]) => ipcRenderer.invoke(channel, ...args),
  send: (channel: string, ...args: unknown[]) => ipcRenderer.send(channel, ...args),
  on: (channel: string, listener: (...args: unknown[]) => void) =>
    ipcRenderer.on(channel, (_event, ...args) => listener(...args)),
  off: (channel: string, listener?: (...args: unknown[]) => void) =>
    ipcRenderer.removeListener(channel, listener as any),
})

contextBridge.exposeInMainWorld('winConfig', {
  getTheme: () => ipcRenderer.invoke('get-theme'),
  getFullscreen: () => ipcRenderer.invoke('get-fullscreen'),
  getLanguage: () => ipcRenderer.invoke('get-language'),
  setTheme: (theme: string) => ipcRenderer.invoke('set-theme', theme),
  getSystemTheme: () => ipcRenderer.invoke('get-system-theme'),
  setFullscreen: (fullscreen: boolean) => ipcRenderer.invoke('set-fullscreen', fullscreen),
  setLanguage: (lang: string) => ipcRenderer.invoke('set-language', lang),
  getSystemLanguage: () => ipcRenderer.invoke('get-system-language'),
  updateApp: () => ipcRenderer.invoke('update-app'),
  checkUpdate: () => ipcRenderer.invoke('check-update'),
  getVersion: () => ipcRenderer.invoke('get-version'),
  ShowOpenDialog: (options: Electron.OpenDialogOptions) => ipcRenderer.invoke('dialog:showOpenDialog', options),
})

contextBridge.exposeInMainWorld('backend', {
  FetchRandomProjects: (count: number) => FetchRandomProjects(count),
  SearchProjects: (count: number, type?: string, querry?: string, offset?: number) => SearchProjects(count, type, querry, offset),
  PathJoin: (...paths: string[]) => PathJoin(...paths),
  AddVanillaLauncher: (props: any) => AddVanillaLauncher(props),
  
  // Modrinth related
  GetMinecraftDirectory: () => GetMinecraftDirectory(),
  StartMrpackInstallation: (
    installationType: string,
    mrpackDirectory: string,
    profileDirectory: string,
    cbStatus?: (status: string) => void,
    cbMax?: (max: number) => void,
    cbProgress?: (progress: number) => void,
    cbFinish?: (status: string) => void,
    cbError?: (error: string) => void
  ) => StartMrpackInstallation(installationType, mrpackDirectory, profileDirectory, cbStatus, cbMax, cbProgress, cbFinish, cbError),
  DownloadCollection: (collectionId: string, version: string, loaders: string[], directory: string, updateExisting: boolean, log: boolean = true) => DownloadCollection(collectionId, version, loaders, directory, updateExisting, log),
  GetCollectionInfo: (collectionId: string) => GetCollectionInfo(collectionId),
  GetModsInCollectionInfo: (collectionId: string, version: string, loaders: string) => GetModsInCollectionInfo(collectionId, version, loaders),
  GetMrpackMedatadaInfo: (filePath: string) => GetMrpackMedatadaInfo(filePath),
  GetMrpackInfo: (filePath: string) => GetMrpackInfo(filePath),
})

console.log("Preload script loaded successfully.")