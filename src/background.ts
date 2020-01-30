'use strict'

import { app, protocol, ipcMain, BrowserWindow } from 'electron'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
import path from 'path'
import { autoUpdater } from 'electron-updater'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1680,
    height: 720,
    frame: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true
    },
    // @ts-ignore
    icon: path.join(__static, 'icon.png')
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
    autoUpdater.checkForUpdatesAndNotify()
  }

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

ipcMain.on('min', () => {
  if (win) {
    win.minimize()
  }
})
ipcMain.on('max', e => {
  if (win) {
    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  }
})
ipcMain.on('close', e => {
  if (win) {
    win.close()
  }
})

ipcMain.on('opacity', (e, arg) => {
  if (win) {
    win.setOpacity(arg)
  }
})

ipcMain.on('top', () => {
  if (win) {
    if (win.isAlwaysOnTop()) {
      win.setAlwaysOnTop(false)
    } else {
      win.setAlwaysOnTop(true)
    }
  }
})

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 当运行第二个实例时,将会聚焦到win这个窗口
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })

  // 创建 win, 加载应用的其余部分, etc...
  app.on('ready', () => {
    createWindow()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', async () => {
//   if (isDevelopment && !process.env.IS_TEST) {
//     // Install Vue Devtools
//     // Devtools extensions are broken in Electron 6.0.0 and greater
//     // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
//     // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
//     // If you are not using Windows 10 dark mode, you may uncomment these lines
//     // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
//     try {
//       await installVueDevtools()
//     } catch (e) {
//       console.error('Vue Devtools failed to install:', e.toString())
//     }
//   }
//   createWindow()
// })

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
