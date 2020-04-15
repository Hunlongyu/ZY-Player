<template>
  <div class="frame">
    <span class="min" @click="frameClickEvent('min')"></span>
    <span class="close" @click="frameClickEvent('close')"></span>
  </div>
</template>
<script>
// const ipc = require('electron').ipcRenderer
export default {
  name: 'frame',
  methods: {
    // frameClickEvent (e) {
    //   ipc.send(e)
    // }
  }
}
</script>
<style lang="scss" scoped>
.frame{
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  user-select: none;
  -webkit-app-region: drag;
  span{
    -webkit-app-region: no-drag;
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    margin-left: 10px;
    cursor: pointer;
    opacity: 0.5;
    &.min{
      background-color: #ffbe2a;
    }
    &.close{
      background-color: #ff5f56;
    }
    &:hover{
      animation: heartbeat 3s ease-in-out infinite both;
    }
    @keyframes heartbeat {
      from {
        transform: scale(1);
        transform-origin: center center;
        animation-timing-function: ease-out;
      }
      10% {
        opacity: 1;
        transform: scale(0.91);
        animation-timing-function: ease-in;
      }
      17% {
        transform: scale(0.98);
        animation-timing-function: ease-out;
      }
      33% {
        transform: scale(0.87);
        animation-timing-function: ease-in;
      }
      45% {
        transform: scale(1);
        animation-timing-function: ease-out;
      }
    }
  }
}
</style>
