<template>
  <div class="film">
    <div class="header">
      <div class="zy-select" @mouseleave="show.site = false">
        <div class="vs-placeholder" @click="show.site = true">{{site.name}}</div>
        <div class="vs-options" v-show="show.site">
          <ul class="zy-scroll" style="max-height: 600px;">
            <li :class="site.key === i.key ? 'active' : ''" v-for="i in sites" :key="i.key" @click="siteClick(i)">{{ i.name }}</li>
          </ul>
        </div>
      </div>
      <div class="zy-select" @mouseleave="show.classList = false" v-show="show.class">
        <div class="vs-placeholder" @click="show.classList = true">{{type.name}}</div>
        <div class="vs-options" v-show="show.classList">
          <ul class="zy-scroll" style="max-height: 600px;">
            <li :class="type.tid === i.tid ? 'active' : ''" v-for="i in classList" :key="i.tid" @click="classClick(i)">{{ i.name }}</li>
          </ul>
        </div>
      </div>
      <div class="zy-select" @mouseleave="show.search = false">
        <div class="vs-input" @click="show.search = true"><input v-model.trim="searchTxt" type="text" placeholder="搜索" @keyup.enter="searchEvent(searchTxt)"></div>
        <div class="vs-options" v-show="show.search">
          <ul class="zy-scroll" style="max-height: 600px">
            <li v-for="(i, j) in searchList" :key="j" @click="searchEvent(i.keywords)">{{i.keywords}}</li>
            <li v-show="searchList.length >= 1" @click="clearSearch">清空历史记录</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="body zy-scroll" infinite-wrapper>
      <div class="body-box" v-show="!show.find">
        <div class="show-img" v-if="setting.view === 'picture'">
          <Waterfall ref="waterfall" :list="list" :gutter="20" :width="240"
          :breakpoints="{ 1200: { rowPerView: 4 } }"
          animationEffect="fadeInUp"
          backgroundColor="rgba(0, 0, 0, 0)">
            <template slot="item" slot-scope="props">
              <div class="card" v-show="!setting.excludeR18Films || !containsR18Keywords(props.data.type)">
                <div class="img">
                  <img style="width: 100%" :src="props.data.pic" alt="" @load="$refs.waterfall.refresh()" @click="detailEvent(site, props.data)">
                  <div class="operate">
                    <div class="operate-wrap">
                      <span class="o-play" @click="playEvent(site, props.data)">播放</span>
                      <span class="o-star" @click="starEvent(site, props.data)">收藏</span>
                      <span class="o-share" @click="shareEvent(site, props.data)">分享</span>
                    </div>
                  </div>
                </div>
                <div class="name" @click="detailEvent(site, props.data)">{{props.data.name}}</div>
                <div class="info">
                  <span>{{props.data.year}}</span>
                  <span>{{props.data.note}}</span>
                  <span>{{props.data.type}}</span>
                </div>
              </div>
            </template>
          </Waterfall>
          <infinite-loading force-use-infinite-wrapper :identifier="infiniteId" @infinite="infiniteHandler"></infinite-loading>
        </div>
        <div class="show-table" v-if="setting.view === 'table'">
          <div class="zy-table">
            <div class="tBody">
              <ul>
                <li v-for="(i, j) in list" :key="j" @click="detailEvent(site, i)" v-show="!setting.excludeR18Films || !containsR18Keywords(i.type)">
                  <span class="name">{{i.name}}</span>
                  <span class="type">{{i.type}}</span>
                  <span class="time">{{i.year}}</span>
                  <span class="note">{{i.note}}</span>
                  <span class="last">{{i.last}}</span>
                  <span class="operate">
                    <span class="btn" @click.stop="playEvent(site, i)">播放</span>
                    <span class="btn" @click.stop="starEvent(site, i)">收藏</span>
                    <span class="btn" @click.stop="shareEvent(site, i)">分享</span>
                    <span class="btn" @click.stop="downloadEvent(site, i)">下载</span>
                  </span>
                </li>
              </ul>
              <infinite-loading force-use-infinite-wrapper :identifier="infiniteId" @infinite="infiniteHandler"></infinite-loading>
            </div>
          </div>
        </div>
      </div>
      <div class="body-box" v-show="show.find">
        <div class="show-table">
          <div class="zy-table">
            <div class="tBody zy-scroll">
              <ul>
                <li v-for="(i, j) in searchContents" :key="j" @click="detailEvent(i.site, i)">
                  <span class="name">{{i.name}}</span>
                  <span class="site">{{i.site.name}}</span>
                  <span class="type">{{i.type}}</span>
                  <span class="time">{{i.year}}</span>
                  <span class="note">{{i.note}}</span>
                  <span class="last">{{i.last}}</span>
                  <span class="operate">
                    <span class="btn" @click.stop="playEvent(i.site, i)">播放</span>
                    <span class="btn" @click.stop="starEvent(i.site, i)">收藏</span>
                    <span class="btn" @click.stop="shareEvent(i.site, i)">分享</span>
                    <span class="btn" @click.stop="downloadEvent(i.site, i)">下载</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { star, history, search, sites } from '../lib/dexie'
import zy from '../lib/site/tools'
import Waterfall from 'vue-waterfall-plugin'
import InfiniteLoading from 'vue-infinite-loading'
const { clipboard } = require('electron')
export default {
  name: 'film',
  data () {
    return {
      show: {
        body: false,
        site: false,
        class: false,
        classList: false,
        search: false,
        find: false
      },
      sites: [],
      site: {},
      classList: [],
      type: {},
      pagecount: 0,
      list: [],
      infiniteId: +new Date(),
      searchList: [],
      searchTxt: '',
      searchContents: [],
      // 福利片关键词
      r18KeyWords: ['伦理', '倫理', '福利', '激情', '理论', '写真', '情色', '美女', '街拍', '赤足', '性感', '里番']
    }
  },
  components: {
    Waterfall,
    InfiniteLoading
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
    },
    sitesList () {
      return this.$store.getters.getEditSites.sites // 需要监听的数据
    }
  },
  watch: {
    view () {
      this.changeView()
    },
    searchTxt () {
      this.searchChangeEvent()
    },
    sitesList () {
      this.getAllsites()
    }
  },
  methods: {
    ...mapMutations(['SET_VIEW', 'SET_DETAIL', 'SET_VIDEO', 'SET_SHARE']),
    siteClick (e) {
      this.list = []
      this.site = e
      this.show.site = false
      this.show.class = false
      if (this.searchTxt.length > 0) {
        this.searchSingleSiteEvent(this.site, this.searchTxt)
      } else {
        this.classList = []
        this.type = {}
        this.getClass().then(res => {
          if (res) {
            this.show.class = true
            this.infiniteId += 1
          }
        })
      }
      const _hmt = window._hmt
      _hmt.push(['_trackEvent', 'site', 'change', e.name])
    },
    classClick (e) {
      this.show.classList = false
      this.list = []
      this.type = e
      this.getPage().then(res => {
        if (res) {
          this.infiniteId += 1
        }
      })
      const _hmt = window._hmt
      _hmt.push(['_trackEvent', 'class', 'change', e.name])
    },
    getClass () {
      return new Promise((resolve, reject) => {
        const key = this.site.key
        // 屏蔽主分类
        const classToHide = ['电影', '电影片', '电视剧', '连续剧', '综艺', '动漫']
        zy.class(key).then(res => {
          var allClass = [{ name: '最新', tid: 0 }]
          res.class.forEach(element => {
            if (!this.setting.excludeRootClasses || !classToHide.includes(element.name)) {
              if (this.setting.excludeR18Films) {
                const containKeyWord = this.containsR18Keywords(element.name)
                if (!containKeyWord) {
                  allClass.push(element)
                }
              } else {
                allClass.push(element)
              }
            }
          })
          this.classList = allClass
          this.show.class = true
          this.pagecount = res.pagecount
          this.type = this.classList[0]
          resolve(true)
        }).catch(err => {
          reject(err)
        })
      })
    },
    containsR18Keywords (name) {
      var containKeyWord = false
      if (!name) {
        return containKeyWord
      }
      return this.r18KeyWords.some(v => name.includes(v))
    },
    getPage () {
      return new Promise((resolve, reject) => {
        const key = this.site.key
        const type = this.type.tid
        zy.page(key, type).then(res => {
          this.pagecount = res.pagecount
          this.show.body = true
          resolve(true)
        }).catch(err => {
          reject(err)
        })
      })
    },
    infiniteHandler ($state) {
      const key = this.site.key
      const type = this.type.tid
      const page = this.pagecount
      if (page < 1) {
        $state.complete()
        return false
      }
      zy.list(key, page, type).then(res => {
        if (res) {
          this.pagecount -= 1
          const type = Object.prototype.toString.call(res)
          if (type === '[object Undefined]') {
            $state.complete()
          }
          if (type === '[object Array]') {
            // zy.list 返回的是按时间从旧到新排列, 我门需要翻转为从新到旧
            this.list.push(...res.reverse())
          }
          if (type === '[object Object]') {
            this.list.push(res)
          }
          $state.loaded()
        } else {
          $state.complete()
        }
      })
    },
    detailEvent (site, e) {
      this.detail = {
        show: true,
        key: site.key,
        site: site,
        info: e
      }
    },
    playEvent (site, e) {
      history.find({ site: site.key, ids: e.id }).then(res => {
        if (res) {
          this.video = { key: res.site, info: { id: res.ids, name: res.name, index: res.index, site: site } }
        } else {
          this.video = { key: site.key, info: { id: e.id, name: e.name, index: 0, site: site } }
        }
      })
      this.view = 'Play'
    },
    starEvent (site, e) {
      star.find({ key: site.key, ids: e.id }).then(res => {
        if (res) {
          this.$message.info('已存在')
        } else {
          const docs = {
            key: site.key,
            ids: e.id,
            site: site,
            name: e.name,
            type: e.type,
            year: e.year,
            last: e.last,
            note: e.note
          }
          star.add(docs).then(res => {
            this.$message.success('收藏成功')
          })
        }
      }).catch(() => {
        this.$message.warning('收藏失败')
      })
    },
    shareEvent (site, e) {
      this.share = {
        show: true,
        key: site.key,
        info: e
      }
    },
    downloadEvent (site, e) {
      zy.download(site.key, e.id).then(res => {
        if (res && res.length > 0 && res.dl && res.dl.dd) {
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
          let m3u8List = []
          const dd = res.dl.dd
          const type = Object.prototype.toString.call(dd)
          if (type === '[object Array]') {
            for (const i of dd) {
              if (i._flag.indexOf('m3u8') >= 0) {
                m3u8List = i._t.split('#')
              }
            }
          } else {
            m3u8List = dd._t.split('#')
          }
          let downloadUrl = e.name + '\n'
          for (const i of m3u8List) {
            const url = encodeURI(i.split('$')[1])
            downloadUrl += (url + '\n')
          }
          clipboard.writeText(downloadUrl)
          this.$message.success('『M3U8』格式的链接已复制, 快去下载吧!')
        }
      })
    },
    changeView () {
      if (this.view === 'Film') {
        if (this.setting.view === 'picture') {
          this.$refs.waterfall.refresh()
        }
        this.getPage().then(() => {
          this.infiniteId += 1
        })
      }
    },
    getAllSearch () {
      search.all().then(res => {
        this.searchList = res.reverse()
      })
    },
    searchEvent (wd) {
      if (this.setting.searchAllSites) {
        this.searchAllSitesEvent(this.sites, wd)
      } else {
        this.searchSingleSiteEvent(this.site, wd)
      }
      const _hmt = window._hmt
      _hmt.push(['_trackEvent', 'film', 'search', wd])
    },
    searchAllSitesEvent (sites, wd) {
      this.searchTxt = wd
      this.searchContents = []
      this.pagecount = 0
      this.show.search = false
      this.show.find = true
      if (wd) {
        search.find({ keywords: wd }).then(res => {
          if (!res) {
            search.add({ keywords: wd })
          }
          this.getAllSearch()
        })
        sites.forEach(site => {
          zy.search(site.key, wd).then(res => {
            const type = Object.prototype.toString.call(res)
            if (type === '[object Array]') {
              res.forEach(element => {
                element.site = site
                this.searchContents.push(element)
              })
            }
            if (type === '[object Object]') {
              res.site = site
              this.searchContents.push(res)
            }
          })
        })
      } else {
        this.show.find = false
        this.getClass().then(res => {
          if (res) {
            this.infiniteId += 1
          }
        })
      }
    },
    searchSingleSiteEvent (site, wd) {
      var sites = []
      sites.push(this.site)
      this.searchAllSitesEvent(sites, wd)
    },
    clearSearch () {
      search.clear().then(res => {
        this.getAllSearch()
      })
    },
    searchChangeEvent () {
      if (this.searchTxt.length >= 1) {
        this.show.class = false
      } else {
        this.show.class = true
        this.searchContents = []
        this.show.find = false
        if (this.setting.view === 'picture') {
          this.$refs.waterfall.refresh()
        }
      }
    },
    getAllsites () {
      sites.all().then(res => {
        if (res.length <= 0) {
          this.site = {}
          this.type = {}
          this.list = []
        } else {
          this.sites = res.filter(x => x.isActive)
          this.site = this.sites[0]
          this.siteClick(this.site)
        }
      })
    }
  },
  created () {
    this.getAllSearch()
  }
}
</script>
<style lang="scss" scoped>
.film{
  height: calc(100% - 40px);
  width: 100%;
  display: flex;
  flex-direction: column;
  .header{
    height: 30px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 10;
  }
  .body{
    margin-top: 20px;
    flex: 1;
    width: 100%;
    border-radius: 0 0 5px 5px;
    overflow-y: scroll;
    &::-webkit-scrollbar{
      width: 5px;
      height: 1px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      position: absolute;
    }
    &::-webkit-scrollbar-track {
      border-radius: 10px;
      position: absolute;
    }
    .body-box{
      height: 100%;
      width: 100%;
    }
    .show-img{
      height: 100%;
      width: 100%;
      padding: 10px;
      .card{
        border-radius: 6px;
        overflow: hidden;
        .img{
          position: relative;
          min-height: 40px;
          img{
            width: 100%;
            height: auto;
            cursor: pointer;
          }
          .operate{
            display: none;
            position: absolute;
            left: 0;
            bottom: 0;
            background-color: #111111aa;
            width: 100%;
            font-size: 13px;
            .operate-wrap{
              display: flex;
              justify-content: space-between;
              .o-play, .o-star, .o-share{
                cursor: pointer;
                display: inline-block;
                width: 80px;
                height: 36px;
                text-align: center;
                line-height: 36px;
                color: #cdcdcd;
                &:hover{
                  background-color: #111;
                }
              }
            }
          }
        }
        .name{
          font-size: 16px;
          padding: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
        }
        .info{
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          padding: 10px;
        }
        &:hover{
          .operate{
            display: block;
          }
        }
      }
    }
  }
}
</style>
