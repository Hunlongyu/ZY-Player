module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        win: {
          icon: './build/icons/icon.ico'
        }
      },
      chainWebpackRendererProcess: config => {
        if (process.env.NODE_ENV === 'development') {
          config.plugins.delete('prefetch')
        }
      }
    }
  }
}
