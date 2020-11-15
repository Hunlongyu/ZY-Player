<template>
  <div class="listpage" id="iptv">
    <div class="listpage-header" id="iptv-header" v-show="!enableBatchEdit">
        <el-switch v-model="enableBatchEdit" active-text="批处理分组"></el-switch>
        <el-button @click.stop="exportChannels" icon="el-icon-upload2" >导出</el-button>
        <el-button @click.stop="importChannels" icon="el-icon-download">导入</el-button>
        <el-button @click="checkAllChannels" icon="el-icon-refresh" :loading="checkAllChannelsLoading">检测{{ this.checkAllChannelsLoading ? this.checkProgress + '/' + this.iptvList.length : '' }}</el-button>
        <el-button @click.stop="resetChannelsEvent" icon="el-icon-refresh-left">重置</el-button>
    </div>
    <div class="listpage-header" id="iptv-header" v-show="enableBatchEdit">
        <el-switch v-model="enableBatchEdit" active-text="批处理分组"></el-switch>
        <el-input placeholder="新组名" v-model="batchGroupName"></el-input>
        <el-switch v-model="batchIsActive" active-text="启用"></el-switch>
        <el-button type="primary" icon="el-icon-edit" @click.stop="saveBatchEdit">保存</el-button>
        <el-button @click.stop="removeSelectedChannels" icon="el-icon-delete-solid">删除</el-button>
    </div>
    <div class="listpage-body" id="iptv-table">
      <div class="show-table" id="iptv-table">
        <el-table
          ref="iptvTable"
          size="mini" fit height="100%" row-key="id"
          :data="filteredTableData"
          lazy
          :load="(row, treeNode, resolve) => resolve(row.channels)"
          :tree-props="{hasChildren: 'hasChildren'}"
          @row-click="playEvent"
          @select="selectionCellClick"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange">
          <el-table-column
            type="selection"
            v-if="enableBatchEdit">
          </el-table-column>
          <el-table-column
            default-sort="ascending"
            prop="name"
            label="频道名">
            <template #header>
              <el-input
              placeholder="搜索"
              size="mini"
              v-model.trim="searchTxt">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="isActive"
            width="120"
            align="center"
            :filters = "[{text:'启用', value: true}, {text:'停用', value: false}]"
            :filter-method="(value, row) => value === row.isActive"
            label="启用">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isActive"
                @click.native.stop='isActiveChangeEvent(scope.row)'>
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            sortable
            :sort-method="(a , b) => sortByLocaleCompare(a.group, b.group)"
            prop="group"
            label="分组"
            :filters="getFilters"
            :filter-method="(value, row) => value === row.group"
            filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-button type="text">{{scope.row.group}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            sortable
            :sort-by="['status']"
            width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.status === ' '">
                <i class="el-icon-loading"></i>
                检测中...
              </span>
              <span v-else>{{scope.row.status}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="right"
            :width="200">
            <template #header>
              <span>总频道数:{{ iptvList.length }}</span>
            </template>
            <template slot-scope="scope">
              <el-button @click.stop="moveToTopEvent(scope.row)" type="text">置顶</el-button>
              <!-- 检测时先强制批量检测一遍，如果不强制直接单个检测时第一次不会显示“检测中”-->
              <el-button size="mini" v-if="iptvList.every(channel => channel.status)" v-show="!checkAllChannelsLoading" @click.stop="checkSingleChannel(scope.row)" type="text">检测</el-button>
              <el-button @click.stop="removeEvent(scope.row)" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { iptv, iptvSearch, channelList } from '../lib/dexie'
import { iptv as defaultChannels } from '../lib/dexie/initData'
import zy from '../lib/site/tools'
import { remote } from 'electron'
import fs from 'fs'
import Sortable from 'sortablejs'
export default {
  name: 'iptv',
  data () {
    return {
      iptvList: [],
      channelList: [],
      searchTxt: '',
      searchRecordList: [],
      enableBatchEdit: false,
      batchGroupName: '',
      batchIsActive: true,
      shiftDown: false,
      selectionBegin: '',
      selectionEnd: '',
      multipleSelection: [],
      checkAllChannelsLoading: false,
      checkProgress: 0,
      stopFlag: false,
      show: {
        search: false
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
    setting () {
      return this.$store.getters.getSetting
    },
    video: {
      get () {
        return this.$store.getters.getVideo
      },
      set (val) {
        this.SET_VIDEO(val)
      }
    },
    filteredTableData () {
      if (this.searchTxt) {
        return this.channelList.filter(x => x.name.toLowerCase().includes(this.searchTxt.toLowerCase()))
      } else {
        return this.channelList
      }
    },
    getFilters () {
      const groups = [...new Set(this.channelList.map(iptv => iptv.group))]
      var filters = []
      groups.forEach(g => {
        var doc = {
          text: g,
          value: g
        }
        filters.push(doc)
      })
      return filters
    }
  },
  watch: {
    view () {
      if (this.view === 'IPTV') {
        this.getChannelList()
      }
    },
    enableBatchEdit () {
      if (this.checkAllChannelsLoading) {
        this.$message.info('正在检测, 请勿操作.')
        this.enableBatchEdit = false
      }
    }
  },
  methods: {
    ...mapMutations(['SET_VIEW', 'SET_DETAIL', 'SET_VIDEO', 'SET_SHARE']),
    sortByLocaleCompare (a, b) {
      return a.localeCompare(b, 'zh')
    },
    selectionCellClick (selection, row) {
      if (this.shiftDown && this.selectionBegin !== '' && selection.includes(row)) {
        this.selectionEnd = row.id
        const start = Math.min(this.selectionBegin, this.selectionEnd) - 1
        const end = Math.max(this.selectionBegin, this.selectionEnd)
        const selections = this.iptvList.slice(start, end)
        this.$nextTick(() => {
          selections.forEach(e => this.$refs.iptvTable.toggleRowSelection(e, true))
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
    handleSortChange (column, prop, order) {
      if (this.checkAllChannelsLoading) {
        this.$message.info('正在检测, 请勿操作.')
        this.enableBatchEdit = false
      }
      this.updateDatabase()
    },
    saveBatchEdit () {
      this.multipleSelection.forEach(ele => {
        if (this.batchGroupName) {
          ele.group = this.batchGroupName
        }
        ele.isActive = this.batchIsActive
      })
      this.updateDatabase()
    },
    playEvent (e) { // 待修改
      this.video = { iptv: { name: e.name, url: e.url, id: e.id } }
      this.view = 'Play'
    },
    containsearchTxt (i) {
      if (this.searchTxt) {
        return i.name.toLowerCase().includes(this.searchTxt.toLowerCase())
      } else {
        return true
      }
    },
    removeEvent (e) {
      if (this.checkAllChannelsLoading) {
        this.$message.info('正在检测, 请勿操作.')
        return false
      }
      iptv.remove(e.id).then(res => { // 需调整
        this.getChannels()
      }).catch(err => {
        this.$message.warning('删除频道失败, 错误信息: ' + err)
      })
    },
    exportChannels () { // 导出导入应为iptvList，然后自动转换为channelList
      const options = {
        filters: [
          { name: 'm3u file', extensions: ['m3u'] },
          { name: 'JSON file', extensions: ['json'] }
        ]
      }
      remote.dialog.showSaveDialog(options).then(result => {
        if (!result.canceled) {
          if (result.filePath.endsWith('m3u')) {
            var writer = require('m3u').extendedWriter()
            this.iptvList.forEach(e => {
              writer.file(e.url, -1, e.name)
            })
            fs.writeFileSync(result.filePath, writer.toString())
            this.$message.success('已保存成功')
          } else {
            const arr = [...this.iptvList]
            const str = JSON.stringify(arr, null, 2)
            fs.writeFileSync(result.filePath, str)
            this.$message.success('已保存成功')
          }
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    importChannels () {
      if (this.checkAllChannelsLoading) {
        this.$message.info('正在检测, 请勿操作.')
        return false
      }
      const options = {
        filters: [
          { name: 'm3u file', extensions: ['m3u', 'm3u8'] },
          { name: 'JSON file', extensions: ['json'] }
        ],
        properties: ['openFile', 'multiSelections']
      }
      remote.dialog.showOpenDialog(options).then(result => {
        if (!result.canceled) {
          var docs = this.iptvList
          var id = docs.length + 1
          result.filePaths.forEach(file => {
            if (file.endsWith('m3u') || file.endsWith('m3u8')) {
              const parser = require('iptv-playlist-parser')
              const playlist = fs.readFileSync(file, { encoding: 'utf-8' })
              const result = parser.parse(playlist)
              result.items.forEach(ele => {
                if (ele.name && ele.url && ele.url.endsWith('.m3u8')) {
                  var doc = {
                    id: id,
                    name: ele.name,
                    url: ele.url,
                    isActive: true,
                    group: this.determineGroup(ele.name)
                  }
                  id += 1
                  docs.push(doc)
                }
              })
            } else {
              // Import Json file
              var str = fs.readFileSync(file)
              const json = JSON.parse(str)
              json.forEach(ele => {
                if (ele.name && ele.url && ele.url.endsWith('.m3u8')) {
                  var doc = {
                    id: id,
                    name: ele.name,
                    url: ele.url,
                    isActive: ele.isActive === undefined ? true : ele.isActive,
                    group: this.determineGroup(ele.name)
                  }
                  id += 1
                  docs.push(doc)
                }
              })
            }
          })
          // 获取name不重复的列表
          // const uniqueList = [...new Map(docs.map(item => [item.name, item])).values()]
          iptv.clear().then(res => {
            iptv.bulkAdd(docs).then(e => { // 支持导入同名频道，群里反馈
              this.updateChannelList()
              this.$message.success('导入成功')
            })
          })
        }
      })
    },
    determineGroup (name) { // iptvList不再需要group，而是通过channelID来追踪归属
      if (name.toLowerCase().includes('cctv') && (name.includes('蓝光') || name.includes('高清'))) {
        return '央视高清'
      } else if (name.toLowerCase().includes('cctv')) {
        return '央视'
      } else if (name.includes('卫视')) {
        return '卫视'
      } else if (name.includes('香港') || name.includes('澳门') || name.includes('台湾') || name.includes('凤凰')) {
        return '港澳台'
      } else if (name.includes('高清') || name.includes('蓝光') || name.includes('1080P')) {
        return '高清'
      } else {
        return '其他'
      }
    },
    resetChannelsEvent () {
      this.stopFlag = true
      if (this.checkAllChannelsLoading) {
        this.$message.info('部分检测还未完全终止, 请稍等...')
        return
      }
      iptv.clear().then(iptv.bulkAdd(defaultChannels).then(this.updateChannelList()))
    },
    removeSelectedChannels () { // 再看看
      this.multipleSelection.forEach(e => iptv.remove(e.id))
      this.$refs.iptvTable.clearFilter()
      this.getChannels()
      this.updateDatabase()
      this.enableBatchEdit = false
    },
    getChannelList () {
      channelList.all().then(res => { if (res && res.length === 0) this.updateChannelList(); this.channelList = res })
    },
    updateChannelList () {
      iptv.all().then(res => {
        const resClone = JSON.parse(JSON.stringify(res))
        const uniqueChannelName = {}
        for (var i = 0; i < resClone.length; i++) {
          var channelName = resClone[i].name.replace(/[- ]?(1080p|蓝光|超清|高清|标清|hd|cq|4k)(\d{1,2})?/i, '')
          if (channelName.match(/cctv/i)) channelName = channelName.replace('-', '')
          if (Object.keys(uniqueChannelName).some(name => channelName.match(new RegExp(`${name}(?!\\d)`, 'i')))) continue // 避免重复
          const matchRule = new RegExp(`${channelName}(1080p|4k|(?!\\d))`, 'i')
          for (var j = i; j < resClone.length; j++) {
            if (resClone[j].name.match(/cctv/i)) {
              resClone[j].name = resClone[j].name.replace('-', '')
            }
            if (matchRule.test(resClone[j].name)) {
              if (uniqueChannelName[channelName]) {
                !uniqueChannelName[channelName].includes(res[j]) && uniqueChannelName[channelName].push(res[j])
              } else {
                uniqueChannelName[channelName] = [res[j]]
              }
            }
          }
        }
        res.forEach(ele => {
          if (ele.isActive === undefined) {
            ele.isActive = true
          }
        })
        let id = res.length // channelList全部放在末尾
        this.channelList = Object.keys(uniqueChannelName).map(e => { return { id: ++id, name: e, isActive: uniqueChannelName[e].some(c => c.isActive), group: this.determineGroup(e), hasChildren: uniqueChannelName[e].length > 1, channels: uniqueChannelName[e] } })
        this.iptvList = this.channelList.reduce((result, item) => { item.channels.forEach(e => { e.channelID = item.id }); return result.concat(item.channels) }, [])
        // 用于验证 console.log(Array.from(new Set(this.iptvList)))
      })
    },
    getSearchRecordList () {
      iptvSearch.all().then(res => {
        this.searchRecordList = res.reverse()
      })
    },
    clearSearch () {
      iptvSearch.clear().then(res => {
        this.getSearchRecordList()
      })
    },
    searchEvent (wd) {
      this.searchTxt = wd
      this.show.search = false
      if (wd) {
        iptvSearch.find({ keywords: wd }).then(res => {
          if (!res) {
            iptvSearch.add({ keywords: wd })
          }
          this.getSearchRecordList()
        })
      }
    },
    moveToTopEvent (i) {
      if (this.checkAllChannelsLoading) {
        this.$message.info('正在检测, 请勿操作.')
        return false
      }
      this.channelList.sort(function (x, y) { return (x.name === i.name && x.url === i.url) ? -1 : (y.name === i.name && y.url === i.url) ? 1 : 0 })
      this.updateDatabase()
    },
    syncTableData () {
      if (this.$refs.iptvTable.tableData) {
        this.channelList = this.$refs.iptvTable.tableData
      }
    },
    updateDatabase () { // iptvList也得考虑
      this.syncTableData()
      channelList.clear().then(res => {
        this.resetId(this.channelList)
        channelList.bulkAdd(this.channelList)
      })
    },
    resetId (inArray) {
      var id = 1
      inArray.forEach(ele => {
        ele.id = id
        id += 1
      })
    },
    rowDrop () {
      if (this.checkAllChannelsLoading) {
        this.$message.info('正在检测, 请勿操作.')
        return false
      }
      const tbody = document.getElementById('iptv-table').querySelector('.el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd ({ newIndex, oldIndex }) {
          const currRow = _this.channelList.splice(oldIndex, 1)[0]
          _this.channelList.splice(newIndex, 0, currRow)
          _this.updateDatabase()
        }
      })
    },
    isActiveChangeEvent (row) { // 得调整
      iptv.remove(row.id)
      iptv.add(row)
    },
    async checkAllChannels () {
      this.checkAllChannelsLoading = true
      this.stopFlag = false
      this.checkProgress = 0
      const uncheckedList = this.iptvList.filter(e => e.status === undefined || e.status === ' ') // 未检测过的优先
      const other = this.iptvList.filter(e => !uncheckedList.includes(e))
      await this.checkChannelList(uncheckedList)
      await this.checkChannelList(other).then(res => {
        this.checkAllChannelsLoading = false
        this.updateChannelList()
      })
    },
    async checkChannelList (channelList) {
      var siteList = {}
      channelList.forEach(channel => {
        const site = channel.url.split('/')[2]
        if (siteList[site]) {
          siteList[site].push(channel)
        } else {
          siteList[site] = [channel]
        }
      })
      await Promise.all(Object.values(siteList).map(site => this.checkSingleSite(site)))
    },
    async checkSingleSite (channelArray) {
      for (const c of channelArray) {
        if (this.stopFlag) return false
        await this.checkSingleChannel(c)
      }
    },
    async checkSingleChannel (row) {
      row.status = ' '
      if (this.stopFlag) {
        this.checkProgress += 1
        return row.status
      }
      const flag = await zy.checkChannel(row.url)
      this.checkProgress += 1
      if (flag) {
        row.status = '可用'
      } else {
        row.status = '失效'
        row.isActive = false
      }
      iptv.remove(row.id)
      iptv.add(row)
      return row.status
    }
  },
  mounted () {
    this.rowDrop()
    addEventListener('keydown', code => { if (code.keyCode === 16) this.shiftDown = true })
    addEventListener('keyup', code => { if (code.keyCode === 16) this.shiftDown = false })
  },
  created () {
    this.getChannelList()
    this.getSearchRecordList()
  }
}
</script>
