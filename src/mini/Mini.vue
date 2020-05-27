<template>
  <div class="mini">
    <div class="top">
      <div class="left">
        <span class="number" v-show="length > 0">{{index + 1}} / {{length}}</span>
        <span class="zy-svg" @click="prevEvent" v-show="index > 0">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="backIconTitle">
            <title id="backIconTitle">上一集</title>
            <path d="M14 14.74L21 19V5l-7 4.26V5L2 12l12 7v-4.26z"></path>
          </svg>
        </span>
        <span class="zy-svg" @click="nextEvent" v-show="index < (length - 1)">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="forwardIconTitle">
            <title id="forwardIconTitle">下一集</title>
            <path d="M10 14.74L3 19V5l7 4.26V5l12 7-12 7v-4.26z"></path>
          </svg>
        </span>
        <span class="opacity">
          <input type="number" min="5" max="100" v-model="opacity" @change="opacityChange"/>
        </span>
      </div>
      <div class="right">
        <span class="min" @click="frameClickEvent('miniMin')"></span>
        <span class="close" @click="frameClickEvent('miniClose')"></span>
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
import history from '../lib/dexie/history'
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
      opacity: 100,
      video: {},
      d: {},
      index: 0,
      length: 0
    }
  },
  methods: {
    frameClickEvent (e) {
      ipc.send(e)
    },
    opacityChange (e) {
      ipc.send('miniOpacity', this.opacity / 100)
    },
    getUrls () {
      mini.find().then(res => {
        const v = res
        this.video = res
        tools.detail_get(v.site, v.detail).then(res => {
          this.d = res
          this.index = v.index
          this.length = this.d.m3u8_urls.length
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
          this.onPlayVideo()
          this.xg.on('ended', () => {
            if (this.d.m3u8_urls.length > 1 && (this.d.m3u8_urls.length - 1 > this.index)) {
              this.video.currentTime = 0
              this.video.index++
              this.index++
              let src = this.d.m3u8_urls[this.index]
              src = src.split('$')[1]
              this.xg.src = src
              this.xg.play()
            }
          })
        })
      })
    },
    onPlayVideo () {
      const h = { ...this.video }
      history.find({ detail: h.detail }).then(res => {
        if (res) {
          h.id = res.id
          history.update(res.id, h)
        } else {
          h.currentTime = ''
          delete h.id
          history.add(h)
        }
      })
      this.timerEvent(h.detail)
    },
    timerEvent (d) {
      this.timer = setInterval(() => {
        history.find({ detail: d }).then(res => {
          if (res) {
            const v = res
            v.currentTime = this.xg.currentTime
            v.index = this.index
            const id = v.id
            delete v.id
            history.update(id, v)
          }
        })
      }, 10000)
    },
    prevEvent () {
      if (this.index === 0) {
        return false
      }
      history.find({ detail: this.video.detail }).then(res => {
        const v = res
        v.index--
        const id = v.id
        delete v.id
        history.update(id, v).then(e => {
          let src = this.d.m3u8_urls[v.index]
          src = src.split('$')[1]
          this.xg.src = src
          this.index--
        })
      })
    },
    nextEvent () {
      if (this.index >= this.d.m3u8_urls.length - 1) {
        return false
      }
      history.find({ detail: this.video.detail }).then(res => {
        const v = res
        v.index++
        const id = v.id
        delete v.id
        history.update(id, v).then(e => {
          let src = this.d.m3u8_urls[v.index]
          src = src.split('$')[1]
          this.xg.src = src
          this.index++
        })
      })
    },
    playbackRateEvent (e) {
      let rate = this.xg.playbackRate
      if (rate > 0.25) {
        rate = rate + e
        this.xg.playbackRate = rate
      }
    }
  },
  created () {
    this.getUrls()
  },
  mounted () {
    this.xg = new Hls(this.config)
    ipc.on('next', () => {
      if (this.xg) {
        if (this.xg.hasStart) {
          this.nextEvent()
        }
      }
    })
    ipc.on('prev', () => {
      if (this.xg) {
        if (this.xg.hasStart) {
          this.prevEvent()
        }
      }
    })
    ipc.on('up', () => {
      if (this.opacity <= 95) {
        this.opacity = this.opacity + 5
        this.opacityChange(this.opacity)
      }
    })
    ipc.on('down', () => {
      if (this.opacity >= 10) {
        this.opacity = this.opacity - 5
        this.opacityChange(this.opacity)
      }
    })
    ipc.on('playbackRateUp', () => {
      if (this.xg) {
        if (this.xg.hasStart) {
          this.playbackRateEvent(0.25)
        }
      }
    })
    ipc.on('playbackRateDown', () => {
      if (this.xg) {
        if (this.xg.hasStart) {
          this.playbackRateEvent(-0.25)
        }
      }
    })
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
    .zy-svg{
      -webkit-app-region: no-drag;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      svg{
        width: 24px;
        height: 24px;
        stroke: #fff;
        stroke-width: 1;
        stroke-linecap: round;
        stroke-linejoin: round;
        fill: none;
      }
    }
    .left{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 100%;
      flex: 1;
      .number{
        color: #fff;
        margin: 0 10px;
        font-size: 12px;
      }
      .opacity{
        -webkit-app-region: no-drag;
        margin-left: 10px;
        input{
          text-indent: 4px;
          background-color: #000;
          color: #fff;
          border: 1px solid #aaa;
        }
      }
    }
    .right{
      width: 80px;
      height: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
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
