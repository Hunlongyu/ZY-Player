<template>
  <el-container id="app">
    <el-header class="Header">
      <i class="el-icon-minus" @click="clickFrameEvent('min')"></i>
      <i class="el-icon-plus" @click="clickFrameEvent('max')"></i>
      <i class="el-icon-close" @click="clickFrameEvent('close')"></i>
      <el-row class="Header-box">
      </el-row>
    </el-header>
    <el-container class="Body">
      <el-aside class="Aside">Aside</el-aside>
      <el-main class="Main">Main</el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import Vue from 'vue'
const { ipcRenderer: ipc } = require('electron')
export default Vue.extend({
  methods: {
    clickFrameEvent (e:string) {
      ipc.send(e)
    }
  },
  created () {
    console.log('alaa')
  }
})
</script>
<style lang="scss">
@import './assets/theme/dark.scss';
@import './assets/theme/light.scss';
html,body,#app{
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: #fff;
  .Header, .Aside, .Main{
    // border: 1px solid #000;
  }
  .Header{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    -webkit-app-region: drag;
    -webkit-user-select: none;
    i{
      font-size: 30px;
      cursor: pointer;
      -webkit-app-region: no-drag;
      margin-left: 10px;
      color: #606266;
      &:hover{
        color: #5ca4d0;
      }
    }
  }
  .Body{
    height: 100%;
  }
}
</style>
