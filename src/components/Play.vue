<template>
  <div class="play">
    <div class="box">
      <div class="title">
        <span v-if="this.right.list.length > 1">『第 {{(video.info.index + 1)}} 集』</span>{{name}}
      </div>
      <div class="player">
        <div id="xgplayer"></div>
      </div>
      <div class="more" v-if="!video.iptv" :key="Boolean(video.iptv)">
        <span class="zy-svg" @click="otherEvent" v-show="name !== ''">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="coloursIconTitle">
            <title id="coloursIconTitle">换源</title>
            <circle cx="12" cy="9" r="5"></circle>
            <circle cx="9" cy="14" r="5"></circle>
            <circle cx="15" cy="14" r="5"></circle>
          </svg>
        </span>
        <span class="zy-svg" @click="nextEvent" v-show="right.list.length > 1">
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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-labelledby="diamondIconTitle">
            <title id="diamondIconTitle">精简模式</title>
            <path d="M12 20L3 11M12 20L21 11M12 20L8 11M12 20L16 11M3 11L7 5M3 11H8M7 5L8 11M7 5H12M17 5L21 11M17 5L16 11M17 5H12M21 11H16M8 11H16M8 11L12 5M16 11L12 5"></path>
          </svg>
        </span>
        <span class="zy-svg" @click="playWithExternalPalyerEvent" v-show="right.list.length > 0">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="tvIconTitle">
            <title id="tvIconTitle" >使用第三方播放器</title>
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
        <span class="zy-svg" @click="showShortcutEvent" v-show="right.list.length > 0">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="sendIconTitle">
            <title id="sendIconTitle">快捷键指南</title>
            <polygon points="21.368 12.001 3 21.609 3 14 11 12 3 9.794 3 2.394"></polygon>
          </svg>
        </span>
        <span class="zy-svg" @click="issueEvent" v-show="right.list.length > 0">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="infoIconTitle">
            <title id="infoIconTitle">复制调试信息</title>
            <path d="M12,12 L12,15"></path>
            <line x1="12" y1="9" x2="12" y2="9"></line>
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
        </span>
        <span class="last-tip" v-if="!video.key && right.history.length > 0" @click="historyItemEvent(right.history[0])">上次播放到【{{right.history[0].site}}】{{right.history[0].name}} 第{{right.history[0].index+1}}集</span>
      </div>
      <div class="more" v-if="video.iptv" :key="Boolean(video.iptv)">
        <span class="zy-svg" @click="channelListShow = !channelListShow">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="dashboardIconTitle">
            <title id="dashboardIconTitle">频道列表</title>
            <rect width="20" height="20" x="2" y="2"></rect>
            <path d="M11 7L17 7M11 12L17 12M11 17L17 17"></path>
            <line x1="7" y1="7" x2="7" y2="7"></line>
            <line x1="7" y1="12" x2="7" y2="12"></line>
            <line x1="7" y1="17" x2="7" y2="17"></line>
          </svg>
        </span>
        <span class="zy-svg" @click="otherEvent">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="coloursIconTitle">
            <title id="coloursIconTitle">换源</title>
            <circle cx="12" cy="9" r="5"></circle>
            <circle cx="9" cy="14" r="5"></circle>
            <circle cx="15" cy="14" r="5"></circle>
          </svg>
        </span>
        <span class="zy-svg" @click="miniEvent">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-labelledby="diamondIconTitle">
            <title id="diamondIconTitle">精简模式</title>
            <path d="M12 20L3 11M12 20L21 11M12 20L8 11M12 20L16 11M3 11L7 5M3 11H8M7 5L8 11M7 5H12M17 5L21 11M17 5L16 11M17 5H12M21 11H16M8 11H16M8 11L12 5M16 11L12 5"></path>
          </svg>
        </span>
        <span class="zy-svg" @click="playWithExternalPalyerEvent">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="tvIconTitle">
            <title id="tvIconTitle" >使用第三方播放器</title>
            <polygon points="20 8 20 20 4 20 4 8"></polygon>
            <polyline stroke-linejoin="round" points="8 4 12 7.917 16 4"></polyline>
          </svg>
        </span>
        <span class="zy-svg" @click="showShortcutEvent">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="sendIconTitle">
            <title id="sendIconTitle">快捷键指南</title>
            <polygon points="21.368 12.001 3 21.609 3 14 11 12 3 9.794 3 2.394"></polygon>
          </svg>
        </span>
      </div>
    </div>
    <transition name="slideX">
      <div v-if="right.show" class="list">
        <div class="list-top">
          <span class="list-top-title" v-if="right.type === 'list'">播放列表</span>
          <span class="list-top-title" v-if="right.type === 'history'">历史记录</span>
          <span class="list-top-title" v-if="right.type === 'shortcut'">快捷键指南{{ this.video.iptv ? '(直播时部分功能不可用)' : '' }}</span>
          <span class="list-top-title" v-if="right.type === 'other'">同组其他源的视频</span>
          <span class="list-top-title" v-if="right.type === 'sources'">该频道可用源</span>
          <span class="list-top-close zy-svg" @click="closeListEvent">
            <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="closeIconTitle">
              <title id="closeIconTitle">关闭</title>
              <path d="M6.34314575 6.34314575L17.6568542 17.6568542M6.34314575 17.6568542L17.6568542 6.34314575"></path>
            </svg>
          </span>
        </div>
        <div class="list-body zy-scroll" :style="{overflowY:scroll? 'auto' : 'hidden',paddingRight: scroll ? '0': '5px' }" @mouseenter="scroll = true" @mouseleave="scroll = false">
          <ul v-if="right.type === 'list'" class="list-item"  v-on-clickaway="closeListEvent">
            <li v-if="right.list.length > 0" @click="exportM3u8">导出</li>
            <li v-if="right.list.length === 0">无数据</li>
            <li @click="listItemEvent(j)" :class="video.info.index === j ? 'active' : ''" v-for="(i, j) in right.list" :key="j">{{i | ftName(j)}}</li>
          </ul>
          <ul v-if="right.type === 'history'" class="list-history"  v-on-clickaway="closeListEvent">
            <li v-if="right.history.length > 0" @click="clearAllHistory">清空</li>
            <li v-if="right.history.length === 0">无数据</li>
            <li @click="historyItemEvent(m)" :class="video.info.id === m.ids ? 'active' : ''" v-for="(m, n) in right.history" :key="n"><span class="title" :title="'【' + m.site + '】' + m.name + ' 第' + (m.index+1) + '集'">【{{m.site}}】{{m.name}} 第{{m.index+1}}集</span><span @click.stop="removeHistoryItem(m)" class="detail-delete">删除</span></li>
          </ul>
          <ul v-if="right.type === 'shortcut'" class="list-shortcut"  v-on-clickaway="closeListEvent">
            <li v-for="(m, n) in right.shortcut" :key="n"><span class="title">{{m.desc}} -- [ {{m.key}} ]</span></li>
          </ul>
          <ul v-if="right.type === 'other'" class="list-other" v-on-clickaway="closeListEvent">
            <li v-if="right.other.length === 0">无数据</li>
            <li @click="otherItemEvent(m)" v-for="(m, n) in right.other" :key="n"><span class="title">{{m.name}} - [{{m.site.name}}]</span></li>
          </ul>
          <ul v-if="right.type === 'sources'" class="list-channels" v-on-clickaway="closeListEvent">
            <li v-if="right.sources.length === 0">当前频道已关闭</li>
            <li v-for="(channel, index) in right.sources" :key="index">
              <span @click="playChannel(channel)" class="title">{{ channel.id === video.iptv.id ? channel.name + '[当前]' : channel.name }}</span>
              <span @click="disableChannel(channel)" class="btn" title="关闭频道">隐藏</span>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <transition name="slideX">
      <div v-if="channelListShow" class="list">
         <div class="list-top">
          <span class="list-top-title">频道列表</span>
          <span class="list-top-close zy-svg" @click="channelListShow = false">
            <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="closeIconTitle">
              <title id="closeIconTitle">关闭</title>
              <path d="M6.34314575 6.34314575L17.6568542 17.6568542M6.34314575 17.6568542L17.6568542 6.34314575"></path>
            </svg>
          </span>
        </div>
        <div class="list-body zy-scroll" :style="{overflowY:scroll? 'auto' : 'hidden',paddingRight: scroll ? '0': '5px' }" @mouseenter="scroll = true" @mouseleave="scroll = false">
          <el-autocomplete
            clearable
            size="small"
            v-model.trim="searchTxt"
            value-key="keywords"
            :fetch-suggestions="querySearch"
            :popper-append-to-body="false"
            popper-class="popper"
            placeholder="搜索"
            @keyup.enter.native="searchAndRecord">
           <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-autocomplete>
          <el-tree ref="channelTree"
            :data="channelListForShow"
            :props="defaultProps"
            accordion
            :filter-node-method="filterNode"
            @node-click="handleNodeClick">
          </el-tree>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { star, history, setting, shortcut, mini, channelList, iptvSearch, sites } from '../lib/dexie'
import zy from '../lib/site/tools'
import Player from 'xgplayer'
import HlsJsPlayer from 'xgplayer-hls.js'
import mt from 'mousetrap'
import { directive as onClickaway } from 'vue-clickaway'
import { exec, execFile } from 'child_process'

const { remote, clipboard } = require('electron')
const win = remote.getCurrentWindow()
const PinyinMatch = require('pinyin-match')

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
        history: [],
        shortcut: [],
        other: [],
        sources: [],
        currentTime: 0
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
        videoTitle: true,
        airplay: true,
        closeVideoTouch: true,
        ignores: ['cssFullscreen']
      },
      state: {
        showList: false,
        showHistory: false
      },
      name: '',
      length: 0,
      timer: null,
      scroll: false,
      isStar: false,
      isTop: false,
      miniMode: false,
      mainWindowBounds: {},
      searchTxt: '',
      searchRecordList: [],
      channelList: [],
      channelListForShow: [],
      channelListShow: false,
      defaultProps: {
        label: 'label',
        children: 'children'
      }
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
  directives: {
    onClickaway: onClickaway
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
    appState: {
      get () {
        return this.$store.getters.getAppState
      },
      set (val) {
        this.SET_APPSTATE(val)
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
      if (this.view === 'Play') {
        this.getChannelList()
        if (this.video.key === '' && !this.video.iptv) this.channelListShow = true
      }
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
    },
    searchTxt () {
      if (this.searchTxt === '清除历史记录...') {
        this.clearSearchRecords()
        this.searchTxt = ''
      }
      this.searchEvent()
    }
  },
  methods: {
    ...mapMutations(['SET_VIEW', 'SET_DETAIL', 'SET_VIDEO', 'SET_SHARE', 'SET_APPSTATE']),
    handleNodeClick (node) {
      if (node.channel) {
        this.playChannel(node.channel)
      }
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.toLowerCase().includes(value.toLowerCase()) || PinyinMatch.match(data.label, value)
    },
    querySearch (queryString, cb) {
      var searchRecordList = this.searchRecordList.slice(0, -1)
      var results = queryString ? searchRecordList.filter(this.createFilter(queryString)) : this.searchRecordList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (item) => {
        return (item.keywords.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    getSearchRecordList () {
      iptvSearch.all().then(res => {
        this.searchRecordList = res.reverse()
        this.searchRecordList.push({ id: this.searchRecordList.length + 1, keywords: '清除历史记录...' })
      })
    },
    addSearchRecord () {
      const wd = this.searchTxt
      if (wd) {
        iptvSearch.find({ keywords: wd }).then(res => {
          if (!res) {
            iptvSearch.add({ keywords: wd })
          }
          this.getSearchRecordList()
        })
      }
    },
    clearSearchRecords () {
      iptvSearch.clear().then(res => {
        this.getSearchRecordList()
      })
    },
    searchEvent () {
      this.$refs.channelTree.filter(this.searchTxt)
    },
    searchAndRecord () {
      this.addSearchRecord()
      this.searchEvent()
    },
    async getUrls () {
      if (this.video.key === '') {
        if (!this.video.iptv) this.channelListShow = true
        return false
      }
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
        this.playChannel(this.video.iptv)
      } else {
        this.channelListShow = false
        const index = this.video.info.index | 0
        var time = this.video.info.time
        if (!time) {
          // 如果video.info.time没有设定的话，从历史中读取时间进度
          const db = await history.find({ site: this.video.key, ids: this.video.info.id })
          if (db) {
            if (db.index === index) {
              time = db.time
            }
          }
        }
        this.playVideo(index, time)
      }
    },
    disableChannel (channel) {
      const index = this.right.sources.indexOf(channel)
      this.right.sources.splice(index, 1)
      const ele = this.channelList.find(e => e.id === channel.channelID)
      const origin = ele.channels.find(e => e.id === channel.id)
      origin.isActive = false
      ele.isActive = ele.channels.some(e => e.isActive)
      channelList.remove(ele.id)
      channelList.add(ele)
      this.getChannelList()
    },
    playChannel (channel) {
      if (channel.channels) {
        this.right.sources = channel.channels.filter(e => e.isActive)
        channel = channel.prefer ? channel.channels.find(e => e.id === channel.prefer) : channel.channels.filter(e => e.isActive)[0]
      } else {
        const ele = this.channelList.find(e => e.id === channel.channelID)
        ele.prefer = channel.id
        channelList.remove(ele.id)
        channelList.add(ele)
        this.getChannelList()
        this.right.sources = ele.channels.filter(e => e.isActive)
      }
      this.video.iptv = channel
      this.name = channel.name
      this.xg.src = channel.url
      this.xg.play()
      document.querySelector('xg-btn-showhistory').style.display = 'none'
      document.querySelector('.xgplayer-playbackrate').style.display = 'none'
    },
    playVideo (index = 0, time = 0) {
      document.querySelector('xg-btn-showhistory').style.display = 'block'
      document.querySelector('.xgplayer-playbackrate').style.display = 'inline-block'
      this.fetchM3u8List().then(m3u8Arr => {
        this.xg.src = m3u8Arr[index]

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
        }
        zy.detail(this.video.key, this.video.info.id).then(res => {
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
    async videoPlaying () {
      this.changeVideo()
      const db = await history.find({ site: this.video.key, ids: this.video.info.id })
      if (db) {
        const doc = {
          site: db.site,
          ids: db.ids,
          name: db.name,
          type: db.type,
          year: db.year,
          index: this.video.info.index,
          time: db.time,
          detail: this.video.detail
        }
        history.update(db.id, doc)
      } else {
        const doc = {
          site: this.video.key,
          ids: this.video.info.id,
          name: this.video.info.name,
          type: this.video.info.type,
          year: this.video.info.year,
          index: this.video.info.index,
          time: '',
          detail: this.video.detail
        }
        history.add(doc)
      }
      this.updateStar()
      this.timerEvent()
    },
    changeVideo () {
      win.setProgressBar(-1)
      this.checkStar()
      this.checkTop()
    },
    timerEvent () {
      this.timer = setInterval(async () => {
        const endTime = this.xg.duration
        const currentTime = this.xg.currentTime
        const progress = parseFloat((currentTime / endTime).toFixed(2))
        win.setProgressBar(progress)
        const db = await history.find({ site: this.video.key, ids: this.video.info.id })
        if (db) {
          const doc = { ...db }
          doc.time = this.xg.currentTime
          doc.duration = this.xg.duration
          delete doc.id
          history.update(db.id, doc)
        }
      }, 10000)
    },
    prevEvent () {
      if (this.video.iptv) {
        var index = this.channelList.findIndex(obj => obj.prefer === this.video.iptv.id)
        if (index >= 1) {
          var channel = this.channelList[index - 1]
          this.playChannel(channel)
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
        var index = this.channelList.findIndex(obj => obj.prefer === this.video.iptv.id)
        if (index < (this.channelList.length - 1)) {
          var channel = this.channelList[index + 1]
          this.playChannel(channel)
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
    async updateStar () {
      const info = this.video.info
      const db = await star.find({ key: this.video.key, ids: info.id })
      if (db) {
        db.index = info.index
        star.update(db.id, db)
      }
    },
    async starEvent () {
      const info = this.video.info
      const db = await star.find({ key: this.video.key, ids: info.id })
      if (db) {
        star.remove(db.id).then(res => {
          if (res) {
            this.$message.warning('取消收藏失败')
          } else {
            this.$message.success('取消收藏成功')
            this.isStar = false
          }
        })
      } else {
        zy.detail(this.video.key, info.id).then(detailRes => {
          const docs = {
            key: this.video.key,
            ids: info.id,
            name: info.name,
            detail: detailRes,
            index: info.index
          }
          star.add(docs).then(res => {
            this.$message.success('收藏成功')
            this.isStar = true
          })
        })
      }
    },
    detailEvent () {
      this.detail = {
        show: true,
        key: this.video.key,
        info: this.video.info
      }
    },
    async miniEvent () {
      this.mainWindowBounds = JSON.parse(JSON.stringify(win.getBounds()))
      let miniWindowBounds
      await mini.find().then(res => { if (res) miniWindowBounds = res.bounds })
      if (!miniWindowBounds) miniWindowBounds = { x: win.getPosition()[0], y: win.getPosition()[1], width: 550, height: 340 }
      win.setBounds(miniWindowBounds)
      this.xg.getCssFullscreen()
      this.miniMode = true
    },
    async exitMiniEvent () {
      await mini.find().then(res => {
        let doc = {}
        doc = {
          id: 0,
          bounds: win.getBounds()
        }
        if (res) {
          mini.update(doc)
        } else {
          mini.add(doc)
        }
      })
      win.setBounds(this.mainWindowBounds)
      this.xg.exitCssFullscreen()
      this.miniMode = false
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
      const fs = require('fs')
      if (this.video.iptv) {
        var externalPlayer = this.setting.externalPlayer
        if (!externalPlayer) {
          this.$message.error('请设置第三方播放器路径')
          return
        }
        if (fs.existsSync(externalPlayer)) {
          execFile(externalPlayer, [this.video.iptv.url])
        } else {
          exec(externalPlayer, [this.video.iptv.url])
        }
        return
      }
      this.fetchM3u8List().then(m3u8Arr => {
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
            execFile(externalPlayer, [m3uFile])
          } else {
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
    async checkStar () {
      const db = await star.find({ key: this.video.key, ids: this.video.info.id })
      if (db) {
        this.isStar = true
      } else {
        this.isStar = false
      }
    },
    checkTop () {
      this.isTop = this.appState.windowIsOnTop
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
        var channel = this.channelList[n]
        // 是直播源，直接播放
        this.playChannel(channel)
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
        this.getAllhistory()
      }).catch(err => {
        this.$message.warning('删除历史记录失败, 错误信息: ' + err)
      })
    },
    async getOtherSites () {
      this.right.other = []
      const currentSite = await sites.find({ key: this.video.key })
      sites.all().then(sitesRes => {
        // 排除已关闭的源和当前源
        for (const siteItem of sitesRes.filter(x => x.isActive && x.group === currentSite.group && x.key !== this.video.key)) {
          zy.search(siteItem.key, this.name).then(searchRes => {
            const type = Object.prototype.toString.call(searchRes)
            if (type === '[object Array]') {
              searchRes.forEach(async item => {
                const detailRes = item
                detailRes.key = siteItem.key
                detailRes.site = siteItem
                this.right.other.push(detailRes)
              })
            }
            if (type === '[object Object]') {
              const detailRes = searchRes
              detailRes.key = siteItem.key
              detailRes.site = siteItem
              this.right.other.push(detailRes)
            }
          })
        }
      })
    },
    otherEvent (m) {
      if (!this.video.iptv) {
        this.right.type = 'other'
        this.getOtherSites()
        this.right.currentTime = this.xg.currentTime
      } else {
        this.channelListShow = false
        this.right.type = 'sources'
      }
      this.right.show = true
    },
    async otherItemEvent (e) {
      // 打开当前播放的剧集index, 定位到当前的时间
      this.video = { key: e.key, info: { id: e.id, name: e.name, site: e.site, index: this.video.info.index, time: this.right.currentTime } }
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
            // 继续播放时,隐藏进度条
            win.setProgressBar(-1)
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
        if (this.appState.windowIsOnTop) {
          win.setAlwaysOnTop(false)
          this.appState.windowIsOnTop = false
        } else {
          win.setAlwaysOnTop(true)
          this.appState.windowIsOnTop = true
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
        if (this.miniMode) {
          this.exitMiniEvent()
        }
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
        const num = win.getOpacity()
        if (num > 0.1) {
          win.setOpacity(num - 0.1)
        }
        return false
      }
      if (e === 'opacityDown') {
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
        this.channelList.forEach(e => {
          if (e.prefer === this.video.iptv.id) {
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
    async getChannelList () {
      await channelList.all().then(res => {
        this.channelList = res.filter(e => e.isActive)
        this.channelListForShow = []
        const groups = [...new Set(this.channelList.map(iptv => iptv.group))]
        groups.forEach(g => {
          var doc = {
            label: g,
            children: this.channelList.filter(x => x.group === g).map(i => { return { label: i.name, channel: i } })
          }
          this.channelListForShow.push(doc)
        })
      })
    },
    bindEvent () {
      this.xg.on('exitFullscreen', () => {
        if (this.miniMode) this.xg.getCssFullscreen()
      })

      this.xg.on('volumechange', () => {
        this.config.volume = this.xg.volume.toFixed(2)
        setting.find().then(res => { res.volume = this.config.volume; setting.update(res) })
      })

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
        if (this.miniMode) this.exitMiniEvent()
        this.videoStop()
      })

      const ev = ['click', 'touchend', 'mousemove']
      let timerID
      ev.forEach(item => {
        this.xg.root.addEventListener(item, () => {
          if (this.xg && this.xg.fullscreen) {
            const videoTitle = document.querySelector('.xg-view-videoTitle')
            videoTitle.style.display = 'block'
            clearTimeout(timerID)
            timerID = setTimeout(() => {
              // 播放中自动消失
              if (this.xg && !this.xg.paused) {
                videoTitle.style.display = 'none'
              }
            }, 3000)
          }
        })
      })

      this.xg.on('exitFullscreen', () => {
        document.querySelector('.xg-view-videoTitle').style.display = 'none'
      })
    },
    videoStop () {
      win.setProgressBar(-1)
      if (this.xg.fullscreen) {
        this.xg.exitFullscreen()
      }
      clearInterval(this.timer)
      this.video.key = ''
      this.xg.src = ''
      this.config.src = ''
      this.xg.destroy(false)
      this.xg = null
      this.name = ''
      this.right.list = []
      this.getAllhistory()
      setTimeout(() => {
        this.xg = new HlsJsPlayer(this.config)
        this.playerInstall()
        this.bindEvent()
      }, 1000)
    },
    minMaxEvent () {
      win.on('minimize', () => {
        if (this.xg && this.xg.hasStart) {
          this.xg.pause()
        }
      })
      win.on('restore', () => {
        // 不知为何，在if clause里直接使用this.xg.hasStart居然就不工作，不得其解。
        var hasStart = this.xg.hasStart
        if (this.xg && hasStart) {
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
    },
    showShortcutEvent () {
      this.right.show = !this.right.show
      shortcut.all().then(res => {
        this.right.type = 'shortcut'
        this.right.shortcut = res
      })
    }
  },
  created () {
    this.getAllhistory()
    this.getChannelList()
    this.mtEvent()
  },
  async mounted () {
    const db = await setting.find()
    this.playerInstall()
    this.config.volume = db.volume ? db.volume : 0.6
    this.xg = new HlsJsPlayer(this.config)
    this.bindEvent()
    this.minMaxEvent()
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>
<style>
.xgplayer-skin-default .xgplayer-live {
  width: 100px;
  position: absolute;
  top:50%;
  left:50%;
  transform: translate(-50%, -50%);
  font-size: 18px !important;
}
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
    .el-tree{
      background-color: inherit;
    }
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
          display: flex;
          .title{
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 231px;
          }
          .btn{
            display: inline-block;
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
