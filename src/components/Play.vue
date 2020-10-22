<template>
  <div class="play">
    <div class="box">
      <div class="title">
        <span v-if="this.right.list.length > 1">『第 {{(video.info.index + 1)}} 集』</span>{{name}}
        <span v-if="video.key" class="right" @click="playWithExternalPalyerEvent" title="使用第三方播放器">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <polygon points="20 8 20 20 4 20 4 8"></polygon>
            <polyline stroke-linejoin="round" points="8 4 12 7.917 16 4"></polyline>
          </svg>
        </span>
        <span v-if="video.key" class="right" @click="issueEvent" title="复制调试信息">
          <svg t="1596338860607" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3127" width="24" height="24">
            <path d="M503.803829 63.578014c-247.050676 0-447.328072 200.277396-447.328072 447.327048 0 247.054769 200.277396 447.333188 447.328072 447.333188 247.054769 0 447.332165-200.278419 447.332165-447.333188C951.13497 263.85541 750.858598 63.578014 503.803829 63.578014L503.803829 63.578014zM503.803829 894.313336c-211.749682 0-383.408273-171.659615-383.408273-383.408273 0-211.749682 171.659615-383.40725 383.408273-383.40725 211.753775 0 383.412366 171.658591 383.412366 383.40725C887.216195 722.653721 715.557604 894.313336 503.803829 894.313336L503.803829 894.313336zM447.745069 255.897158l127.914298 0L575.659367 383.576095 447.745069 383.576095 447.745069 255.897158 447.745069 255.897158zM447.745069 425.470251l127.914298 0 0 342.058516L447.745069 767.528767 447.745069 425.470251 447.745069 425.470251zM447.745069 425.470251" p-id="3128"></path>
          </svg>
        </span>
      </div>
      <div class="player">
        <div id="xgplayer"></div>
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
        <span class="last-tip" v-if="!video.key && right.history.length > 0" @click="historyItemEvent(right.history[0])">上次播放到【{{right.history[0].site}}】{{right.history[0].name}} 第{{right.history[0].index+1}}集</span>
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
            <li v-show="right.list.length > 0" @click="exportM3u8">导出</li>
            <li v-show="right.list.length === 0">无数据</li>
            <li @click="listItemEvent(j)" :class="video.info.index === j ? 'active' : ''" v-for="(i, j) in right.list" :key="j">{{i | ftName(j)}}</li>
          </ul>
          <ul v-show="right.type === 'history'" class="list-history">
            <li v-show="right.history.length > 0" @click="clearAllHistory">清空</li>
            <li v-show="right.history.length === 0">无数据</li>
            <li @click="historyItemEvent(m)" :class="video.info.id === m.ids ? 'active' : ''" v-for="(m, n) in right.history" :key="n"><span class="title" :title="'【' + m.site + '】' + m.name + ' 第' + (m.index+1) + '集'">【{{m.site}}】{{m.name}} 第{{m.index+1}}集</span><span @click.stop="removeHistoryItem(m)" class="detail-delete">删除</span></li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { star, history, setting, shortcut, mini, iptv } from '../lib/dexie'
import zy from '../lib/site/tools'
import Player from 'xgplayer'
import Hls from 'xgplayer-hls.js'
import mt from 'mousetrap'
const { remote, ipcRenderer, clipboard } = require('electron')

const VIDEO_DETAIL_CACHE = {}

const addPlayerBtn = function (event, svg, attrs) {
  const player = this
  const util = Player.util
  const controlEl = player.controls
  const btnConfig = player.config[event]
  if (btnConfig) {
    const btnName = 'xg-btn-' + event
    const btn = util.createDom(btnName, svg || btnConfig.svg, attrs || {}, btnName)
    controlEl.appendChild(btn)
    const ev = ['click', 'touchend']
    ev.forEach(item => {
      btn.addEventListener(item, function (e) {
        e.preventDefault()
        e.stopPropagation()
        player.emit(event)
      }, false)
    })
  }
}

const addPlayerView = function (event, tpl, attrs) {
  const player = this
  const util = Player.util
  const rootEl = player.root
  const viewConfig = player.config[event]
  if (viewConfig) {
    const viewName = 'xg-view-' + event
    const view = util.createDom(viewName, tpl, attrs || {}, viewName)
    rootEl.appendChild(view)
    const ev = ['click', 'touchend']
    ev.forEach(item => {
      view.addEventListener(item, function (e) {
        e.preventDefault()
        e.stopPropagation()
        player.emit(event)
      }, false)
    })
  }
}

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
        id: 'xgplayer',
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
        playPrev: true,
        playNextOne: true,
        videoStop: true,
        showList: true,
        showHistory: true,
        videoTitle: true
      },
      state: {
        showList: false,
        showHistory: false
      },
      name: '',
      length: 0,
      timer: null,
      scroll: false,
      showNext: false,
      isStar: false,
      isTop: false,
      mini: {},
      iptvList: []
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
    },
    name () {
      const span = document.querySelector('.xg-view-videoTitle span')
      if (!span) {
        return
      }
      if (this.right.list.length > 1) {
        span.innerText = `『第 ${this.video.info.index + 1} 集』${this.name}`
      } else {
        span.innerText = `${this.name}`
      }
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
      if (this.xg && this.xg.hasStart) {
        this.xg.pause()
      }

      if (this.video.iptv) {
        // 是直播源，直接播放
        this.playUrl(this.video.iptv.url)
        this.name = this.video.iptv.name
        this.getIptvList()
        const _hmt = window._hmt
        _hmt.push(['_trackEvent', 'IPTV', 'play', this.name])
      } else {
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
      }
    },
    playUrl (url) {
      this.xg.src = url
      this.xg.play()
    },
    playVideo (index = 0, time = 0) {
      this.fetchM3u8List().then(m3u8Arr => {
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
    fetchM3u8List () {
      return new Promise((resolve) => {
        const cacheKey = this.video.key + '@' + this.video.info.id
        if (VIDEO_DETAIL_CACHE[cacheKey]) {
          this.name = VIDEO_DETAIL_CACHE[cacheKey].name
          resolve(VIDEO_DETAIL_CACHE[cacheKey].list)
          return
        }
        zy.detail(this.video.key, this.video.info.id).then(res => {
          this.name = res.name
          const _hmt = window._hmt
          _hmt.push(['_trackEvent', 'film', 'play', res.name])
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
                if (j[m].indexOf('.m3u8') >= 0 && j[m].startsWith('http')) {
                  m3u8Arr.push(j[m])
                  break
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
      this.changeVideo()
      history.find({ site: this.video.key, ids: this.video.info.id }).then(res => {
        if (res) {
          const doc = {
            site: res.site,
            ids: res.ids,
            name: res.name,
            type: res.type,
            year: res.year,
            index: this.video.info.index,
            time: res.time
          }
          history.remove(res.id)
          history.add(doc)
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
      this.updateStar()
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
      if (this.video.iptv) {
        var index = this.iptvList.findIndex(obj => obj.name === this.video.iptv.name && obj.url === this.video.iptv.url)
        if (index >= 1) {
          var channel = this.iptvList[index - 1]
          this.video.iptv = channel
          this.playUrl(channel.url)
        } else {
          this.$message.warning('这已经是第一个频道了。')
        }
      } else {
        if (this.video.info.index >= 1) {
          this.video.info.index--
          this.video.info.time = 0
        } else {
          this.$message.warning('这已经是第一集了。')
        }
      }
    },
    nextEvent () {
      if (this.video.iptv) {
        var index = this.iptvList.findIndex(obj => obj.name === this.video.iptv.name && obj.url === this.video.iptv.url)
        if (index < (this.iptvList.length - 1)) {
          var channel = this.iptvList[index + 1]
          this.video.iptv = channel
          this.playUrl(channel.url)
        } else {
          this.$message.warning('这已经是最后一个频道了。')
        }
      } else {
        if (this.video.info.index < (this.right.list.length - 1)) {
          this.video.info.index++
          this.video.info.time = 0
        } else {
          this.$message.warning('这已经是最后一集了。')
        }
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
      this.getAllhistory()
    },
    getAllhistory () {
      history.all().then(res => {
        this.right.history = res.reverse()
      })
    },
    updateStar () {
      const info = this.video.info
      star.find({ key: this.video.key, ids: info.id }).then(res => {
        if (res) {
          res.index = info.index
          star.update(res.id, res)
        }
      }).catch(() => {
        this.$message.warning('检查收藏失败')
      })
    },
    starEvent () {
      const info = this.video.info
      star.find({ key: this.video.key, ids: info.id }).then(res => {
        const doc = {
          key: this.video.key,
          ids: info.id,
          name: info.name,
          type: info.type,
          year: info.year,
          last: info.last,
          note: info.note,
          index: info.index
        }
        if (res) {
          star.update(res.id, doc)
        } else {
          star.add(doc).then(starRes => {
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
    issueEvent () {
      const info = {
        video: this.video,
        list: this.right.list,
        m3u8List: VIDEO_DETAIL_CACHE[this.video.key + '@' + this.video.info.id] || [],
        playerError: this.xg.error || '',
        playerState: this.xg.readyState || '',
        networkState: this.xg.networkState || ''
      }
      clipboard.writeText(JSON.stringify(info, null, 4))
      this.$message.success('视频信息复制成功')
    },
    playWithExternalPalyerEvent () {
      this.fetchM3u8List().then(m3u8Arr => {
        const fs = require('fs')
        var externalPlayer = this.setting.externalPlayer
        if (!externalPlayer) {
          this.$message.error('请设置第三方播放器路径')
          // 在线播放该视频
          var link = 'https://www.m3u8play.com/?play=' + m3u8Arr[this.video.info.index]
          const open = require('open')
          open(link)
        } else {
          var m3uFile = this.generateM3uFile(this.video.info.name, m3u8Arr, this.video.info.index)
          if (fs.existsSync(externalPlayer)) {
            var execFile = require('child_process').execFile
            execFile(externalPlayer, [m3uFile])
          } else {
            var exec = require('child_process').exec
            exec(externalPlayer, [m3uFile])
          }
        }
      })
    },
    generateM3uFile (fileName, m3u8Arr, startIndex) {
      const path = require('path')
      const os = require('os')
      const fs = require('fs')
      var filePath = path.join(os.tmpdir(), fileName + '.m3u')
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
      var str = '#EXTM3U' + os.EOL
      for (let ind = startIndex; ind < m3u8Arr.length; ind++) {
        str += `#EXTINF: -1, 第${ind + 1}集` + os.EOL
        str += m3u8Arr[ind] + os.EOL
      }
      str += '#EXT-X-ENDLIST' + os.EOL
      fs.writeFileSync(filePath, str)
      return filePath
    },
    checkStar () {
      star.find({ key: this.video.key, ids: this.video.info.id }).then(res => {
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
    exportM3u8 () {
      const m3u8Arr = []
      for (const i of this.right.list) {
        const j = i.split('$')
        let link, name
        if (j.length > 1) {
          for (let m = 0; m < j.length; m++) {
            if (j[m].indexOf('.m3u8') >= 0 && j[m].startsWith('http')) {
              link = j[m]
              break
            }
          }
          name = j[0]
        } else {
          name = `第${m3u8Arr.length + 1}集`
          link = j[0]
        }
        m3u8Arr.push({
          name: name,
          link: link
        })
      }
      let m3u8Content = '#EXTM3U'
      for (const item of m3u8Arr) {
        m3u8Content += `#EXTINF:-1, ${item.name}\n${item.link}`
      }
      const blob = new Blob([m3u8Content], { type: 'application/vnd.apple.mpegurl' })
      const downloadElement = document.createElement('a')
      const href = window.URL.createObjectURL(blob)
      downloadElement.href = href
      downloadElement.download = `${this.name}.m3u8`
      document.body.appendChild(downloadElement)
      downloadElement.click()
      document.body.removeChild(downloadElement)
      window.URL.revokeObjectURL(href)
    },
    clearAllHistory () {
      history.clear().then(res => {
        this.right.history = []
      })
    },
    listItemEvent (n) {
      if (this.video.iptv) {
        var channel = this.iptvList[n]
        this.video.iptv = channel
        // 是直播源，直接播放
        this.playUrl(channel.url)
      } else {
        this.video.info.time = 0
        this.video.info.index = n
        this.right.show = false
        this.right.type = ''
      }
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
          this.xg.currentTime += parseInt(this.setting.forwardTimeInSec)
        }
        return false
      }
      if (e === 'back') {
        if (this.xg && !this.xg.paused) {
          this.xg.currentTime -= parseInt(this.setting.forwardTimeInSec)
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
    },
    toggleList () {
      if (this.state.showList) {
        document.querySelector('xg-btn-showlist ul').style.display = 'none'
        this.state.showList = false
      } else {
        this.refreshList()
        document.querySelector('xg-btn-showlist ul').style.display = 'block'
        this.state.showList = true
      }
    },
    refreshList () {
      let ul = document.querySelector('xg-btn-showlist ul')
      if (!ul) {
        ul = document.createElement('ul')
        document.querySelector('xg-btn-showlist').appendChild(ul)
        ul.addEventListener('click', (ev) => {
          ev = ev || window.event
          const target = ev.target || ev.srcElement // target表示在事件冒泡中触发事件的源元素，在IE中是srcElement
          if (target.nodeName.toLowerCase() === 'li') {
            this.listItemEvent(parseInt(target.dataset.index))
          }
        })
      }
      ul.style.display = 'none'
      let li = ''
      if (this.video.iptv) {
        // 直播频道列表
        let index = 0
        this.iptvList.forEach(e => {
          if (e.name === this.video.iptv.name && e.url === this.video.iptv.url) {
            li += `<li class="selected" data-index="${index}" title="${e.name}">${e.name}</li>`
          } else {
            li += `<li data-index="${index}" title="${e.name}">${e.name}</li>`
          }
          index += 1
        })
      } else {
        if (this.right.list.length === 0) {
          li = '<li>无数据</li>'
        } else {
          for (let index = 0; index < this.right.list.length; index++) {
            const item = this.right.list[index]
            const num = item.split('$')
            let title
            if (num.length > 1) {
              title = num[0]
            } else {
              title = `第${(index + 1)}集`
            }
            if (index === this.video.info.index) {
              li += `<li class="selected" data-index="${index}" title="${title}">${title}</li>`
            } else {
              li += `<li data-index="${index}" title="${title}">${title}</li>`
            }
          }
        }
      }
      ul.innerHTML = li
    },
    toggleHistory () {
      if (this.state.showHistory) {
        document.querySelector('xg-btn-showhistory ul').style.display = 'none'
        this.state.showHistory = false
      } else {
        this.refreshHistory()
        document.querySelector('xg-btn-showhistory ul').style.display = 'block'
        this.state.showHistory = true
      }
    },
    refreshHistory () {
      this.getAllhistory()
      let ul = document.querySelector('xg-btn-showhistory ul')
      if (!ul) {
        ul = document.createElement('ul')
        document.querySelector('xg-btn-showhistory').appendChild(ul)
        ul.addEventListener('click', (ev) => {
          ev = ev || window.event
          const target = ev.target || ev.srcElement // target表示在事件冒泡中触发事件的源元素，在IE中是srcElement
          if (target.nodeName.toLowerCase() === 'li') {
            this.historyItemEvent(this.right.history[parseInt(target.dataset.index)])
          }
        })
      }
      ul.style.display = 'none'
      let li = ''
      if (this.right.history.length === 0) {
        li = '<li>无数据</li>'
      } else if (!this.video.iptv) {
        window.historyItemEvent = this.historyItemEvent.bind(this)
        for (let index = 0; index < this.right.history.length; index++) {
          const item = this.right.history[index]
          const text = `【${item.site}】${item.name} 第${item.index + 1}集`
          if (this.video.info.id === item.ids) {
            li += `<li class="selected" data-index="${index}" title="${text}">${text}</li>`
          } else {
            li += `<li data-index="${index}" title="${text}">${text}</li>`
          }
        }
      }
      ul.innerHTML = li
    },
    getIptvList () {
      iptv.all().then(res => {
        this.iptvList = res
      })
    },
    bindEvent () {
      this.xg.on('playNextOne', () => {
        this.nextEvent()
      })

      this.xg.on('playPrev', () => {
        this.prevEvent()
      })

      this.xg.on('showList', () => {
        this.toggleList()
      })

      this.xg.on('showHistory', () => {
        this.toggleHistory()
      })

      this.xg.on('videoStop', () => {
        this.videoStop()
      })

      const ev = ['click', 'touchend', 'mousemove']
      let timerID
      ev.forEach(item => {
        this.xg.root.addEventListener(item, () => {
          if (!this.xg.fullscreen) {
            return
          }
          const videoTitle = document.querySelector('.xg-view-videoTitle')
          videoTitle.style.display = 'block'
          clearTimeout(timerID)
          timerID = setTimeout(() => {
            // 播放中自动消失
            if (this.xg && !this.xg.paused) {
              videoTitle.style.display = 'none'
            }
          }, 3000)
        })
      })

      this.xg.on('exitFullscreen', () => {
        document.querySelector('.xg-view-videoTitle').style.display = 'none'
      })
    },
    videoStop () {
      if (this.xg.fullscreen) {
        this.xg.exitFullscreen()
      }
      this.xg.destroy()
      this.config.src = ''
      this.name = ''
      this.right.list = []
      this.showNext = false
      setTimeout(() => {
        this.playerInstall()
        this.xg = new Hls(this.config)
        this.bindEvent()
      }, 500)
    },
    minMaxEvent () {
      const win = remote.getCurrentWindow()
      win.on('minimize', () => {
        if (this.xg && this.xg.hasStart) {
          this.xg.pause()
        }
      })
      win.on('restore', () => {
        if (this.xg && this.config.src) {
          this.xg.play()
        }
      })
    },
    playerInstall () {
      Player.install('playPrev', function () {
        addPlayerBtn.bind(this, 'playPrev', '<svg t="1595866093990" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3657" style="width: 20px;height: 20px;margin-top: 11px;margin-left: 9px;" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M98.583851 3.180124h190.807453a31.801242 31.801242 0 0 1 31.801243 31.801242v387.021118L902.201242 10.176398l11.130435-7.632299A31.801242 31.801242 0 0 1 957.217391 31.801242v960.397516a31.801242 31.801242 0 0 1-43.885714 29.257143l-11.130435-7.632299L321.192547 601.997516V989.018634a31.801242 31.801242 0 0 1-31.801243 31.801242H98.583851a31.801242 31.801242 0 0 1-31.801242-31.801242v-954.037268a31.801242 31.801242 0 0 1 31.801242-31.801242z" p-id="3658" fill="#ffffff"></path></svg>', { title: '上一集' })()
      })
      Player.install('playNextOne', function () {
        addPlayerBtn.bind(this, 'playNextOne', '<svg t="1595866110378" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3946" style="width: 20px;height: 20px;margin-top: 11px;margin-left: 0px;" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M925.416149 3.180124h-190.807453a31.801242 31.801242 0 0 0-31.801243 31.801242v387.021118L121.798758 10.176398 110.668323 2.544099A31.801242 31.801242 0 0 0 98.583851 0a31.801242 31.801242 0 0 0-31.801242 31.801242v960.397516a31.801242 31.801242 0 0 0 31.801242 31.801242 31.801242 31.801242 0 0 0 12.084472-2.544099l11.130435-7.632299L702.807453 601.997516V989.018634a31.801242 31.801242 0 0 0 31.801243 31.801242h190.807453a31.801242 31.801242 0 0 0 31.801242-31.801242v-954.037268a31.801242 31.801242 0 0 0-31.801242-31.801242z" p-id="3947" fill="#ffffff"></path></svg>', { title: '下一集' })()
      })
      Player.install('videoStop', function () {
        addPlayerBtn.bind(this, 'videoStop', '<svg t="1603093629102" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3621" style="width: 25px;height: 25px;margin-top: 8px;margin-left: 0px;"><path d="M768 768H256V256h512v512z" p-id="3622" fill="#ffffff"></path></svg>', { title: '停止播放' })()
      })
      Player.install('showList', function () {
        addPlayerBtn.bind(this, 'showList', '<svg t="1595866128681" class="icon" viewBox="0 0 1316 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4187" style="width: 22px;height: 22px;margin-top: 9px;margin-left: 6px;" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M0 0h1316.571429v146.285714H0zM0 438.857143h1316.571429v146.285714H0zM0 877.714286h1316.571429v146.285714H0z" p-id="4188" fill="#ffffff"></path></svg>', { title: '播放列表' })()
      })
      Player.install('showHistory', function () {
        addPlayerBtn.bind(this, 'showHistory', '<svg t="1595866015473" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3282" style="width: 22px;height: 22px;margin-top: 9px;margin-left: 6px;" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M512 0a512 512 0 1 0 512 512A512 512 0 0 0 512 0z m0 910.222222a398.222222 398.222222 0 1 1 398.222222-398.222222 398.222222 398.222222 0 0 1-398.222222 398.222222z" p-id="3283" fill="#ffffff"></path><path d="M568.888889 227.555556h-113.777778v341.333333h227.555556v-113.777778h-113.777778V227.555556z" p-id="3284" fill="#ffffff"></path></svg>', { title: '播放历史' })()
      })
      const that = this
      Player.install('videoTitle', function () {
        let title
        if (that.right.list.length > 1) {
          title = `『第 ${that.video.info.index + 1} 集』${that.name}`
        } else {
          title = `${that.name}`
        }
        addPlayerView.bind(this, 'videoTitle', `<span>${title}</span>`, {})()
      })
    }
  },
  created () {
    this.getAllhistory()
    this.mtEvent()
  },
  mounted () {
    this.playerInstall()
    this.xg = new Hls(this.config)
    ipcRenderer.on('miniClosed', () => {
      history.find({ site: this.video.key, ids: this.video.info.id }).then(res => {
        if (res) {
          if (this.video.info.index !== res.index) {
            this.video.info.index = res.index
          } else {
            this.getUrls()
          }
        }
      })
    })
    this.bindEvent()
    this.minMaxEvent()
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>
<style>
.xgplayer-skin-default .xg-btn-playPrev,
.xgplayer-skin-default .xg-btn-playNextOne,
.xgplayer-skin-default .xg-btn-showList,
.xgplayer-skin-default .xg-btn-showHistory,
.xgplayer-skin-default .xg-btn-videoStop {
  width: 32px;
  position: relative;
  -webkit-order: 0;
  -moz-box-ordinal-group: 1;
  order: 0;
  display: block;
  cursor: pointer;
  margin-left: 3px;
}
.xgplayer-skin-default .xg-btn-playPrev:hover,
.xgplayer-skin-default .xg-btn-playNextOne:hover,
.xgplayer-skin-default .xg-btn-showList:hover,
.xgplayer-skin-default .xg-btn-showHistory:hover,
.xgplayer-skin-default .xg-btn-videoStop:hover {
  opacity: 0.8;
}
.xgplayer-skin-default .xg-btn-playNextOne {
  order: 2;
}
.xgplayer-skin-default .xgplayer-play, .xgplayer-skin-default .xgplayer-play-img {
  order: 1 !important;
}
.xgplayer-skin-default .xg-btn-videoStop {
  order: 2;
}
.xgplayer-skin-default .xg-btn-showList {
  order: 4;
}
.xgplayer-skin-default .xg-btn-showHistory {
  order: 4;
}
.xgplayer-skin-default .xg-btn-showList ul, .xgplayer-skin-default .xg-btn-showHistory ul {
  display: none;
  list-style: none;
  min-width: 85px;
  max-width: 300px;
  max-height: 60vh;
  overflow-y: scroll;
  background: rgba(0,0,0,.54);
  border-radius: 1px;
  position: absolute;
  bottom: 45px;
  left: 50%;
  transform: translateX(-50%);
  text-align: left;
  white-space: nowrap;
  z-index: 26;
  cursor: pointer;
}
.xgplayer-skin-default .xg-btn-showList ul li, .xgplayer-skin-default .xg-btn-showHistory ul li {
  opacity: .7;
  font-family: PingFangSC-Regular;
  font-size: 13px;
  color: hsla(0,0%,100%,.8);
  position: relative;
  padding: 5px;
  text-align: center;
}
.xgplayer-skin-default .xg-btn-showList ul li:first-child, .xgplayer-skin-default .xg-btn-showHistory ul li:first-child {
    position: relative;
    margin-top: 12px;
}
.xgplayer-skin-default .xg-btn-showList ul li:last-child, .xgplayer-skin-default .xg-btn-showHistory ul li:last-child {
    margin-bottom: 12px;
}
.xgplayer-skin-default .xg-btn-showList ul li.selected, .xgplayer-skin-default .xg-btn-showHistory ul li.selected, .xgplayer-skin-default .xg-btn-showList ul li:hover, .xgplayer-skin-default .xg-btn-showHistory ul li:hover {
  color: #fff;
  opacity: 1;
}
.xgplayer-skin-default .xgplayer-volume {
  width: 32px !important;
}
.xgplayer-skin-default .xgplayer-playbackrate {
  width: 40px !important;
}
.xgplayer-skin-default .xgplayer-playbackrate .name {
  top: 10px !important;
}
.xgplayer-skin-default .xgplayer-playbackrate ul {
  bottom: 25px;
}
.xgplayer-skin-default .xgplayer-playbackrate ul li {
  font-size: 13px !important;
}
.xgplayer-skin-default .xgplayer-screenshot .name span {
  width: 40px !important;
}
.xgplayer-skin-default .xg-view-videoTitle {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  padding-left: 10px;
  background-image: linear-gradient(180deg,rgba(0,0,0,.75),rgba(0,0,0,.75),rgba(0,0,0,.37),transparent);
  z-index: 10;
}
.xgplayer-skin-default .xg-view-videoTitle span {
  font-size: 16px;
  line-height: 40px;
  color: #ffffff;
}
</style>
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
      .right {
        float: right;
        svg {
          margin-top: 8px;
          cursor: pointer;
        }
      }
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
