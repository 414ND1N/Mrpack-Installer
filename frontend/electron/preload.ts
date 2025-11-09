import { ipcRenderer, contextBridge } from 'electron'

import { 
  FetchRandomProjects,
  SearchProjects,
  GetMrpackMedatadaInfo,
  StartMrpackInstallation,
  DownloadCollection,
  GetCollectionInfo,
  GetModsInCollectionInfo
} from './backend/modrinth'

import {
  PathJoin
} from './backend/utils'

import {
  GetMinecraftDirectory,
  AddVanillaLauncher
} from './backend/minecraft'

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
  fetchRandomProjects: (count: number) => FetchRandomProjects(count),
  searchProjects: (count: number, type?: string, querry?: string, offset?: number) => SearchProjects(count, type, querry, offset),
  GetMrpackMedatadaInfo: (filePath: string) => GetMrpackMedatadaInfo(filePath),
  PathJoin: (...paths: string[]) => PathJoin(...paths),
  GetMinecraftDirectory: () => GetMinecraftDirectory(),
  AddVanillaLauncher: (props: any) => AddVanillaLauncher(props),
  StartMrpackInstallation: (
    props: any,
    cbStatus?: (status: string) => void,
    cbMax?: (max: number) => void,
    cbProgress?: (progress: number) => void,
    cbFinish?: (status: string) => void,
    cbError?: (status: string) => void,
  ) => StartMrpackInstallation(props, cbStatus, cbMax, cbProgress, cbFinish, cbError),
  DownloadCollection: (
    collectionId: string,
    version: string,
    loader: string,
    directory: string,
    updateExisting: boolean
  ) => DownloadCollection(collectionId, version, loader, directory, updateExisting),
  GetCollectionInfo: (collectionId:string) => GetCollectionInfo(collectionId),
  GetModsInCollectionInfo: (collectionId:string, version:string, loader: string) => GetModsInCollectionInfo(collectionId, version, loader),
})

console.log("Preload script loaded successfully.")