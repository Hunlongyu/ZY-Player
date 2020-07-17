<template>
  <div class="frame">
    <span class="min" @click="frameClickEvent('min')"></span>
    <span class="max" @click="frameClickEvent('max')"></span>
    <span class="close" @click="frameClickEvent('close')"></span>
  </div>
</template>
<script>
const { remote } = require('electron')
export default {
  name: 'frame',
  methods: {
    frameClickEvent (e) {
      const win = remote.getCurrentWindow()
      if (e === 'min') {
        win.minimize()
      }
      if (e === 'max') {
        win.isMaximized() ? win.unmaximize() : win.maximize()
      }
      if (e === 'close') {
        win.destroy()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.frame{
  width: 100%;
  height: 40px;
  display: flex;
  user-select: none;
  align-items: center;
  justify-content: flex-end;
  -webkit-app-region: drag;
  span{
    width: 14px;
    height: 14px;
    cursor: pointer;
    margin-left: 10px;
    border-radius: 50%;
    display: inline-block;
    -webkit-app-region: no-drag;
  }
}
</style>
