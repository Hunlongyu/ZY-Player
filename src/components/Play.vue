<template>
  <div class="play">
    <div class="box">
      <div class="title">{{name}}</div>
      <div id="xg"></div>
      <div class="more" v-show="more">
        <span @click="nextEvent" v-show="showNext">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="forwardIconTitle">
            <title id="forwardIconTitle">下一集</title>
            <path d="M10 14.74L3 19V5l7 4.26V5l12 7-12 7v-4.26z"></path>
          </svg>
        </span>
        <span @click="listEvent" :class="right.type === 'list' ? 'active' : ''" v-show="right.listData.length > 0">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="dashboardIconTitle">
            <title id="dashboardIconTitle">播放列表</title>
            <rect width="20" height="20" x="2" y="2"></rect>
            <path d="M11 7L17 7M11 12L17 12M11 17L17 17"></path>
            <line x1="7" y1="7" x2="7" y2="7"></line>
            <line x1="7" y1="12" x2="7" y2="12"></line>
            <line x1="7" y1="17" x2="7" y2="17"></line>
          </svg>
        </span>
        <span @click="historyEvent" :class="right.type === 'history' ? 'active' : ''">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="timeIconTitle">
            <title id="timeIconTitle">历史记录</title>
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 5 12 12 16 16"></polyline>
          </svg>
        </span>
        <span @click="starEvent" :class="isStar ? 'active' : ''" v-show="right.listData.length > 0">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="favouriteIconTitle">
            <title id="favouriteIconTitle">收藏</title>
            <path d="M12,21 L10.55,19.7051771 C5.4,15.1242507 2,12.1029973 2,8.39509537 C2,5.37384196 4.42,3 7.5,3 C9.24,3 10.91,3.79455041 12,5.05013624 C13.09,3.79455041 14.76,3 16.5,3 C19.58,3 22,5.37384196 22,8.39509537 C22,12.1029973 18.6,15.1242507 13.45,19.7149864 L12,21 Z"></path>
          </svg>
        </span>
        <span @click="topEvent" :class="isTop ? 'active' : ''" v-show="right.listData.length > 0">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="arrowUpIconTitle">
            <title id="arrowUpIconTitle">置顶</title>
            <path d="M9 10.5l3-3 3 3"></path>
            <path d="M12 16.5V9"></path>
            <path stroke-linecap="round" d="M12 7.5V9"></path>
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
        </span>
        <span @click="detailEvent" v-show="right.listData.length > 0">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="feedIconTitle">
            <title id="feedIconTitle">详情</title>
            <circle cx="7.5" cy="7.5" r="2.5"></circle>
            <path d="M22 13H2"></path>
            <path d="M18 6h-5m5 3h-5"></path>
            <path d="M5 2h14a3 3 0 0 1 3 3v17H2V5a3 3 0 0 1 3-3z"></path>
          </svg>
        </span>
        <!-- <span @click="smallEvent" v-show="right.listData.length > 0">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="tvIconTitle">
            <title id="tvIconTitle">精简模式</title>
            <polygon points="20 8 20 20 4 20 4 8"></polygon>
            <polyline stroke-linejoin="round" points="8 4 12 7.917 16 4"></polyline>
          </svg>
        </span> -->
        <span @click="shareEvent" v-show="right.listData.length > 0">
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
          <span class="list-top-close" @click="closeEvent">
            <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="closeIconTitle">
              <title id="closeIconTitle">关闭</title>
              <path d="M6.34314575 6.34314575L17.6568542 17.6568542M6.34314575 17.6568542L17.6568542 6.34314575"></path>
            </svg>
          </span>
        </div>
        <div class="list-body" :style="{overflowY:scroll? 'auto' : 'hidden',paddingRight: scroll ? '0': '5px' }" @mouseenter="scroll = true" @mouseleave="scroll = false">
          <ul v-show="right.type === 'list'">
            <li v-show="right.listData.length === 0">无数据</li>
            <li @click="listItemEvent(j)" :class="video.index === j ? 'active' : ''" v-for="(i, j) in right.listData" :key="j">{{i | ftName}}</li>
          </ul>
          <ul v-show="right.type === 'history'">
            <li v-show="right.historyData.length > 1" @click="clearAll">清空数据</li>
            <li v-show="right.historyData.length === 0">无数据</li>
            <li @click="historyItemEvent(m)" v-for="(m, n) in right.historyData" :key="n"><span class="title">{{m.name}}</span><span @click.stop="removeItem(m)" class="delete">删除</span></li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import tools from '../lib/site/tools'
import history from '../lib/dexie/history'
import video from '../lib/dexie/video'
import 'xgplayer'
import Hls from 'xgplayer-hls.js'
// const { ipcRenderer: ipc } = require('electron')
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
        fluid: true,
        autoplay: false,
        videoInit: true,
        screenShot: true,
        keyShortcut: 'on',
        crossOrigin: true,
        defaultPlaybackRate: 1,
        playbackRate: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4, 5]
      },
      name: '',
      timer: null,
      scroll: false,
      more: true,
      showNext: false,
      isStar: false,
      isTop: false
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
      if (this.timer !== null) {
        clearInterval(this.timer)
        this.timer = null
      }
      if (this.xg) {
        this.xg.pause()
        this.xg.off('play', () => {
          console.log('play off')
        })
      }
      this.changeVideo()
      tools.detail_get(this.video.site, this.video.detail).then(res => {
        this.name = this.video.name
        this.right.listData = res.m3u8_urls
        if (res.m3u8_urls.length > 1) {
          const m3 = res.m3u8_urls
          const arr = []
          for (const i of m3) {
            arr.push(i.split('$')[1])
          }
          this.xg.src = arr[this.video.index]
          this.showNext = true
        } else {
          const link = res.m3u8_urls[this.video.index]
          const src = link.split('$')[1]
          this.xg.src = src
          this.showNext = false
        }
        const currentTime = this.video.currentTime
        if (currentTime !== '') {
          this.xg.play()
          this.xg.once('playing', () => {
            this.xg.currentTime = currentTime
          })
        } else {
          this.xg.play()
        }
        this.onPlayVideo()
      })
    },
    changeVideo () {
      this.checkStar()
      this.checkTop()
      this.name = ''
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
    // checkTop () {
    //   ipc.send('checkTop')
    //   ipc.on('isTop', (e, flag) => {
    //     this.isTop = flag
    //   })
    // },
    onPlayVideo () {
      this.more = true
      const h = { ...this.video }
      history.find({ detail: h.detail }).then(res => {
        if (res) {
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
      }, 10000)
    },
    closeEvent () {
      this.right.show = false
      this.right.type = ''
    },
    nextEvent () {
      const v = { ...this.video }
      const i = v.index + 1
      if (i < this.right.listData.length) {
        this.video.index++
      } else {
        this.$message.warning('这是最后一集了.')
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
        if (res) {
          video.remove(this.video.id).then(r => {
            this.$message.info('删除成功')
            this.isStar = false
          })
        } else {
          const v = { ...this.video }
          if (v.id) {
            delete v.id
          }
          video.add(v).then(r => {
            this.$message.success('收藏成功')
            this.isStar = true
          })
        }
      })
    },
    topEvent () {
      ipc.send('top')
      this.checkTop()
    },
    detailEvent () {
      this.detail = {
        show: true,
        v: this.video
      }
    },
    smallEvent () {}, // TODO 小窗口模式
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
      this.video.index = n
    },
    historyItemEvent (e) {
      this.video = e
    },
    removeItem (e) {
      history.remove(e.id).then(res => {
        history.all().then(e => {
          this.right.historyData = e.reverse()
        })
      })
    }
  },
  mounted () {
    this.xg = new Hls(this.config)
  }
}
</script>
<style lang="scss" scoped>
.play{
  position: relative;
  height: 660px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 0 3px 1px -2px #8e8da233, 0 2px 2px 0 #8e8da224, 0 1px 5px 0 #8e8da21f;
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
        &:hover{
          svg{
            stroke: #823aa0ee;
            stroke-width: 1.5;
            fill: #823aa022;
          }
        }
        &.active{
          svg{
            stroke: #823aa0;
            stroke-width: 2;
            fill: #823aa033;
          }
        }
      }
      svg{
        width: 24px;
        height: 24px;
        stroke: #823aa099;
        stroke-width: 1;
        stroke-linecap: round;
        stroke-linejoin: round;
        fill: none;
      }
    }
  }
  .list{
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
    height: 100%;
    border: 1px solid #00000022;
    background-color: #fff;
    z-index: 555;
    border-radius: 3px;
    padding: 6px;
    display: flex;
    flex-direction: column;
    svg{
      width: 24px;
      height: 24px;
      stroke: #823aa099;
      stroke-width: 1;
      stroke-linecap: round;
      stroke-linejoin: round;
      fill: none;
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
      &::-webkit-scrollbar{
        width: 5px;
        height: 1px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 5px #823aa005;
        background: #823aa055;
        position: absolute;
      }
      &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px #823aa005;
        border-radius: 10px;
        background: #EDEDED;
        position: absolute;
      }
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
          color: #808695;
          &.active{
            background-color: #823aa011;
          }
          &:hover{
            background-color: #823aa011;
            .delete{
              display: inline-block;
            }
          }
          .title{
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 231px;
          }
          .delete{
            display: none;
            position: absolute;
            right: 0;
            height: 28px;
            width: 50px;
            text-align: center;
            &:hover{
              background-color: #823aa022;
            }
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
