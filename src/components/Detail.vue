<template>
  <div class="detail">
    <div class="detail-content">
      <div class="detail-header">
        <span class="detail-title">详情</span>
        <span class="detail-close zy-svg" @click="close">
          <svg
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            aria-labelledby="closeIconTitle"
          >
            <title id="closeIconTitle">关闭</title>
            <path d="M6.34314575 6.34314575L17.6568542 17.6568542M6.34314575 17.6568542L17.6568542 6.34314575"></path>
          </svg>
        </span>
      </div>
      <div class="detail-body zy-scroll listpage" v-show="!loading">
        <div class="info">
          <div class="info-left">
            <img :src="info.pic" alt="">
          </div>
          <div class="info-right">
            <div class="name">{{info.name}}</div>
            <div class="director" v-show="info.director">导演: {{info.director}}</div>
            <div class="actor" v-show="info.actor">主演: {{info.actor}}</div>
            <div class="type" v-show="info.type">类型: {{info.type}}</div>
            <div class="area" v-show="info.area">地区: {{info.area}}</div>
            <div class="lang" v-show="info.lang">语言: {{info.lang}}</div>
            <div class="year" v-show="info.year">上映: {{info.year}}</div>
            <div class="last" v-show="info.last">更新: {{info.last}}</div>
            <div class="note" v-show="info.note">备注: {{info.note}}</div>
            <div class="rate" v-show="info.rate">豆瓣评分: {{info.rate}}</div>
          </div>
        </div>
        <div class="operate">
          <span @click="playEvent(selectedEpisode)">播放</span>
          <span @click="starEvent(info)">收藏</span>
          <span @click="downloadEvent">下载</span>
          <span @click="shareEvent(info,selectedEpisode)">分享</span>
          <span @click="doubanLinkEvent">豆瓣</span>
          <span @click="togglePlayOnlineEvent">
            <input type="checkbox" v-model="playOnline"> 播放在线高清视频
          </span>
          <span>
            <select v-model="selectedOnlineSite" class="vs-options">
              <option disabled value="">Please select one</option>
              <option v-for="(i, j) in onlineSites" :key="j">{{i}}</option>
            </select>
          </span>
        </div>
        <div
          class="desc" v-show="info.des">{{info.des}}
        </div>
        <div class="m3u8" v-if="videoFullList.length > 1">
          <div class="box">
            <span v-bind:class="{ selected: i.flag === videoFlag }" v-for="(i, j) in videoFullList" :key="j" @click="updateVideoList(i)">{{i.flag}}</span>
          </div>
        </div>
        <div class="m3u8">
          <div class="box">
            <span v-bind:class="{ selected: j === selectedEpisode }" v-for="(i, j) in videoList" :key="j" @click="playEvent(j)" @mouseenter="() => { selectedEpisode = j }">{{ i | ftName(j) }}</span>
          </div>
        </div>
        <div class="m3u8">
          <div class="show-picture" v-show="info.recommendations && info.recommendations.length > 0">
            <span>喜欢这部电影的人也喜欢 · · · · · ·</span>
            <Waterfall :list="info.recommendations" :gutter="20" :width="240"
            :breakpoints="{
            1200: { //当屏幕宽度小于等于1200
              rowPerView: 4,
            },
            800: { //当屏幕宽度小于等于800
              rowPerView: 3,
            },
            500: { //当屏幕宽度小于等于500
              rowPerView: 2,
            }
          }"
          animationEffect="fadeIn"
          backgroundColor="rgba(0, 0, 0, 0)">
            <template slot="item" slot-scope="props">
              <div class="card">
                <div class="img">
                  <img style="width: 100%" :src="props.data.pic" alt="" @click="detailEvent(props.data)">
                  <div class="operate">
                    <div class="operate-wrap">
                      <span class="o-play" @click="playRecommendationEvent(props.data)">播放</span>
                      <span class="o-star" @click="starEvent(props.data)">收藏</span>
                      <span class="o-share" @click="shareEvent(props.data, 0)">分享</span>
                    </div>
                  </div>
                </div>
                <div class="name">{{props.data.name}}</div>
                <div class="info">
                  <span>{{props.data.area}}</span>
                  <span>{{props.data.year}}</span>
                  <span>{{props.data.note}}</span>
                  <span>{{props.data.type}}</span>
                </div>
              </div>
            </template>
            </Waterfall>
          </div>
        </div>
      </div>
      <div class="detail-mask zy-loading" v-show="loading">
        <div class="loader"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import Waterfall from 'vue-waterfall-plugin'
import zy from '../lib/site/tools'
import onlineVideo from '../lib/site/onlineVideo'
import { star, history } from '../lib/dexie'
const { clipboard } = require('electron')
export default {
  name: 'detail',
  data () {
    return {
      loading: true,
      videoFlag: '',
      videoList: [],
      videoFullList: [],
      key: '',
      site: {},
      info: {},
      playOnline: false,
      selectedEpisode: 0, // 选定集数
      selectedOnlineSite: '哔嘀',
      onlineSites: ['哔嘀', '素白白', '简影', '极品', '喜欢看', '1080影视']
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
    detail: {
      get () {
        return this.$store.getters.getDetail
      },
      set (val) {
        this.SET_DETAIL(val)
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
    share: {
      get () {
        return this.$store.getters.getShare
      },
      set (val) {
        this.SET_SHARE(val)
      }
    },
    DetailCache: {
      get () {
        return this.$store.getters.getDetailCache
      },
      set (val) {
        this.SET_DetailCache(val)
      }
    }
  },
  components: {
    Waterfall
  },
  methods: {
    ...mapMutations(['SET_VIEW', 'SET_VIDEO', 'SET_DETAIL', 'SET_SHARE', 'SET_DetailCache']),
    async playRecommendationEvent (e) {
      const db = await history.find({ site: this.detail.key, ids: e.id })
      if (db) {
        this.video = { key: db.site, info: { id: db.ids, name: db.name, index: db.index, site: this.detail.site } }
      } else {
        this.video = { key: this.detail.key, info: { id: e.id, name: e.name, index: 0, site: this.detail.site } }
      }
      this.video.detail = e
      this.view = 'Play'
      this.detail.show = false
    },
    addClass (flag) {
      if (flag === this.videoFlag) {
        return 'selectedBox'
      } else {
        return 'box'
      }
    },
    close () {
      this.detail.show = false
    },
    async updateVideoList (e) {
      this.videoFlag = e.flag
      this.videoList = e.list
      const db = await history.find({ site: this.detail.key, ids: this.detail.info.id })
      if (db) {
        const doc = { ...db }
        doc.videoFlag = e.flag
        delete doc.id
        history.update(db.id, doc)
      }
    },
    async playEvent (n) {
      if (!this.playOnline) {
        const db = await history.find({ site: this.detail.key, ids: this.detail.info.id })
        if (db) {
          this.video = { key: db.site, info: { id: db.ids, name: db.name, index: n, site: this.detail.site, videoFlag: this.videoFlag } }
        } else {
          this.video = { key: this.detail.key, info: { id: this.detail.info.id, name: this.detail.info.name, index: n, site: this.detail.site, videoFlag: this.videoFlag } }
        }
        this.video.detail = this.info
        this.view = 'Play'
        this.detail.show = false
      } else {
        const db = await history.find({ site: this.detail.key, ids: this.info.id })
        if (db) {
          db.index = n
          db.detail = this.info
          history.update(db.id, db)
        } else {
          const doc = {
            site: this.detail.key,
            ids: this.detail.info.id,
            name: this.detail.info.name,
            type: this.detail.info.type,
            year: this.detail.info.year,
            index: n,
            time: '',
            detail: this.info
          }
          history.add(doc)
        }
        onlineVideo.playVideoOnline(this.selectedOnlineSite, this.detail.info.name, n)
      }
    },
    async starEvent (info) {
      const db = await star.find({ key: this.detail.key, ids: info.id })
      const doc = {
        key: this.detail.key,
        ids: info.id,
        site: this.detail.site,
        name: info.name,
        detail: info,
        rate: info.rate
      }
      if (db) {
        star.update(db.id, doc)
        this.$message.success('收藏更新成功')
      } else {
        star.add(doc).then(res => {
          this.$message.success('收藏成功')
        })
      }
    },
    detailEvent (info) {
      this.detail.info = info
      this.getDetailInfo()
    },
    togglePlayOnlineEvent () {
      this.playOnline = !this.playOnline
    },
    playVideoOnline (videoName, videoIndex) {
      switch (this.selectedOnlineSite) {
        case '哔嘀':
          onlineVideo.playVideoOnBde4(videoName, videoIndex)
          break
        case '1080影视':
          onlineVideo.playVideoOnK1080(videoName, videoIndex)
          break
        case '素白白':
          onlineVideo.playVideoOnSubaibai(videoName, videoIndex)
          break
        case '哆咪动漫':
          onlineVideo.playVideoOndmdm2020(videoName, videoIndex)
          break
        case '樱花动漫':
          onlineVideo.playVideoOnYhdm(videoName, videoIndex)
          break
        case '简影':
          onlineVideo.playVideoOnSyrme(videoName, videoIndex)
          break
        case '极品':
          onlineVideo.playVideoOnJpysvip(videoName, videoIndex)
          break
        default:
          this.$message.console.error(`不支持该网站：${this.selectedOnlineSite}`)
      }
    },
    downloadEvent () {
      zy.download(this.detail.key, this.info.id, this.videoFlag).then(res => {
        clipboard.writeText(res.downloadUrls)
        this.$message.success(res.info)
      }).catch((err) => {
        this.$message.error(err.info)
      })
    },
    shareEvent (info, selectedEpisode) {
      this.share = {
        show: true,
        key: this.detail.key,
        info: info,
        index: selectedEpisode
      }
    },
    doubanLinkEvent () {
      const name = this.info.name.trim()
      const year = this.info.year
      zy.doubanLink(name, year).then(link => {
        const open = require('open')
        open(link)
      })
    },
    async getDoubanRate () {
      const name = this.info.name.trim()
      const year = this.info.year
      this.info.rate = await zy.doubanRate(name, year)
      const recommendations = await zy.doubanRecommendations(name, year)
      if (recommendations) {
        this.info.recommendations = []
        recommendations.forEach(element => {
          zy.searchFirstDetail(this.detail.key, element).then(detailRes => {
            if (detailRes) {
              this.info.recommendations.push(detailRes)
            }
          })
        })
      }
    },
    async getDetailInfo () {
      const id = this.detail.info.ids || this.detail.info.id
      const cacheKey = this.detail.key + '@' + id
      const db = await history.find({ site: this.detail.key, ids: id })
      if (db) {
        this.videoFlag = db.videoFlag
        this.selectedEpisode = db.index
      }
      if (!this.DetailCache[cacheKey]) {
        this.DetailCache[cacheKey] = await zy.detail(this.detail.key, id)
      }
      const res = this.DetailCache[cacheKey]
      if (res) {
        this.info = res
        this.$set(this.info, 'rate', this.DetailCache[cacheKey].rate || '')
        this.$set(this.info, 'recommendations', this.DetailCache[cacheKey].recommendations || [])
        this.videoFlag = this.videoFlag || res.fullList[0].flag
        this.videoList = res.fullList[0].list
        this.videoFullList = res.fullList
        this.loading = false
        if (!this.info.rate) {
          await this.getDoubanRate()
          this.DetailCache[cacheKey] = this.info
        }
      }
    }
  },
  created () {
    this.getDetailInfo()
  }
}
</script>
<style lang="scss" scoped>
.detail {
  position: absolute;
  left: 80px;
  right: 20px;
  bottom: 0;
  width: calc(100% - 100px);
  height: calc(100% - 40px);
  z-index: 888;
  .detail-content {
    height: calc(100% - 10px);
    padding: 0 60px;
    position: relative;
    .detail-header {
      width: 100%;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .detail-title {
        font-size: 16px;
      }
      .detail-close {
        cursor: pointer;
      }
    }
  }
  .detail-body {
    height: calc(100% - 50px);
    overflow-y: auto;
    .info {
      width: 100%;
      padding: 10px;
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: flex-start;
      border: 1px solid;
      border-radius: 2px;
      margin-bottom: 10px;
      height: auto;
      .info-left {
        width: 200px;
        height: 100%;
        img {
          width: 100%;
          height: auto;
        }
      }
      .info-right {
        flex: 1;
        margin-left: 20px;
        .name {
          font-size: 20px;
          margin-bottom: 10px;
          font-weight: bold;
        }
        .director,
        .actor,
        .type,
        .area,
        .lang,
        .year,
        .last,
        .note {
          font-size: 14px;
          line-height: 26px;
        }
        .rate {
          font-size: 16px;
          line-height: 26px;
          font-weight: bolder;
        }
      }
    }
    .operate {
      border: 1px solid;
      padding: 10px;
      width: 100%;
      margin-bottom: 10px;
      border-radius: 2px;
      span {
        margin-right: 20px;
        font-size: 14px;
        cursor: pointer;
        user-select: none;
      }
    }
    .desc {
      border: 1px solid;
      padding: 10px;
      width: 100%;
      margin-bottom: 10px;
      border-radius: 2px;
      font-size: 14px;
      line-height: 20px;
    }
    .m3u8 {
      border: 1px solid;
      padding: 10px 0 10px 10px;
      width: 100%;
      margin-bottom: 10px;
      border-radius: 2px;
      .box {
        width: 100%;
        span {
          display: inline-block;
          font-size: 12px;
          border: 1px solid;
          border-radius: 2px;
          cursor: pointer;
          margin: 6px 10px 0px 0px;
          padding: 8px 22px;
        }
        .selected {
          display: inline-block;
          font-size: 12px;
          border: 1px solid;
          border-radius: 2px;
          cursor: pointer;
          margin: 6px 10px 0px 0px;
          padding: 8px 22px;
        }
      }
    }
  }
  .detail-mask {
    position: absolute;
    top: 50px;
    left: 0;
    width: 100%;
    height: calc(100% - 50px);
    display: flex;
    justify-content: center;
    align-items: center;
    .loader {
      font-size: 8px;
      width: 1em;
      height: 1em;
      border-radius: 50%;
      position: relative;
      text-indent: -9999em;
      animation: load4 1.3s infinite linear;
      transform: translateZ(0);
    }
    @keyframes load4 {
      0%,
      100% {
        box-shadow: 0 -3em 0 0.2em, 2em -2em 0 0em, 3em 0 0 -1em, 2em 2em 0 -1em,
          0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 0;
      }
      12.5% {
        box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em, 3em 0 0 0, 2em 2em 0 -1em,
          0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
      }
      25% {
        box-shadow: 0 -3em 0 -0.5em, 2em -2em 0 0, 3em 0 0 0.2em, 2em 2em 0 0,
          0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
      }
      37.5% {
        box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 0, 2em 2em 0 0.2em,
          0 3em 0 0em, -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
      }
      50% {
        box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 0em,
          0 3em 0 0.2em, -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
      }
      62.5% {
        box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em,
          0 3em 0 0, -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
      }
      75% {
        box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 -1em,
          2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0.2em,
          -2em -2em 0 0;
      }
      87.5% {
        box-shadow: 0em -3em 0 0, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em,
          0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
      }
    }
  }
}
</style>
