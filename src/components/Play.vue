<template>
  <div class="play">
    <div class="box">
      <div class="title">
        <span v-if="this.right.list.length > 1">『第 {{(video.info.index + 1)}} 集』</span>{{name}}
        <span class="right" @click="() => { onlineUrl = ''; videoStop(); }">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="closeIconTitle">
            <title id="closeIconTitle">关闭</title>
            <path d="M6.34314575 6.34314575L17.6568542 17.6568542M6.34314575 17.6568542L17.6568542 6.34314575"></path>
          </svg>
        </span>
      </div>
      <div class="player" v-show="!onlineUrl">
        <div id="xgplayer"></div>
      </div>
      <div class="iframePlayer" v-if="onlineUrl" style='width:100%;height:100%;'>
        <iframe v-bind:src="onlineUrl" width="100%" height="100%"
          frameborder="0" scrolling="no" allow='autoplay;fullscreen'>
        </iframe>
      </div>
      <div class="more" v-if="!video.iptv" :key="Boolean(video.iptv)">
        <span class="zy-svg" @click="otherEvent" v-show="name !== ''" :class="right.type === 'other' ? 'active' : ''">
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
        <span class="zy-svg" @click="starEvent" :class="isStar ? 'active' : ''" v-show="right.list.length > 0 || isStar">
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
        <span class="zy-svg" @click="miniEvent" v-show="!onlineUrl && right.list.length > 0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-labelledby="diamondIconTitle">
            <title id="diamondIconTitle">精简模式</title>
            <path d="M12 20L3 11M12 20L21 11M12 20L8 11M12 20L16 11M3 11L7 5M3 11H8M7 5L8 11M7 5H12M17 5L21 11M17 5L16 11M17 5H12M21 11H16M8 11H16M8 11L12 5M16 11L12 5"></path>
          </svg>
        </span>
        <span class="zy-svg" @click="playWithExternalPalyerEvent" v-show="!onlineUrl && right.list.length > 0">
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
        <span class="zy-svg" @click="showShortcutEvent" :class="right.type === 'shortcut' ? 'active' : ''" v-show="!onlineUrl && right.list.length > 0">
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
        <span class="timespanSwitch" v-if="right.list.length > 1 && !onlineUrl" title="跳过片头片尾，建议优先通过快捷键设置，更便捷更精准">
          <el-switch v-model="state.showTimespanSetting" active-text="手动跳略时长"></el-switch>
        </span>
        <span class="timespan" v-if="state.showTimespanSetting">
          <label>片头：</label>
          <input type="number" v-model="startPosition.min" style="width:45px" min="00" max="59" placeholder="00" required>
          <label>:</label>
          <input type="number" v-model="startPosition.sec" style="width:45px" min="00" max="59" placeholder="00" required>
          <span></span>
          <label>片尾：</label>
          <input type="number" v-model="endPosition.min" style="width:45px" min="00" max="59" placeholder="00" required>
          <label>:</label>
          <input type="number" v-model="endPosition.sec" style="width:45px" min="00" max="59" placeholder="00" required>
          <span></span>
          <input type="button" value="确定" @click="setProgressDotByInput">
          <span></span>
          <input type="button" value="重置" @click="() => { startPosition.min = startPosition.sec = endPosition.min = endPosition.sec = '00'; this.clearPosition() }">
        </span>
        <span class="last-tip" v-if="!video.key && right.history.length > 0 && right.history[0]" @click="historyItemEvent(right.history[0])">
          <span>上次播放到:【{{right.history[0].site}}】{{right.history[0].name}} 第{{right.history[0].index+1}}集 </span>
          <span v-if="right.history[0].time && right.history[0].duration">{{fmtMSS(right.history[0].time.toFixed(0))}}/{{fmtMSS(right.history[0].duration.toFixed(0))}}</span>
          <span v-if="right.history[0].onlinePlay">在线解析</span>
        </span>
      </div>
      <div class="more" v-if="video.iptv" :key="Boolean(video.iptv)">
        <span class="zy-svg" @click="state.showChannelList = !state.showChannelList" :class="state.showChannelList ? 'active' : ''">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="dashboardIconTitle">
            <title id="dashboardIconTitle">频道列表</title>
            <rect width="20" height="20" x="2" y="2"></rect>
            <path d="M11 7L17 7M11 12L17 12M11 17L17 17"></path>
            <line x1="7" y1="7" x2="7" y2="7"></line>
            <line x1="7" y1="12" x2="7" y2="12"></line>
            <line x1="7" y1="17" x2="7" y2="17"></line>
          </svg>
        </span>
        <span class="zy-svg" @click="otherEvent" :class="right.type === 'sources' ? 'active' : ''">
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
        <span class="zy-svg" @click="showShortcutEvent" :class="right.type === 'shortcut' ? 'active' : ''">
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
          <ul v-if="right.type === 'list'" class="list-item"  v-clickoutside="closeListEvent">
            <li v-if="exportablePlaylist" @click="exportM3u8">导出</li>
            <li v-if="right.list.length === 0">无数据</li>
            <li @click="listItemEvent(j)" :class="video.info.index === j ? 'active' : ''" v-for="(i, j) in right.list" :key="j">{{i | ftName(j)}}</li>
          </ul>
          <ul v-if="right.type === 'history'" class="list-history"  v-clickoutside="closeListEvent">
            <li v-if="right.history.length > 0" @click="clearAllHistory">清空</li>
            <li v-if="right.history.length === 0">无数据</li>
            <li @click="historyItemEvent(m)" :class="video.info.id === m.ids ? 'active' : ''" v-for="(m, n) in right.history" :key="n"><span class="title" :title="'【' + m.site + '】' + m.name + ' 第' + (m.index+1) + '集'">【{{m.site}}】{{m.name}} 第{{m.index+1}}集</span><span @click.stop="removeHistoryItem(m)" class="detail-delete">删除</span></li>
          </ul>
          <ul v-if="right.type === 'shortcut'" class="list-shortcut"  v-clickoutside="closeListEvent">
            <li v-for="(m, n) in right.shortcut" :key="n"><span class="title">{{m.desc}} -- [ {{m.key}} ]</span></li>
          </ul>
          <ul v-if="right.type === 'other'" class="list-other" v-clickoutside="closeListEvent">
            <li v-if="right.other.length === 0">无数据</li>
            <li @click="otherItemEvent(m)" v-for="(m, n) in right.other" :key="n"><span class="title">{{m.name}} - [{{m.site.name}}]</span></li>
          </ul>
          <ul v-if="right.type === 'sources'" class="list-channels" v-clickoutside="closeListEvent">
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
      <div v-if="state.showChannelList && channelList && channelList.length > 0" class="list" v-clickoutside="closeListEvent">
         <div class="list-top">
          <span class="list-top-title">频道列表</span>
          <span class="list-top-close zy-svg" @click="state.showChannelList = false">
            <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="closeIconTitle">
              <title id="closeIconTitle">关闭</title>
              <path d="M6.34314575 6.34314575L17.6568542 17.6568542M6.34314575 17.6568542L17.6568542 6.34314575"></path>
            </svg>
          </span>
        </div>
        <div class="list-body zy-scroll" :style="{overflowY:scroll? 'auto' : 'hidden',paddingRight: scroll ? '0': '5px' }" @mouseenter="scroll = true" @mouseleave="scroll = false">
          <el-input
            clearable
            size="small" title="支持按拼音首字母搜索"
            v-model.trim="searchTxt"
            placeholder="搜索">
           <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <el-tree ref="channelTree"
            :data="channelTree"
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
import { star, history, setting, shortcut, mini, channelList, sites } from '../lib/dexie'
import zy from '../lib/site/tools'
import Player from 'xgplayer'
import 'xgplayer-mp4'
import HlsJsPlayer from 'xgplayer-hls.js'
import FlvJsPlayer from 'xgplayer-flv.js'
import mt from 'mousetrap'
import Clickoutside from 'element-ui/src/utils/clickoutside'
import { exec, execFile } from 'child_process'
import PinyinMatch from 'pinyin-match'

const { remote, clipboard } = require('electron')
const win = remote.getCurrentWindow()
const URL = require('url')
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
        quitMiniMode: true,
        videoTitle: true,
        airplay: true,
        closeVideoTouch: true,
        ignores: ['replay', 'error'], // 为了切换播放器类型时避免显示错误刷新，暂时忽略错误
        preloadTime: 300
      },
      state: {
        showList: false,
        showHistory: false,
        showChannelList: false,
        showTimespanSetting: false
      },
      name: '',
      length: 0,
      timer: null,
      scroll: false,
      isStar: false,
      miniMode: false,
      mainWindowBounds: {},
      searchTxt: '',
      channelList: [],
      channelTree: [],
      isLive: false,
      defaultProps: {
        label: 'label',
        children: 'children'
      },
      startPosition: { min: '00', sec: '00' }, // 对应调略输入框
      endPosition: { min: '00', sec: '00' },
      skipendStatus: false, // 是否跳过了片尾
      currentShortcutList: [],
      onlineUrl: '',
      playerType: 'hls',
      exportablePlaylist: false,
      changingIPTV: false
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
    Clickoutside
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
    setting: {
      get () {
        return this.$store.getters.getSetting
      },
      set (val) {
        this.SET_SETTING(val)
      }
    },
    DetailCache: {
      get () {
        return this.$store.getters.getDetailCache
      },
      set (val) {
        this.SET_DetailCache(val)
      }
    },
    VideoEssentialInfo () {
      return this.video.key + '@' + this.video.info.id + '@' + this.video.info.index
    }
  },
  watch: {
    view () {
      if (this.view === 'Play') {
        this.right.show = false
        this.right.type = ''
        this.getChannelList()
        if (this.video.key === '' && !this.isLive) {
          this.state.showChannelList = true
        }
      }
    },
    VideoEssentialInfo: {
      handler () {
        if (this.changingIPTV) return
        this.getUrls()
      }
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
      this.$refs.channelTree.filter(this.searchTxt)
    },
    startPosition: {
      handler (time) {
        this.leadingZero(time)
      },
      deep: true
    },
    endPosition: {
      handler (time) {
        this.leadingZero(time)
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations(['SET_VIEW', 'SET_DETAIL', 'SET_VIDEO', 'SET_SHARE', 'SET_APPSTATE', 'SET_DetailCache']),
    fmtMSS (s) {
      return (s - (s %= 60)) / 60 + (s > 9 ? ':' : ':0') + s
    },
    leadingZero (time) { // 格式化单个调略输入框
      Object.keys(time).forEach(key => {
        if (time[key] > 59 || time[key] < 0) {
          time[key] = '00'
        } else if (time[key].length > 2) {
          time[key] = '' + parseInt(time[key])
        } else if (time[key] < 10 && time[key].length === 1) {
          time[key] = '0' + time[key]
        }
      })
    },
    handleNodeClick (node) {
      if (node.channel) {
        this.playChannel(node.channel)
      }
    },
    filterNode (value, data) {
      if (!value) return true
      return PinyinMatch.match(data.label, value)
    },
    async getUrls () {
      if (this.video.key === '') {
        if (!this.video.iptv) this.state.showChannelList = true
        return false
      }
      this.name = ''
      this.onlineUrl = ''
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
        this.state.showChannelList = false
        const index = this.video.info.index || 0
        const db = await history.find({ site: this.video.key, ids: this.video.info.id })
        const key = this.video.key + '@' + this.video.info.id
        let time = this.video.info.time
        this.xg.removeAllProgressDot()
        this.startPosition = { min: '00', sec: '00' }
        this.endPosition = { min: '00', sec: '00' }
        if (db) {
          if (!time && db.index === index) { // 如果video.info.time没有设定的话，从历史中读取时间进度
            time = db.time
          }
          if (!VIDEO_DETAIL_CACHE[key]) VIDEO_DETAIL_CACHE[key] = {}
          if (!this.video.info.videoFlag) this.video.info.videoFlag = db.videoFlag
          if (db.startPosition) { // 数据库保存的时长通过快捷键设置时可能为小数, this.startPosition为object对应输入框分秒转化到数据库后肯定为整数
            VIDEO_DETAIL_CACHE[key].startPosition = db.startPosition
            this.startPosition = { min: '' + parseInt(db.startPosition / 60), sec: '' + parseInt(db.startPosition % 60) }
          }
          if (db.endPosition) {
            VIDEO_DETAIL_CACHE[key].endPosition = db.endPosition
            this.endPosition = { min: '' + parseInt(db.endPosition / 60), sec: '' + parseInt(db.endPosition % 60) }
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
    },
    playChannel (channel) {
      this.isLive = true
      if (channel.channels) {
        let prefer
        this.right.sources = channel.channels.filter(e => e.isActive)
        if (channel.prefer) prefer = channel.channels.find(e => e.id === channel.prefer)
        if (!prefer) prefer = channel.channels.filter(e => e.isActive)[0]
        channel = prefer
      } else {
        const ele = this.channelList.find(e => e.id === channel.channelID)
        ele.prefer = channel.id
        channelList.remove(ele.id)
        channelList.add(ele)
        this.right.sources = ele.channels.filter(e => e.isActive)
      }
      this.changingIPTV = true // 避免二次执行playChannel
      this.video.iptv = channel
      this.name = channel.name
      const supportFormats = /\.(m3u8|flv)$/
      const extRE = channel.url.match(supportFormats) || new URL.URL(channel.url).pathname.match(supportFormats)
      this.getPlayer(extRE[1])
      if (extRE[1] === 'flv') this.xg.config.isLive = true
      this.xg.src = channel.url
      this.xg.play()
      this.changingIPTV = false
      setTimeout(() => {
        if (!document.getElementById('xgplayer').querySelector('video')) {
          this.getPlayer(this.playerType, true)
          this.playChannel(channel)
        }
      }, 1000)
      if (document.querySelector('xg-btn-showhistory')) document.querySelector('xg-btn-showhistory').style.display = 'none'
      if (document.querySelector('.xgplayer-playbackrate')) document.querySelector('.xgplayer-playbackrate').style.display = 'none'
    },
    async getPlayer (playerType, force = false) {
      if (!force && this.playerType === playerType) return
      if (this.playerType !== 'flv') {
        this.xg.src = '' // https://developers.google.com/web/updates/2017/06/play-request-was-interrupted#danger-zone
        this.config.url = ''
      }
      try {
        if (this.xg) this.xg.destroy()
      } catch (err) { }
      this.xg = null
      switch (playerType) {
        case 'mp4':
          this.xg = new Player(this.config)
          break
        case 'flv':
          this.xg = new FlvJsPlayer(this.config)
          break
        default:
          this.xg = new HlsJsPlayer(this.config)
      }
      this.playerInstall()
      this.bindEvent()
      this.playerType = playerType
      if (this.miniMode) { await this.saveMiniWindowState(); this.miniEvent() }
    },
    playVideo (index = 0, time = 0) {
      this.isLive = false
      this.isStar = false
      this.exportablePlaylist = false
      this.fetchPlaylist().then(async (fullList) => {
        let playlist = fullList[0].list // ZY支持的已移到首位
        // 如果设定了特定的video flag, 获取该flag下的视频列表
        const videoFlag = this.video.info.videoFlag
        if (videoFlag) {
          playlist = fullList.find(x => x.flag === videoFlag).list
        }
        this.right.list = playlist
        const url = playlist[index].includes('$') ? playlist[index].split('$')[1] : playlist[index]
        if (playlist.every(e => e.includes('$') ? e.split('$')[1].endsWith('.m3u8') : e.endsWith('.m3u8'))) this.exportablePlaylist = true
        if (!url.endsWith('.m3u8') && !url.endsWith('.mp4')) {
          const currentSite = await sites.find({ key: this.video.key })
          this.$message.info('即将调用解析接口播放，请等待...')
          if (currentSite.jiexiUrl) {
            this.onlineUrl = currentSite.jiexiUrl + url
          } else {
            this.onlineUrl = this.setting.defaultParseURL + url
          }
          this.videoPlaying('online')
          return
        } else {
          const ext = url.match(/\.\w+?$/)[0].slice(1)
          this.getPlayer(ext)
        }
        this.xg.src = url
        const key = this.video.key + '@' + this.video.info.id
        const startTime = VIDEO_DETAIL_CACHE[key].startPosition || 0
        this.xg.play()
        setTimeout(() => {
          if (!document.getElementById('xgplayer').querySelector('video')) {
            this.getPlayer(this.playerType, true)
            this.getUrls()
          }
        }, 1000)
        if (document.querySelector('xg-btn-showhistory')) document.querySelector('xg-btn-showhistory').style.display = 'block'
        if (document.querySelector('.xgplayer-playbackrate')) document.querySelector('.xgplayer-playbackrate').style.display = 'inline-block'
        this.xg.once('playing', () => {
          this.xg.currentTime = time > startTime ? time : startTime
          if (VIDEO_DETAIL_CACHE[key].startPosition) this.xg.addProgressDot(VIDEO_DETAIL_CACHE[key].startPosition, '片头')
          if (VIDEO_DETAIL_CACHE[key].endPosition) this.xg.addProgressDot(this.xg.duration - VIDEO_DETAIL_CACHE[key].endPosition, '片尾')
        })
        this.videoPlaying()
        this.skipendStatus = false
        this.xg.once('ended', () => {
          if (playlist.length > 1 && (playlist.length - 1 > index)) {
            this.video.info.time = 0
            this.video.info.index++
          }
          this.xg.off('ended') // 明明是once为何会触发多次，得注销掉以真正只执行一次
        })
      })
    },
    fetchPlaylist () {
      return new Promise((resolve) => {
        const cacheKey = this.video.key + '@' + this.video.info.id
        if (VIDEO_DETAIL_CACHE[cacheKey] && VIDEO_DETAIL_CACHE[cacheKey].list && VIDEO_DETAIL_CACHE[cacheKey].list.length) {
          this.name = VIDEO_DETAIL_CACHE[cacheKey].name
          resolve(VIDEO_DETAIL_CACHE[cacheKey].list)
        }
        let res
        if (!this.DetailCache[cacheKey]) {
          zy.detail(this.video.key, this.video.info.id).then(res => {
            this.DetailCache[cacheKey] = res
            res = this.DetailCache[cacheKey]
            this.name = res.name
            VIDEO_DETAIL_CACHE[cacheKey] = Object.assign(VIDEO_DETAIL_CACHE[cacheKey] || { }, {
              list: res.fullList,
              name: res.name
            })
            resolve(res.fullList)
          }).catch(err => { this.$message.error('播放地址可能已失效，请换源并调整收藏', err); this.name = this.video.info.name; this.updateStar(); this.otherEvent() })
        } else {
          res = this.DetailCache[cacheKey]
          this.name = res.name
          VIDEO_DETAIL_CACHE[cacheKey] = Object.assign(VIDEO_DETAIL_CACHE[cacheKey] || { }, {
            list: res.fullList,
            name: res.name
          })
          resolve(res.fullList)
        }
      })
    },
    async videoPlaying (isOnline) {
      const db = await history.find({ site: this.video.key, ids: this.video.info.id })
      const videoFlag = this.video.info.videoFlag || ''
      let time = this.xg.currentTime || 0
      let duration = this.xg.duration || 0
      let startPosition = 0
      let endPosition = 0
      if (db) {
        time = time || db.time
        duration = duration || db.duration
        startPosition = db.startPosition
        endPosition = db.endPosition
        await history.remove(db.id)
      }
      if (isOnline) {
        time = duration = 0
      }
      const doc = {
        site: this.video.key,
        ids: this.video.info.id,
        name: this.video.info.name,
        type: this.video.info.type,
        year: this.video.info.year,
        index: this.video.info.index,
        time: time,
        duration: duration,
        startPosition: startPosition,
        endPosition: endPosition,
        detail: this.DetailCache[this.video.key + '@' + this.video.info.id],
        onlinePlay: isOnline,
        videoFlag: videoFlag
      }
      await history.add(doc)
      this.updateStar()
      if (!isOnline) this.timerEvent()
    },
    async setProgressDotEvent (position, timespan, text) { // 根据跳略时长在进度条上添加标记, position为位置, timespan为时长，text为标记文本(title)
      const key = this.video.key + '@' + this.video.info.id
      const db = await history.find({ site: this.video.key, ids: this.video.info.id })
      if (db && this.xg && this.right.list.length > 1) {
        this[position] = { min: '' + parseInt(timespan / 60), sec: '' + parseInt(timespan % 60) }
        const positionTime = position === 'endPosition' ? this.xg.duration - timespan : timespan
        if (db[position]) this.xg.removeProgressDot(position === 'endPosition' ? this.xg.duration - db[position] : db[position])
        if (parseInt(this[position].min) || parseInt(this[position].sec)) this.xg.addProgressDot(positionTime, text) // 均为0时不添加标记
        const doc = { ...db }
        doc[position] = timespan
        delete doc.id
        history.update(db.id, doc)
        VIDEO_DETAIL_CACHE[key][position] = timespan
      }
    },
    async setProgressDotByInput () { // 对应调略输入框后的“确定”
      this.xg.removeAllProgressDot()
      const startTime = parseInt(this.startPosition.min) * 60 + parseInt(this.startPosition.sec)
      const endTime = parseInt(this.endPosition.min) * 60 + parseInt(this.endPosition.sec)
      if (startTime > this.xg.duration || endTime > this.xg.duration) {
        this.$message.error('设置的跳跃时间长度已超过视频播放时长，请调整设置！')
        return
      }
      await this.setProgressDotEvent('startPosition', startTime)
      await this.setProgressDotEvent('endPosition', endTime)
    },
    async clearPosition () {
      await this.setProgressDotEvent('startPosition', 0)
      await this.setProgressDotEvent('endPosition', 0)
      this.xg.removeAllProgressDot()
    },
    timerEvent () {
      this.timer = setInterval(async () => {
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
        let index = this.channelList.findIndex(obj => obj.id === this.video.iptv.channelID)
        index = index === 0 ? this.channelList.length - 1 : index - 1
        const channel = this.channelList[index]
        this.playChannel(channel)
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
        let index = this.channelList.findIndex(obj => obj.id === this.video.iptv.channelID)
        index = index === this.channelList.length - 1 ? 0 : index + 1
        const channel = this.channelList[index]
        this.playChannel(channel)
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
      this.state.showChannelList = false
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
        this.isStar = true
        db.index = info.index
        star.update(db.id, db)
      } else {
        this.isStar = false
      }
    },
    async starEvent () {
      const db = await star.find({ key: this.video.key, ids: this.video.info.id })
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
        const docs = {
          key: this.video.key,
          ids: this.video.info.id,
          name: this.video.info.name,
          detail: this.DetailCache[this.video.key + '@' + this.video.info.id],
          index: this.video.info.index
        }
        star.add(docs).then(res => {
          this.$message.success('收藏成功')
          this.isStar = true
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
      if (!this.miniMode) this.mainWindowBounds = JSON.parse(JSON.stringify(win.getBounds()))
      let miniWindowBounds
      await mini.find().then(res => { if (res) miniWindowBounds = res.bounds })
      if (!miniWindowBounds) miniWindowBounds = { x: win.getPosition()[0], y: win.getPosition()[1], width: 550, height: 340 }
      win.setBounds(miniWindowBounds)
      this.xg.getCssFullscreen()
      document.querySelector('xg-btn-quitMiniMode').style.display = 'block'
      this.miniMode = true
    },
    async saveMiniWindowState () {
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
    },
    async exitMiniEvent () {
      await this.saveMiniWindowState()
      win.setBounds(this.mainWindowBounds)
      this.xg.exitCssFullscreen()
      document.querySelector('xg-btn-quitMiniMode').style.display = 'none'
      this.miniMode = false
    },
    shareEvent () {
      this.share = {
        show: true,
        key: this.video.key,
        info: this.DetailCache[this.video.key + '@' + this.video.info.id],
        index: this.video.info.index
      }
    },
    async issueEvent () {
      const currentSite = await sites.find({ key: this.video.key })
      const info = {
        video: Object.assign({ site: currentSite, detail: this.DetailCache[this.video.key + '@' + this.video.info.id] }, this.video.info),
        playlist: this.right.list.map(e => e.split('$')[1]),
        playerType: this.onlineUrl ? '在线解析' : this.playerType,
        playerError: this.xg.error || '',
        playerState: this.xg.readyState || '',
        networkState: this.xg.networkState || ''
      }
      clipboard.writeText(JSON.stringify(info, null, 4))
      this.$message.success('视频信息复制成功')
    },
    playWithExternalPalyerEvent () {
      const fs = require('fs')
      const externalPlayer = this.setting.externalPlayer
      if (this.video.iptv) {
        if (!externalPlayer) {
          this.$message.error('请设置第三方播放器路径')
          return
        }
        if (fs.existsSync(externalPlayer)) {
          execFile(externalPlayer, [this.video.iptv.url])
        } else {
          exec(externalPlayer, [this.video.iptv.url])
        }
      } else {
        const playlistUrls = this.right.list.map(e => e.split('$')[1])
        if (!externalPlayer) {
          this.$message.error('请设置第三方播放器路径')
          // 在线播放该视频
          if (playlistUrls[this.video.info.index].endsWith('.m3u8')) {
            const link = 'http://hunlongyu.gitee.io/zy-player-web?url=' + playlistUrls[this.video.info.index] + '&name=' + this.video.info.name
            const open = require('open')
            open(link)
          }
        } else {
          let playlist
          if (playlistUrls.every(e => e.endsWith('.m3u8'))) {
            playlist = this.generateM3uFile(this.video.info.name, playlistUrls, this.video.info.index)
          } else {
            playlist = playlistUrls[this.video.info.index]
          }
          if (fs.existsSync(externalPlayer)) {
            execFile(externalPlayer, [playlist])
          } else {
            exec(externalPlayer, [playlist])
          }
        }
      }
    },
    generateM3uFile (fileName, m3u8Arr, startIndex) {
      const path = require('path')
      const os = require('os')
      const fs = require('fs')
      const filePath = path.join(os.tmpdir(), fileName + '.m3u')
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
      let str = '#EXTM3U' + os.EOL
      for (let ind = startIndex; ind < m3u8Arr.length; ind++) {
        str += `#EXTINF: -1, 第${ind + 1}集` + os.EOL
        str += m3u8Arr[ind] + os.EOL
      }
      str += '#EXT-X-ENDLIST' + os.EOL
      fs.writeFileSync(filePath, str)
      return filePath
    },
    closeListEvent () {
      const lastRightType = this.right.type
      const lastChannelListState = this.state.showChannelList
      setTimeout(() => {
        if (lastRightType === this.right.type) {
          this.right.show = false
          this.right.type = ''
        }
        if (lastChannelListState === this.state.showChannelList) {
          this.state.showChannelList = false
        }
      }, 50)
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
      let m3u8Content = '#EXTM3U\n'
      for (const item of m3u8Arr) {
        m3u8Content += `#EXTINF:-1, ${item.name}\n${item.link}\n`
      }
      const blob = new Blob([m3u8Content], { type: 'application/vnd.apple.mpegurl' })
      const downloadElement = document.createElement('a')
      const href = window.URL.createObjectURL(blob)
      downloadElement.href = href
      downloadElement.download = `${this.name}.m3u`
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
        const channel = this.channelList[n]
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
        this.right.type = 'sources'
      }
      this.right.show = true
    },
    async otherItemEvent (e) {
      // 打开当前播放的剧集index, 定位到当前的时间
      this.video = { key: e.key, info: { id: e.id, name: e.name, site: e.site, index: this.video.info.index, time: this.right.currentTime } }
    },
    mtEvent () {
      if (this.setting.shortcutModified) this.currentShortcutList.forEach(e => mt.unbind(e.key))
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
            this.currentShortcutList = res
          })
        } else {
          shortcut.all().then(res => {
            for (const i of res) {
              mt.unbind(i.key)
            }
            this.currentShortcutList = []
          })
        }
      }).finally(() => {
        this.setting.shortcutModified = false
        setting.find().then(res => {
          res.shortcutModified = this.setting.shortcutModified
          setting.update(res)
        })
      })
    },
    async shortcutEvent (e) {
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
      if (e === 'startPosition') {
        this.setProgressDotEvent('startPosition', this.xg.currentTime, '片头')
        return false
      }
      if (e === 'endPosition') {
        this.setProgressDotEvent('endPosition', this.xg.duration - this.xg.currentTime, '片尾')
        return false
      }
      if (e === 'clearPosition') {
        this.clearPosition()
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
        if (!this.miniMode) {
          this.miniEvent()
        } else {
          this.exitMiniEvent()
        }
        return false
      }
      if (e === 'resetMini') {
        if (this.miniMode) {
          const miniWindowBounds = { x: this.mainWindowBounds.x, y: this.mainWindowBounds.y, width: 550, height: 340 }
          win.setBounds(miniWindowBounds)
        }
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
        this.channelTree = []
        const groups = [...new Set(this.channelList.map(iptv => iptv.group))]
        groups.forEach(g => {
          const doc = {
            label: g,
            children: this.channelList.filter(x => x.group === g).map(i => { return { label: i.name, channel: i } })
          }
          this.channelTree.push(doc)
        })
      })
    },
    bindEvent () {
      // 直播卡顿时换源换台
      let stallIptvTimeout
      let stallCount = 0
      this.xg.on('waiting', () => {
        if (this.isLive && this.setting.autoChangeSourceWhenIptvStalling) {
          stallIptvTimeout = setTimeout(() => {
            let index = this.right.sources.indexOf(this.video.iptv) + 1
            if (index === this.right.sources.length) index = 0
            stallCount++
            if (stallCount >= this.right.sources.length) {
              stallCount = 0
              this.nextEvent()
            } else {
              this.playChannel(this.right.sources[index])
            }
          }, this.setting.waitingTimeInSec * 1000)
        }
      })
      this.xg.on('canplay', () => {
        stallCount = 0
        clearTimeout(stallIptvTimeout)
      })
      this.xg.on('destroy', () => {
        stallCount = 0
        clearTimeout(stallIptvTimeout)
      })

      this.xg.on('exitFullscreen', () => {
        if (this.miniMode) this.xg.getCssFullscreen()
      })

      this.xg.on('volumechange', () => {
        this.config.volume = this.xg.volume.toFixed(2)
        const volume = this.config.volume
        setTimeout(() => { if (volume === this.config.volume) setting.find().then(res => { res.volume = this.config.volume; setting.update(res) }) }, 500)
      })

      this.xg.on('timeupdate', () => {
        if (this.isLive) return
        const key = this.video.key + '@' + this.video.info.id
        if (VIDEO_DETAIL_CACHE[key] && VIDEO_DETAIL_CACHE[key].endPosition) {
          const time = this.xg.duration - VIDEO_DETAIL_CACHE[key].endPosition - this.xg.currentTime
          if (time > 0 && time < 0.3) { // timeupdate每0.25秒触发一次，只有自然播放到该点时才会跳过片尾
            if (!this.skipendStatus) {
              this.skipendStatus = true
              this.xg.emit('ended')
            }
          }
        }
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

      this.xg.on('videoStop', async () => {
        if (this.miniMode) await this.exitMiniEvent()
        this.videoStop()
      })

      this.xg.on('quitMiniMode', () => {
        if (this.miniMode) this.exitMiniEvent()
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

      this.xg.on('play', () => {
        clearTimeout(stallIptvTimeout)
        if (!this.video.key) {
          if (!this.video.iptv && !this.video.info.ids) {
            // 如果当前播放页面的播放信息没有被赋值,播放历史记录
            if (this.right.history.length === 0) {
              this.$message.error('历史记录为空，无法播放！')
              this.videoStop()
              return
            }
            const historyItem = this.right.history[0]
            this.video = { key: historyItem.site, info: { id: historyItem.ids, name: historyItem.name, index: historyItem.index } }
          } else if (this.video.iptv && !this.isLive) {
            this.playChannel(this.video.iptv)
            this.state.showChannelList = false
          }
        }
      })
    },
    videoStop () {
      if (this.xg.fullscreen) {
        this.xg.exitFullscreen()
      }
      clearInterval(this.timer)
      this.video.key = ''
      this.name = ''
      this.isLive = false
      this.state.showChannelList = true
      this.state.showTimespanSetting = false
      this.right.list = []
      this.getAllhistory()
      if (this.playerType === 'flv') this.xg.destroy()
      this.getPlayer('hls', true)
    },
    minMaxEvent () {
      win.on('minimize', () => {
        if (this.xg && this.xg.hasStart && this.setting.pauseWhenMinimize) {
          this.xg.pause()
        }
      })
      win.on('restore', () => {
        if (this.xg && this.xg.hasStart) {
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
      Player.install('quitMiniMode', function () {
        addPlayerBtn.bind(this, 'quitMiniMode', '<svg t="1606051549980" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2510" style="width: 22px;height: 22px;margin-top: 9px;margin-left: 6px;"><path d="M224 704c-8 0-16-3.2-22.4-9.6l-160-160c-12.8-12.8-12.8-32 0-44.8l160-160c12.8-12.8 32-12.8 44.8 0 12.8 12.8 12.8 32 0 44.8L108.8 512l137.6 137.6c12.8 12.8 12.8 32 0 44.8-6.4 6.4-14.4 9.6-22.4 9.6z m416-160H80c-17.6 0-32-14.4-32-32s14.4-32 32-32h560c17.6 0 32 14.4 32 32s-14.4 32-32 32z m192 384H480c-52.8 0-96-43.2-96-96V704c0-17.6 14.4-32 32-32s32 14.4 32 32v128c0 17.6 14.4 32 32 32h352c17.6 0 32-14.4 32-32V192c0-17.6-14.4-32-32-32H480c-17.6 0-32 14.4-32 32v128c0 17.6-14.4 32-32 32s-32-14.4-32-32V192c0-52.8 43.2-96 96-96h352c52.8 0 96 43.2 96 96v640c0 52.8-43.2 96-96 96z" p-id="2511" fill="#ffffff"></path></svg>',
          { title: '退出精简模式' })()
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
      if (this.right.type === 'shortcut') {
        this.right.show = false
        this.right.type = ''
      } else {
        this.right.show = true
        shortcut.all().then(res => {
          this.right.type = 'shortcut'
          this.right.shortcut = res
        })
      }
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
.xgplayer-skin-default .xg-btn-videoStop,
.xgplayer-skin-default .xg-btn-quitMiniMode {
  width: 32px;
  position: relative;
  -webkit-order: 0;
  -moz-box-ordinal-group: 1;
  order: 0;
  display: block;
  cursor: pointer;
  margin-left: 3px;
}
.xgplayer-skin-default .xg-btn-playPrev {
  margin-left: 50px;
}
.xgplayer-skin-default .xg-btn-quitMiniMode {
  display: none;
}
.xgplayer-skin-default .xg-btn-playPrev:hover,
.xgplayer-skin-default .xg-btn-playNextOne:hover,
.xgplayer-skin-default .xg-btn-showList:hover,
.xgplayer-skin-default .xg-btn-showHistory:hover,
.xgplayer-skin-default .xg-btn-videoStop:hover,
.xgplayer-skin-default .xg-btn-quitMiniMode:hover {
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

.xgplayer-skin-default .xg-btn-quitMiniMode {
  order: 4;
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
          display: inline-block;
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
      .timespan{
        margin-left: auto;
        justify-content: space-between;
        align-items: center;
        input{
          &::-webkit-inner-spin-button, &::-webkit-outer-spin-button {
            opacity: 1;
          }
        }
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
