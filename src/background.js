'use strict'

import { app, protocol, BrowserWindow, globalShortcut, ipcMain, screen } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { initUpdater } from './lib/update/update'
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
require('@electron/remote/main').initialize()

const isDevelopment = process.env.NODE_ENV !== 'production'

// 固定 ffmpeg 路径，避免打包后 webpack 改写的 __dirname 导致找不到 ffmpeg
const ffmpegBinName = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg'
const ffmpegCandidates = app.isPackaged
  ? [
      path.join(process.resourcesPath, ffmpegBinName),
      path.join(process.resourcesPath, 'app.asar.unpacked', 'node_modules', 'ffmpeg-static', ffmpegBinName)
    ]
  : [path.join(__dirname, '..', 'node_modules', 'ffmpeg-static', ffmpegBinName)]
const ffmpegBinPath = ffmpegCandidates.find(candidate => {
  try { return fs.existsSync(candidate) } catch (e) { return false }
})
if (ffmpegBinPath) process.env.FFMPEG_BIN = ffmpegBinPath

// const log = require('electron-log') // 用于调试主程序

app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors') // 允许跨域
app.commandLine.appendSwitch('--ignore-certificate-errors', 'true') // 忽略证书相关错误

let win
let recordControlWin = null

const RECORD_CONTROL_ACTIONS = ['pause', 'stop', 'cancel']

ipcMain.handle('record-control:open', async (event) => {
  if (!win || win.isDestroyed() || event.sender !== win.webContents) return false
  if (recordControlWin && !recordControlWin.isDestroyed()) {
    recordControlWin.showInactive()
    return true
  }
  const workArea = screen.getDisplayMatching(win.getBounds()).workArea
  const width = 300
  const height = 120
  const control = new BrowserWindow({
    width,
    height,
    x: workArea.x + workArea.width - width - 24,
    y: workArea.y + 24,
    frame: false,
    resizable: false,
    movable: true,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    transparent: true,
    backgroundColor: '#00000000',
    hasShadow: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: false
    }
  })
  recordControlWin = control
  control.setAlwaysOnTop(true, 'screen-saver')
  control.on('closed', () => {
    if (recordControlWin === control) recordControlWin = null
    if (win && !win.isDestroyed()) win.webContents.send('record-control:closed')
  })
  try {
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      const base = process.env.WEBPACK_DEV_SERVER_URL.replace(/\/$/, '')
      await control.loadURL(`${base}/record-control.html`)
    } else {
      await control.loadFile(path.join(__dirname, 'record-control.html'))
    }
    if (control.isDestroyed()) return false
    control.showInactive()
    return true
  } catch (e) {
    recordControlWin = null
    try { control.destroy() } catch (err) {}
    return false
  }
})

ipcMain.on('record-control:update', (event, state) => {
  if (!win || win.isDestroyed() || event.sender !== win.webContents) return
  if (!recordControlWin || recordControlWin.isDestroyed()) return
  recordControlWin.webContents.send('record-control:state', state)
})

ipcMain.on('record-control:action', (event, action) => {
  if (!recordControlWin || recordControlWin.isDestroyed()) return
  if (event.sender !== recordControlWin.webContents) return
  if (!RECORD_CONTROL_ACTIONS.includes(action)) return
  if (win && !win.isDestroyed()) win.webContents.send('record-control:action', action)
})

ipcMain.on('record-control:close', (event) => {
  if (!win || win.isDestroyed() || event.sender !== win.webContents) return
  if (recordControlWin && !recordControlWin.isDestroyed()) recordControlWin.close()
})

// 本地视频文件只通过临时 token 暴露，避免任意页面直接读取 file:// 路径
const localMediaFiles = new Map()
const LOCAL_MEDIA_EXTENSIONS = ['.mp4', '.webm', '.mov', '.m4v']

ipcMain.handle('local-media:register', (event, filePath) => {
  if (!filePath || typeof filePath !== 'string') throw new Error('无效的文件路径')
  const stat = fs.statSync(filePath)
  if (!stat.isFile()) throw new Error('不是有效的文件')
  const ext = path.extname(filePath).toLowerCase()
  if (!LOCAL_MEDIA_EXTENSIONS.includes(ext)) throw new Error('不支持的文件类型')
  const token = crypto.randomBytes(16).toString('hex')
  localMediaFiles.set(token, filePath)
  return token
})

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
  { scheme: 'zyfile', privileges: { secure: true, standard: true, supportFetchAPI: true, stream: true, bypassCSP: true } }
])

function createWindow () {
  win = new BrowserWindow({
    width: 1080,
    height: 720,
    frame: false,
    resizable: true,
    webPreferences: {
      webSecurity: false,
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
      allowRunningInsecureContent: false,
      webviewTag: true
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
  require("@electron/remote/main").enable(win.webContents)
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
    if (recordControlWin && !recordControlWin.isDestroyed()) {
      recordControlWin.destroy()
    }
    recordControlWin = null
  })
}

if (process.platform === 'darwin') {
  app.dock.show()
}
if (process.platform === 'linux') {
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
    protocol.registerFileProtocol('zyfile', (request, callback) => {
      try {
        const url = new URL(request.url)
        const token = url.pathname.replace(/^\/+/, '').split('/')[0]
        const filePath = localMediaFiles.get(token)
        if (!filePath) return callback({ error: -6 })
        callback({ path: filePath })
      } catch (e) {
        callback({ error: -2 })
      }
    })
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
