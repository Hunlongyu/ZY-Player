<template>
  <div class="mini">
    <div class="top">
      <div class="left">
        <span class="title">
          <span v-if="m3u8Arr.length > 1">『第 {{(video.index + 1)}} 集』</span>{{name}}
        </span>
        <span class="zy-svg" @click="prevEvent" v-show="video.index > 0">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="backIconTitle">
            <title id="backIconTitle">上一集</title>
            <path d="M14 14.74L21 19V5l-7 4.26V5L2 12l12 7v-4.26z"></path>
          </svg>
        </span>
        <span class="zy-svg" @click="nextEvent" v-show="video.index < (m3u8Arr.length - 1)">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="forwardIconTitle">
            <title id="forwardIconTitle">下一集</title>
            <path d="M10 14.74L3 19V5l7 4.26V5l12 7-12 7v-4.26z"></path>
          </svg>
        </span>
        <span class="opacity" v-show="opacity !== 100">透明度: {{opacity}}</span>
        <span class="rate" v-show="rate !== 1">播放速率: {{rate}}</span>
        <span class="progress" v-show="progress > 0">播放进度: {{progress}}%</span>
      </div>
      <div class="right">
        <span class="min" @click="frameClickEvent('min')"></span>
        <span class="close" @click="frameClickEvent('close')"></span>
      </div>
    </div>
    <div class="bottom">
      <div id="xg"></div>
    </div>
  </div>
</template>
<script>
import zy from '../lib/site/tools'
import { history, setting, shortcut, mini } from '../lib/dexie'
import mt from 'mousetrap'
import 'xgplayer'
import Hls from 'xgplayer-hls.js'
const { remote, ipcRenderer } = require('electron')
export default {
  name: 'mini',
  data () {
    return {
      xg: null,
      config: {
        id: 'xg',
        url: '',
        lang: 'zh-cn',
        width: '100%',
        height: '100%',
        autoplay: false,
        videoInit: true,
        screenShot: true,
        keyShortcut: 'off',
        crossOrigin: true,
        cssFullscreen: true,
        defaultPlaybackRate: 1,
        playbackRate: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4, 5],
        controls: false
      },
      opacity: 100,
      name: '',
      video: {},
      detail: {},
      m3u8Arr: [],
      rate: 1,
      progress: 0
    }
  },
  methods: {
    frameClickEvent (e) {
      if (e === 'min') {
        const win = remote.getCurrentWindow()
        win.minimize()
        return false
      }
      if (e === 'close') {
        ipcRenderer.send('win')
        return false
      }
    },
    opacityChange (val) {
      const win = remote.getCurrentWindow()
      const num = val / 100
      win.setOpacity(num)
      return false
    },
    getUrls () {
      mini.find().then(res => {
        this.video = res
        zy.detail(res.site, res.ids).then(e => {
          this.name = e.name
          this.detail = e
          const dd = e.dl.dd
          const type = Object.prototype.toString.call(dd)
          let m3u8Txt = []
          if (type === '[object Array]') {
            for (const i of dd) {
              if (i._t.indexOf('m3u8') >= 0) {
                m3u8Txt = i._t.split('#')
              }
            }
          } else {
            m3u8Txt = dd._t.split('#')
          }
          const m3u8Arr = []
          for (const i of m3u8Txt) {
            const j = i.split('$')
            if (j.length > 1) {
              for (let m = 0; m < j.length; m++) {
                if (j[m].indexOf('m3u8') >= 0) {
                  m3u8Arr.push(j[m])
                }
              }
            } else {
              m3u8Arr.push(j[0])
            }
          }
          this.m3u8Arr = m3u8Arr
          this.xg.src = m3u8Arr[res.index]
          if (res.time !== 0 || res.time !== '') {
            this.xg.play()
            this.xg.once('playing', () => {
              this.xg.currentTime = res.time
            })
          } else {
            this.xg.play()
          }
          this.videoPlaying()
          this.xg.once('ended', () => {
            if (m3u8Arr.length > 1 && (m3u8Arr.length - 1 > res.index)) {
              this.video.time = 0
              this.video.index++
              this.xg.src = m3u8Arr[this.video.index]
              this.xg.play()
            }
          })
        })
      })
    },
    videoPlaying () {
      history.find({ site: this.video.site, ids: this.video.ids }).then(res => {
        if (res) {
          res.index = this.video.index
          history.update(res.id, res)
        } else {
          const doc = {
            site: this.video.site,
            ids: this.video.ids,
            name: this.video.name,
            index: this.video.index,
            time: 0
          }
          history.add(doc)
        }
      })
      this.timerEvent()
    },
    timerEvent () {
      this.timer = setInterval(() => {
        const endTime = this.xg.duration
        const currentTime = this.xg.currentTime
        const progress = (currentTime / endTime) * 100
        this.progress = progress.toFixed(2)
        history.find({ site: this.video.site, ids: this.video.ids }).then(res => {
          if (res) {
            const v = res
            v.time = this.xg.currentTime
            v.index = this.video.index
            const id = v.id
            delete v.id
            history.update(id, v)
          }
        })
      }, 10000)
    },
    prevEvent () {
      if (this.video.index === 0) {
        return false
      }
      history.find({ site: this.video.site, ids: this.video.ids }).then(res => {
        const v = res
        const id = v.id
        v.index--
        delete v.id
        history.update(id, v).then(e => {
          this.xg.src = this.m3u8Arr[v.index]
          this.video.index--
        })
      })
    },
    nextEvent () {
      if (this.video.index >= this.m3u8Arr.length - 1) {
        return false
      }
      history.find({ site: this.video.site, ids: this.video.ids }).then(res => {
        const v = res
        v.index++
        const id = v.id
        delete v.id
        history.update(id, v).then(e => {
          this.xg.src = this.m3u8Arr[v.index]
          this.video.index++
        })
      })
    },
    playbackRateEvent (e) {
      let rate = this.xg.playbackRate
      if (rate > 0.25) {
        rate = rate + e
        this.xg.playbackRate = rate
      }
    },
    mtEvent () {
      setting.find().then(res => {
        if (res.shortcut) {
          shortcut.all().then(res => {
            for (const i of res) {
              mt.bind(i.key, () => {
                this.shortcutEvent(i.name)
              })
            }
          })
        }
      })
    },
    shortcutEvent (e) {
      if (e === 'playAndPause') {
        if (this.xg) {
          if (this.xg.paused) {
            this.xg.play()
          } else {
            this.xg.pause()
          }
        }
        return false
      }
      if (e === 'forward') {
        if (this.xg && !this.xg.paused) {
          this.xg.currentTime += 5
        }
        return false
      }
      if (e === 'back') {
        if (this.xg && !this.xg.paused) {
          this.xg.currentTime -= 5
        }
        return false
      }
      if (e === 'volumeUp') {
        if (this.xg && this.xg.volume < 0.9) {
          this.xg.volume += 0.1
        }
        return false
      }
      if (e === 'volumeDown') {
        if (this.xg && this.xg.volume > 0.2) {
          this.xg.volume -= 0.1
        }
        return false
      }
      if (e === 'mute') {
        if (this.xg) {
          this.xg.volume = 0
        }
        return false
      }
      if (e === 'top') {
        const win = remote.getCurrentWindow()
        if (win.isAlwaysOnTop()) {
          win.setAlwaysOnTop(false)
        } else {
          win.setAlwaysOnTop(true)
        }
        return false
      }
      if (e === 'fullscreen') {
        if (this.xg.fullscreen) {
          this.xg.exitFullscreen()
        } else {
          this.xg.getFullscreen(this.xg.root)
        }
        return false
      }
      if (e === 'escape') {
        this.xg.exitFullscreen()
        this.xg.exitCssFullscreen()
        return false
      }
      if (e === 'next') {
        this.nextEvent()
        return false
      }
      if (e === 'prev') {
        this.prevEvent()
        return false
      }
      if (e === 'home') {
        if (this.xg && !this.xg.paused) {
          this.xg.currentTime = 0
        }
        return false
      }
      if (e === 'end') {
        if (this.xg && !this.xg.paused) {
          const endTime = this.xg.duration
          this.xg.currentTime = endTime
        }
        return false
      }
      if (e === 'opacityUp') {
        const win = remote.getCurrentWindow()
        if (this.opacity >= 10) {
          this.opacity -= 5
          const num = this.opacity / 100
          win.setOpacity(num)
        }
        return false
      }
      if (e === 'opacityDown') {
        const win = remote.getCurrentWindow()
        if (this.opacity <= 95) {
          this.opacity += 5
          const num = this.opacity / 100
          win.setOpacity(num)
        }
        return false
      }
      if (e === 'playbackRateUp') {
        if (this.xg && !this.xg.paused) {
          const rate = this.xg.playbackRate
          this.xg.playbackRate = rate + 0.25
          this.rate = this.xg.playbackRate
        }
        return false
      }
      if (e === 'playbackRateDown') {
        if (this.xg && !this.xg.paused) {
          const rate = this.xg.playbackRate
          if (rate > 0.25) {
            this.xg.playbackRate = rate - 0.25
            this.rate = this.xg.playbackRate
          }
        }
        return false
      }
      if (e === 'mini') {
        ipcRenderer.send('win')
        return false
      }
    }
  },
  created () {
    this.getUrls()
    this.mtEvent()
  },
  mounted () {
    this.xg = new Hls(this.config)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>
<style lang="scss">
html,body{
  padding: 1px;
  margin: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #000;
}
.mini{
  -webkit-app-region: drag;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  .top{
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
        stroke: #888;
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
      .title, .opacity, .rate, .progress{
        color: #888;
        font-size: 12px;
        margin: 0 10px;
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
        opacity: 0.4;
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
    flex: 1;
    .xgplayer-start{
      -webkit-app-region: no-drag;
    }
  }
}
</style>
