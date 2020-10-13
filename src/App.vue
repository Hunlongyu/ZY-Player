<template>
  <div id="app" class="theme-light">
    <Frame />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
@import './assets/scss/theme.scss';
html, body, #app{
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
}
#app{
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', SimSun, sans-serif;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
}
</style>
