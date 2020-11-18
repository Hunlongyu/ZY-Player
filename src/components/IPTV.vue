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
        <el-input placeholder="新组名/新频道名" v-model="inputContent"></el-input>
        <el-switch v-model="batchIsActive" active-text="启用"></el-switch>
        <el-button type="primary" icon="el-icon-edit" @click.stop="saveBatchEdit">保存分组</el-button>
        <el-button type="primary" icon="el-icon-film" @click.stop="mergeChannel">频道合并</el-button>
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
          @expand-change="expandChange"
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
            :class-name="enableBatchEdit ? 'disableExpand' : ''"
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
              <el-button @click.stop="moveToTopEvent(scope.row)" type="text" v-if="scope.row.channels">置顶</el-button>
              <!-- 检测时先强制批量检测一遍，如果不强制直接单个检测时第一次不会显示“检测中”-->
              <el-button size="mini" v-if="iptvList.every(channel => channel.status)" v-show="!checkAllChannelsLoading" @click.stop="checkChannel(scope.row)" type="text">检测</el-button>
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
      inputContent: '',
      batchIsActive: true,
      shiftDown: false,
      selectionBegin: '',
      selectionEnd: '',
      multipleSelection: [],
      expandedRows: [],
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
        return
      }
      if (this.enableBatchEdit) {
        this.$nextTick(() => {
          this.expandedRows.forEach(e => this.$refs.iptvTable.toggleRowExpansion(e, false))
        })
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
        const start = this.channelList.findIndex(e => e.id === Math.min(this.selectionBegin, this.selectionEnd))
        const end = this.channelList.findIndex(e => e.id === Math.max(this.selectionBegin, this.selectionEnd))
        const selections = this.channelList.slice(start, end + 1) // 多选时强制不让展开
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
    expandChange (row, expanded) {
      const index = this.expandedRows.indexOf(row)
      if (expanded && index === -1) {
        this.expandedRows.push(row)
      } else if (!expanded && index !== -1) {
        this.expandedRows.splice(index, 1)
      }
    },
    handleSelectionChange (rows) {
      this.multipleSelection = rows
    },
    handleSortChange (column, prop, order) {
      if (this.checkAllChannelsLoading) {
        this.$message.info('正在检测, 请勿操作.')
        return
      }
      this.updateDatabase()
    },
    saveBatchEdit () {
      this.multipleSelection.forEach(ele => {
        if (this.inputContent) {
          ele.group = this.inputContent
        }
        ele.isActive = this.batchIsActive
      })
      this.updateDatabase()
    },
    mergeChannel () {
      if (this.inputContent && this.multipleSelection.length) {
        var channels = []
        const id = this.multipleSelection[0].id
        this.multipleSelection.forEach(ele => {
          channels = channels.concat(ele.channels)
          channels.forEach(e => { e.channelID = id })
          channelList.remove(ele.id)
        })
        const mergeChannel = { id: id, name: this.inputContent, isActive: channels.some(c => c.isActive), group: this.determineGroup(this.inputContent), hasChildren: channels.length > 1, channels: channels }
        channelList.add(mergeChannel)
        this.getChannelList()
        this.updateDatabase()
      }
    },
    playEvent (e) { // 下一步与Play联动prefer
      if (e.url) {
        this.video = { iptv: e }
      } else {
        const prefer = e.channels.filter(c => c.isActive)[0]
        if (!prefer) return
        this.video = { iptv: prefer }
      }
      this.view = 'Play'
    },
    containsearchTxt (i) {
      if (this.searchTxt) {
        return i.name.toLowerCase().includes(this.searchTxt.toLowerCase())
      } else {
        return true
      }
    },
    removeEvent (row) {
      if (this.checkAllChannelsLoading) {
        this.$message.info('正在检测, 请勿操作.')
        return false
      }
      try {
        if (row.url) { // tree树形控件节点一旦展开，就不再重新加载节点数据
          iptv.remove(row.id)
          const parent = this.channelList.find(e => e.id === row.channelID)
          parent.channels.splice(parent.channels.findIndex(e => e.id === row.id), 1)
          channelList.remove(row.channelID)
          if (parent.channels.length) channelList.add(parent)
          this.$set(this.$refs.iptvTable.store.states.lazyTreeNodeMap, parent.id, parent.channels)
        } else {
          channelList.remove(row.id)
          row.channels.forEach(e => {
            iptv.remove(e.id)
          })
        }
        this.getChannelList()
      } catch (err) {
        this.$message.warning('删除频道失败, 错误信息: ' + err)
      }
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
          var _id = 1
          this.iptvList.forEach(e => { e.id = _id++ }) // 导入时需重置iptvList的id
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
                    isActive: true
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
                    isActive: ele.isActive === undefined ? true : ele.isActive
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
    removeSelectedChannels () {
      this.multipleSelection.forEach(e => { channelList.remove(e.id); e.channels.forEach(c => iptv.remove(c.id)) })
      this.$refs.iptvTable.clearFilter()
      this.getChannelList()
      this.updateDatabase()
      this.enableBatchEdit = false
    },
    updateChannelList () {
      iptv.all().then(res => {
        const resClone = JSON.parse(JSON.stringify(res))
        const uniqueChannelName = {}
        for (var i = 0; i < resClone.length; i++) {
          var channelName = resClone[i].name.trim().replace(/[- ]?(1080p|蓝光|超清|高清|标清|hd|cq|4k)(\d{1,2})?$/i, '')
          if (channelName.match(/cctv/i)) channelName = channelName.replace('-', '')
          if (Object.keys(uniqueChannelName).some(name => channelName.match(new RegExp(`${name}(1080p|4k|(?!\\d))`, 'i')))) continue // 避免重复
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
        this.getIptvList()
        Object.values(this.$refs.iptvTable.store.states.treeData).forEach(e => { e.loaded = false })
        channelList.clear().then(channelList.bulkAdd(this.channelList))
        iptv.clear().then(iptv.bulkAdd(this.iptvList))
        // 用于验证
        // console.log(res.length, Array.from(new Set(this.iptvList)))
        // res.forEach(e => { if (!this.iptvList.includes(e)) console.log(e) })
      })
    },
    getChannelList () {
      channelList.all().then(res => { if (res && res.length === 0) this.updateChannelList(); this.channelList = res; this.getIptvList() })
    },
    getIptvList () {
      this.iptvList = this.channelList.reduce((result, item) => { item.channels.forEach(e => { e.channelID = item.id }); return result.concat(item.channels) }, [])
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
    moveToTopEvent (row) {
      if (this.checkAllChannelsLoading) {
        this.$message.info('正在检测, 请勿操作.')
        return false
      }
      // this.channelList.sort(function (x, y) { return (x.name === i.name && x.url === i.url) ? -1 : (y.name === i.name && y.url === i.url) ? 1 : 0 })
      if (row.channels) {
        this.channelList.splice(this.channelList.findIndex(e => e.id === row.id), 1)
        this.channelList.unshift(row)
        this.updateDatabase()
      }
    },
    syncTableData () {
      if (this.$refs.iptvTable.tableData && this.$refs.iptvTable.tableData.length === this.channelList.length) {
        this.channelList = this.$refs.iptvTable.tableData
      }
    },
    updateDatabase () {
      this.syncTableData()
      Object.values(this.$refs.iptvTable.store.states.treeData).forEach(e => { e.loaded = false })
      channelList.clear().then(res => {
        this.resetId(this.channelList)
        channelList.bulkAdd(this.channelList)
        iptv.clear().then(iptv.bulkAdd(this.iptvList))
        this.getChannelList()
      })
    },
    resetId (channelList) {
      this.getIptvList()
      var id = this.iptvList.length + 1
      channelList.forEach(ele => {
        ele.id = id
        id += 1
        ele.channels.forEach(e => { e.channelID = ele.id })
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
        filter: '.el-table__row--level-1', // 禁止children拖动
        onEnd ({ newIndex, oldIndex }) {
          const currRow = _this.channelList.splice(oldIndex, 1)[0]
          _this.channelList.splice(newIndex, 0, currRow)
          _this.updateDatabase()
        }
      })
    },
    isActiveChangeEvent (row) {
      if (row.url) {
        iptv.remove(row.id)
        iptv.add(row)
        const parent = this.channelList.find(e => e.id === row.channelID)
        parent.isActive = parent.channels.some(e => e.isActive)
        channelList.remove(row.channelID)
        channelList.add(parent)
      } else {
        channelList.remove(row.id)
        channelList.add(row)
        row.channels.forEach(e => {
          e.isActive = row.isActive
          iptv.remove(e.id)
          iptv.add(e)
        })
      }
    },
    async checkAllChannels () {
      this.checkAllChannelsLoading = true
      this.stopFlag = false
      this.checkProgress = 0
      this.channelList.forEach(e => { e.status = ' '; e.hasCheckedNum = 0 })
      const uncheckedList = this.iptvList.filter(e => e.status === undefined || e.status === ' ') // 未检测过的优先
      const other = this.iptvList.filter(e => !uncheckedList.includes(e))
      await this.checkChannelsBySite(uncheckedList)
      await this.checkChannelsBySite(other).then(res => {
        this.checkAllChannelsLoading = false
        this.updateChannelList()
      })
    },
    async checkChannelsBySite (channels) {
      var siteList = {}
      channels.forEach(channel => {
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
    async checkSingleChannel (channel) {
      channel.status = ' '
      const parent = this.channelList.find(e => e.id === channel.channelID)
      if (this.stopFlag) {
        this.checkProgress += 1
        return channel.status
      }
      const flag = await zy.checkChannel(channel.url)
      this.checkProgress += 1
      parent.hasCheckedNum++
      if (flag) {
        channel.status = '可用'
      } else {
        channel.status = '失效'
        channel.isActive = false
      }
      if (parent.hasCheckedNum === parent.channels.length) {
        parent.status = parent.channels.some(channel => channel.status === '可用') ? '可用' : '失效'
        if (parent.status === '失效') parent.isActive = false
        channelList.remove(channel.channelID)
        channelList.add(parent)
      }
      iptv.remove(channel.id)
      iptv.add(channel)
      return channel.status
    },
    async checkChannel (row) {
      if (row.channels) {
        row.status = ' '
        row.hasCheckedNum = 0
        row.channels.forEach(e => this.checkSingleChannel(e))
      } else {
        this.checkSingleChannel(row)
      }
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
