<template>
  <div id="app" :class="appTheme">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'App',
  data () {
    return {
      appTheme: 'theme-light'
    }
  },
  computed: {
    theme () {
      return this.$store.getters.getTheme
    }
  },
  watch: {
    theme () {
      this.changeTheme()
    }
  },
  methods: {
    changeTheme () {
      this.appTheme = `theme-${this.theme}`
    }
  }
}
</script>

<style lang="scss">
@import './assets/scss/theme.scss';
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
