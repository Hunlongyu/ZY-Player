<template>
  <el-container id="app" :class="appTheme">
    <el-header class="Header">
      <i class="el-icon-minus" @click="clickFrameEvent('min')"></i>
      <i class="el-icon-plus" @click="clickFrameEvent('max')"></i>
      <i class="el-icon-close" @click="clickFrameEvent('close')"></i>
      <el-row class="Header-box">
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="Aside" width="70px">
        <el-row class="top">
          <i title="浏览" :class="Main === 'Film' ? 'el-icon-film active' : 'el-icon-film'" @click="asideMenuClick('Film')"></i>
          <i title="搜索" :class="Main === 'Search' ? 'el-icon-search active' : 'el-icon-search'" @click="asideMenuClick('Search')"></i>
          <i title="播放" :class="Main === 'Player' ? 'el-icon-video-play active' : 'el-icon-video-play'" @click="asideMenuClick('Player')"></i>
          <i title="收藏" :class="Main === 'Star' ? 'el-icon-star-off active' : 'el-icon-star-off'" @click="asideMenuClick('Star')"></i>
        </el-row>
        <el-row class="bottom">
          <i title="设置" :class="Main === 'Setting' ? 'el-icon-setting active' : 'el-icon-setting'" @click="asideMenuClick('Setting')"></i>
        </el-row>
      </el-aside>
      <el-main class="Main">
        <Film v-show="Main === 'Film'" />
        <Search v-show="Main === 'Search'" />
        <Player v-show="Main === 'Player'" />
        <Star v-show="Main === 'Star'" />
        <Setting v-show="Main === 'Setting'" />
      </el-main>
    </el-container>
    <el-drawer class="drawer" :visible.sync="detail.show" :show-close="true" size="90%" :with-header="true" direction="btt" title="详情">
      <Detail />
    </el-drawer>
  </el-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Detail from '@/components/detail.vue'
import { mapMutations } from 'vuex'
const { ipcRenderer: ipc } = require('electron')
export default Vue.extend({
  data () {
    return {
      appTheme: 'theme-light'
    }
  },
  computed: {
    Main: {
      get () {
        return this.$store.getters.getMain
      },
      set (val) {
        this.SET_MAIN(val)
      }
    },
    detail: {
      get () {
        return this.$store.getters.getDetail
      },
      set (val) {
        this.SET_DETAIL(val)
      }
    },
    theme () {
      return this.$store.getters.getTheme
    }
  },
  watch: {
    theme () {
      this.changeTheme()
    }
  },
  components: {
    Detail
  },
  methods: {
    ...mapMutations(['SET_DETAIL', 'SET_MAIN']),
    clickFrameEvent (e:string) {
      ipc.send(e)
    },
    asideMenuClick (e:string) {
      this.Main = e
    },
    changeTheme () {
      this.appTheme = `theme-${this.theme}`
    }
  }
})
</script>
<style lang="scss">
@import './assets/theme/global.scss';
@import './assets/theme/dark.scss';
@import './assets/theme/light.scss';
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html,body{
  height: 100%;
}
#app{
  height: 100%;
  user-select: none;
  .Header{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    -webkit-app-region: drag;
    -webkit-user-select: none;
    padding: 0;
    i{
      width: 60px;
      height: 60px;
      font-size: 30px;
      cursor: pointer;
      -webkit-app-region: no-drag;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .Aside{
    -webkit-app-region: drag;
    -webkit-user-select: none;
    text-align: center;
    i{
      -webkit-app-region: no-drag;
      font-size: 32px;
      width: 70px;
      height: 70px;
      line-height: 70px;
      cursor: pointer;
    }
  }
  .Main{
    height: 100%;
    overflow: hidden;
  }
}
</style>
