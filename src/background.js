'use strict'

import { app, protocol, BrowserWindow, globalShortcut } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { initUpdater } from './lib/update/update'
const isDevelopment = process.env.NODE_ENV !== 'production'
// const log = require('electron-log') // 用于调试主程序

app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors') // 允许跨域
app.commandLine.appendSwitch('--ignore-certificate-errors', 'true') // 忽略证书相关错误

let win

protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow () {
  win = new BrowserWindow({
    width: 1080,
    height: 720,
    frame: false,
    resizable: true,
    webPreferences: {
      webSecurity: false,
      enableRemoteModule: true,
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      allowRunningInsecureContent: false
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    win.loadURL('app://./index.html')
  }

  // 修改request headers
  // Sec-Fetch下禁止修改，浏览器自动加上请求头 https://www.cnblogs.com/fulu/p/13879080.html 暂时先用index.html的meta referer policy替代
  const filter = {
    urls: ['http://*/*', 'http://*/*']
  }
  win.webContents.session.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    const url = new URL(details.url)
    details.requestHeaders.Origin = url.origin
    if (!details.url.includes('//localhost') && details.requestHeaders.Referer && details.requestHeaders.Referer.includes('//localhost')) {
      details.requestHeaders.Referer = url.origin
    }
    callback({ // https://github.com/electron/electron/issues/23988 回调似乎无法修改headers，暂时先用index.html的meta referer policy替代
      cancel: false,
      requestHeaders: details.requestHeaders
    })
  })

  initUpdater(win)

  win.on('closed', () => {
    win = null
  })
}

if (process.platform === 'darwin') {
  app.dock.show()
}
if (process.platform === 'Linux') {
  app.disableHardwareAcceleration()
  app.commandLine.appendSwitch('--no-sandbox') // linux 关闭沙盒模式
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
