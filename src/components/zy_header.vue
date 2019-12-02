<template>
  <Row class="header-box">
    <Icon type="md-remove" @click="clickFrameEvent('min')" />
    <Icon type="md-add" @click="clickFrameEvent('max')" />
    <Icon type="md-close" @click="clickFrameEvent('close')" />
  </Row>
</template>
<script>
const { ipcRenderer: ipc } = require('electron')
export default {
  name: 'zy_header',
  methods: {
    clickFrameEvent (e) {
      ipc.send(e)
    }
  }
}
</script>
<style lang="scss" scoped>
.header-box{
  height: 100%;
  -webkit-app-region: drag;
  -webkit-user-select: none;
  display: flex;
  justify-content: flex-end;
  i{
    font-size: 20px;
    width:50px;
    height:50px;
    line-height:50px;
    cursor: pointer;
    -webkit-app-region: no-drag;
  }
}
</style>
