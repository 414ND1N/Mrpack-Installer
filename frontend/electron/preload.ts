import { ipcRenderer, contextBridge } from 'electron'

import { 
  modrinthFetchRandomProjects,
  modrinthSearchProjects,
  GetMrpackMedatadaInfo
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
  setTheme: (theme: string) => ipcRenderer.invoke('set-theme', theme),
  setFullscreen: (fullscreen: boolean) => ipcRenderer.invoke('set-fullscreen', fullscreen),
  updateApp: () => ipcRenderer.invoke('update-app'),
  checkUpdate: () => ipcRenderer.invoke('check-update'),
  getVersion: () => ipcRenderer.invoke('get-version'),
})

contextBridge.exposeInMainWorld('backend', {
  fetchRandomProjects: (count: number) => modrinthFetchRandomProjects(count),
  searchProjects: (count: number, type?: string, querry?: string, offset?: number) => modrinthSearchProjects(count, type, querry, offset),
  GetMrpackMedatadaInfo: (filePath: string) => GetMrpackMedatadaInfo(filePath),
  PathJoin: (...paths: string[]) => PathJoin(...paths),
  GetMinecraftDirectory: () => GetMinecraftDirectory(),
  AddVanillaLauncher: (props: any) => AddVanillaLauncher(props),
})

console.log("Preload script loaded successfully.")