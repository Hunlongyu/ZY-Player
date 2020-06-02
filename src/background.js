'use strict'

import { app, ipcMain, protocol, BrowserWindow } from 'electron'
import {
  createProtocol
  // installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
import path from 'path'
import { autoUpdater } from 'electron-updater'
const isDevelopment = process.env.NODE_ENV !== 'production'
const globalShortcut = require('electron').globalShortcut

let win
let mini

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow () {
  win = new BrowserWindow({
    width: 1080,
    height: 720,
    frame: false,
    resizable: true,
    transparent: true,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    },
    // eslint-disable-next-line
    icon: path.join(__static, 'icon.png')
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    win.loadURL('app://./index.html')
    autoUpdater.checkForUpdatesAndNotify()
  }

  win.on('closed', () => {
    win = null
  })
}

function createMini () {
  mini = new BrowserWindow({
    width: 550,
    minWidth: 260,
    height: 340,
    minHeight: 180,
    frame: false,
    resizable: true,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    },
    // eslint-disable-next-line
    icon: path.join(__static, 'icon.png')
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    mini.loadURL(process.env.WEBPACK_DEV_SERVER_URL + 'mini')
    if (!process.env.IS_TEST) mini.webContents.openDevTools()
  } else {
    mini.loadURL('app://./mini.html')
  }

  mini.on('closed', () => {
    mini = null
  })
}

app.allowRendererProcessReuse = true
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors')
if (process.platform === 'Linux') {
  app.disableHardwareAcceleration()
}

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
  if (mini === null) {
    createMini()
  }
})

ipcMain.on('min', () => {
  win.minimize()
})
ipcMain.on('close', () => {
  win.close()
})

ipcMain.on('mini', () => {
  createMini()
  win.close()
})
ipcMain.on('miniMin', () => {
  mini.minimize()
})
ipcMain.on('miniClose', () => {
  mini.close()
  createWindow()
})
ipcMain.on('miniOpacity', (e, arg) => {
  mini.setOpacity(arg)
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
    globalShortcut.register('CommandOrControl+right', function () {
      if (win) {
        win.webContents.send('next', 0)
      }
      if (mini) {
        mini.webContents.send('next', 0)
      }
    })
    globalShortcut.register('CommandOrControl+left', function () {
      if (win) {
        win.webContents.send('prev', 0)
      }
      if (mini) {
        mini.webContents.send('prev', 0)
      }
    })
    globalShortcut.register('CommandOrControl+up', function () {
      if (mini) {
        mini.webContents.send('up', 0)
      }
    })
    globalShortcut.register('CommandOrControl+down', function () {
      if (mini) {
        mini.webContents.send('down', 0)
      }
    })
    globalShortcut.register('shift+up', function () {
      if (win) {
        win.webContents.send('playbackRateUp', 0)
      }
      if (mini) {
        mini.webContents.send('playbackRateUp', 0)
      }
    })
    globalShortcut.register('shift+down', function () {
      if (win) {
        win.webContents.send('playbackRateDown', 0)
      }
      if (mini) {
        mini.webContents.send('playbackRateDown', 0)
      }
    })
    if (!process.env.WEBPACK_DEV_SERVER_URL) {
      createProtocol('app')
    }
    createWindow()
  })
}

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
