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
      <div class="detail-body zy-scroll" v-show="!loading">
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
          <span @click="playEvent(0)">播放</span>
          <span @click="starEvent">收藏</span>
          <span @click="downloadEvent">下载</span>
          <span @click="shareEvent">分享</span>
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
          class="desc" v-show="info.des">{{info.des}}</div>
        <div class="m3u8">
          <div class="box">
            <span v-for="(i, j) in m3u8List" :key="j" @click="playEvent(j)">{{i | ftName}}</span>
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
import zy from '../lib/site/tools'
import onlineVideo from '../lib/site/onlineVideo'
import { star, history } from '../lib/dexie'
const { clipboard } = require('electron')
export default {
  name: 'detail',
  data () {
    return {
      loading: true,
      m3u8List: [],
      info: {},
      playOnline: false,
      selectedOnlineSite: '哔嘀',
      onlineSites: ['哔嘀', '素白白', '简影', '极品', '喜欢看', '1080影视']
    }
  },
  filters: {
    ftName (e) {
      const name = e.split('$')[0]
      return name
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
    }
  },
  methods: {
    ...mapMutations(['SET_VIEW', 'SET_VIDEO', 'SET_DETAIL', 'SET_SHARE']),
    close () {
      this.detail.show = false
    },
    m3u8Parse (e) {
      const dd = e.dl.dd
      const type = Object.prototype.toString.call(dd)
      if (type === '[object Array]') {
        for (const i of dd) {
          if (i._flag.indexOf('m3u8') >= 0) {
            this.m3u8List = i._t.split('#')
          }
        }
      } else {
        this.m3u8List = dd._t.split('#')
      }
    },
    playEvent (n) {
      if (!this.playOnline) {
        history.find({ site: this.detail.key, ids: this.detail.info.id }).then(res => {
          if (res) {
            this.video = { key: res.site, info: { id: res.ids, name: res.name, index: n, site: this.detail.site } }
          } else {
            this.video = { key: this.detail.key, info: { id: this.detail.info.id, name: this.detail.info.name, index: n, site: this.detail.site } }
          }
        })
        this.view = 'Play'
        this.detail.show = false
      } else {
        history.find({ site: this.detail.key, ids: this.detail.info.id }).then(res => {
          if (res) {
            res.index = n
            history.update(res.id, res)
          } else {
            const doc = {
              site: this.detail.key,
              ids: this.detail.info.id,
              name: this.detail.info.name,
              type: this.detail.info.type,
              year: this.detail.info.year,
              index: n,
              time: ''
            }
            history.add(doc)
          }
        })
        onlineVideo.playVideoOnline(this.selectedOnlineSite, this.detail.info.name, n)
      }
    },
    starEvent () {
      star.find({ key: this.detail.key, ids: this.info.id }).then(res => {
        if (res) {
          this.$message.info('该影片已被收藏')
        } else {
          const docs = {
            key: this.detail.key,
            ids: this.info.id,
            site: this.detail.site,
            name: this.info.name,
            type: this.info.type,
            year: this.info.year,
            note: this.info.note,
            last: this.info.last

          }
          star.add(docs).then(res => {
            this.$message.success('收藏成功')
          })
        }
      }).catch(() => {
        this.$message.warning('收藏失败')
      })
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
      zy.download(this.detail.key, this.info.id).then(res => {
        if (res && res.dl && res.dl.dd) {
          const text = res.dl.dd._t
          if (text) {
            const list = text.split('#')
            let downloadUrl = res.name + '\n'
            for (const i of list) {
              const url = encodeURI(i.split('$')[1])
              downloadUrl += (url + '\n')
            }
            clipboard.writeText(downloadUrl)
            this.$message.success('『MP4』格式的链接已复制, 快去下载吧!')
          } else {
            this.$message.warning('没有查询到下载链接.')
          }
        } else {
          const list = [...this.m3u8List]
          let downloadUrl = this.detail.info.name + '\n'
          for (const i of list) {
            const url = encodeURI(i.split('$')[1])
            downloadUrl += (url + '\n')
          }
          clipboard.writeText(downloadUrl)
          this.$message.success('『M3U8』格式的链接已复制, 快去下载吧!')
        }
      })
    },
    shareEvent () {
      this.share = {
        show: true,
        key: this.detail.key,
        info: this.detail.info
      }
    },
    doubanLinkEvent () {
      const open = require('open')
      const axios = require('axios')
      const cheerio = require('cheerio')
      const name = this.detail.info.name.trim()
      // 豆瓣搜索链接
      var doubanSearchLink = 'https://www.douban.com/search?q=' + name
      var link = doubanSearchLink
      axios.get(doubanSearchLink).then(res => {
        const $ = cheerio.load(res.data)
        // 比较第一和第二豆瓣搜索结果, 如果名字相符， 就打开该链接，否则打开搜索页面
        var nameInDouban = $($('div.result')[0]).find('div>div>h3>a').first()
        if (name.replace(/\s/g, '') === nameInDouban.text().replace(/\s/g, '')) {
          link = nameInDouban.attr('href')
        } else {
          nameInDouban = $($('div.result')[1]).find('div>div>h3>a').first()
          if (name.replace(/\s/g, '') === nameInDouban.text().replace(/\s/g, '')) {
            link = nameInDouban.attr('href')
          }
        }
        open(link)
      })
    },
    getDoubanRate () {
      const axios = require('axios')
      const cheerio = require('cheerio')
      const name = this.detail.info.name.trim()
      // 豆瓣搜索链接
      var doubanSearchLink = 'https://www.douban.com/search?q=' + name
      axios.get(doubanSearchLink).then(res => {
        const $ = cheerio.load(res.data)
        // 比较第一和第二给豆瓣搜索结果, 看名字是否相符
        var link = ''
        var nameInDouban = $($('div.result')[0]).find('div>div>h3>a').first()
        if (name.replace(/\s/g, '') === nameInDouban.text().replace(/\s/g, '')) {
          link = nameInDouban.attr('href')
        } else {
          nameInDouban = $($('div.result')[1]).find('div>div>h3>a').first()
          if (name.replace(/\s/g, '') === nameInDouban.text().replace(/\s/g, '')) {
            link = nameInDouban.attr('href')
          }
        }
        // 如果找到链接，就打开该链接获取评分
        if (link) {
          axios.get(link).then(response => {
            const parsedHtml = cheerio.load(response.data)
            var rating = parsedHtml('body').find('#interest_sectl').first().find('strong').first()
            if (rating.text()) {
              this.info.rate = rating.text()
            } else {
              this.info.rate = '暂无评分'
            }
          })
        } else {
          this.info.rate = '暂无评分'
        }
      })
    },
    getDetailInfo () {
      const id = this.detail.info.ids || this.detail.info.id
      zy.detail(this.detail.key, id).then(res => {
        if (res) {
          this.info = res
          this.$set(this.info, 'rate', '')
          this.m3u8Parse(res)
          this.getDoubanRate()
          this.loading = false
        }
      })
      const _hmt = window._hmt
      const name = this.detail.info.name
      _hmt.push(['_trackEvent', 'detail', 'view', name])
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
