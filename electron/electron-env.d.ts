/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  winConfig: {
    getTheme: () => Promise<string>;
    getFullscreen: () => Promise<boolean>;
    setTheme: (theme: string) => Promise<void>;
    setFullscreen: (fullscreen: boolean) => Promise<void>;
    updateApp: () => Promise<void>;
    ckeckUpdate: () => Promise<boolean>;
    getVersion: () => Promise<string>;
  },
  nodeModules: {
    path: {
      join: (...args: string[]) => string;
      dirname: (filePath: string) => string;
      basename: (filePath: string) => string;
    };
    os: {
      homedir: () => string;
      platform: () => string;
    };
    fs: {
      readFile: (filePath: string, encoding?: BufferEncoding) => Promise<string>;
      writeFile: (filePath: string, data: string, encoding?: BufferEncoding) => Promise<void>;
      readFileSync: (filePath: string, encoding?: BufferEncoding) => string;
      existsSync: (filePath: string) => boolean;
      writeFileSync: (filePath: string, data: string | NodeJS.ArrayBufferView, encoding?: BufferEncoding) => void;
      mkdirSync: (dirPath: string, options: { recursive?: boolean } = { recursive: true }) => void;
    };
    axios: {
      get: (url: string) => Promise<any>;
    }
    minecraft: {
      installModpack: (props: InstallationModpackProps, callback: Function) => Promise<void>;
      getMinecraftDirectory: () => string;
      getMrpackInfo: (modpackId: string) => Promise<MrpackInfo>;
    }
  },

}