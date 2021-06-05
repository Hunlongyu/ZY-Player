<template>
  <div class="listpage" id="star">
    <div class="listpage-header" id="star-header">
        <el-button @click.stop="exportFavoritesEvent" icon="el-icon-upload2" title="导出全部，自动添加扩展名">导出</el-button>
        <el-button @click.stop="importFavoritesEvent" icon="el-icon-download" title="支持同时导入多个文件">导入</el-button>
        <el-button @click.stop="removeSelectedItems" icon="el-icon-delete-solid">{{ multipleSelection.length === 0 ? "清空" : "删除所选" }}</el-button>
        <b-button-group>
          <el-switch v-model="onlyShowItemsHasUpdate" active-text="有更新" inactive-text="全部" @change="refreshFilteredList"></el-switch>
          <el-button @click.stop="updateAllEvent" icon="el-icon-refresh">检查更新</el-button>
        </b-button-group>
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
    <div class="listpage-body" id="star-body">
      <div class="show-table" id="star-table"  v-if="setting.starViewMode === 'table'">
        <el-table size="mini" fit height="100%" row-key="id"
          ref="starTable"
          :data="filteredList"
          :cell-class-name="checkUpdate"
          @row-click="detailEvent"
          @sort-change="handleSortChange"
          @select="selectionCellClick"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection">
          </el-table-column>
          <el-table-column
            sortable
            :sort-method="(a , b) => sortByLocaleCompare(a.name, b.name)"
            prop="name"
            label="片名">
          </el-table-column>
          <el-table-column
            prop="site.name"
            width="120"
            label="源站">
            <template slot-scope="scope">
              <span>{{ getSiteName(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            sortable
            :sort-method="(a , b) => sortByLocaleCompare(a.detail.type, b.detail.type)"
            prop="detail.type"
            label="类型"
            width="100">
          </el-table-column>
          <el-table-column
            sortable
            :sort-by="['detail.year', 'name']"
            prop="detail.year"
            label="上映"
            width="100">
          </el-table-column>
          <el-table-column v-if="list.some(e => e.detail.note)"
            prop="detail.note"
            width="120"
            label="备注">
          </el-table-column>
          <el-table-column v-if="list.some(e => e.rate && e.rate !== '暂无评分')"
            sortable
            sort-by="rate"
            prop="rate"
            width="120"
            align="center"
            label="豆瓣评分">
          </el-table-column>
          <el-table-column v-if="list.some(e => e.index >= 0)"
            prop="index"
            width="120"
            label="观看至">
            <template slot-scope="scope">
              <span>{{ getHistoryNote(scope.row.index) }}</span>
            </template>
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
              <el-button @click.stop="deleteEvent(scope.row)" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="show-picture" id="star-picture" v-if="setting.starViewMode === 'picture'">
        <Waterfall ref="starWaterfall" :list="filteredList" :gutter="20" :width="240"
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
                  <div class="rate" v-if="props.data.rate && props.data.rate !== '暂无评分'">
                    <span>{{props.data.rate}}分</span>
                  </div>
                  <div class="update" v-if="props.data.hasUpdate">
                    <span>有更新</span>
                  </div>
                  <div class="progress" v-if="props.data.index && props.data.detail && props.data.detail.fullList[0].list !== undefined && props.data.detail.fullList[0].list.length > 1">
                  <span>
                    看至第{{ props.data.index + 1 }}集
                  </span>
                  </div>
                  <img style="width: 100%" :src="props.data.detail.pic" alt="" @load="$refs.starWaterfall.refresh()" @click="detailEvent(props.data)">
                  <div class="operate">
                    <div class="operate-wrap">
                      <span class="o-play" @click="playEvent(props.data)">播放</span>
                      <span class="o-share" @click="shareEvent(props.data)">分享</span>
                      <span class="o-star" @click="downloadEvent(props.data)">下载</span>
                      <span class="o-star" @click="deleteEvent(props.data)">删除</span>
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
import { history, star, sites, setting } from '../lib/dexie'
import zy from '../lib/site/tools'
import { remote } from 'electron'
import fs from 'fs'
import Sortable from 'sortablejs'
import Waterfall from 'vue-waterfall-plugin'
const { clipboard } = require('electron')
export default {
  name: 'star',
  data () {
    return {
      list: [],
      sites: [],
      numNoUpdate: 0,
      shiftDown: false,
      selectionBegin: '',
      selectionEnd: '',
      multipleSelection: [],
      filteredList: [],
      areas: [],
      types: [],
      // Toolbar
      showToolbar: false,
      selectedAreas: [],
      selectedTypes: [],
      sortKeyword: '',
      sortKeywords: ['按片名', '按上映年份', '按更新时间'],
      selectedYears: { start: 0, end: new Date().getFullYear() },
      onlyShowItemsHasUpdate: false
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
  watch: {
    view () {
      if (this.view === 'Star') {
        this.getAllsites()
        this.getFavorites()
        if (this.setting.starViewMode === 'table') this.showShiftPrompt()
      }
    },
    numNoUpdate () {
      // 如果所有收藏都没有更新的话
      if (this.numNoUpdate === this.list.length) {
        this.numNoUpdate = 0
        this.$message.warning('未查询到任何更新')
      }
    },
    list: {
      handler (list) {
        this.areas = [...new Set(list.map(ele => ele.detail.area))].filter(x => x)
        this.types = [...new Set(list.map(ele => ele.detail.type))].filter(x => x)
        this.refreshFilteredList()
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations(['SET_VIEW', 'SET_DETAIL', 'SET_VIDEO', 'SET_SHARE', 'SET_SETTING']),
    toggleViewMode () {
      this.setting.starViewMode = this.setting.starViewMode === 'picture' ? 'table' : 'picture'
      if (this.setting.starViewMode === 'table') {
        setTimeout(() => { this.rowDrop() }, 100)
        this.showShiftPrompt()
      } else {
        setTimeout(() => { if (this.$refs.starWaterfall) this.$refs.starWaterfall.refresh() }, 700)
      }
      setting.find().then(res => {
        res.starViewMode = this.setting.starViewMode
        setting.update(res)
      })
    },
    backTop () {
      if (this.setting.starViewMode === 'picture') {
        document.getElementById('star-body').scrollTop = 0
      } else {
        this.$refs.starTable.bodyWrapper.scrollTop = 0
      }
    },
    refreshFilteredList () {
      if (!this.showToolbar) {
        this.sortKeyword = ''
        this.selectedAreas = []
        this.selectedSearchClassNames = []
        this.selectedYears.start = 0
        this.selectedYears.end = new Date().getFullYear()
        this.filteredList = this.list
      } else {
        let filteredData = this.list
        filteredData = filteredData.filter(x => (this.selectedAreas.length === 0) || this.selectedAreas.includes(x.detail.area))
        filteredData = filteredData.filter(x => (this.selectedTypes.length === 0) || this.selectedTypes.includes(x.detail.type))
        filteredData = filteredData.filter(res => res.detail.year >= this.selectedYears.start)
        filteredData = filteredData.filter(res => res.detail.year <= this.selectedYears.end)
        switch (this.sortKeyword) {
          case '按上映年份':
            filteredData.sort(function (a, b) {
              return b.detail.year - a.detail.year
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
      if (this.onlyShowItemsHasUpdate) {
        this.filteredList = this.filteredList.filter(x => x.hasUpdate)
      }
    },
    handleSortChange (column, prop, order) {
      this.updateDatabase()
    },
    sortByLocaleCompare (a, b) {
      return a.localeCompare(b, 'zh')
    },
    selectionCellClick (selection, row) { // 同history一样，逆序
      if (this.shiftDown && this.selectionBegin !== '' && selection.includes(row)) {
        this.selectionEnd = row.id
        const start = this.list.findIndex(e => e.id === Math.max(this.selectionBegin, this.selectionEnd))
        const end = this.list.findIndex(e => e.id === Math.min(this.selectionBegin, this.selectionEnd))
        const selections = this.list.slice(start, end + 1)
        this.$nextTick(() => {
          selections.forEach(e => this.$refs.starTable.toggleRowSelection(e, true))
        })
        this.selectionBegin = this.selectionEnd = ''
        return
      }
      if (selection.includes(row)) {
        this.selectionBegin = row.id
      } else {
        this.selectionBegin = ''
      }
    },
    handleSelectionChange (rows) {
      this.multipleSelection = rows
    },
    removeSelectedItems () {
      if (!this.multipleSelection.length) this.multipleSelection = this.list
      this.multipleSelection.forEach(e => star.remove(e.id))
      this.getFavorites()
      this.updateDatabase()
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
      if (e.hasUpdate) {
        this.clearHasUpdateFlag(e)
      }
    },
    async playEvent (e) {
      if (e.index) {
        this.video = { key: e.key, info: { id: e.ids, name: e.name, index: e.index } }
      } else {
        this.video = { key: e.key, info: { id: e.ids, name: e.name, index: 0 } }
      }
      if (e.hasUpdate) {
        this.clearHasUpdateFlag(e)
      }
      this.view = 'Play'
    },
    deleteEvent (e) {
      star.remove(e.id).then(res => {
        if (res) {
          this.$message.warning('删除失败')
        }
        this.getFavorites()
      })
    },
    shareEvent (e) {
      this.share = {
        show: true,
        key: e.key,
        info: e.detail
      }
    },
    checkUpdate ({ row, rowIndex }) {
      if (this.list[rowIndex].hasUpdate) {
        return 'highlight'
      }
    },
    async clearHasUpdateFlag (e) {
      const db = await star.find({ id: e.id })
      if (db) {
        db.hasUpdate = false
        star.update(e.id, db)
        this.getFavorites()
      }
    },
    async updateEvent (e) {
      try {
        if (!this.DetailCache[e.key + '@' + e.ids]) {
          this.DetailCache[e.key + '@' + e.ids] = await zy.detail(e.key, e.ids)
        }
        const doc = {
          id: e.id,
          key: e.key,
          ids: e.ids,
          site: e.site,
          name: e.name,
          detail: this.DetailCache[e.key + '@' + e.ids],
          index: e.index
        }
        star.get(e.id).then(resStar => {
          if (!e.hasUpdate && e.detail.last !== doc.detail.last) {
            doc.hasUpdate = true
            const msg = `检查到"${e.name}"有更新。`
            this.$message.success(msg)
          } else {
            this.numNoUpdate += 1
          }
          star.update(e.id, doc)
          this.getFavorites()
        })
      } catch (err) {
        const msg = `更新"${e.name}"失败, 请重试。`
        this.$message.warning(msg, err)
      }
    },
    updateAllEvent () {
      this.numNoUpdate = 0
      this.list.forEach(e => {
        this.updateEvent(e)
      })
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
    getSiteName (row) {
      if (row.site) {
        return row.site.name
      } else {
        const site = this.sites.find(e => e.key === row.key)
        if (site) {
          return site.name
        }
      }
    },
    getHistoryNote (index) {
      if (index !== null && index !== undefined) {
        return `第${index + 1}集`
      } else {
        return ''
      }
    },
    getFavorites () {
      star.all().then(res => {
        this.list = res.sort(function (a, b) {
          return b.id - a.id
        })
      })
    },
    getAllsites () {
      sites.all().then(res => {
        this.sites = res
      })
    },
    exportFavoritesEvent () {
      const arr = [...this.list]
      const str = JSON.stringify(arr, null, 2)
      const options = {
        filters: [
          { name: 'JSON file', extensions: ['json'] }
        ]
      }
      remote.dialog.showSaveDialog(options).then(result => {
        if (!result.canceled) {
          if (!result.filePath.endsWith('.json')) result.filePath += '.json'
          fs.writeFileSync(result.filePath, str)
          this.$message.success('导出收藏成功')
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    importFavoritesEvent () {
      const options = {
        filters: [
          { name: 'JSON file', extensions: ['json'] }
        ],
        properties: ['openFile', 'multiSelections']
      }
      remote.dialog.showOpenDialog(options).then(result => {
        if (!result.canceled) {
          const starList = Array.from(this.list)
          let id = this.list.length + 1
          result.filePaths.forEach(file => {
            const str = fs.readFileSync(file)
            const json = JSON.parse(str)
            json.reverse().forEach(ele => {
              const starExists = starList.some(x => x.key === ele.key && x.ids === ele.ids)
              if (!starExists) {
                const newDetail = {
                  director: ele.director,
                  actor: ele.actor,
                  type: ele.type,
                  area: ele.area,
                  lang: ele.lang,
                  year: ele.year,
                  last: ele.last,
                  note: ele.note
                }
                const doc = {
                  id: id,
                  key: ele.key,
                  ids: ele.ids,
                  site: ele.site === undefined ? ele.site = this.sites.find(x => x.key === ele.key) : ele.site,
                  name: ele.name,
                  hasUpdate: ele.hasUpdate,
                  index: ele.index,
                  rate: ele.rate,
                  detail: ele.detail === undefined ? newDetail : ele.detail
                }
                id += 1
                starList.push(doc)
              }
            })
          })
          star.clear().then(star.bulkAdd(starList).then(res => {
            this.getFavorites()
            this.$message.success('导入收藏成功')
          }))
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    syncTableData () {
      if (this.$refs.starTable.tableData && this.$refs.starTable.tableData.length === this.list.length) {
        this.list = this.$refs.starTable.tableData
      }
    },
    updateDatabase () {
      this.syncTableData()
      star.clear().then(res => {
        let id = this.list.length
        this.list.forEach(ele => {
          ele.id = id
          id -= 1
        })
        star.bulkAdd(this.list)
      })
    },
    rowDrop () {
      if (!document.getElementById('star-table')) return
      const tbody = document.getElementById('star-table').querySelector('.el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd ({ newIndex, oldIndex }) {
          const currRow = _this.list.splice(oldIndex, 1)[0]
          _this.list.splice(newIndex, 0, currRow)
          _this.updateDatabase()
        }
      })
    },
    showShiftPrompt () {
      if (this.setting.shiftTooltipLimitTimes === undefined) this.setting.shiftTooltipLimitTimes = 5
      if (this.setting.shiftTooltipLimitTimes) {
        this.$message.info('多选时支持shift快捷键')
        this.setting.shiftTooltipLimitTimes--
        setting.find().then(res => {
          res.shiftTooltipLimitTimes = this.setting.shiftTooltipLimitTimes
          setting.update(res)
        })
      }
    }
  },
  created () {
    this.getFavorites()
  },
  mounted () {
    if (this.setting.starViewMode === 'table') setTimeout(() => { this.rowDrop() }, 100)
    addEventListener('keydown', code => { if (code.keyCode === 16) this.shiftDown = true })
    addEventListener('keyup', code => { if (code.keyCode === 16) this.shiftDown = false })
    addEventListener('resize', () => {
      setTimeout(() => { if (this.$refs.starWaterfall) this.$refs.starWaterfall.resize() }, 500)
    })
  }
}
</script>
