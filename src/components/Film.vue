<template>
  <div class="listpage" id="film">
    <div class="listpage-header" id="film-header">
      <el-select v-model="selectedSiteName" size="small" placeholder="源站" :popper-append-to-body="false" popper-class="popper" @change="siteClick">
        <el-option
          v-for="item in sites"
          :key="item.key"
          :label="item.name"
          :value="item.name">
        </el-option>
      </el-select>
      <el-select v-model="selectedClassName" size="small" placeholder="类型" :popper-append-to-body="false" popper-class="popper" @change="classClick" v-if="classList && classList.length" v-show="!showFind">
        <el-option
          v-for="item in classList"
          :key="item.tid"
          :label="item.name"
          :value="item.name">
        </el-option>
      </el-select>
      <el-select v-model="selectedSearchClassNames" size="small" multiple placeholder="类型" :popper-append-to-body="false" popper-class="popper" v-if="searchClassList && searchClassList.length" v-show="showFind && showToolbar" @remove-tag="refreshFilteredList" @change="refreshFilteredList">
        <el-option
          v-for="(item, index) in searchClassList"
          :key='index'
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <el-autocomplete
        clearable
        size="small"
        v-model.trim="searchTxt"
        value-key="keywords"
        :fetch-suggestions="querySearch"
        :popper-append-to-body="false"
        popper-class="popper"
        placeholder="搜索"
        @keyup.enter.native="searchAndRecord"
        @select="searchEvent"
        @change="searchChangeEvent">
        <el-select v-model="searchGroup" size="small" slot="prepend"
          :popper-append-to-body="false"
          popper-class="popper"
          default-first-option placeholder="请选择"
          @change="searchEvent">
          <el-option
            v-for="item in searchGroups"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <!--方便触屏-->
        <el-button icon="el-icon-search" @click.stop="searchEvent" slot="append" v-if="!searchRunning"/>
        <el-button icon="el-icon-loading" @click.stop="stopSearchEvent" slot="append" v-if="searchRunning" title='点击可停止搜索'/>
      </el-autocomplete>
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
    <div class="listpage-body" id="film-body" infinite-wrapper>
      <div class="show-picture" v-if="setting.view === 'picture' && !showFind">
          <Waterfall ref="filmWaterfall" :list="filteredList" :gutter="20" :width="240"
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
                  <img style="width: 100%" :src="props.data.pic" alt="" @load="$refs.filmWaterfall.refresh()" @click="detailEvent(site, props.data)">
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
                  <span>{{props.data.area}}</span>
                  <span>{{props.data.year}}</span>
                  <span>{{props.data.note}}</span>
                  <span>{{props.data.type}}</span>
                </div>
              </div>
            </template>
          </Waterfall>
          <infinite-loading force-use-infinite-wrapper :identifier="infiniteId" @infinite="infiniteHandler"></infinite-loading>
      </div>
      <div class="show-table" v-if="setting.view === 'table' && !showFind">
        <el-table
          size="mini"
          :data="filteredList"
          ref="filmTable"
          height="100%"
          :empty-text="statusText"
          @row-click="(row) => detailEvent(site, row)"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="片名">
          </el-table-column>
          <el-table-column v-if="type.name === '最新'"
            prop="type"
            label="类型"
            width="100">
          </el-table-column>
          <el-table-column
            prop="year"
            label="上映"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            prop="area"
            label="地区"
            width="100">
          </el-table-column>
          <el-table-column
            prop="lang"
            label="语言"
            width="100">
          </el-table-column>
          <el-table-column v-if="showTableLastColumn"
            prop="last"
            label="最近更新"
            :formatter="dateFormat"
            align="left"
            width="120">
          </el-table-column>
          <el-table-column
            prop="note"
            label="备注">
          </el-table-column>
          <el-table-column
            label="操作"
            header-align="center"
            align="right"
            width="200">
            <template slot-scope="scope">
              <el-button @click.stop="playEvent(site, scope.row)" type="text">播放</el-button>
              <el-button @click.stop="starEvent(site, scope.row)" type="text">收藏</el-button>
              <el-button @click.stop="shareEvent(site, scope.row)" type="text">分享</el-button>
              <el-button @click.stop="downloadEvent(site, scope.row)" type="text">下载</el-button>
            </template>
          </el-table-column>
          <infinite-loading
            slot="append"
            :identifier="infiniteId"
            @infinite="infiniteHandler"
            force-use-infinite-wrapper=".el-table__body-wrapper">
            <div slot="no-more">数据量过少时请重复操作一次，以防网站抽风</div>
          </infinite-loading>
        </el-table>
      </div>
      <div class="show-table" v-if="setting.searchViewMode === 'table' && showFind">
        <el-table size="mini"
          ref="searchResultTable"
          :data="filteredSearchContents"
          height="100%"
          :empty-text="statusText"
          @filter-change="filterChange"
          @row-click="(row) => detailEvent(row.site, row)"
          style="width: 100%">
          <el-table-column
            sortable
            :sort-method="(a , b) => sortByLocaleCompare(a.name, b.name)"
            prop="name"
            label="片名">
          </el-table-column>
          <el-table-column v-if="searchGroup !== '站内'"
            sortable
            :sort-method="(a , b) => sortByLocaleCompare(a.site.name, b.site.name)"
            :filters="getFilters('siteName')"
            :filter-method="(value, row, column) => { this.currentColumn = column; return value === row.site.name }"
            prop="site"
            label="源站"
            width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.site.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="type"
            label="类型"
            width="100">
          </el-table-column>
          <el-table-column
              sortable
              prop="year"
              label="上映"
              width="100">
          </el-table-column>
          <el-table-column
            prop="area"
            label="地区"
            width="100">
          </el-table-column>
          <el-table-column
            :filters="getFilters('lang')"
            :filter-method="(value, row, column) => { this.currentColumn = column; return value === row.lang }"
            prop="lang"
            label="语言"
            width="100">
          </el-table-column>
          <el-table-column v-if="showTableLastColumn"
            prop="last"
            label="最近更新"
            :formatter="dateFormat"
            align="left"
            width="120">
          </el-table-column>
          <el-table-column
            sortable
            prop="note"
            label="备注">
          </el-table-column>
          <el-table-column
            label="操作"
            header-align="center"
            align="right"
            width="200">
            <template slot-scope="scope">
              <el-button @click.stop="playEvent(scope.row.site, scope.row)" type="text">播放</el-button>
              <el-button @click.stop="starEvent(scope.row.site, scope.row)" type="text">收藏</el-button>
              <el-button @click.stop="shareEvent(scope.row.site, scope.row)" type="text">分享</el-button>
              <el-button @click.stop="downloadEvent(scope.row.site, scope.row)" type="text">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="show-picture" v-if="setting.searchViewMode === 'picture' && showFind">
          <Waterfall ref="filmSearchWaterfall" :list="filteredSearchContents" :gutter="20" :width="240"
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
              <div class="card" v-show="!setting.excludeR18Films || !containsClassFilterKeyword(props.data.type)">
                <div class="img">
                  <div class="site">
                    <span>{{props.data.site.name}}</span>
                  </div>
                  <img style="width: 100%" :src="props.data.pic" alt="" @load="$refs.filmSearchWaterfall.refresh()" @click="detailEvent(props.data.site, props.data)">
                  <div class="operate">
                    <div class="operate-wrap">
                      <span class="o-play" @click="playEvent(props.data.site, props.data)">播放</span>
                      <span class="o-star" @click="starEvent(props.data.site, props.data)">收藏</span>
                      <span class="o-share" @click="shareEvent(props.data.site, props.data)">分享</span>
                    </div>
                  </div>
                </div>
                <div class="name" @click="detailEvent(props.data.site, props.data)">{{props.data.name}}</div>
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
</template>
<script>
import { mapMutations } from 'vuex'
import { star, history, search, sites, setting } from '../lib/dexie'
import zy from '../lib/site/tools'
import Waterfall from 'vue-waterfall-plugin'
import InfiniteLoading from 'vue-infinite-loading'
const { clipboard } = require('electron')
const FILM_DATA_CACHE = {} // key = site.key, value = classList; key = site.key + '@' + type.tid, value = {list, pageCount}
export default {
  name: 'film',
  data () {
    return {
      showFind: false,
      showTableLastColumn: false,
      sites: [],
      site: {},
      classList: [],
      searchClassList: [],
      type: {},
      selectedSiteName: '',
      selectedClassName: '',
      selectedSearchClassNames: [],
      totalpagecount: 0,
      pagecount: 0,
      recordcount: 0,
      list: [],
      statusText: ' ',
      infiniteId: +new Date(),
      searchID: 0,
      searchList: [],
      searchTxt: '',
      searchContents: [],
      filteredSearchContents: [],
      currentColumn: '',
      searchGroup: '',
      searchGroups: ['站内', '组内', '全站'],
      classFilterKeywords: [],
      filteredList: [],
      areas: [],
      searchRunning: false,
      siteSearchCount: 0,
      infiniteHandlerCount: 0,
      // Toolbar
      showToolbar: false,
      selectedAreas: [],
      sortKeyword: '',
      sortKeywords: ['按片名', '按上映年份', '按更新时间'],
      selectedYears: { start: 0, end: new Date().getFullYear() }
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
    filterSettings () {
      return this.$store.getters.getSetting.classFilter // 需要监听的数据
    },
    searchSites () {
      if (this.searchGroup === '站内') return [this.site]
      if (this.searchGroup === '组内') return this.sites.filter(site => site.group === this.site.group)
      if (this.searchGroup === '全站') return this.sites
      return this.sites.filter(site => site.isActive)
    }
  },
  filters: {
    classNameFilter: (name) => {
      const clsName = name.toString()
      return clsName.replace(/[^\u4e00-\u9fa5]/gi, '')
    }
  },
  watch: {
    view () {
      if (this.view === 'Film') {
        this.getAllSites()
        if (this.$refs.filmWaterfall) this.$refs.filmWaterfall.resize() // 瀑布插件resize和refresh功能相同，只是延时不同
        if (this.$refs.filmSearchWaterfall) this.$refs.filmSearchWaterfall.resize()
      }
    },
    searchTxt () {
      if (this.searchTxt === '清除历史记录...') {
        this.clearSearchHistory()
        this.searchTxt = ''
        this.searchChangeEvent()
      }
    },
    filterSettings () {
      this.refreshClass()
    },
    list: {
      handler (list) {
        this.areas = [...new Set(list.map(ele => ele.area))].filter(x => x)
        this.refreshFilteredList()
      },
      deep: true
    },
    siteSearchCount () {
      if (this.siteSearchCount === this.searchSites.length) this.searchRunning = false
    },
    site () {
      this.siteClick(this.site.name)
    },
    searchContents: {
      handler (list) {
        list = list.filter(res => !this.setting.excludeR18Films || !this.containsClassFilterKeyword(res.type))
        this.areas = [...new Set(list.map(ele => ele.area))].filter(x => x)
        this.searchClassList = [...new Set(list.map(ele => ele.type))].filter(x => x)
        this.refreshFilteredList()
      },
      deep: true
    },
    selectedAreas: {
      handler () {
        this.infiniteHandlerCount = 0
      },
      deep: true
    },
    selectedYears: {
      handler () {
        this.infiniteHandlerCount = 0
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations(['SET_VIEW', 'SET_DETAIL', 'SET_VIDEO', 'SET_SHARE', 'SET_SETTING', 'SET_DetailCache']),
    backTop () {
      const viewMode = this.showFind ? this.setting.searchViewMode : this.setting.view
      if (viewMode === 'picture') {
        document.getElementById('film-body').scrollTop = 0
      } else {
        const table = this.showFind ? this.$refs.searchResultTable : this.$refs.filmTable
        table.bodyWrapper.scrollTop = 0
      }
    },
    refreshFilteredList () {
      if (!this.showToolbar) {
        this.sortKeyword = ''
        this.selectedAreas = []
        this.selectedSearchClassNames = []
        this.selectedYears.start = 0
        this.selectedYears.end = new Date().getFullYear()
      }
      let filteredData = this.showFind ? this.searchContents : this.list
      if (this.showFind) filteredData = filteredData.filter(x => (this.selectedSearchClassNames.length === 0) || this.selectedSearchClassNames.includes(x.type))
      filteredData = filteredData.filter(x => (this.selectedAreas.length === 0) || this.selectedAreas.includes(x.area))
      filteredData = filteredData.filter(res => !this.setting.excludeR18Films || !this.containsClassFilterKeyword(res.type))
      filteredData = filteredData.filter(res => res.year >= this.selectedYears.start)
      filteredData = filteredData.filter(res => res.year <= this.selectedYears.end)
      if (!this.showFind) this.selectedClassName = this.type.name + '    ' + filteredData.length + '/' + this.recordcount
      switch (this.sortKeyword) {
        case '按上映年份':
          filteredData.sort(function (a, b) {
            return b.year - a.year
          })
          break
        case '按片名':
          filteredData.sort(function (a, b) {
            return a.name.localeCompare(b.name, 'zh')
          })
          break
        case '按更新时间':
          filteredData.sort(function (a, b) {
            return new Date(b.last) - new Date(a.last)
          })
          break
        default:
          filteredData.sort(function (a, b) {
            return new Date(b.last) - new Date(a.last)
          })
          break
      }

      // Get unique film data
      filteredData = Array.from(new Set(filteredData))
      if (this.showFind) {
        this.filteredSearchContents = filteredData
      } else {
        this.filteredList = filteredData
      }
    },
    toggleViewMode () {
      if (this.showFind) {
        this.setting.searchViewMode = this.setting.searchViewMode === 'picture' ? 'table' : 'picture'
        setTimeout(() => { if (this.$refs.filmSearchWaterfall) this.$refs.filmSearchWaterfall.refresh() }, 700)
      } else {
        this.setting.view = this.setting.view === 'picture' ? 'table' : 'picture'
      }
      setting.find().then(res => {
        res.searchViewMode = this.setting.searchViewMode
        res.view = this.setting.view
        setting.update(res)
      })
    },
    sortByLocaleCompare (a, b) {
      return a.localeCompare(b, 'zh')
    },
    dateFormat (row, column) {
      const date = row[column.property]
      if (date === undefined) {
        return ''
      }
      return date.split(/\s/)[0]
    },
    getFilters (column) {
      if (column === 'siteName') return [...new Set(this.filteredSearchContents.map(row => row.site.name))].map(e => { return { text: e, value: e } }) // 有方法合并这两行吗？
      return [...new Set(this.filteredSearchContents.map(row => row[column]))].map(e => { return { text: e, value: e } })
    },
    filterChange (filters) {
      // 一次只能一列
      if (Object.values(filters)[0].length) {
        const otherColumns = this.$refs.searchResultTable.columns.filter(col => col.id !== this.currentColumn.id)
        otherColumns.forEach(col => { col.filterable = false })
      } else {
        const filterLabels = ['源站', '语言']
        const columns = this.$refs.searchResultTable.columns.filter(col => filterLabels.includes(col.label))
        columns.forEach(col => { col.filterable = true })
      }
    },
    siteClick (siteName) {
      this.list = []
      this.site = this.sites.find(x => x.name === siteName)
      if (this.searchGroup === '站内' && this.searchTxt) {
        this.searchEvent()
        return
      } else {
        this.searchTxt = ''
      }
      this.showFind = false
      this.classList = []
      if (FILM_DATA_CACHE[this.site.key]) {
        this.classList = FILM_DATA_CACHE[this.site.key].classList
        this.classClick(this.type.name)
      } else {
        this.getClass().then(res => {
          this.classList = res
          // cache classList data
          FILM_DATA_CACHE[this.site.key] = {
            classList: this.classList
          }
          this.classClick(this.type.name)
        })
      }
    },
    refreshClass () {
      this.getClass().then(res => {
        this.classList = res
        // cache classList data
        FILM_DATA_CACHE[this.site.key] = {
          classList: this.classList
        }
        this.classClick(this.type.name)
      })
    },
    classClick (className) {
      this.list = []
      this.type = this.classList.find(x => x.name === className)
      this.infiniteHandlerCount = 0
      if (!this.type) {
        this.type = this.classList[0]
      }
      if (this.type.name.endsWith('剧')) this.selectedAreas = []
      const cacheKey = this.site.key + '@' + this.type.tid
      if (FILM_DATA_CACHE[cacheKey]) {
        this.totalpagecount = FILM_DATA_CACHE[cacheKey].totalpagecount
        this.pagecount = FILM_DATA_CACHE[cacheKey].pagecount
        this.recordcount = FILM_DATA_CACHE[cacheKey].recordcount
        this.list = FILM_DATA_CACHE[cacheKey].list
        this.areas = FILM_DATA_CACHE[cacheKey].areas
      } else {
        zy.page(this.site.key, this.type.tid).then(res => {
          this.totalpagecount = res.pagecount
          this.pagecount = res.pagecount
          this.recordcount = res.recordcount
          this.infiniteId += 1
        })
      }
    },
    getClass () {
      return new Promise((resolve, reject) => {
        const key = this.site.key
        zy.class(key).then(res => {
          const allClass = [{ name: '最新', tid: 0 }]
          res.class.forEach(element => {
            if (!this.containsClassFilterKeyword(element.name)) {
              allClass.push(element)
            }
          })
          resolve(allClass)
        }).catch(err => {
          reject(err)
        })
      })
    },
    containsClassFilterKeyword (name) {
      let ret = false
      // 主分类过滤, 检测关键词是否包含分类名
      if (this.setting.excludeRootClasses) {
        ret = this.setting.rootClassFilter?.some(v => v.includes(name))
      }
      // 福利过滤,检测分类名是否包含关键词
      if (this.setting.excludeR18Films && !ret) {
        ret = this.setting.r18ClassFilter?.some(v => name?.includes(v))
      }
      return ret
    },
    toFlipPagecount () {
      return this.site.reverseOrder
    },
    infiniteHandler ($state) {
      const key = this.site.key
      const typeTid = this.type.tid
      let page = this.pagecount
      if (this.toFlipPagecount()) {
        page = this.totalpagecount - this.pagecount + 1
      }
      this.statusText = ' '
      if (key === undefined || page < 1 || page > this.totalpagecount || typeTid === undefined) {
        $state.complete()
        this.statusText = '暂无数据'
        return false
      }
      if (this.showToolbar && this.filteredList.length && this.filteredList.length < 10) {
        this.infiniteHandlerCount++
      }
      const interval = this.setting.view === 'picture' ? 1200 : 300
      setTimeout(() => {
        zy.list(key, page, typeTid).then(res => {
          if (res) {
            this.pagecount -= 1
            const type = Object.prototype.toString.call(res)
            if (type === '[object Array]') {
              // 过滤掉无链接的项
              res = res.filter(e => e.dl.dd && (e.dl.dd._t || (Object.prototype.toString.call(e.dl.dd) === '[object Array]' && e.dl.dd.some(i => i._t))))
              if (!this.toFlipPagecount()) {
                // zy.list 返回的是按时间从旧到新排列, 我门需要翻转为从新到旧
                this.list.push(...res.reverse())
              } else {
                // 如果是需要解析的视频网站，zy.list已经是按从新到旧排列
                this.list.push(...res)
              }
            } else if (type === '[object Object]') {
              if (res.dl.dd && (res.dl.dd._t || (Object.prototype.toString.call(res.dl.dd) === '[object Array]' && res.dl.dd.some(e => e._t)))) {
                this.list.push(res)
              }
            }
            $state.loaded()
            // 更新缓存数据
            const cacheKey = this.site.key + '@' + typeTid
            FILM_DATA_CACHE[cacheKey] = {
              pagecount: this.pagecount,
              recordcount: this.recordcount,
              list: this.list
            }
          }
        })
      }, (this.infiniteHandlerCount <= 1 ? 0 : this.infiniteHandlerCount - 1) * interval)
    },
    detailEvent (site, e) {
      this.detail = {
        show: true,
        key: site.key,
        site: site,
        info: e
      }
    },
    async playEvent (site, e) {
      const db = await history.find({ site: site.key, ids: e.id })
      if (db) {
        this.video = { key: db.site, info: { id: db.ids, name: db.name, index: db.index, site: site } }
      } else {
        this.video = { key: site.key, info: { id: e.id, name: e.name, index: 0, site: site } }
      }
      this.view = 'Play'
    },
    async starEvent (site, e) {
      const db = await star.find({ key: site.key, ids: e.id })
      if (db) {
        this.$message.info('已存在')
      } else {
        const cacheKey = site.key + '@' + e.id
        if (!this.DetailCache[cacheKey]) {
          this.DetailCache[cacheKey] = await zy.detail(site.key, e.id)
        }
        const docs = {
          key: site.key,
          ids: e.id,
          site: site,
          name: e.name,
          detail: this.DetailCache[cacheKey]
        }
        star.add(docs).then(res => {
          this.$message.success('收藏成功')
        })
      }
    },
    shareEvent (site, e) {
      this.share = {
        show: true,
        key: site.key,
        info: e
      }
    },
    async downloadEvent (site, row) {
      const db = await history.find({ site: site.key, ids: row.id })
      let videoFlag
      if (db) videoFlag = db.videoFlag
      zy.download(site.key, row.id, videoFlag).then(res => {
        clipboard.writeText(res.downloadUrls)
        this.$message.success(res.info)
      }).catch((err) => {
        this.$message.error(err.info)
      })
    },
    querySearch (queryString, cb) {
      const searchList = this.searchList.slice(0, -1)
      const results = queryString ? searchList.filter(this.createFilter(queryString)) : this.searchList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (item) => {
        return (item.keywords.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    addSearchRecord () {
      const wd = this.searchTxt
      if (wd) {
        search.find({ keywords: wd }).then(res => {
          if (!res) {
            search.add({ keywords: wd })
          }
          this.getSearchHistory()
        })
      }
    },
    clearSearchHistory () {
      search.clear().then(res => {
        this.getSearchHistory()
      })
    },
    getSearchHistory () {
      search.all().then(res => {
        this.searchList = res.reverse()
        this.searchList.push({ id: this.searchList.length + 1, keywords: '清除历史记录...' })
      })
    },
    stopSearchEvent () {
      this.searchRunning = false
    },
    searchEvent () {
      const wd = this.searchTxt
      if (this.setting.searchGroup !== this.searchGroup) {
        this.setting.searchGroup = this.searchGroup
        setting.update(this.setting)
      }
      if (!wd) return
      this.searchID += 1
      this.searchContents = []
      this.showFind = true
      this.statusText = ' '
      this.searchRunning = true
      this.siteSearchCount = 0
      this.searchSites.forEach(site => {
        const id = this.searchID
        zy.search(site.key, wd).then(res => {
          if (id !== this.searchID || !this.searchRunning) return
          const type = Object.prototype.toString.call(res)
          if (type === '[object Array]') {
            let count = 0
            res.forEach(element => {
              zy.detail(site.key, element.id).then(detailRes => {
                if (id !== this.searchID || !this.searchRunning) return
                detailRes.site = site
                if (this.isValidSearchResult(detailRes)) {
                  this.searchContents.push(detailRes)
                  this.searchContents.sort(function (a, b) {
                    return a.site.id - b.site.id
                  })
                }
              }).finally(() => { count++; if (count === res.length) { this.siteSearchCount++; this.statusText = '暂无数据' } })
            })
          } else if (type === '[object Object]') {
            zy.detail(site.key, res.id).then(detailRes => {
              if (id !== this.searchID || !this.searchRunning) return
              detailRes.site = site
              if (this.isValidSearchResult(detailRes)) {
                this.searchContents.push(detailRes)
                this.searchContents.sort(function (a, b) {
                  return a.site.id - b.site.id
                })
              }
            }).finally(() => { this.siteSearchCount++; this.statusText = '暂无数据' })
          } else if (res === undefined) {
            this.siteSearchCount++
            this.statusText = '暂无数据'
            if (this.searchGroup === '站内') this.$message.info('没有查询到数据！')
          }
        }).catch(() => { this.siteSearchCount++; if (this.searchGroup === '站内') this.$message.error('本次查询状态异常，未获取到数据！') })
      })
    },
    isValidSearchResult (detailRes) {
      return detailRes.dl.dd && (detailRes.dl.dd._t || (Object.prototype.toString.call(detailRes.dl.dd) === '[object Array]' &&
             detailRes.dl.dd.some(i => i._t)))
    },
    searchAndRecord () {
      this.addSearchRecord()
      this.searchEvent()
    },
    searchChangeEvent () {
      if (!this.searchTxt.length) {
        this.searchContents = []
        this.showFind = false
      }
    },
    getAllSites () {
      sites.all().then(res => {
        if (res.length <= 0) {
          this.site = {}
          this.type = {}
          this.list = []
        } else {
          this.sites = res.filter(item => item.isActive)
          if (this.site === undefined || !this.sites.some(x => x.key === this.site.key)) {
            this.site = this.sites[0]
            this.selectedSiteName = this.sites[0].name
          }
        }
        this.searchGroup = this.setting.searchGroup
        if (this.searchGroup === undefined) setting.find().then(res => { this.searchGroup = res.searchGroup })
      })
    }
  },
  created () {
    this.getAllSites()
    this.getSearchHistory()
  },
  mounted () {
    addEventListener('resize', () => {
      setTimeout(() => {
        this.showTableLastColumn = window.outerWidth >= 1200
        if (this.$refs.filmWaterfall) this.$refs.filmWaterfall.resize()
        if (this.$refs.filmSearchWaterfall) this.$refs.filmSearchWaterfall.resize()
      }, 500)
    })
  }
}
</script>
