<template>
  <div class="listpage" id="recommendations">
    <div class="listpage-header" id="recommendations-header">
        <el-select v-model="selectedRecommendationType" size="small" slot="prepend"
          :popper-append-to-body="false"
          popper-class="popper"
          default-first-option placeholder="请选择"
          @change="changeRecommendationTypeEvent">
          <el-option
            v-for="item in recommendationTypes"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <el-button type="text">视频数：{{ recommendations.length }}</el-button>
        <el-button :loading="loading" @click.stop="updateEvent" icon="el-icon-refresh">更新推荐</el-button>
    </div>
    <div class="toolbar" v-show="showToolbar">
      <el-select v-model="selectedAreas" size="small" multiple placeholder="地区" popper-class="popper" :popper-append-to-body="false" @remove-tag="refreshFilteredList" @change="refreshFilteredList">
        <el-option
          v-for="item in areas"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <el-select v-model="selectedTypes" size="small" multiple placeholder="类型" popper-class="popper" :popper-append-to-body="false" @remove-tag="refreshFilteredList" @change="refreshFilteredList">
        <el-option
          v-for="item in types"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <el-select v-model="sortKeyword" size="small" placeholder="排序" popper-class="popper" :popper-append-to-body="false" @change="refreshFilteredList">
        <el-option
          v-for="item in sortKeywords"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <span>
       上映区间：
       <el-input-number size="small" v-model="selectedYears.start" :min=0 :max="new Date().getFullYear()" controls-position="right" step-strictly @change="refreshFilteredList"></el-input-number>
       至
       <el-input-number size="small" v-model="selectedYears.end" :min=0 :max="new Date().getFullYear()" controls-position="right" step-strictly @change="refreshFilteredList"></el-input-number>
       </span>
    </div>
    <el-divider class="listpage-header-divider" content-position="right">
      <el-button type="text" size="mini" @click="toggleViewMode">视图切换</el-button>
      <el-button type="text" size="mini" @click='() => { showToolbar = !showToolbar; if (!showToolbar) this.refreshFilteredList() }' title="收起工具栏会重置筛选排序">{{ showToolbar ? '隐藏工具栏' : '显示工具栏' }}</el-button>
      <el-button type="text" size="mini" @click="backTop">回到顶部</el-button>
    </el-divider>
    <div class="listpage-body" id="recommendations-body" >
      <div class="show-table" id="star-table" v-if="setting.recommendationViewMode === 'table'">
        <el-table size="mini" fit height="100%" row-key="id"
        ref="recommendationsTable"
        :data="filteredList"
        @row-click="detailEvent">
          <el-table-column
            prop="name"
            label="片名">
          </el-table-column>
          <el-table-column
            prop="detail.area"
            label="地区"
            width="100">
          </el-table-column>
          <el-table-column
            prop="detail.type"
            label="类型"
            width="100">
          </el-table-column>
          <el-table-column
            prop="detail.year"
            label="上映"
            width="100"
            align="center">
          </el-table-column>
          <el-table-column v-if="filteredList.some(e => e.rate)"
            prop="rate"
            align="center"
            width="100"
            label="豆瓣评分">
          </el-table-column>
          <el-table-column v-if="filteredList.some(e => e.detail.note)"
            prop="detail.note"
            label="备注">
          </el-table-column>
          <el-table-column
            label="操作"
            header-align="center"
            align="right"
            width="200">
            <template slot-scope="scope">
              <el-button @click.stop="playEvent(scope.row)" type="text">播放</el-button>
              <el-button @click.stop="shareEvent(scope.row)" type="text">分享</el-button>
              <el-button @click.stop="downloadEvent(scope.row)" type="text">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="show-picture" id="star-picture" v-if="setting.recommendationViewMode === 'picture'">
        <Waterfall ref="recommendationsWaterfall" :list="filteredList" :gutter="20" :width="240"
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
          animationDuration="0.5s"
          backgroundColor="rgba(0, 0, 0, 0)">
            <template slot="item" slot-scope="props">
              <div class="card">
                <div class="img">
                  <div class="rate" v-if="props.data.rate && props.data.rate !== '暂无评分'">
                    <span>{{props.data.rate}}分</span>
                  </div>
                  <img style="width: 100%" :src="props.data.detail.pic" alt="" @load="$refs.recommendationsWaterfall.refresh()" @click="detailEvent(props.data)">
                  <div class="operate">
                    <div class="operate-wrap">
                      <span class="o-play" @click="playEvent(props.data)">播放</span>
                      <span class="o-share" @click="shareEvent(props.data)">分享</span>
                      <span class="o-star" @click="downloadEvent(props.data)">下载</span>
                    </div>
                  </div>
                </div>
                <div class="name" @click="detailEvent(props.data)">{{props.data.name}}</div>
                <div class="info">
                  <span>{{props.data.detail.area}}</span>
                  <span>{{props.data.detail.year}}</span>
                  <span>{{props.data.detail.note}}</span>
                  <span>{{props.data.detail.type}}</span>
                </div>
              </div>
            </template>
        </Waterfall>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { history, recommendation, setting, sites, cachedMovies } from '../lib/dexie'
import zy from '../lib/site/tools'
import Waterfall from 'vue-waterfall-plugin'
import axios from 'axios'
const { clipboard } = require('electron')

export default {
  name: 'recommendations',
  data () {
    return {
      recommendations: [],
      sites: [],
      loading: false,
      types: [],
      areas: [],
      filteredList: [],
      // 不同推荐
      recommendationsDefault: [],
      recommendationsDoubanMovie: [],
      recommendationsDoubanTV: [],
      recommendationTypes: ['作者推荐', '豆瓣热门电影', '豆瓣热门剧集', '豆瓣高分电影'],
      selectedRecommendationType: '作者推荐',
      // Toolbar
      showToolbar: false,
      selectedAreas: [],
      selectedTypes: [],
      sortKeyword: '',
      sortKeywords: ['按片名', '按上映年份', '按更新时间'],
      selectedYears: { start: 0, end: new Date().getFullYear() },
      // 缓存数据
      localCachedMovies: []
    }
  },
  components: {
    Waterfall
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
    setting: {
      get () {
        return this.$store.getters.getSetting
      },
      set (val) {
        this.SET_SETTING(val)
      }
    }
  },
  watch: {
    view () {
      if (this.view === 'Recommendation') {
        if (this.$refs.recommendationsWaterfall) this.$refs.recommendationsWaterfall.resize()
      }
    },
    recommendations: {
      handler (recommendations) {
        this.areas = [...new Set(recommendations.map(ele => ele.detail.area))].filter(x => x)
        this.types = [...new Set(recommendations.map(ele => ele.detail.type))].filter(x => x)
        this.refreshFilteredList()
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations(['SET_VIEW', 'SET_DETAIL', 'SET_VIDEO', 'SET_SHARE', 'SET_SETTING']),
    changeRecommendationTypeEvent () {
      if (this.selectedRecommendationType === '作者推荐') {
        this.recommendations = this.recommendationsDefault
      }
      if (this.selectedRecommendationType === '豆瓣热门电影') {
        const doubanUrl = 'https://movie.douban.com/j/search_subjects?type=movie&tag=热门&sort=recommend&page_limit=100&page_start=0'
        this.getRecommendationsDoubanMovieOrTV(doubanUrl)
      }
      if (this.selectedRecommendationType === '豆瓣高分电影') {
        const doubanUrl = 'https://movie.douban.com/j/search_subjects?type=movie&tag=豆瓣高分&sort=recommend&page_limit=100&page_start=0'
        this.getRecommendationsDoubanMovieOrTV(doubanUrl)
      }
      if (this.selectedRecommendationType === '豆瓣热门剧集') {
        const doubanUrl = 'https://movie.douban.com/j/search_subjects?type=tv&tag=热门&sort=recommend&page_limit=100&page_start=0'
        this.getRecommendationsDoubanMovieOrTV(doubanUrl)
      }
    },
    getRecommendationsDoubanMovieOrTV (doubanUrl) {
      this.recommendations = []
      axios.get(doubanUrl).then(res => {
        if (res.data) {
          res.data.subjects.forEach(element => {
            const localCachedMovie = this.localCachedMovies.find(e => e.key === this.sites[0].key && e.name === element.title)
            if (localCachedMovie) {
              this.recommendations.push(localCachedMovie)
            } else {
              this.searchAndCacheMovie(element)
            }
          })
        }
      })
    },
    searchAndCacheMovie (element) {
      zy.searchFirstDetail(this.sites[0].key, element.title).then(detailRes => {
        if (detailRes) {
          const doc = {
            key: this.sites[0].key,
            ids: detailRes.id,
            site: this.sites[0],
            name: detailRes.name,
            detail: detailRes,
            rate: element.rate
          }
          this.recommendations.push(doc)
          this.localCachedMovies.push(doc)
          cachedMovies.add(doc)
        }
      })
    },
    toggleViewMode () {
      this.setting.recommendationViewMode = this.setting.recommendationViewMode === 'picture' ? 'table' : 'picture'
      if (this.setting.recommendationViewMode === 'table') {
        setTimeout(() => { this.rowDrop() }, 100)
      } else {
        setTimeout(() => { if (this.$refs.recommendationsWaterfall) this.$refs.recommendationsWaterfall.refresh() }, 700)
      }
      setting.find().then(res => {
        res.recommendationViewMode = this.setting.recommendationViewMode
        setting.update(res)
      })
    },
    backTop () {
      if (this.setting.recommendationViewMode === 'picture') {
        document.getElementById('recommendations-body').scrollTop = 0
      } else {
        this.$refs.recommendationsTable.bodyWrapper.scrollTop = 0
      }
    },
    refreshFilteredList () {
      if (!this.showToolbar) {
        this.sortKeyword = ''
        this.selectedAreas = []
        this.selectedSearchClassNames = []
        this.selectedYears.start = 0
        this.selectedYears.end = new Date().getFullYear()
        this.filteredList = this.recommendations
      } else {
        let filteredData = this.recommendations
        filteredData = filteredData.filter(x => (this.selectedAreas.length === 0) || this.selectedAreas.includes(x.detail.area))
        filteredData = filteredData.filter(x => (this.selectedTypes.length === 0) || this.selectedTypes.includes(x.detail.type))
        filteredData = filteredData.filter(res => res.detail.year >= this.selectedYears.start)
        filteredData = filteredData.filter(res => res.detail.year <= this.selectedYears.end)
        switch (this.sortKeyword) {
          case '按上映年份':
            filteredData.sort(function (a, b) {
              return a.detail.year - b.detail.year
            })
            break
          case '按片名':
            filteredData.sort(function (a, b) {
              return a.detail.name.localeCompare(b.detail.name, 'zh')
            })
            break
          case '按更新时间':
            filteredData.sort(function (a, b) {
              return new Date(b.detail.last) - new Date(a.detail.last)
            })
            break
          default:
            break
        }
        this.filteredList = filteredData
      }
    },
    detailEvent (e) {
      this.detail = {
        show: true,
        key: e.key,
        info: {
          id: e.ids,
          name: e.name
        }
      }
    },
    updateEvent () {
      const url = 'https://raw.githubusercontent.com/cuiocean/ZY-Player-Resources/main/Recommendations/Recommendations.json'
      this.loading = true
      axios.get(url).then(res => {
        if (res.status === 200) {
          if (res.data.length > 0) {
            this.recommendations = res.data
            recommendation.clear().then(recommendation.bulkAdd(this.recommendations))
            this.getFilterData()
            this.$message.success('更新推荐成功. 仅根据作者cuiocean个人喜好推荐,不喜请无视.')
          }
        }
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$message.error('更新推荐失败. ' + error)
        this.$message.warning('最新的推荐数据保存在Github上,请考虑使用代理或者等待下一版本内置数据更新.')
      })
    },
    async playEvent (e) {
      const db = await history.find({ site: e.key, ids: e.ids })
      if (db) {
        this.video = { key: e.key, info: { id: db.ids, name: db.name, index: db.index }, detail: db.detail }
      } else {
        this.video = { key: e.key, info: { id: e.ids, name: e.name, index: 0 }, detail: e.detail }
      }
      this.view = 'Play'
    },
    shareEvent (e) {
      this.share = {
        show: true,
        key: e.key,
        info: e.detail
      }
    },
    async downloadEvent (e) {
      const db = await history.find({ site: e.key, ids: e.ids })
      let videoFlag
      if (db) videoFlag = db.videoFlag
      zy.download(e.key, e.ids, videoFlag).then(res => {
        clipboard.writeText(res.downloadUrls)
        this.$message.success(res.info)
      }).catch((err) => {
        this.$message.error(err.info)
      })
    },
    getRecommendations () {
      recommendation.all().then(res => {
        this.recommendations = res.sort(function (a, b) {
          return b.id - a.id
        })
        this.recommendationsDefault = this.recommendations
        this.getFilterData()
      })
    },
    getFilterData () {
      this.types = [...new Set(this.recommendations.map(ele => ele.detail.type))].filter(x => x)
      this.areas = [...new Set(this.recommendations.map(ele => ele.detail.area))].filter(x => x)
    },
    updateViewMode () {
      setTimeout(() => { if (this.$refs.recommendationsWaterfall) this.$refs.recommendationsWaterfall.refresh() }, 700)
      setting.find().then(res => {
        res.recommendationViewMode = this.setting.recommendationViewMode
        setting.update(res)
      })
    },
    getAllSites () {
      sites.all().then(res => {
        if (res.length > 0) {
          this.sites = res.filter(item => item.isActive)
        }
      })
    },
    getCachedMovies () {
      cachedMovies.all().then(res => {
        this.localCachedMovies = res
      })
    }
  },
  created () {
    this.getAllSites()
    this.getRecommendations()
    this.getCachedMovies()
  },
  mounted () {
    addEventListener('resize', () => {
      setTimeout(() => { if (this.$refs.recommendationsWaterfall) this.$refs.recommendationsWaterfall.resize() }, 500)
    })
  }
}
</script>
