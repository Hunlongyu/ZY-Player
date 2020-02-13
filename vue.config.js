module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        win: {
          icon: './build/icons/icon.ico',
          target: [
            {
              target: 'nsis',
              arch: [
                'ia32',
                'x64'
              ]
            }
          ]
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
