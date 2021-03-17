<template>
  <div class="listpage" id="iptv">
    <div class="listpage-header" id="iptv-header" v-show="!enableBatchEdit">
        <el-switch v-model="enableBatchEdit" active-text="批处理及频道调整"></el-switch>
        <el-button @click.stop="exportChannels" icon="el-icon-upload2" title="导出m3u时必须手动添加扩展名，要保存频道配置信息请选择json格式">导出</el-button>
        <el-button @click.stop="importChannels" icon="el-icon-download" title='支持同时导入多个文件,导入m3u时网址可带参数、含有"#"号时自动分割'>导入</el-button>
        <el-button @click="checkAllChannels" icon="el-icon-refresh" :loading="checkAllChannelsLoading" title="可在后台运行">检测{{ this.checkAllChannelsLoading ? this.checkProgress + '/' + this.iptvList.length : '' }}</el-button>
        <el-button @click.stop="resetChannelsEvent" icon="el-icon-refresh-left">重置</el-button>
    </div>
    <div class="listpage-header" id="iptv-header" v-show="enableBatchEdit">
        <el-switch v-model="enableBatchEdit" active-text="批处理及频道调整"></el-switch>
        <el-input placeholder="新组名/新频道名" v-model="inputContent"></el-input>
        <el-switch v-model="batchIsActive" active-text="启用"></el-switch>
        <el-button type="primary" icon="el-icon-edit" @click.stop="saveBatchEdit" title="输入框组名为空时仅保存开关状态">保存分组与开关状态</el-button>
        <el-button type="primary" icon="el-icon-film" @click.stop="mergeChannel" title="勾选单个时可重命名频道">{{ this.multipleSelection.length === 1 ? '频道重命名' : '频道合并' }}</el-button>
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
              <span>{{ enableBatchEdit ? `频道总数:${channelList.length}` : `资源总数:${iptvList.length}` }}</span>
            </template>
            <template slot-scope="scope">
              <el-button @click.stop="moveToTopEvent(scope.row)" type="text" v-if="scope.row.channels">置顶</el-button>
              <el-button @click.stop="playEvent(scope.row)" type="text">播放</el-button>
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
import { iptv, channelList, setting } from '../lib/dexie'
import { iptv as defaultChannels } from '../lib/dexie/initData'
import zy from '../lib/site/tools'
import { remote } from 'electron'
import fs from 'fs'
import Sortable from 'sortablejs'
import axios from 'axios'
export default {
  name: 'iptv',
  data () {
    return {
      iptvList: [],
      channelList: [],
      searchTxt: '',
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
      sortableTable: ''
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
    setting: {
      get () {
        return this.$store.getters.getSetting
      },
      set (val) {
        this.SET_SETTING(val)
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
    filteredTableData () {
      if (this.searchTxt) {
        return this.channelList.filter(x => x.name.toLowerCase().includes(this.searchTxt.toLowerCase()))
      } else {
        return this.channelList
      }
    },
    getFilters () {
      const groups = [...new Set(this.channelList.map(iptv => iptv.group))]
      const filters = []
      groups.forEach(g => {
        const doc = {
          text: g,
          value: g
        }
        filters.push(doc)
      })
      return filters
    }
  },
  watch: {
    enableBatchEdit () {
      if (this.checkAllChannelsLoading) {
        this.$message.info('正在检测, 请勿操作.')
        this.enableBatchEdit = false
        return
      }
      if (this.enableBatchEdit) {
        if (this.setting.shiftTooltipLimitTimes === undefined) this.setting.shiftTooltipLimitTimes = 5
        if (this.setting.shiftTooltipLimitTimes) {
          this.$message.info('多选时支持shift快捷键')
          this.setting.shiftTooltipLimitTimes--
          setting.find().then(res => {
            res.shiftTooltipLimitTimes = this.setting.shiftTooltipLimitTimes
            setting.update(res)
          })
        }
        this.$nextTick(() => {
          this.expandedRows.forEach(e => this.$refs.iptvTable.toggleRowExpansion(e, false))
        })
        this.rowDrop()
      } else {
        this.sortableTable.destroy()
      }
    }
  },
  methods: {
    ...mapMutations(['SET_VIEW', 'SET_DETAIL', 'SET_VIDEO', 'SET_SHARE', 'SET_SETTING']),
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
        let channels = []
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
    playEvent (e) {
      if (e.url) {
        this.video = { iptv: e }
      } else {
        let prefer
        if (e.prefer) prefer = e.channels.find(c => c.id === e.prefer)
        if (!prefer) prefer = e.channels.filter(c => c.isActive)[0]
        if (!prefer) {
          this.$message.error('当前频道所有源已全部停用，不可播放！')
          return
        }
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
          const ele = this.channelList.find(e => e.id === row.channelID)
          ele.channels.splice(ele.channels.findIndex(e => e.id === row.id), 1)
          channelList.remove(row.channelID)
          if (ele.channels.length) {
            if (ele.prefer === row.id) delete ele.prefer
            if (ele.channels.length === 1) ele.hasChildren = false
            channelList.add(ele)
            this.$set(this.$refs.iptvTable.store.states.lazyTreeNodeMap, ele.id, ele.channels)
          }
        } else {
          channelList.remove(row.id)
        }
        this.getChannelList()
      } catch (err) {
        this.$message.warning('删除频道失败, 错误信息: ' + err)
      }
    },
    exportChannels () { // 导出导入m3u为iptvList，json为channelList
      const options = {
        filters: [
          { name: 'm3u file', extensions: ['m3u'] },
          { name: 'JSON file', extensions: ['json'] }
        ]
      }
      remote.dialog.showSaveDialog(options).then(result => {
        if (!result.canceled) {
          if (result.filePath.endsWith('m3u')) {
            const writer = require('m3u').extendedWriter()
            this.iptvList.forEach(e => {
              writer.file(e.url, -1, e.name)
            })
            fs.writeFileSync(result.filePath, writer.toString())
            this.$message.success('已保存成功')
          } else {
            if (!result.filePath.endsWith('.json')) result.filePath += '.json'
            const arr = [...this.channelList] // 要保存channelList必须选json
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
      this.$msgbox.prompt('请输入网址', '提示', {
        distinguishCancelAndClose: true,
        inputValue: 'http://y.qibaobaike.com/nzy.txt',
        confirmButtonText: '确定',
        cancelButtonText: '本地文件'
      }).then(({ value }) => {
        this.importOnlineChannels(value)
      }).catch(action => {
        if (action === 'cancel') {
          this.importLocalChannels()
        }
      })
    },
    async importOnlineChannels (url) {
      try {
        const docs = []
        let id = this.channelList.length ? this.channelList.slice(-1)[0].id + 1 : 1
        const res = await axios.get(url)
        const result = res.data.split('\n')
        const supportFormats = /\.(m3u8|flv)$/
        for (const i of result) {
          if (i.includes('http') && supportFormats.test(i)) {
            const j = i.split(',')
            const doc = {
              id: id,
              name: j[0],
              url: j[1],
              isActive: true
            }
            id += 1
            docs.push(doc)
          }
        }
        // 获取url不重复的列表
        const uniqueList = [...new Map(docs.map(item => [item.url, item])).values()]
        iptv.clear().then(res => {
          iptv.bulkAdd(uniqueList).then(e => { // 支持导入同名频道，群里反馈
            this.updateChannelList()
          })
        })
        this.$message.success('导入成功')
      } catch (error) {
        this.$message.warning('导入失败')
      }
    },
    importLocalChannels () {
      const options = {
        filters: [
          { name: '支持的文件格式', extensions: ['m3u', 'm3u8', 'json', 'txt'] }
        ],
        properties: ['openFile', 'multiSelections']
      }
      remote.dialog.showOpenDialog(options).then(result => {
        if (!result.canceled) {
          result.filePaths.forEach(file => {
            if (file.endsWith('m3u') || file.endsWith('m3u8')) {
              const docs = []
              const URL = require('url')
              let id = this.channelList.length ? this.channelList.slice(-1)[0].id + 1 : 1
              const parser = require('iptv-playlist-parser')
              const playlist = fs.readFileSync(file, { encoding: 'utf-8' })
              const result = parser.parse(playlist)
              const supportFormats = /\.(m3u8|flv)$/
              result.items.forEach(ele => {
                const urls = ele.url.split('#').filter(e => e.startsWith('http')) // 网址带#时自动分割
                urls.forEach(url => {
                  if (ele.name && url && (supportFormats.test(url) || supportFormats.test(new URL.URL(url).pathname))) { // 网址可能带参数
                    const doc = {
                      id: id,
                      name: ele.name,
                      url: url,
                      isActive: true
                    }
                    id += 1
                    docs.push(doc)
                  }
                })
              })
              // 获取url不重复的列表
              const uniqueList = [...new Map(docs.map(item => [item.url, item])).values()]
              iptv.clear().then(res => {
                iptv.bulkAdd(uniqueList).then(e => { // 支持导入同名频道，群里反馈
                  this.updateChannelList()
                })
              })
              this.$message.success('导入成功')
            }
            if (file.endsWith('json')) {
              const importedList = JSON.parse(fs.readFileSync(file))
              importedList.forEach(ele => {
                const commonEle = this.channelList.find(e => e.name === ele.name)
                if (commonEle) {
                  const urls = commonEle.channels.map(c => c.url)
                  const channels = ele.channels.filter(e => !urls.includes(e.url))
                  commonEle.channels = commonEle.channels.concat(channels)
                } else {
                  ele.id = this.channelList.length ? this.channelList.slice(-1)[0].id + 1 : 1
                  this.channelList.push(ele)
                }
              })
              this.updateDatabase()
              this.$message.success('导入成功')
            }
            if (file.endsWith('txt')) {
              try {
                const docs = []
                let id = this.channelList.length ? this.channelList.slice(-1)[0].id + 1 : 1
                const playlist = fs.readFileSync(file, 'utf8')
                const result = playlist.split('\n')
                const supportFormats = /\.(m3u8|flv)$/
                for (const i of result) {
                  if (i.includes('http') && supportFormats.test(i)) {
                    const j = i.split(',')
                    const doc = {
                      id: id,
                      name: j[0],
                      url: j[1],
                      isActive: true
                    }
                    id += 1
                    docs.push(doc)
                  }
                }
                // 获取url不重复的列表
                const uniqueList = [...new Map(docs.map(item => [item.url, item])).values()]
                iptv.clear().then(res => {
                  iptv.bulkAdd(uniqueList).then(e => { // 支持导入同名频道，群里反馈
                    this.updateChannelList()
                  })
                })
                this.$message.success('导入成功')
              } catch (error) {
                this.$message.warning('导入失败')
              }
            }
          })
        }
      })
    },
    determineGroup (name) {
      if (name.toLowerCase().includes('cctv') || name.toLowerCase().includes('cgtn')) {
        return '央视'
      } else if (name.includes('香港') || name.includes('澳门') || name.includes('台湾') || name.includes('凤凰') || name.includes('翡翠')) {
        return '港澳台'
      } else if (name.includes('卫视')) {
        return '卫视'
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
      this.channelList = []
      this.iptvList = []
      iptv.clear().then(iptv.bulkAdd(defaultChannels).then(this.updateChannelList()))
    },
    removeSelectedChannels () {
      this.multipleSelection.forEach(e => channelList.remove(e.id))
      this.$refs.iptvTable.clearFilter()
      this.getChannelList()
      this.updateDatabase()
      this.enableBatchEdit = false
    },
    updateChannelList () {
      iptv.all().then(res => {
        res = res.filter(o => !this.iptvList.find(e => o.url === e.url))
        const resClone = JSON.parse(JSON.stringify(res))
        const uniqueChannelName = {}
        for (let i = 0; i < resClone.length; i++) {
          let channelName = resClone[i].name.trim().replace(/[- ]?(1080p|蓝光|超清|高清|标清|hd|cq|4k)(\d{1,2})?$/i, '')
          if (channelName.match(/cctv/i)) channelName = channelName.replace('-', '')
          if (Object.keys(uniqueChannelName).some(name => channelName.match(new RegExp(`${name}(1080p|4k|(?!\\d))`, 'i')))) continue // 避免重复
          const matchRule = new RegExp(`${channelName}(1080p|4k|(?!\\d))`, 'i')
          for (let j = i; j < resClone.length; j++) {
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
        Object.keys(uniqueChannelName).forEach(k => {
          const ele = this.channelList.find(e => e.name === k)
          if (ele) {
            ele.channels = ele.channels.concat(uniqueChannelName[k])
            delete uniqueChannelName[k]
          }
        })
        if (Object.keys(uniqueChannelName).length) {
          let id = this.channelList.length ? this.channelList.slice(-1)[0].id + 1 : 1
          const channelList = Object.keys(uniqueChannelName).map(e => { return { id: id++, name: e, isActive: uniqueChannelName[e].some(c => c.isActive), group: this.determineGroup(e), hasChildren: uniqueChannelName[e].length > 1, channels: uniqueChannelName[e] } })
          this.channelList = this.channelList.concat(channelList)
        }
        this.updateDatabase()
        iptv.clear() // iptv默认清空状态
      })
    },
    async getChannelList () {
      await channelList.all().then(res => {
        this.channelList = res
        this.getIptvList()
      })
    },
    getIptvList () {
      this.iptvList = this.channelList.reduce((result, item) => { item.channels.forEach(e => { e.channelID = item.id }); return result.concat(item.channels) }, [])
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
        this.getChannelList()
      })
    },
    resetId (channelList) {
      let id = 1
      channelList.forEach(ele => {
        ele.id = id
        id += 1
        ele.channels.forEach(e => {
          e.channelID = ele.id
          const embedChannelID = ele.id + '_'
          const prefer = ele.prefer ? ele.channels.find(e => e.id === ele.prefer) : ''
          ele.channels.forEach((e, index) => { e.id = embedChannelID + index }) // 为避免混杂，给内置iptv重起id
          if (prefer) ele.prefer = prefer.id
        })
        if (ele.channels.length === 1) {
          ele.hasChildren = false
        } else {
          ele.hasChildren = true
        }
      })
    },
    rowDrop () {
      if (this.checkAllChannelsLoading) {
        this.$message.info('正在检测, 请勿操作.')
        return false
      }
      const tbody = document.getElementById('iptv-table').querySelector('.el-table__body-wrapper tbody')
      const _this = this
      this.sortableTable = new Sortable(tbody, {
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
        const ele = this.channelList.find(e => e.id === row.channelID)
        ele.isActive = ele.channels.some(e => e.isActive)
        channelList.remove(row.channelID)
        channelList.add(ele)
      } else {
        if (row.channels.length === 1) row.channels[0].isActive = row.isActive
        channelList.remove(row.id)
        channelList.add(row)
      }
    },
    async checkAllChannels () {
      if (this.checkAllChannelsLoading) return
      this.checkAllChannelsLoading = true
      this.stopFlag = false
      this.checkProgress = 0
      this.channelList.filter(e => e.channels.length).forEach(e => { e.status = ' '; e.hasCheckedNum = 0 })
      const uncheckedList = this.iptvList.filter(e => e.status === undefined || e.status === ' ') // 未检测过的优先
      const other = this.iptvList.filter(e => !uncheckedList.includes(e))
      await this.checkChannelsBySite(uncheckedList)
      await this.checkChannelsBySite(other).then(res => {
        this.checkAllChannelsLoading = false
        this.getChannelList()
        if (!this.stopFlag) this.$message.success('直播频道批量检测已完成！')
      })
    },
    async checkChannelsBySite (channels) {
      const siteList = {}
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
    async checkSingleChannel (channel, force = false) {
      if (this.stopFlag) {
        this.checkProgress += 1
        return
      }
      const ele = this.channelList.find(e => e.id === channel.channelID)
      if (!force && this.setting.allowPassWhenIptvCheck && (!channel.isActive || !ele.isActive)) {
        if (!ele.isActive) {
          ele.status = '跳过'
        } else if (!channel.isActive) {
          channel.status = '跳过'
        }
      } else {
        channel.status = ' '
        const flag = await zy.checkChannel(channel.url)
        if (flag) {
          channel.status = '可用'
        } else {
          channel.status = '失效'
          channel.isActive = false
          if (this.setting.autocleanWhenIptvCheck) {
            if (ele.prefer === channel.id) delete ele.prefer
            ele.channels.splice(ele.channels.findIndex(e => e.id === channel.id), 1)
            ele.hasCheckedNum--
          }
        }
      }
      this.checkProgress += 1
      ele.hasCheckedNum++
      if (ele.hasCheckedNum === ele.channels.length) {
        if (ele.status === ' ') {
          ele.status = ele.channels.some(channel => channel.status === '可用') ? '可用' : '失效'
          if (ele.status === '失效') ele.isActive = false
        }
        channelList.remove(channel.channelID)
        if (ele.channels.length === 1) ele.hasChildren = false
        if (ele.channels.length) channelList.add(ele)
      }
    },
    async checkChannel (row) {
      if (row.channels) {
        row.status = ' '
        row.hasCheckedNum = 0
        row.channels.forEach(e => this.checkSingleChannel(e, true))
      } else {
        this.checkSingleChannel(row)
      }
    }
  },
  mounted () {
    addEventListener('keydown', code => { if (code.keyCode === 16) this.shiftDown = true })
    addEventListener('keyup', code => { if (code.keyCode === 16) this.shiftDown = false })
  },
  async created () {
    await this.getChannelList()
    if (!this.channelList.length) this.resetChannelsEvent()
  }
}
</script>
