<template>
  <div class="film">
    <div class="top" v-if="top">
      <!-- site -->
      <div class="zy-select" @mouseleave="show.site = false">
        <div class="vs-placeholder" @click="show.site = true">{{site.name}}</div>
        <div class="vs-options" v-show="show.site">
          <ul>
            <li :class="site === j ? 'active' : ''" v-for="(i, j) in sites" :key="j" @click="siteClick(i)">{{ i.name }}</li>
          </ul>
        </div>
      </div>
      <!-- tags -->
      <div class="zy-select" @mouseleave="show.tags = false" v-if="site.tags.length > 0">
        <div class="vs-placeholder" @click="show.tags = true">{{site.tags[tag].title}}</div>
        <div class="vs-options" v-show="show.tags">
          <ul>
            <li :class="tag === j ? 'active' : ''" v-for="(i, j) in site.tags" :key="j" @click="tagClick(i, j)">{{ i.title }}</li>
          </ul>
        </div>
      </div>
      <!-- type -->
      <div class="zy-select" @mouseleave="show.type = false" v-if="site.tags[tag].children.length > 0">
        <!-- <div class="vs-placeholder" @click="show.type = true">{{site.tags[tag].children[type].title}}</div> -->
        <div class="vs-placeholder" @click="show.type = true">{{typeName}}</div>
        <div class="vs-options" v-show="show.type">
          <ul>
            <li :class="type === j ? 'active' : ''" v-for="(i, j) in site.tags[tag].children" :key="j" @click="typeClick(i, j)">{{ i.title }}</li>
          </ul>
        </div>
      </div>
      <div :class="[inputFocus ? 'active ': ''] + 'search'" @mouseover="inputFocus = true" @mouseleave="inputFocus = false">
        <div class="search-icon">
          <span class="zy-svg">
            <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="searchIconTitle">
              <title id="searchIconTitle">Search</title>
              <path d="M14.4121122,14.4121122 L20,20"></path>
              <circle cx="10" cy="10" r="6"></circle>
            </svg>
          </span>
        </div>
        <input type="text" class="search-box" v-model="keywords" @keypress.enter="searchEvent">
      </div>
    </div>
    <div class="middle">
      <div class="zy-table">
        <div class="tHead">
          <span class="name">{{$t('videoName')}}</span>
          <span class="type">{{$t('type')}}</span>
          <span class="time">{{$t('time')}}</span>
          <span class="operate">{{$t('operate')}}</span>
        </div>
        <div class="tBody zy-scroll">
          <ul v-show="!tb.loading">
            <li v-for="(i, j) in tb.list" :key="j" @click="detailEvent(i)">
              <span class="name">{{i.name}}</span>
              <span class="type">{{i.type}}</span>
              <span class="time">{{i.time}}</span>
              <span class="operate">
                <span class="btn" @click.stop="playEvent(i)">{{$t('play')}}</span>
                <span class="btn" @click.stop="starEvent(i)">{{$t('star')}}</span>
                <span class="btn" @click.stop="shareEvent(i)">{{$t('share')}}</span>
              </span>
            </li>
          </ul>
          <div class="tBody-mask zy-loading" v-show="tb.loading">
            <div class="loader"></div>
          </div>
        </div>
        <div class="tFooter">
          <span class="tFooter-span">今日更新: {{ tb.update }} 条</span>
          <el-pagination small :page-size="tb.size" :total="tb.total" :current-page="tb.page" @current-change="tbPageChange" layout="total, prev, pager, next, jumper"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { sites, getSite } from '../lib/site/sites'
import tools from '../lib/site/tools'
import video from '../lib/dexie/video'
import setting from '../lib/dexie/setting'
export default {
  name: 'film',
  data () {
    return {
      sites: sites,
      site: {},
      top: false,
      tag: 0,
      type: 0,
      typeName: '',
      keywords: '',
      id: '',
      show: {
        site: false,
        tags: false,
        type: false
      },
      inputFocus: false,
      tb: {
        list: [],
        page: 1,
        size: 50,
        total: 0,
        update: 0,
        loading: true
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
    gSite: {
      get () {
        return this.$store.getters.getSite
      },
      set (val) {
        this.SET_SITE(val)
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
  watch: {
    gSite (n, o) {
      const s = getSite(n)
      this.siteClick(s)
    }
  },
  methods: {
    ...mapMutations(['SET_VIEW', 'SET_SITE', 'SET_DETAIL', 'SET_VIDEO', 'SET_SHARE']),
    init () {
      setting.find().then(res => {
        this.site = getSite(res.site)
        this.top = true
        tools.film_get(res.site).then(tRes => {
          this.tb.list = tRes.list
          this.tb.total = tRes.total
          this.tb.update = tRes.update
          this.tb.loading = false
        })
      })
    },
    siteClick (e) {
      this.site = e
      this.tb.update = 0
      this.tb.total = 0
      this.tag = 0
      this.id = e.tags[0].id
      this.tb.loading = true
      this.show.site = false
      tools.film_get(e.key, this.id).then(res => {
        this.tb.list = res.list
        this.tb.total = res.total
        this.tb.update = res.update
        this.tb.loading = false
      })
    },
    tagClick (e, n) {
      this.tb.update = 0
      this.tb.total = 0
      this.tag = n
      this.id = e.id
      this.typeName = 'All'
      this.tb.loading = true
      this.show.tags = false
      tools.film_get(this.site.key, this.id).then(res => {
        this.tb.list = res.list
        this.tb.total = res.total
        this.tb.update = res.update
        this.tb.loading = false
      })
    },
    typeClick (e, n) {
      this.tb.update = 0
      this.tb.total = 0
      this.type = n
      this.typeName = e.title
      this.id = e.id
      this.tb.loading = true
      this.show.type = false
      tools.film_get(this.site.key, this.id).then(res => {
        this.tb.list = res.list
        this.tb.total = res.total
        this.tb.update = res.update
        this.tb.loading = false
      })
    },
    searchEvent () {
      const flag = this.site.search
      if (flag === '') {
        this.$message.warning(this.$t('not_support_search'))
        return false
      }
      this.tb.loading = true
      this.tb.update = 0
      this.tb.total = 0
      tools.search_get(this.site.key, this.keywords).then(res => {
        this.tb.list = res.list
        this.tb.total = res.total
        this.tb.loading = false
      })
    },
    detailEvent (e) {
      this.detail = {
        show: true,
        v: e
      }
    },
    playEvent (e) {
      this.video = e
      this.view = 'Play'
    },
    starEvent (e) {
      video.find({ detail: e.detail }).then(res => {
        if (res) {
          this.$message.warning(this.$t('exists'))
        } else {
          video.add(e).then(res => {
            this.$message.success(this.$t('star_success'))
          })
        }
      })
    },
    shareEvent (e) {
      this.share = {
        show: true,
        v: e
      }
    },
    tbPageChange (e) {
      this.tb.loading = true
      this.tb.page = e
      tools.film_get(this.site.key, this.id, this.tb.page).then(res => {
        this.tb.list = res.list
        this.tb.loading = false
      })
    }
  },
  created () {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
.film{
  height: 670px;
  width: 100%;
  display: flex;
  flex-direction: column;
  animation: viewFadeIn 1s ease-in both;
  .top{
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .search{
      width: 200px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 15px;
      svg{
        width: 20px;
        height: 20px;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      .search-icon{
        width: 40px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .search-box{
        width: 160px;
        height: 30px;
        border-radius: 20px;
        border: none;
        text-indent: 2px;
        font-size: 14px;
        &:focus{
          outline: none;
          border: none;
        }
      }
    }
  }
  .middle{
    height: 620px;
    width: 100%;
    margin-top: 10px;
    padding-bottom: 0px;
    border-radius: 5px;
  }
}
</style>
