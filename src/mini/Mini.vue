<template>
  <div class="mini">
    <div class="top">
      <div class="left">
        <span class="opacity">
          <input type="range" min="5" max="100" v-model="opacity" @change="opacityChange"/>
        </span>
      </div>
      <div class="right">
        <span class="min" @click="frameClickEvent('mini-min')"></span>
        <span class="close" @click="frameClickEvent('mini-close')"></span>
      </div>
    </div>
    <div class="bottom">
      <div id="xg"></div>
    </div>
  </div>
</template>
<script>
import tools from '../lib/site/tools'
import mini from '../lib/dexie/mini'
import 'xgplayer'
import Hls from 'xgplayer-hls.js'
const ipc = require('electron').ipcRenderer
export default {
  name: 'mini',
  data () {
    return {
      xg: null,
      config: {
        id: 'xg',
        lang: 'zh-cn',
        url: '',
        fluid: true,
        autoplay: false,
        videoInit: true,
        screenShot: true,
        keyShortcut: 'on',
        crossOrigin: true,
        defaultPlaybackRate: 1,
        playbackRate: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4, 5]
      },
      opacity: 100
    }
  },
  methods: {
    frameClickEvent (e) {
      ipc.send(e)
    },
    opacityChange (e) {
      ipc.send('mini-opacity', this.opacity / 100)
    },
    getUrls () {
      mini.find().then(res => {
        const v = res
        tools.detail_get(v.site, v.detail).then(res => {
          const link = res.m3u8_urls[v.index]
          const src = link.split('$')[1]
          this.xg.src = src
          const currentTime = v.currentTime
          if (currentTime !== '') {
            this.xg.play()
            this.xg.once('playing', () => {
              this.xg.currentTime = currentTime
            })
          } else {
            this.xg.play()
          }
        })
      })
    }
  },
  created () {
    this.getUrls()
  },
  mounted () {
    this.xg = new Hls(this.config)
  }
}
</script>
<style lang="scss">
html,body{
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #000;
}
.mini{
  box-sizing: border-box;
  .top{
    -webkit-app-region: drag;
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    .left, .right{
      width: 50%;
    }
    .left{
      .opacity{
        -webkit-app-region: no-drag;
        margin-left: 10px;
      }
    }
    .right{
      text-align: right;
      span{
        -webkit-app-region: no-drag;
        display: inline-block;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        margin-right: 10px;
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
  }
  .bottom{
    width: 100%;
    height: 305px;
  }
}
</style>
