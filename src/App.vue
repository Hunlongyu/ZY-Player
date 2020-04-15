<template>
  <div id="app" class="theme-light">
    <router-view/>
  </div>
</template>

<style lang="scss">
html, body, #app{
  height: 100%;
  border-radius: 6px;
}
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', SimSun, sans-serif;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
  overflow: hidden;
}
</style>
