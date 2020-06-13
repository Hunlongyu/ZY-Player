<template>
  <div class="play">
    <div class="box">
      <div class="title" v-if="length === 1">{{name}}</div>
      <div class="title" v-if="length > 1">『第 {{(video.index + 1)}} 集』 {{name}}</div>
      <div class="xgBox">
        <div id="xg"></div>
      </div>
      <div class="mask zy-loading" v-show="mask">
        <div class="loader"></div>
      </div>
      <div class="more" v-show="more">
        <span class="zy-svg" @click="nextEvent" v-show="showNext">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="forwardIconTitle">
            <title id="forwardIconTitle">{{$t('next')}}</title>
            <path d="M10 14.74L3 19V5l7 4.26V5l12 7-12 7v-4.26z"></path>
          </svg>
        </span>
        <span class="zy-svg" @click="listEvent" :class="right.type === 'list' ? 'active' : ''" v-show="right.listData.length > 0">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="dashboardIconTitle">
            <title id="dashboardIconTitle">{{$t('play_list')}}</title>
            <rect width="20" height="20" x="2" y="2"></rect>
            <path d="M11 7L17 7M11 12L17 12M11 17L17 17"></path>
            <line x1="7" y1="7" x2="7" y2="7"></line>
            <line x1="7" y1="12" x2="7" y2="12"></line>
            <line x1="7" y1="17" x2="7" y2="17"></line>
          </svg>
        </span>
        <span class="zy-svg" @click="historyEvent" :class="right.type === 'history' ? 'active' : ''">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="timeIconTitle">
            <title id="timeIconTitle">{{$t('history')}}</title>
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 5 12 12 16 16"></polyline>
          </svg>
        </span>
        <span class="zy-svg" @click="starEvent" :class="isStar ? 'active' : ''" v-show="right.listData.length > 0">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="favouriteIconTitle">
            <title id="favouriteIconTitle">{{$t('star')}}</title>
            <path d="M12,21 L10.55,19.7051771 C5.4,15.1242507 2,12.1029973 2,8.39509537 C2,5.37384196 4.42,3 7.5,3 C9.24,3 10.91,3.79455041 12,5.05013624 C13.09,3.79455041 14.76,3 16.5,3 C19.58,3 22,5.37384196 22,8.39509537 C22,12.1029973 18.6,15.1242507 13.45,19.7149864 L12,21 Z"></path>
          </svg>
        </span>
        <span class="zy-svg" @click="detailEvent" v-show="right.listData.length > 0">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="feedIconTitle">
            <title id="feedIconTitle">{{$t('detail')}}</title>
            <circle cx="7.5" cy="7.5" r="2.5"></circle>
            <path d="M22 13H2"></path>
            <path d="M18 6h-5m5 3h-5"></path>
            <path d="M5 2h14a3 3 0 0 1 3 3v17H2V5a3 3 0 0 1 3-3z"></path>
          </svg>
        </span>
        <span class="zy-svg" @click="smallEvent" v-show="right.listData.length > 0">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="tvIconTitle">
            <title id="tvIconTitle">{{$t('mini')}}</title>
            <polygon points="20 8 20 20 4 20 4 8"></polygon>
            <polyline stroke-linejoin="round" points="8 4 12 7.917 16 4"></polyline>
          </svg>
        </span>
        <span class="zy-svg" @click="shareEvent" v-show="right.listData.length > 0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-labelledby="qrIconTitle">
            <title id="qrIconTitle">{{$t('share')}}</title>
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
          <span class="list-top-title">{{ right.type === 'list' ? $t('play_list') : $t('history') }}</span>
          <span class="list-top-close zy-svg" @click="closeEvent">
            <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="closeIconTitle">
              <title id="closeIconTitle">{{$t('close')}}</title>
              <path d="M6.34314575 6.34314575L17.6568542 17.6568542M6.34314575 17.6568542L17.6568542 6.34314575"></path>
            </svg>
          </span>
        </div>
        <div class="list-body zy-scroll" :style="{overflowY:scroll? 'auto' : 'hidden',paddingRight: scroll ? '0': '5px' }" @mouseenter="scroll = true" @mouseleave="scroll = false">
          <ul v-show="right.type === 'list'" class="list-item">
            <li v-show="right.listData.length === 0">{{$t('no_data')}}</li>
            <li @click="listItemEvent(j)" :class="video.index === j ? 'active' : ''" v-for="(i, j) in right.listData" :key="j">{{i | ftName}}</li>
          </ul>
          <ul v-show="right.type === 'history'" class="list-history">
            <li v-show="right.historyData.length > 1" @click="clearAll">{{$t('clear_data')}}</li>
            <li v-show="right.historyData.length === 0">{{$t('no_data')}}</li>
            <li @click="historyItemEvent(m)" :class="video.detail === m.detail ? 'active' : ''" v-for="(m, n) in right.historyData" :key="n"><span class="title">{{m.name}}</span><span @click.stop="removeItem(m)" class="detail-delete">{{$t('delete')}}</span></li>
          </ul>
        </div>
      </div>
    </transition>
    <div class="play-mask" v-if="right.listData.length === 0 && right.historyData.length === 0">{{$t('no_history')}}</div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import tools from '../lib/site/tools'
import history from '../lib/dexie/history'
import video from '../lib/dexie/video'
import mini from '../lib/dexie/mini'
import 'xgplayer'
import Hls from 'xgplayer-hls.js'
const { ipcRenderer: ipc } = require('electron')
export default {
  name: 'play',
  data () {
    return {
      xg: null,
      right: {
        show: false,
        type: '',
        listData: [],
        historyData: []
      },
      config: {
        id: 'xg',
        lang: 'zh-cn',
        url: '',
        width: '100%',
        height: '100%',
        autoplay: false,
        videoInit: true,
        screenShot: true,
        keyShortcut: 'on',
        crossOrigin: true,
        cssFullscreen: true,
        defaultPlaybackRate: 1,
        playbackRate: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4, 5]
      },
      name: '',
      length: 0,
      timer: null,
      scroll: false,
      more: true,
      showNext: false,
      isStar: false,
      isTop: false,
      mask: false
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
    }
  },
  filters: {
    ftName (e) {
      return e.split('$')[0]
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
    }
  },
  methods: {
    ...mapMutations(['SET_VIEW', 'SET_DETAIL', 'SET_VIDEO', 'SET_SHARE']),
    getUrls () {
      this.name = ''
      this.mask = true
      if (this.timer !== null) {
        clearInterval(this.timer)
        this.timer = null
      }

      if (this.xg) {
        if (this.xg.hasStart) {
          this.xg.pause()
        }
      }

      const index = this.video.index
      let time = 0

      history.find({ detail: this.video.detail }).then(item => {
        if (item) {
          if (item.index === index) {
            time = item.currentTime
          }
        }
        this.playVideo(index, time)
      })
    },
    playVideo (index, time) {
      tools.detail_get(this.video.site, this.video.detail).then(res => {
        this.name = res.name
        this.right.listData = res.m3u8_urls

        const m = res.m3u8_urls
        const arr = []
        for (const i of m) {
          arr.push(i.split('$')[1])
        }
        this.length = arr.length
        this.xg.src = arr[index]
        this.showNext = this.length > 1

        if (time !== 0) {
          this.xg.play()
          this.xg.once('playing', () => {
            this.xg.currentTime = time
          })
        } else {
          this.xg.play()
        }
        this.xg.once('play', () => {
          this.mask = false
        })
        this.onPlayVideo()
        this.xg.once('ended', () => {
          if (res.m3u8_urls.length > 1 && (res.m3u8_urls.length - 1 > this.video.index)) {
            this.video.currentTime = 0
            this.video.index++
          }
          this.xg.off('ended')
        })
      })
    },
    changeVideo () {
      this.checkStar()
      this.checkTop()
    },
    checkStar () {
      video.find({ detail: this.video.detail }).then(res => {
        if (res) {
          this.isStar = true
        } else {
          this.isStar = false
        }
      })
    },
    checkTop () {
      ipc.send('checkTop')
      ipc.on('isTop', (e, flag) => {
        this.isTop = flag
      })
    },
    onPlayVideo () {
      this.more = true
      this.changeVideo()
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
            const h = { ...this.video }
            h.currentTime = this.xg.currentTime
            delete h.id
            history.update(res.id, h)
          }
        })
        video.find({ detail: d }).then(res => {
          if (res) {
            const h = { ...this.video }
            delete h.id
            delete h.currentTime
            video.update(res.id, h)
          }
        })
      }, 10000)
    },
    closeEvent () {
      this.right.show = false
      this.right.type = ''
    },
    nextEvent () {
      if (this.video.index < this.right.listData.length - 1) {
        this.video.index++
        this.video.currentTime = 0
      } else {
        this.$m.warning(this.$t('last_video'))
      }
    },
    prevEvent () {
      if (this.video.index > 0) {
        this.video.index--
        this.video.currentTime = 0
      } else {
        this.$m.warning(this.$t('first_video'))
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
        this.right.historyData = res.reverse()
      })
    },
    starEvent () {
      video.find({ detail: this.video.detail }).then(res => {
        if (res !== undefined) {
          video.remove(res.id).then(r => {
            this.$m.info(this.$t('delete_success'))
            this.isStar = false
          })
        } else {
          const v = { ...this.video }
          if (v.id) {
            delete v.id
          }
          video.add(v).then(r => {
            this.$m.success(this.$t('star_success'))
            this.isStar = true
          })
        }
      })
    },
    detailEvent () {
      this.detail = {
        show: true,
        v: this.video
      }
    },
    smallEvent () {
      this.xg.pause()
      mini.find().then(res => {
        const d = { ...this.video }
        d.currentTime = this.xg.currentTime
        d.id = 0
        if (res) {
          mini.update(d)
        } else {
          mini.add(d)
        }
        ipc.send('min')
        ipc.send('mini')
      })
    },
    shareEvent () {
      this.share = {
        show: true,
        v: this.video
      }
    },
    clearAll () {
      history.clear().then(res => {
        this.right.historyData = []
      })
    },
    listItemEvent (n) {
      history.find({ detail: this.video.detail }).then(item => {
        if (item) {
          item.currentTime = 0
          item.index = n
          history.update(item.id, item)
        }
        this.video.index = n
        this.right.show = false
        this.right.type = ''
      })
    },
    historyItemEvent (e) {
      this.video = e
      this.right.show = false
      this.right.type = ''
    },
    removeItem (e) {
      history.remove(e.id).then(res => {
        history.all().then(e => {
          this.right.historyData = e.reverse()
        })
      })
    },
    playbackRateEvent (e) {
      let rate = this.xg.playbackRate
      if (rate > 0.25) {
        rate = rate + e
        this.xg.playbackRate = rate
        this.$m.success(this.$t('rate') + rate)
      }
    }
  },
  mounted () {
    this.xg = new Hls(this.config)
    history.all().then(res => {
      this.right.historyData = res
    })
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
    width: 92%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .title{
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    .xgBox{
      width: 100%;
      height: 500px;
      flex: 1;
    }
    .more{
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      span{
        display: flex;
        margin-right: 10px;
        cursor: pointer;
      }
    }
    .mask{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 600;
      opacity: 0.98;
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
  .play-mask{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 900;
    display: flex;
    font-size: 14px;
    border-radius: 5px;
    justify-content: center;
    align-items: center;
  }
}
</style>
