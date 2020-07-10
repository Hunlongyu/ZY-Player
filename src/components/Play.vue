<template>
  <div class="play">
    <div class="box">
      <div class="title">
        <span v-if="this.right.list.length > 1">『第 {{(video.info.index + 1)}} 集』</span>{{name}}
      </div>
      <div class="player">
        <div id="xg"></div>
      </div>
      <div class="more">
        <span class="zy-svg" @click="nextEvent" v-show="showNext">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="forwardIconTitle">
            <title id="forwardIconTitle">下一集</title>
            <path d="M10 14.74L3 19V5l7 4.26V5l12 7-12 7v-4.26z"></path>
          </svg>
        </span>
        <span class="zy-svg" @click="listEvent" :class="right.type === 'list' ? 'active' : ''" v-show="right.list.length > 0">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="dashboardIconTitle">
            <title id="dashboardIconTitle">播放列表</title>
            <rect width="20" height="20" x="2" y="2"></rect>
            <path d="M11 7L17 7M11 12L17 12M11 17L17 17"></path>
            <line x1="7" y1="7" x2="7" y2="7"></line>
            <line x1="7" y1="12" x2="7" y2="12"></line>
            <line x1="7" y1="17" x2="7" y2="17"></line>
          </svg>
        </span>
        <span class="zy-svg" @click="historyEvent" :class="right.type === 'history' ? 'active' : ''">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="timeIconTitle">
            <title id="timeIconTitle">历史记录</title>
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 5 12 12 16 16"></polyline>
          </svg>
        </span>
        <span class="zy-svg" @click="starEvent" :class="isStar ? 'active' : ''" v-show="right.list.length > 0">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="favouriteIconTitle">
            <title id="favouriteIconTitle">收藏</title>
            <path d="M12,21 L10.55,19.7051771 C5.4,15.1242507 2,12.1029973 2,8.39509537 C2,5.37384196 4.42,3 7.5,3 C9.24,3 10.91,3.79455041 12,5.05013624 C13.09,3.79455041 14.76,3 16.5,3 C19.58,3 22,5.37384196 22,8.39509537 C22,12.1029973 18.6,15.1242507 13.45,19.7149864 L12,21 Z"></path>
          </svg>
        </span>
        <span class="zy-svg" @click="detailEvent" v-show="right.list.length > 0">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="feedIconTitle">
            <title id="feedIconTitle">详情</title>
            <circle cx="7.5" cy="7.5" r="2.5"></circle>
            <path d="M22 13H2"></path>
            <path d="M18 6h-5m5 3h-5"></path>
            <path d="M5 2h14a3 3 0 0 1 3 3v17H2V5a3 3 0 0 1 3-3z"></path>
          </svg>
        </span>
        <span class="zy-svg" @click="miniEvent" v-show="right.list.length > 0">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="tvIconTitle">
            <title id="tvIconTitle">精简模式</title>
            <polygon points="20 8 20 20 4 20 4 8"></polygon>
            <polyline stroke-linejoin="round" points="8 4 12 7.917 16 4"></polyline>
          </svg>
        </span>
        <span class="zy-svg" @click="shareEvent" v-show="right.list.length > 0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-labelledby="qrIconTitle">
            <title id="qrIconTitle">分享</title>
            <rect x="10" y="3" width="7" height="7" transform="rotate(90 10 3)"></rect>
            <rect width="1" height="1" transform="matrix(-1 0 0 1 7 6)"></rect>
            <rect x="10" y="14" width="7" height="7" transform="rotate(90 10 14)"></rect>
            <rect x="6" y="17" width="1" height="1"></rect>
            <rect x="14" y="20" width="1" height="1"></rect>
            <rect x="17" y="17" width="1" height="1"></rect>
            <rect x="14" y="14" width="1" height="1"></rect>
            <rect x="20" y="17" width="1" height="1"></rect>
            <rect x="20" y="14" width="1" height="1"></rect>
            <rect x="20" y="20" width="1" height="1"></rect>
            <rect x="21" y="3" width="7" height="7" transform="rotate(90 21 3)"></rect>
            <rect x="17" y="6" width="1" height="1"></rect>
          </svg>
        </span>
      </div>
    </div>
    <transition name="slideX">
      <div v-if="right.show" class="list">
        <div class="list-top">
          <span class="list-top-title">{{ right.type === 'list' ? '播放列表' : '历史记录' }}</span>
          <span class="list-top-close zy-svg" @click="closeListEvent">
            <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="closeIconTitle">
              <title id="closeIconTitle">关闭</title>
              <path d="M6.34314575 6.34314575L17.6568542 17.6568542M6.34314575 17.6568542L17.6568542 6.34314575"></path>
            </svg>
          </span>
        </div>
        <div class="list-body zy-scroll" :style="{overflowY:scroll? 'auto' : 'hidden',paddingRight: scroll ? '0': '5px' }" @mouseenter="scroll = true" @mouseleave="scroll = false">
          <ul v-show="right.type === 'list'" class="list-item">
            <li v-show="right.list.length === 0">无数据</li>
            <li @click="listItemEvent(j)" :class="video.info.index === j ? 'active' : ''" v-for="(i, j) in right.list" :key="j">{{i | ftName(j)}}</li>
          </ul>
          <ul v-show="right.type === 'history'" class="list-history">
            <li v-show="right.history.length > 1" @click="clearAllHistory">清空</li>
            <li v-show="right.history.length === 0">无数据</li>
            <li @click="historyItemEvent(m)" :class="video.info.id === m.ids ? 'active' : ''" v-for="(m, n) in right.history" :key="n"><span class="title">{{m.name}}</span><span @click.stop="removeHistoryItem(m)" class="detail-delete">删除</span></li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { star, history, setting, shortcut, mini } from '../lib/dexie'
import zy from '../lib/site/tools'
import 'xgplayer'
import Hls from 'xgplayer-hls.js'
import mt from 'mousetrap'
const { remote, ipcRenderer } = require('electron')
export default {
  name: 'play',
  data () {
    return {
      xg: null,
      right: {
        show: false,
        type: '',
        list: [],
        history: []
      },
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
        playbackRate: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4, 5]
      },
      name: '',
      length: 0,
      timer: null,
      scroll: false,
      showNext: false,
      isStar: false,
      isTop: false,
      mini: {}
    }
  },
  filters: {
    ftName (e, n) {
      const num = e.split('$')
      if (num.length > 1) {
        return e.split('$')[0]
      } else {
        return `第${(n + 1)}集`
      }
    }
  },
  computed: {
    view: {
      get () {
        return this.$store.getters.getView
      },
      set (val) {
        this.SET_VIEW(val)
      }
    },
    video: {
      get () {
        return this.$store.getters.getVideo
      },
      set (val) {
        this.SET_VIDEO(val)
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
    share: {
      get () {
        return this.$store.getters.getShare
      },
      set (val) {
        this.SET_SHARE(val)
      }
    },
    setting () {
      return this.$store.getters.getSetting
    }
  },
  watch: {
    view () {
      this.right.show = false
      this.right.type = ''
    },
    video: {
      handler () {
        this.getUrls()
      },
      deep: true
    },
    setting: {
      handler () {
        this.changeSetting()
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations(['SET_VIEW', 'SET_DETAIL', 'SET_VIDEO', 'SET_SHARE']),
    getUrls () {
      this.name = ''
      if (this.timer !== null) {
        clearInterval(this.timer)
        this.timer = null
      }
      if (this.xg) {
        if (this.xg.hasStart) {
          this.xg.pause()
        }
      }

      const index = this.video.info.index | 0
      let time = 0

      history.find({ site: this.video.key, ids: this.video.info.id }).then(res => {
        if (res) {
          if (res.index === index) {
            time = res.time
          }
        }
        this.playVideo(index, time)
      })
    },
    playVideo (index = 0, time = 0) {
      const id = this.video.info.id
      zy.detail(this.video.key, id).then(res => {
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
        this.right.list = m3u8Txt
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

        this.xg.src = m3u8Arr[index]
        this.showNext = m3u8Arr.length > 1

        if (time !== 0) {
          this.xg.play()
          this.xg.once('playing', () => {
            this.xg.currentTime = time
          })
        } else {
          this.xg.play()
        }

        this.videoPlaying()
        this.xg.once('ended', () => {
          if (m3u8Arr.length > 1 && (m3u8Arr.length - 1 > index)) {
            this.video.info.time = 0
            this.video.info.index++
          }
          this.xg.off('ended')
        })
      })
    },
    videoPlaying () {
      this.changeVideo()
      history.find({ site: this.video.key, ids: this.video.info.id }).then(res => {
        if (res) {
          const doc = {
            id: res.id,
            site: res.site,
            ids: res.ids,
            name: res.name,
            type: res.type,
            year: res.year,
            index: this.video.info.index,
            time: res.time
          }
          history.update(res.id, doc)
        } else {
          const doc = {
            site: this.video.key,
            ids: this.video.info.id,
            name: this.video.info.name,
            type: this.video.info.type,
            year: this.video.info.year,
            index: this.video.info.index,
            time: ''
          }
          history.add(doc)
        }
      })
      this.timerEvent()
    },
    changeVideo () {
      this.checkStar()
      this.checkTop()
    },
    timerEvent () {
      this.timer = setInterval(() => {
        history.find({ site: this.video.key, ids: this.video.info.id }).then(res => {
          if (res) {
            const doc = { ...res }
            doc.time = this.xg.currentTime
            delete doc.id
            history.update(res.id, doc)
          }
        })
      }, 10000)
    },
    prevEvent () {
      if (this.video.info.index >= 1) {
        this.video.info.index--
        this.video.info.time = 0
      } else {
        this.$message.warning('这已经是第一集了。')
      }
    },
    nextEvent () {
      if (this.video.info.index < (this.right.list.length - 1)) {
        this.video.info.index++
        this.video.info.time = 0
      } else {
        this.$message.warning('这已经是最后一集了。')
      }
    },
    listEvent () {
      if (this.right.type === 'list') {
        this.right.show = false
        this.right.type = ''
      } else {
        this.right.show = true
        this.right.type = 'list'
      }
    },
    historyEvent () {
      if (this.right.type === 'history') {
        this.right.show = false
        this.right.type = ''
      } else {
        this.right.show = true
        this.right.type = 'history'
      }
      history.all().then(res => {
        this.right.history = res.reverse()
      })
    },
    getAllhistory () {
      history.all().then(res => {
        this.right.history = res.reverse()
      })
    },
    starEvent () {
      const info = this.video.info
      star.find({ site: this.video.key, ids: info.id }).then(res => {
        if (res) {
          star.remove(res.id).then(e => {
            this.$message.info('取消收藏')
            this.isStar = false
          })
        } else {
          const docs = {
            site: this.video.key,
            ids: info.id,
            name: info.name,
            type: info.type,
            year: info.year,
            last: info.last
          }
          star.add(docs).then(res => {
            this.$message.success('收藏成功')
            this.isStar = true
          })
        }
      }).catch(() => {
        this.$message.warning('检查收藏失败')
      })
    },
    detailEvent () {
      this.detail = {
        show: true,
        key: this.video.key,
        info: this.video.info
      }
    },
    miniEvent () {
      if (this.xg) {
        this.xg.pause()
      }
      mini.find().then(res => {
        const doc = {
          id: 0,
          site: this.video.key,
          ids: this.video.info.id,
          name: this.video.info.name,
          index: this.video.info.index,
          time: this.xg.currentTime
        }
        if (res) {
          mini.update(doc)
        } else {
          mini.add(doc)
        }
        this.mini = doc
        clearInterval(this.timer)
        const win = remote.getCurrentWindow()
        win.hide()
        ipcRenderer.send('mini')
      })
    },
    shareEvent () {
      this.share = {
        show: true,
        key: this.video.key,
        info: this.video.info
      }
    },
    checkStar () {
      star.find({ site: this.video.key, ids: this.video.info.id }).then(res => {
        if (res) {
          this.isStar = true
        } else {
          this.isStar = false
        }
      })
    },
    checkTop () {
      const win = remote.getCurrentWindow()
      this.isTop = win.isAlwaysOnTop()
    },
    closeListEvent () {
      this.right.show = false
      this.right.type = ''
    },
    clearAllHistory () {
      history.clear().then(res => {
        this.right.history = []
      })
    },
    listItemEvent (n) {
      this.video.info.time = 0
      this.video.info.index = n
      this.right.show = false
      this.right.type = ''
    },
    historyItemEvent (e) {
      this.video = {
        key: e.site,
        info: {
          id: e.ids,
          name: e.name,
          type: e.type,
          year: e.year,
          index: e.index,
          time: e.time
        }
      }
      this.right.show = false
      this.right.type = ''
    },
    removeHistoryItem (e) {
      history.remove(e.id).then(res => {
        this.$message.success('删除历史记录成功~')
        this.getAllhistory()
      }).catch(err => {
        this.$message.warning('删除历史记录失败, 错误信息: ' + err)
      })
    },
    mtEvent () {
      setting.find().then(res => {
        if (res.shortcut) {
          shortcut.all().then(res => {
            for (const i of res) {
              mt.bind(i.key, () => {
                if (this.view === 'Play') {
                  this.shortcutEvent(i.name)
                }
              })
            }
          })
        } else {
          shortcut.all().then(res => {
            for (const i of res) {
              mt.unbind(i.key)
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
        const num = win.getOpacity()
        if (num > 0.1) {
          win.setOpacity(num - 0.1)
        }
        return false
      }
      if (e === 'opacityDown') {
        const win = remote.getCurrentWindow()
        const num = win.getOpacity()
        if (num < 1) {
          win.setOpacity(num + 0.1)
        }
        return false
      }
      if (e === 'playbackRateUp') {
        if (this.xg && !this.xg.paused) {
          const rate = this.xg.playbackRate
          this.xg.playbackRate = rate + 0.25
          this.$message.info('当前播放速度为: ' + this.xg.playbackRate)
        }
        return false
      }
      if (e === 'playbackRateDown') {
        if (this.xg && !this.xg.paused) {
          const rate = this.xg.playbackRate
          if (rate > 0.25) {
            this.xg.playbackRate = rate - 0.25
            this.$message.info('当前播放速度为: ' + this.xg.playbackRate)
          }
        }
        return false
      }
      if (e === 'mini') {
        this.miniEvent()
        return false
      }
    },
    changeSetting () {
      this.mtEvent()
    }
  },
  created () {
    this.getAllhistory()
    this.mtEvent()
  },
  mounted () {
    this.xg = new Hls(this.config)
    ipcRenderer.on('miniClosed', () => {
      this.xg.destroy()
      this.xg = new Hls(this.config)
      this.getUrls()
    })
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>
<style lang="scss" scoped>
.play{
  position: relative;
  height: calc(100% - 40px);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  .box{
    width: 100%;
    height: 100%;
    display: flex;
    border-radius: 5px;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .title{
      width: 100%;
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
    }
    .player{
      width: 100%;
      flex: 1;
      padding: 0 10px;
      overflow: hidden;
    }
    .more{
      width: 100%;
      height: 50px;
      min-height: 50px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 0 10px;
      span{
        display: flex;
        margin-right: 10px;
        cursor: pointer;
      }
    }
  }
  .list{
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
    height: 100%;
    z-index: 555;
    border-radius: 3px;
    padding: 6px;
    display: flex;
    flex-direction: column;
    .list-top{
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 30px;
      .list-top-title{
        font-size: 16px;
      }
      .list-top-close{
        display: inline-block;
        cursor: pointer;
      }
    }
    .list-body{
      flex: 1;
      overflow-y: auto;
      ul{
        margin: 0;
        padding: 0;
        list-style: none;
        li{
          position: relative;
          height: 28px;
          width: 100%;
          line-height: 28px;
          padding-left: 10px;
          font-size: 14px;
          cursor: pointer;
          .title{
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 231px;
          }
          .detail-delete{
            display: none;
            position: absolute;
            right: 0;
            height: 28px;
            width: 50px;
            text-align: center;
          }
        }
      }
    }
  }
  .slideX-enter-active, .slideX-leave-active{
    transition: all .5s ease-in-out;
  }
  .slideX-enter, .slideX-leave-to{
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>
