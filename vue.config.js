module.exports = {
  pages: {
    index: 'src/main.js'
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        asarUnpack: ['node_modules/ffmpeg-static/**'],
        extraResources: [
          {
            from: process.platform === 'win32' ? 'node_modules/ffmpeg-static/ffmpeg.exe' : 'node_modules/ffmpeg-static/ffmpeg',
            to: process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg'
          }
        ],
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true
        },
        appId: 'com.hunlongyu.zy',
        copyright: 'Copyright @ 2020 Hunlongyu',
        productName: 'ZY Player',
        publish: [
          {
            provider: 'github',
            owner: 'Hunlongyu',
            repo: 'ZY-Player'
          }
        ],
        mac: {
          icon: 'build/icon/icon.icns',
          category: 'public.app-category.developer-tools',
          target: 'default',
          extendInfo: {
            LSUIElement: 1
          }
        },
        win: {
          icon: 'build/icons/icon.ico',
          target: 'nsis'
        },
        linux: {
          icon: 'build/icons/'
        },
        snap: {
          publish: ['github']
        }
      }
    }
  }
}
