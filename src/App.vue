<template>
  <div id="app" :class="appTheme">
    <Aside />
    <div class="zy-body">
      <Frame />
      <Film v-show="view === 'Film'" />
      <Play v-show="view === 'Play'" />
      <Star v-show="view === 'Star'" />
      <History v-show="view === 'History'" />
      <Setting v-show="view === 'Setting'" />
      <IPTV v-show="view === 'IPTV'" />
      <EditSites v-if="view === 'EditSites'"/>
      <Recommendation v-show="view === 'Recommendation'" />
    </div>
    <transition name="slide">
      <Detail v-if="detail.show"/>
    </transition>
    <transition name="slide">
      <Share v-if="share.show"/>
    </transition>
  </div>
</template>

<script>
import { setting } from './lib/dexie'
const { remote } = require('electron')
export default {
  name: 'App',
  data () {
    return {
      appTheme: 'theme-light',
      winSizePosition: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }
    }
  },
  created () {
    // 窗口创建口，检查是否有窗口大小位置的记录，如果有的话，更新窗口位置及大小
    setting.find().then(res => {
      if (res.restoreWindowPositionAndSize) {
        var win = remote.getCurrentWindow()
        win.setBounds({
          x: res.windowPositionAndSize.x,
          y: res.windowPositionAndSize.y,
          width: res.windowPositionAndSize.width,
          height: res.windowPositionAndSize.height
        })
        this.winSizePosition = {
          x: win.getPosition()[0],
          y: win.getPosition()[1],
          width: win.getSize()[0],
          height: win.getSize()[1]
        }
      }
    })
  },
  updated () {
    // 本来想hook up到beforedestroy， 但不工作
    // 每当窗口更新时，检查窗口大小及位置，记录到setting数据库中
    if (this.setting.restoreWindowPositionAndSize) {
      const win = remote.getCurrentWindow()
      var newWinSizePosition = {
        x: win.getPosition()[0],
        y: win.getPosition()[1],
        width: win.getSize()[0],
        height: win.getSize()[1]
      }
      if (newWinSizePosition.x !== this.winSizePosition.x ||
        newWinSizePosition.y !== this.winSizePosition.y ||
        newWinSizePosition.width !== this.winSizePosition.width ||
        newWinSizePosition.height !== this.winSizePosition.height) {
        this.winSizePosition = newWinSizePosition
        setting.find().then(res => {
          res.windowPositionAndSize = newWinSizePosition
          setting.update(res)
        })
      }
    }
  },
  computed: {
    view () {
      return this.$store.getters.getView
    },
    detail () {
      return this.$store.getters.getDetail
    },
    share () {
      return this.$store.getters.getShare
    },
    setting () {
      return this.$store.getters.getSetting
    },
    editSites () {
      return this.$store.getters.getEditSites
    },
    recommendation () {
      return this.$store.getters.recommendation
    }
  },
  watch: {
    setting: {
      handler () {
        this.changeSetting()
      },
      deep: true
    }
  },
  methods: {
    changeSetting () {
      this.appTheme = `theme-${this.setting.theme}`
    }
  }
}
</script>

<style lang="scss">
@import './assets/scss/theme.scss';
html, body, #app{
  height: 100%;
  border-radius: 0px;
}
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', SimSun, sans-serif;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .zy-body{
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    padding: 0 20px 20px;
  }
}
</style>
