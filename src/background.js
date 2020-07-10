'use strict'

import './lib/site/server'
import { app, protocol, BrowserWindow, globalShortcut, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

let win
let mini

protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow () {
  win = new BrowserWindow({
    width: 1680,
    height: 720,
    frame: false,
    resizable: true,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

function createMini () {
  mini = new BrowserWindow({
    width: 1150,
    miniWidth: 860,
    height: 340,
    miniHeight: 180,
    frame: false,
    resizable: true,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    mini.loadURL(process.env.WEBPACK_DEV_SERVER_URL + 'mini')
    if (!process.env.IS_TEST) mini.webContents.openDevTools()
  } else {
    createProtocol('app')
    mini.loadURL('app://./mini.html')
  }

  mini.on('closed', () => {
    mini = null
  })
}

if (process.platform === 'darwin') {
  app.dock.show()
}
if (process.platform === 'Linux') {
  app.disableHardwareAcceleration()
}
app.allowRendererProcessReuse = true

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

ipcMain.on('mini', () => {
  createMini()
  win.hide()
})

ipcMain.on('win', () => {
  mini.destroy()
  win.show()
  win.webContents.send('miniClosed')
})

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })
  app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
      try {
        await installExtension(VUEJS_DEVTOOLS)
      } catch (e) {
        console.error('Vue Devtools failed to install:', e.toString())
      }
    }
    createWindow()
    globalShortcut.register('Alt+Space', () => {
      if (win) {
        win.isFocused() ? win.blur() : win.focus()
      }
      if (mini) {
        mini.isFocused() ? mini.blur() : mini.focus()
      }
    })
  })
}


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
