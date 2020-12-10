import { BrowserWindow, ipcMain } from 'electron'
const { autoUpdater } = require('@imjs/electron-differential-updater')

export function initUpdater (win = BrowserWindow) {
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = false

  // 主进程监听检查更新事件
  ipcMain.on('checkForUpdate', () => {
    autoUpdater.checkForUpdates()
  })

  // 主进程监听开始下载事件
  ipcMain.on('downloadUpdate', () => {
    autoUpdater.downloadUpdate()
  })

  // 主进程监听退出并安装事件
  ipcMain.on('quitAndInstall', () => {
    autoUpdater.quitAndInstall()
  })

  // 开始检测是否有更新
  autoUpdater.on('checking-for-update', () => {
    win.webContents.send('checking-for-update')
  })

  // 检测到有可用的更新
  autoUpdater.on('update-available', (info) => {
    win.webContents.send('update-available', info)
  })

  // 没有检测到有可用的更新
  autoUpdater.on('update-not-available', () => {
    win.webContents.send('update-not-available')
  })

  // 更新出错
  autoUpdater.on('update-error', err => {
    win.webContents.send('update-error', err)
  })

  // 下载更新进度
  autoUpdater.on('download-progress', (info, progress) => {
    win.webContents.send('download-progress', info, progress)
  })

  // 下载完成
  autoUpdater.on('update-downloaded', () => {
    win.webContents.send('update-downloaded')
  })
}
