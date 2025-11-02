import { app, BrowserWindow, nativeTheme } from 'electron'
import { Menu } from 'electron'
import Store from 'electron-store'
import { ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { spawn, ChildProcess } from 'child_process';

let backendProcess: ChildProcess | null = null;
const getBackendPath = (): string => {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'backend', 'backend.exe');
  }
  return path.join(__dirname, '..', 'backend', 'backend.exe');
};

const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.env.APP_ROOT = path.join(__dirname, '..')

// Datos persistentes
const store = new Store()

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

interface WindowBounds {
  width: number
  height: number
}

// --------- Ventana ---------

function createWindow() {

  // Obtener datos persistentes
  const windowBounds = store.get('windowBounds', { width: 1100, height: 700 }) as WindowBounds
  const isFullscreen = store.get('isFullscreen', false) as boolean

  win = new BrowserWindow({
    title: 'Modpack Installer',
    icon: path.join(process.env.VITE_PUBLIC ?? '', 'app-icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true,
    },
    fullscreen: isFullscreen,
    minHeight: 700,
    minWidth: 1100,
    height: windowBounds?.height || 700,
    width: windowBounds?.width || 1100,
  })

  // Limpiar la referencia a la ventana cuando se cierre
  win.on('closed', () => {
    win = null // Asegurarse de que la referencia a la ventana se elimine
  })

  // Acciones al iniciar la ventana
  win.webContents.on('did-finish-load', () => {
    console.log('Ventana cargada con éxito')
  })

  // // Abrir DevTools en modo separado para depuración
  // try {
  //   win.webContents.openDevTools({ mode: 'detach' })
  // } catch (e) {
  //   console.warn('No se pudo abrir DevTools:', e)
  // }

  // Cargar la URL de desarrollo o el archivo HTML
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    const indexPath = path.join(RENDERER_DIST, 'index.html')
    console.log('Cargando archivo:', indexPath) // Agrega un log para depuración
    win.loadFile(indexPath)
  }

  // Iniciar el proceso de Python ANTES de cargar la ventana
  const backendPath = getBackendPath();
  console.log(`Iniciando backend desde: ${backendPath}`);
  try {
    backendProcess = spawn(backendPath); // Ejecutar el backend
    if (!backendProcess) {
      console.error('Error: No se pudo iniciar el proceso de backend.');
      return;
    }
    backendProcess.stdout?.on('data', (data) => {
      console.log(`[Backend STDOUT]: ${data.toString()}`);
    });

    backendProcess.stderr?.on('data', (data) => {
      console.error(`[Backend STDERR]: ${data.toString()}`);
    });

    backendProcess.on('close', (code) => {
      console.log(`Proceso de backend cerrado con código ${code}`);
    });

  } catch (error) {
    console.error('Error al intentar ejecutar spawn:', error);
  }
}

app.on('window-all-closed', () => {
  if (win) {
    const bounds = win.getBounds()
    store.set('windowBounds', { width: bounds.width, height: bounds.height })
    store.set('isFullscreen', win.isFullScreen())
  }

  // On macOS it is common for applications and their menu bar to stay active
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('will-quit', () => {
  if (backendProcess) {
    console.log('Cerrando el proceso del backend...');
    backendProcess.kill(); // Envía la señal para terminar el proceso
    backendProcess = null;
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})


// --------- Auto Updater ---------

autoUpdater.autoDownload = false
autoUpdater.autoRunAppAfterInstall = true
autoUpdater.setFeedURL({
  provider: 'github',
  repo: 'Mrpack-Installer',
  owner: '414ND1N',
  channel: 'latest',
  private: false
})
// autoUpdater.autoInstallOnAppQuit = true

autoUpdater.on('update-available', (_) => {
  console.log('Update available')
})

autoUpdater.on('update-not-available', (_) => {
  console.log('No update available')
})

autoUpdater.on('error', (info) => {
  console.error('Error checking for updates:', info)
})

autoUpdater.on('update-downloaded', (info) => {
  console.log('Update downloaded:', info)
})

// --------- App Events ---------
function setupIpcEvents() {
  ipcMain.handle('set-fullscreen', (_, isFullscreen: boolean) => {
    if (win) {
      win.setFullScreen(isFullscreen)
      store.set('isFullscreen', isFullscreen)
    }
  })

  ipcMain.handle('get-fullscreen', () => {
    if (win) {
      const isFullscreen = win.isFullScreen()
      return isFullscreen
    } else {
      return false
    }
  })

  ipcMain.handle('set-theme', (_, theme: string) => {
    try {
      if (theme === 'system') {
        const sysTheme = nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
        store.set('theme', sysTheme)
      } else {
        store.set('theme', theme)
      }
      console.log(`Theme saved to: ${theme}`)
    } catch (error) {
      console.error('Error saving theme:', error)
    }
  })

  ipcMain.handle('get-theme', () => {
    if (store.has('theme')) {
      return store.get('theme')
    }
    return nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
  })

  ipcMain.handle('get-system-theme', () => {
    return nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
  })

  nativeTheme.on('updated', () => {
    try {
      if (!store.has('theme') && win) {
        const sysTheme = nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
        win.webContents.send('system-theme-changed', sysTheme)
      }
    } catch (e) {
      console.error('Error al notificar cambio de tema del sistema:', e)
    }
  })

  ipcMain.handle('get-version', () => {
    return app.getVersion()
  })

  ipcMain.handle('update-app', async () => {
    try {
      console.log('Updating app...')
      await autoUpdater.downloadUpdate()
    } catch (error) {
      console.error('Error downloading update:', error)
      throw error
    }
  })

  ipcMain.handle('check-update', async () => {
    try {
      console.log('Checking for updates...')
      const updateCheckResult = await autoUpdater.checkForUpdates()
      return updateCheckResult?.isUpdateAvailable || false
    } catch (error) {
      console.error('Error checking for updates:', error)
      throw error
    }
  })

  ipcMain.handle('get-language', () => {
    if (store.has('language')) {
      return store.get('language', 'en')
    }
    const locale = app.getLocale() || 'en'
    return String(locale).split(/[-_]/)[0]
  })

  ipcMain.handle('set-language', (_, lang: string) => {
    try {
      store.set('language', lang)
      console.log(`Language saved to: ${lang}`)
    } catch (error) {
      console.error('Error saving language:', error)
    }
  })
}

// ------- Inicialización de la aplicación -------
app.whenReady().then(() => {
  createWindow()

  // Disable menu on Windows and Linux only if not in development
  if (!(process.platform === 'darwin') && !VITE_DEV_SERVER_URL) {
    Menu.setApplicationMenu(null)
  }

  setupIpcEvents()

  console.log('Checking for updates...')
  autoUpdater.checkForUpdates()
  console.log('Last version:', autoUpdater.currentVersion)
})


