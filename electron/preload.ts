import { ipcRenderer, contextBridge } from 'electron'
import path from "path"
import { readFile, writeFile} from 'fs/promises'
import os from 'os'
import axios from 'axios'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { InstallModpack, InstallationModpackProps, getMinecraftDirectory } from "./../src/hooks/minecraft/minecraft"
import { GetMrpackInfo } from "./../src/hooks/modrinth/mrpack"
import { MrpackInfo } from './../src/hooks/modrinth/Types'
// import { InstallModpack, InstallationModpackProps, getMinecraftDirectory } from "@/hooks/minecraft/minecraft"
// import { GetMrpackInfo } from "@/hooks/modrinth/mrpack"
// import { MrpackInfo } from '@/hooks/modrinth/Types'

// --------- Expose some API to the Renderer process ---------

contextBridge.exposeInMainWorld('winConfig', {
  getTheme: () => ipcRenderer.invoke('get-theme'),
  getFullscreen: () => ipcRenderer.invoke('get-fullscreen'),
  setTheme: (theme: string) => ipcRenderer.invoke('set-theme', theme),
  setFullscreen: (fullscreen: boolean) => ipcRenderer.invoke('set-fullscreen', fullscreen),
  updateApp: () => ipcRenderer.invoke('update-app'),
  ckeckUpdate: () => ipcRenderer.invoke('check-update'),
  getVersion: () => ipcRenderer.invoke('get-version'),
})

contextBridge.exposeInMainWorld('nodeModules', {
  path: {
    join: (...args: string[]) => path.join(...args),
    dirname: (filePath: string) => path.dirname(filePath),
    basename: (filePath: string) => path.basename(filePath),
  },
  os: {
    homedir: () => os.homedir(),
    platform: () => os.platform(),
  },
  fs: {
    readFile: async (filePath: string, encoding: BufferEncoding = 'utf-8') => {
      return await readFile(filePath, encoding);
    },
    writeFile: async (filePath: string, data: string, encoding: BufferEncoding = 'utf-8') => {
      return await writeFile(filePath, data, encoding);
    },
    readFileSync: (filePath: string, encoding: BufferEncoding = 'utf-8') => {
      return readFileSync(filePath, encoding);
    },
    existsSync: (filePath: string) => {
      return existsSync(filePath);
    },
    writeFileSync: (filePath: string, data: string | NodeJS.ArrayBufferView, encoding: BufferEncoding = 'utf-8') => {
      writeFileSync(filePath, data, encoding);
    },
    mkdirSync: (dirPath: string, options: { recursive?: boolean } = { recursive: true }) => {
      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, options);
      }
    }
  },
  axios: {
    get: async (url: string) => {
      try {
        const response = await axios.get(url);
        return response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
      }
    },
  },
  minecraft: {
    installMinecraftModpack: async (props: InstallationModpackProps, callback: Function) => {
      try {
        const data = await InstallModpack(props, callback);
        return data;
      } catch (error) {
        console.error('Error installing modpack:', error);
        throw error;
      }
    },
    getMinecraftPath: () => {
      try {
        return getMinecraftDirectory();
      } catch (error) {
        console.error('Error getting Minecraft directory:', error);
        throw error;
      }
    },
    getMrpackInfo: async (filePath: string): Promise<MrpackInfo> => {
      try {
        const data = await GetMrpackInfo(filePath);
        return data;
      } catch (error) {
        console.error('Error fetching mrpack info:', error);
        throw error;
      }
    }
  }
});

console.log("Preload script loaded successfully.")