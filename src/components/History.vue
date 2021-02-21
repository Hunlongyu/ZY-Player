<template>
  <div class="listpage" id="history">
    <div class="listpage-header" id="history-header">
        <el-switch v-model="setting.historyViewMode" active-text="海报" active-value="picture" inactive-text="列表" inactive-value="table" @change="updateViewMode"></el-switch>
        <el-button @click.stop="exportHistory" icon="el-icon-upload2" title="导出全部，自动添加扩展名">导出</el-button>
        <el-button @click.stop="importHistory" icon="el-icon-download" title="支持同时导入多个文件">导入</el-button>
        <el-button @click.stop="removeSelectedItems" icon="el-icon-delete-solid">{{ multipleSelection.length === 0 ? "清空" : "删除所选" }}</el-button>
    </div>
    <div class="listpage-body" id="history-body">
      <div class="show-table" id="history-table" v-if="setting.historyViewMode === 'table'">
        <el-table size="mini" fit height="100%"
          :data="history"
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
          <el-table-column v-if="history.some(e => e.time)"
            width="150"
            label="时间进度">
            <template slot-scope="scope">
               <span v-if="scope.row.time && scope.row.duration">{{fmtMSS(scope.row.time.toFixed(0))}}/{{fmtMSS(scope.row.duration.toFixed(0))}}</span>
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
        <Waterfall ref="historyWaterfall" :list="history" :gutter="20" :width="240"
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
                    {{fmtMSS(props.data.time.toFixed(0))}}/{{fmtMSS(props.data.duration.toFixed(0))}}
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
      history: [],
      sites: [],
      shiftDown: false,
      selectionBegin: '',
      selectionEnd: '',
      multipleSelection: []
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
      if (this.view === 'History') {
        this.getAllhistory()
        this.getAllsites()
        if (this.setting.historyViewMode === 'table') this.showShiftPrompt()
      }
    }
  },
  methods: {
    ...mapMutations(['SET_VIEW', 'SET_DETAIL', 'SET_VIDEO', 'SET_SHARE', 'SET_SETTING']),
    fmtMSS (s) {
      return (s - (s %= 60)) / 60 + (s > 9 ? ':' : ':0') + s
    },
    selectionCellClick (selection, row) { // 历史id与顺序刚好相反，大的反而在前面
      if (this.shiftDown && this.selectionBegin !== '' && selection.includes(row)) {
        this.selectionEnd = row.id
        const start = this.history.findIndex(e => e.id === Math.max(this.selectionBegin, this.selectionEnd))
        const end = this.history.findIndex(e => e.id === Math.min(this.selectionBegin, this.selectionEnd))
        const selections = this.history.slice(start, end + 1)
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
      if (!this.multipleSelection.length) this.multipleSelection = this.history
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
    },
    async playEvent (e) {
      const db = await history.find({ site: e.site, ids: e.ids })
      if (db) {
        this.video = { key: db.site, info: { id: db.ids, name: db.name, index: db.index } }
      } else {
        this.video = { key: e.site, info: { id: e.ids, name: e.name, index: 0 } }
      }
      this.view = 'Play'
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
      const arr = [...this.history]
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
        this.history = res.reverse()
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
        this.history.forEach(ele => {
          ele.id = id
          id -= 1
          history.add(ele)
        })
      })
    },
    updateViewMode () {
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
