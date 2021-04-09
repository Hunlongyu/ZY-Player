<template>
  <div class="listpage" id="history">
    <div class="listpage-header" id="history-header">
        <el-button @click.stop="exportHistory" icon="el-icon-upload2" title="导出全部，自动添加扩展名">导出</el-button>
        <el-button @click.stop="importHistory" icon="el-icon-download" title="支持同时导入多个文件">导入</el-button>
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
    <div class="listpage-body" id="history-body">
      <div class="show-table" id="history-table" v-if="setting.historyViewMode === 'table'">
        <el-table size="mini" fit height="100%"
          :data="filteredList"
          row-key="id"
          ref="historyTable"
          @select="selectionCellClick"
          @selection-change="handleSelectionChange"
          @row-click="detailEvent">
          <el-table-column
            type="selection">
          </el-table-column>
          <el-table-column
            prop="name"
            label="片名">
          </el-table-column>
          <el-table-column
            prop="site"
            width="120"
            label="片源">
            <template slot-scope="scope">
              <span>{{ getSiteName(scope.row.site) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="index"
            width="180"
            label="观看至">
            <template slot-scope="scope">
              <span v-if="scope.row.detail && scope.row.detail.fullList[0].list && scope.row.detail.fullList[0].list.length > 1">
                第{{ scope.row.index + 1 }}集(共{{scope.row.detail.fullList[0].list.length}}集)
              </span>
            </template>
          </el-table-column>
          <el-table-column v-if="list.some(e => e.time)"
            width="200"
            label="时间进度">
            <template slot-scope="scope">
               <span v-if="scope.row.time && scope.row.duration">{{fmtMSS(scope.row.time.toFixed(0))}}/{{fmtMSS(scope.row.duration.toFixed(0))}} ({{progress(scope.row)}}%)</span>
               <span v-if="scope.row.onlinePlay">在线解析</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="200"
            header-align="center"
            align="right">
            <template slot-scope="scope">
              <el-button @click.stop="playEvent(scope.row)" type="text">播放</el-button>
              <el-button @click.stop="shareEvent(scope.row)" type="text">分享</el-button>
              <el-button @click.stop="downloadEvent(scope.row)" type="text">下载</el-button>
              <el-button @click.stop="deleteEvent(scope.row)" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="show-picture" id="star-picture" v-if="setting.historyViewMode === 'picture'">
        <Waterfall ref="historyWaterfall" :list="filteredList" :gutter="20" :width="240"
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
                  <div class="update" v-if="props.data.hasUpdate">
                    <span>有更新</span>
                  </div>
                  <img v-if="props.data.detail && props.data.detail.pic" style="width: 100%" :src="props.data.detail.pic" alt="" @load="$refs.historyWaterfall.refresh()" @click="detailEvent(props.data)">
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
                 <span v-if="props.data.time && props.data.duration">
                    {{fmtMSS(props.data.time.toFixed(0))}}/{{fmtMSS(props.data.duration.toFixed(0))}} ({{progress(props.data)}}%)
                  </span>
                  <span v-if="props.data.onlinePlay">在线解析</span>
                  <span v-if="props.data.detail && props.data.detail.fullList[0].list !== undefined && props.data.detail.fullList[0].list.length > 1">
                    第{{ props.data.index + 1 }}集(共{{props.data.detail.fullList[0].list.length}}集)
                  </span>
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
import { history, sites, setting } from '../lib/dexie'
import zy from '../lib/site/tools'
import { remote } from 'electron'
import fs from 'fs'
import Waterfall from 'vue-waterfall-plugin'
const { clipboard } = require('electron')

export default {
  name: 'history',
  data () {
    return {
      list: [],
      sites: [],
      shiftDown: false,
      selectionBegin: '',
      selectionEnd: '',
      multipleSelection: [],
      areas: [],
      types: [],
      filteredList: [],
      // Update
      numNoUpdate: 0,
      // Toolbar
      showToolbar: false,
      selectedAreas: [],
      selectedTypes: [],
      sortKeyword: '',
      sortKeywords: ['按片名', '按上映年份', '按更新时间', '按完成度'],
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
      if (this.view === 'History') {
        this.getAllhistory()
        this.getAllsites()
        if (this.setting.historyViewMode === 'table') this.showShiftPrompt()
      }
    },
    list: {
      handler (list) {
        this.areas = [...new Set(list.map(ele => ele.detail.area))].filter(x => x)
        this.types = [...new Set(list.map(ele => ele.detail.type))].filter(x => x)
        this.refreshFilteredList()
      },
      deep: true
    },
    numNoUpdate () {
      // 如果所有历史都没有更新的话
      if (this.numNoUpdate === this.list.length) {
        this.numNoUpdate = 0
        this.$message.warning('未查询到任何更新')
      }
    }
  },
  methods: {
    ...mapMutations(['SET_VIEW', 'SET_DETAIL', 'SET_VIDEO', 'SET_SHARE', 'SET_SETTING']),
    updateAllEvent () {
      this.numNoUpdate = 0
      this.list.forEach(e => {
        this.updateEvent(e)
      })
    },
    async updateEvent (e) {
      try {
        if (!this.DetailCache[e.site + '@' + e.ids]) {
          this.DetailCache[e.site + '@' + e.ids] = await zy.detail(e.site, e.ids)
        }
        const newDetail = this.DetailCache[e.site + '@' + e.ids]
        history.get(e.id).then(res => {
          if (!e.hasUpdate && e.detail.last !== newDetail.last) {
            res.hasUpdate = true
            res.detail = newDetail
            const msg = `检查到"${e.name}"有更新。`
            this.$message.success(msg)
          } else {
            this.numNoUpdate += 1
          }
          history.update(e.id, res)
          this.getAllhistory()
        })
      } catch (err) {
        const msg = `更新"${e.name}"失败, 请重试。`
        this.$message.warning(msg, err)
      }
    },
    toggleViewMode () {
      this.setting.historyViewMode = this.setting.historyViewMode === 'picture' ? 'table' : 'picture'
      if (this.setting.historyViewMode === 'table') {
        this.showShiftPrompt()
      } else {
        setTimeout(() => { if (this.$refs.historyWaterfall) this.$refs.historyWaterfall.refresh() }, 700)
      }
      setting.find().then(res => {
        res.historyViewMode = this.setting.historyViewMode
        setting.update(res)
      })
    },
    backTop () {
      if (this.setting.starViewMode === 'picture') {
        document.getElementById('history-body').scrollTop = 0
      } else {
        this.$refs.historyTable.bodyWrapper.scrollTop = 0
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
          case '按完成度':
            filteredData.sort(this.sortByProgress)
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
    progress (e) {
      return e.duration > 0 ? ((e.time / e.duration) * 100).toFixed(0) : 0
    },
    sortByProgress (a, b) {
      if (this.progress(a) < this.progress(b)) {
        return -1
      } else {
        return 1
      }
    },
    fmtMSS (s) {
      return (s - (s %= 60)) / 60 + (s > 9 ? ':' : ':0') + s
    },
    selectionCellClick (selection, row) { // 历史id与顺序刚好相反，大的反而在前面
      if (this.shiftDown && this.selectionBegin !== '' && selection.includes(row)) {
        this.selectionEnd = row.id
        const start = this.list.findIndex(e => e.id === Math.max(this.selectionBegin, this.selectionEnd))
        const end = this.list.findIndex(e => e.id === Math.min(this.selectionBegin, this.selectionEnd))
        const selections = this.list.slice(start, end + 1)
        this.$nextTick(() => {
          selections.forEach(e => this.$refs.historyTable.toggleRowSelection(e, true))
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
      this.multipleSelection.forEach(e => history.remove(e.id))
      this.multipleSelection = []
      this.getAllhistory()
      this.updateDatabase()
    },
    detailEvent (e) {
      this.detail = {
        show: true,
        key: e.site,
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
      const db = await history.find({ site: e.site, ids: e.ids })
      if (db) {
        this.video = { key: db.site, info: { id: db.ids, name: db.name, index: db.index } }
      } else {
        this.video = { key: e.site, info: { id: e.ids, name: e.name, index: 0 } }
      }
      if (e.hasUpdate) {
        this.clearHasUpdateFlag(e)
      }
      this.view = 'Play'
    },
    async clearHasUpdateFlag (e) {
      const db = await history.find({ id: e.id })
      if (db) {
        db.hasUpdate = false
        history.update(e.id, db)
        this.getAllhistory()
      }
    },
    shareEvent (e) {
      this.share = {
        show: true,
        key: e.site,
        info: e.detail
      }
    },
    downloadEvent (e) {
      zy.download(e.site, e.ids, e.videoFlag).then(res => {
        clipboard.writeText(res.downloadUrls)
        this.$message.success(res.info)
      }).catch((err) => {
        this.$message.error(err.info)
      })
    },
    exportHistory () {
      this.getAllhistory()
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
          this.$message.success('已保存成功')
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    importHistory () {
      const options = {
        filters: [
          { name: 'JSON file', extensions: ['json'] }
        ],
        properties: ['openFile', 'multiSelections']
      }
      remote.dialog.showOpenDialog(options).then(result => {
        if (!result.canceled) {
          result.filePaths.forEach(file => {
            const str = fs.readFileSync(file)
            const json = JSON.parse(str)
            json.forEach(record => {
              if (record.detail && record.detail.m3u8List) {
                record.detail.fullList = [].concat({ flag: 'm3u8', list: record.detail.m3u8List })
                delete record.detail.m3u8List
              }
            })
            history.bulkAdd(json).then(res => {
              this.$message.success('导入成功')
              this.getAllhistory()
            })
          })
        }
      })
    },
    getAllhistory () {
      history.all().then(res => {
        this.list = res.reverse()
      })
    },
    getAllsites () {
      sites.all().then(res => {
        this.sites = res
      })
    },
    getSiteName (key) {
      const site = this.sites.find(e => e.key === key)
      if (site) {
        return site.name
      }
    },
    deleteEvent (e) {
      history.remove(e.id).then(res => {
        this.getAllhistory()
      }).catch(err => {
        this.$message.warning('删除历史记录失败, 错误信息: ' + err)
      })
    },
    updateDatabase () {
      history.clear().then(res => {
        let id = length
        this.list.forEach(ele => {
          ele.id = id
          id -= 1
          history.add(ele)
        })
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
  mounted () {
    addEventListener('keydown', code => { if (code.keyCode === 16) this.shiftDown = true })
    addEventListener('keyup', code => { if (code.keyCode === 16) this.shiftDown = false })
    addEventListener('resize', () => {
      setTimeout(() => { if (this.$refs.historyWaterfall) this.$refs.historyWaterfall.resize() }, 500)
    })
  },
  created () {
    this.getAllhistory()
  }
}
</script>
