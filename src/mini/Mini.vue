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
        <span class="top" @click="frameClickEvent('top')" title="置顶">
          <svg t="1595919317571" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1188" style="width:10px;height:14px"><path d="M43.072 974.72l380.864-301.952 151.936 161.6c0 0 63.424 17.28 67.328-30.72l-3.904-163.584 225.088-259.648 98.048-5.696c0 0 76.928-15.488 21.184-82.752l-275.072-276.928c0 0-74.944-9.6-69.248 59.584l0 75.008L383.552 367.104 225.856 376.64c0 0-57.728 19.2-36.608 69.248l148.16 146.176L43.072 974.72 43.072 974.72z" p-id="1189" :fill="isAlwaysOnTop ? '#555555' : '#ffffff'"></path></svg>
        </span>
        <span class="min" @click="frameClickEvent('min')" title="最小化">
          <svg t="1595917239849" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1155" style="width:8px;height:14px"><path d="M0 479.936C0 444.64 28.448 416 64.064 416L959.936 416C995.328 416 1024 444.736 1024 479.936L1024 544.064C1024 579.392 995.552 608 959.936 608L64.064 608C28.672 608 0 579.264 0 544.064L0 479.936Z" p-id="1156" fill="#ffffff"></path></svg>
        </span>
        <span class="max" @click="frameClickEvent('max')" title="最大化">
          <svg t="1595917343956" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1540" style="width:8px;height:14px"><path d="M416 416 64.064 416C28.448 416 0 444.64 0 479.936L0 544.064C0 579.264 28.672 608 64.064 608L416 608 416 959.936C416 995.552 444.64 1024 479.936 1024L544.064 1024C579.264 1024 608 995.328 608 959.936L608 608 959.936 608C995.552 608 1024 579.36 1024 544.064L1024 479.936C1024 444.736 995.328 416 959.936 416L608 416 608 64.064C608 28.448 579.36 0 544.064 0L479.936 0C444.736 0 416 28.672 416 64.064L416 416Z" p-id="1541" fill="#ffffff"></path></svg>
        </span>
        <span class="close" @click="frameClickEvent('close')" title="关闭">
          <svg t="1595917372551" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1685" style="width:8px;height:14px"><path d="M511.968 376.224 796.096 92.096C833.536 54.624 894.4 54.624 931.84 92.096 969.312 129.568 969.312 190.4 931.84 227.872L647.744 512 931.84 796.096C969.312 833.568 969.312 894.4 931.84 931.872 894.4 969.344 833.536 969.344 796.096 931.872L511.968 647.744 227.84 931.872C190.4 969.344 129.536 969.344 92.096 931.872 54.624 894.4 54.624 833.568 92.096 796.096L376.224 512 92.096 227.872C54.624 190.4 54.624 129.568 92.096 92.096 129.536 54.624 190.4 54.624 227.84 92.096L511.968 376.224Z" p-id="1686" fill="#ffffff"></path></svg>
        </span>
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
const VIDEO_DETAIL_CACHE = {}
export default {
  name: 'mini',
  data () {
    const win = remote.getCurrentWindow()
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
      progress: 0,
      isAlwaysOnTop: win.isAlwaysOnTop()
    }
  },
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
        ipcRenderer.send('win')
        return false
      }
      if (e === 'top') {
        this.isAlwaysOnTop = !this.isAlwaysOnTop
        win.setAlwaysOnTop(this.isAlwaysOnTop)
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
        this.fetchM3u8List(res).then(m3u8Arr => {
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
    fetchM3u8List (info) {
      return new Promise((resolve) => {
        const cacheKey = info.site + '@' + info.ids
        if (VIDEO_DETAIL_CACHE[cacheKey]) {
          this.name = VIDEO_DETAIL_CACHE[cacheKey].name
          resolve(VIDEO_DETAIL_CACHE[cacheKey].list)
          return
        }
        zy.detail(info.site, info.ids).then(res => {
          this.name = res.name
          const dd = res.dl.dd
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

          VIDEO_DETAIL_CACHE[cacheKey] = {
            list: m3u8Arr,
            name: res.name
          }
          resolve(m3u8Arr)
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
        this.$message.info('已是第一集.')
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
        this.$message.info('已是最后一集.')
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
        if (this.xg.fullscreen) {
          this.xg.exitFullscreen()
          this.xg.exitCssFullscreen()
        }
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
  mounted () {
    this.xg = new Hls(this.config)
    this.mtEvent()
    this.getUrls()
    const _hmt = window._hmt
    _hmt.push(['_trackEvent', 'page', 'view', 'mini'])
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
        width: 14px;
        height: 14px;
        text-align: center;
        line-height: 14px;
        border-radius: 50%;
        margin-right: 10px;
        cursor: pointer;
        opacity: 0.4;
        &.min{
          background-color: #32dc36;
        }
        &.max{
          background-color: #ffbe2a;
        }
        &.close{
          background-color: #ff5f56;
        }
        &.top{
          background-color: #f3bab7;
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
