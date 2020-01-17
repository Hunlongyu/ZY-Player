<template>
  <el-container id="app" class="theme-light">
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
          <i :class="Main === 'Film' ? 'el-icon-film active' : 'el-icon-film'" @click="asideMenuClick('Film')"></i>
          <i :class="Main === 'Search' ? 'el-icon-search active' : 'el-icon-search'" @click="asideMenuClick('Search')"></i>
          <i :class="Main === 'Player' ? 'el-icon-video-play active' : 'el-icon-video-play'" @click="asideMenuClick('Player')"></i>
          <i :class="Main === 'Star' ? 'el-icon-star-off active' : 'el-icon-star-off'" @click="asideMenuClick('Star')"></i>
        </el-row>
        <el-row class="bottom">
          <i :class="Main === 'Setting' ? 'el-icon-setting active' : 'el-icon-setting'" @click="asideMenuClick('Setting')"></i>
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
    <el-drawer :visible.sync="drawer" :show-close="true" size="80%" :with-header="false" direction="btt">
      <Detail />
    </el-drawer>
  </el-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Detail from '@/components/detail.vue'
const { ipcRenderer: ipc } = require('electron')
export default Vue.extend({
  data () {
    return {
      Main: 'Setting',
      drawer: false
    }
  },
  components: {
    Detail
  },
  methods: {
    clickFrameEvent (e:string) {
      ipc.send(e)
    },
    asideMenuClick (e:string) {
      this.Main = e
    }
  },
  created () {}
})
</script>
<style lang="scss">
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
