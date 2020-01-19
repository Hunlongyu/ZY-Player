module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {},
      chainWebpackRendererProcess: config => {
        if (process.env.NODE_ENV === 'development') {
          config.plugins.delete('prefetch')
        }
      }
    }
  }
}
