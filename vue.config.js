module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        win: {
          icon: './build/icons/icon.ico',
          target: [
            'nsis','portable', 'zip', 'msi'
          ]
        },
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true
        },
        productName: 'ZY Player',
        publish: [{
          'provider': 'github',
          'owner': 'Hunlongyu',
          'repo': 'ZY-Player'
        }]
      },
      chainWebpackRendererProcess: config => {
        if (process.env.NODE_ENV === 'development') {
          config.plugins.delete('prefetch')
        }
      }
    }
  }
}
