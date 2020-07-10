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
      <div class="zy-select" @mouseleave="show.classList = false" v-if="show.class">
        <div class="vs-placeholder" @click="show.classList = true">{{type.name}}</div>
        <div class="vs-options" v-show="show.classList">
          <ul class="zy-scroll" style="max-height: 600px;">
            <li :class="type.tid === i.tid ? 'active' : ''" v-for="i in classList" :key="i.tid" @click="classClick(i)">{{ i.name }}</li>
          </ul>
        </div>
      </div>
      <div class="zy-select" @mouseleave="show.search = false">
        <div class="vs-input" @click="show.search = true"><input v-model.trim="searchTxt" type="text" placeholder="搜索" @keyup.enter="searchEvent"></div>
        <div class="vs-options" v-show="show.search">
          <ul class="zy-scroll" style="max-height: 600px">
            <li v-for="(i, j) in searchList" :key="j" @click="searchClickEvent(i)">{{i.keywords}}</li>
            <li @click="clearSearch">清空历史记录</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="body zy-scroll" infinite-wrapper>
      <div class="show-img" v-if="show.img">
        <Waterfall :list="list" :gutter="20" :width="240"
        :breakpoints="{ 1200: { rowPerView: 4 } }"
        animationEffect="fadeInUp"
        backgroundColor="rgba(0, 0, 0, 0)"
        ref="waterfall">
          <template slot="item" slot-scope="props">
            <div class="card">
              <div class="img">
                <img style="width: 100%" :src="props.data.pic" alt="" @load="$refs.waterfall.refresh()" @click="detailEvent(props.data)">
                <div class="operate">
                  <div class="operate-wrap">
                    <span class="o-play" @click="playEvent(props.data)">播放</span>
                    <span class="o-star" @click="starEvent(props.data)">收藏</span>
                    <span class="o-share" @click="shareEvent(props.data)">分享</span>
                  </div>
                </div>
              </div>
              <div class="name" @click="detailEvent(props.data)">{{props.data.name}}</div>
              <div class="info">
                <span>{{props.data.year}}</span>
                <span>{{props.data.type}}</span>
              </div>
            </div>
          </template>
        </Waterfall>
        <infinite-loading force-use-infinite-wrapper :identifier="infiniteId" @infinite="infiniteHandler"></infinite-loading>
      </div>
      <div class="show-table" v-if="!show.img">
        <div class="zy-table">
          <div class="tBody">
            <ul>
              <li v-for="(i, j) in list" :key="j" @click="detailEvent(i)">
                <span class="name">{{i.name}}</span>
                <span class="type">{{i.type}}</span>
                <span class="time">{{i.year}}</span>
                <span class="last">{{i.last}}</span>
                <span class="operate">
                  <span class="btn" @click.stop="playEvent(i)">播放</span>
                  <span class="btn" @click.stop="starEvent(i)">收藏</span>
                  <span class="btn" @click.stop="shareEvent(i)">分享</span>
                </span>
              </li>
            </ul>
            <infinite-loading force-use-infinite-wrapper="tBody" :identifier="infiniteId" @infinite="infiniteHandler"></infinite-loading>
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
        img: true
      },
      sites: [],
      site: {},
      classList: [],
      type: {},
      pagecount: 0,
      list: [],
      infiniteId: +new Date(),
      refresh: 0,
      searchList: [],
      searchTxt: ''
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
    }
  },
  watch: {
    setting: {
      handler () {
        this.changeSetting()
      },
      deep: true
    },
    view () {
      this.changeView()
    },
    searchTxt () {
      this.searchChangeEvent()
    }
  },
  methods: {
    ...mapMutations(['SET_VIEW', 'SET_DETAIL', 'SET_VIDEO', 'SET_SHARE']),
    siteClick (e) {
      this.list = []
      this.site = e
      this.show.site = false
      if (this.searchTxt.length > 0) {
        this.searchEvent()
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
    },
    getClass () {
      return new Promise((resolve, reject) => {
        const key = this.site.key
        zy.class(key).then(res => {
          this.classList = res.class
          this.show.class = true
          this.pagecount = res.pagecount
          this.type = { name: '最新', tid: 0 }
          resolve(true)
        }).catch(err => {
          reject(err)
        })
      })
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
          if (type === '[object Array]') {
            this.list.push(...res)
          } else {
            this.list.push(res)
          }
          $state.loaded()
        } else {
          $state.complete()
        }
      })
    },
    detailEvent (e) {
      this.detail = {
        show: true,
        key: this.site.key,
        info: e
      }
    },
    playEvent (e) {
      history.find({ site: this.site.key, ids: e.id }).then(res => {
        if (res) {
          this.video = { key: res.site, info: { id: res.ids, name: res.name, index: res.index } }
        } else {
          this.video = { key: this.site.key, info: { id: e.id, name: e.name, index: 0 } }
        }
      })
      this.view = 'Play'
    },
    starEvent (e) {
      star.find({ site: this.site.key, ids: e.id }).then(res => {
        if (res) {
          this.$message.info('已存在')
        } else {
          const docs = {
            site: this.site.key,
            ids: e.id,
            name: e.name,
            type: e.type,
            year: e.year,
            last: e.last
          }
          star.add(docs).then(res => {
            this.$message.success('收藏成功')
          })
        }
      }).catch(() => {
        this.$message.warning('收藏失败')
      })
    },
    shareEvent (e) {
      this.share = {
        show: true,
        key: this.site.key,
        info: e
      }
    },
    changeSetting () {
      this.list = []
      this.setting.view === 'picture' ? this.show.img = true : this.show.img = false
      this.refresh++
    },
    changeView () {
      if (this.refresh >= 1) {
        this.getPage().then(() => {
          this.infiniteId += 1
          this.refresh = 0
        })
      }
    },
    getAllSearch () {
      search.all().then(res => {
        this.searchList = res.reverse()
      })
    },
    searchEvent () {
      const wd = this.searchTxt
      this.list = []
      this.pagecount = 0
      this.show.search = false
      if (wd) {
        search.find({ keywords: wd }).then(res => {
          if (!res) {
            search.add({ keywords: wd })
          }
          this.getAllSearch()
        })
        zy.search(this.site.key, wd).then(res => {
          this.list = res
        })
      } else {
        this.$message.warning('请输入关键字')
      }
    },
    searchClickEvent (e) {
      this.list = []
      this.pagecount = 0
      this.searchTxt = e.keywords
      this.show.search = false
      search.remove(e.id).then(res => {
        search.add({ keywords: e.keywords })
        this.getAllSearch()
      })
      zy.search(this.site.key, e.keywords).then(res => {
        this.list = res
      })
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
      }
    },
    getAllsites () {
      sites.all().then(res => {
        this.sites = res
        this.site = this.sites[0]
        this.siteClick(this.site)
      })
    }
  },
  created () {
    this.getAllsites()
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
