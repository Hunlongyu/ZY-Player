'use strict'

import { app, ipcMain, protocol, BrowserWindow } from 'electron'
import {
  createProtocol
  // installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let mini

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1680,
    height: 720,
    frame: false,
    resizable: true,
    transparent: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

function createMini () {
  mini = new BrowserWindow({
    // width: 540,
    // height: 360,
    width: 980,
    height: 720,
    frame: true,
    resizable: true,
    transparent: false,
    webPreferences: {
      webSecurity: false
    },
    parent: win,
    modal: true,
    show: false
  })
  mini.loadURL('http://localhost:8080/#/mini')
  // mini.show()
  mini.once('ready-to-show', () => {
    mini.show()
  })
}

app.allowRendererProcessReuse = true

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

ipcMain.on('min', () => {
  win.minimize()
})
ipcMain.on('close', () => {
  win.close()
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
ipcMain.on('checkTop', (e) => {
  if (win.isAlwaysOnTop()) {
    e.sender.send('isTop', true)
  } else {
    e.sender.send('isTop', false)
  }
})

ipcMain.on('mini', () => {
  createMini()
})

app.on('ready', async () => {
  createWindow()
})

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
