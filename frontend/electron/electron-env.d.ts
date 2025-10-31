/// <reference types="vite-plugin-electron/electron-env" />

import { ipcRenderer, contextBridge } from 'electron'
import path from "path"
import os from 'os'
import axios from 'axios'

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
    getFullscreen: () => Promise<boolean>;
    setTheme: (theme: string) => Promise<void>;
    setFullscreen: (fullscreen: boolean) => Promise<void>;
    updateApp: () => Promise<void>;
    ckeckUpdate: () => Promise<boolean>;
    getVersion: () => Promise<string>;
  },
  modules: {
    path: {
      join: (...args: string[]) => string
      dirname: (filePath: string) => string
      basename: (filePath: string) => string
    }
    os: {
      homedir: () => string
      platform: () => NodeJS.Platform
    }
    axios: {
      get: <T = unknown>(url: string) => Promise<T>
    }
  },
  backend?: {
    fetchRandomProjects: (count: number) => Promise<unknown>;
    searchProjects: (count: number, type?: string, querry?: string, offset?: number) => Promise<unknown>;
    GetMrpackMedatadaInfo: (filePath: string) => Promise<unknown>;
    PathJoin: (...paths: string[]) => Promise<string>;
  }
}
