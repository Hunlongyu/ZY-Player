<template>
  <div class="listpage" id="IPTV">
    <div class="listpage-content">
      <div class="listpage-header">
        <el-button @click.stop="editGroupDialogVisible = true" type="text">分组管理</el-button>
        <el-button @click.stop="batchSetDialogVisible = multipleSelection.length" type="text">指定分组</el-button>
        <el-button @click.stop="exportChannels" type="text">导出</el-button>
        <el-button @click.stop="importChannels" type="text">导入</el-button>
        <el-button @click.stop="removeAllChannels" type="text">清空</el-button>
        <el-button @click.stop="resetChannelsEvent" type="text">重置</el-button>
      </div>
      <div class="listpage-body" id="iptv-table">
        <el-table @selection-change="handleSelectionChange" @filter-change="backTop"
          ref="iptvTable"
          :data="searchResult"
          row-key="id"
          @row-click="playEvent"
          height="100%"
          style="width: 100%">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="name"
            label="频道名"
            min-width="200">
            <template #header>
              <el-autocomplete width="100"
                clearable
                placeholder="搜索"
                v-model.trim="searchTxt"
                value-key="keywords"
                :fetch-suggestions="querySearch"
                @keyup.enter.native="searchAndRecord"
                @select="searchEvent"
                @change="searchEvent">
               <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-autocomplete>
            </template>
          </el-table-column>
          <el-table-column
            prop="gid"
            label="所在组"
            width="150"
            :formatter="getGroupName"
            :filters="getFilters"
            :filter-method="filterHandle">
          </el-table-column>
          <el-table-column
            prop="url"
            label="源站"
            width="150"
            :formatter="getHostname"
            :filters="getHostFilters"
            :filter-method="hostFilterHandle">
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="140">
            <template #header>
              <span>总频道数:{{ iptvList.length }}</span>
            </template>
            <template slot-scope="scope">
              <el-button @click.stop="removeEvent(scope.row)" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分组管理 -->
    <div>
      <el-dialog :visible.sync="editGroupDialogVisible" v-if='editGroupDialogVisible' title="分组管理" :append-to-body="true" @close="closeDialog">
        <el-button
          size="small"
          type="success"
          @click="addGroup">新增组</el-button>
        <el-table
          :data="groups"
          row-key="gid"
          tyle="width: 100%">
          <el-table-column
              prop="gid"
              label="gid"
              width="60">
          </el-table-column>
          <el-table-column
              prop="name"
              label="组名"
              align="center"
              width="150">
              <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.name" placeholder="请输入组名" ></el-input>
              </template>
          </el-table-column>
          <el-table-column
              label="操作"
              align="center"
              width="250">
              <template slot-scope="scope">
                <el-button @click="removeGroup(scope.row)" type="danger">删除组及属于该组的频道</el-button>
              </template>
          </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
           <el-button @click="closeDialog">取消</el-button>
           <el-button type="primary" @click="updateGroups">确认</el-button>
      </span>
     </el-dialog>
   </div>
   <!-- 指定分组 -->
   <div>
     <el-dialog :visible.sync="batchSetDialogVisible" v-if='batchSetDialogVisible' title="指定分组" :append-to-body="true" @close="closeDialog">
       <el-select v-model="batchConfigGroup" placeholder="请选择">
         <el-option
           v-for="item in groups"
           :key="item.gid"
           :label="item.name"
           :value="item.gid">
         </el-option>
       </el-select>
       <span slot="footer" class="dialog-footer">
         <el-button @click="closeDialog">取消</el-button>
         <el-button type="primary" @click="batchSet">保存</el-button>
       </span>
     </el-dialog>
   </div>
</div>
</template>
<script>
import { mapMutations } from 'vuex'
import { iptv, iptvSearch, channelGroups } from '../lib/dexie'
import { iptv as defaultChannels, channelGroups as defaultGroups } from '../lib/dexie/initData'
import { remote } from 'electron'
import fs from 'fs'
import Sortable from 'sortablejs'
export default {
  name: 'iptv',
  data () {
    return {
      iptvList: [],
      searchTxt: '',
      searchResult: [],
      searchRecordList: [],
      editGroupDialogVisible: false,
      batchSetDialogVisible: false,
      batchConfigGroup: 0,
      tempGroups: [],
      groups: [],
      multipleSelection: []
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
    getFilters () {
      const groups = [...new Set(this.iptvList.map(iptv => iptv.gid))]
      var filters = []
      groups.forEach(gid => {
        console.log(this.groups)
        var doc = {
          text: this.groups[gid].name || gid,
          value: gid
        }
        filters.push(doc)
      })
      return filters
    },
    getHostFilters () {
      const hosts = [...new Set(this.iptvList.map(iptv => iptv.url.split('/')[2]))]
      var filters = []
      console.log(hosts)
      hosts.forEach(host => {
        var doc = {
          text: host,
          value: host
        }
        filters.push(doc)
      })
      return filters
    }
  },
  watch: {
    view () {
      this.getChannels()
    },
    searchTxt () {
      if (this.searchTxt === '清除历史记录...') {
        this.clearSearchRecords()
        this.searchTxt = ''
        this.searchEvent()
      }
    }
  },
  methods: {
    ...mapMutations(['SET_VIEW', 'SET_DETAIL', 'SET_VIDEO', 'SET_SHARE']),
    backTop () {
      this.$refs.iptvTable.bodyWrapper.scrollTop = 0
    },
    querySearch (queryString, cb) {
      var searchRecordList = this.searchRecordList.slice(0, -1)
      var results = queryString ? searchRecordList.filter(this.createFilter(queryString)) : this.searchRecordList
      // 调用 callback 返回建议列表的数据
      console.log(results)
      cb(results)
    },
    createFilter (queryString) {
      return (item) => {
        return (item.keywords.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    getSearchRecordList () {
      iptvSearch.all().then(res => {
        this.searchRecordList = res.reverse()
        this.searchRecordList.push({ id: this.searchRecordList.length + 1, keywords: '清除历史记录...' })
      })
    },
    addSearchRecord () {
      const wd = this.searchTxt
      if (wd) {
        iptvSearch.find({ keywords: wd }).then(res => {
          if (!res) {
            iptvSearch.add({ keywords: wd })
          }
          this.getSearchRecordList()
        })
      }
    },
    clearSearchRecords () {
      iptvSearch.clear().then(res => {
        this.getSearchRecordList()
      })
    },
    searchEvent () {
      this.searchResult = this.iptvList.filter(data => !this.searchTxt || data.name.toLowerCase().includes(this.searchTxt.toLowerCase()))
    },
    searchAndRecord () {
      this.addSearchRecord()
      this.searchEvent()
    },
    playEvent (e) {
      this.video = { iptv: { name: e.name, url: e.url } }
      this.view = 'Play'
    },
    filterHandle (value, row) {
      return row.gid === value
    },
    hostFilterHandle (value, row) {
      return row.url.split('/')[2] === value
    },
    closeDialog () {
      this.batchSetDialogVisible = false
      this.editGroupDialogVisible = false
      if (this.tempGroups.length) this.groups = [...this.tempGroups]
      this.tempGroups = []
      this.getChannels()
      this.getGroups()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      console.log(val)
    },
    getGroupName (row, column) {
      const gid = row[column.property]
      return this.groups[gid].name || gid
    },
    getHostname (row, column) {
      const url = row[column.property]
      console.log(url)
      return url.split('/')[2]
    },
    getGroups () {
      channelGroups.all().then(res => {
        this.groups = res
        console.log('group', res)
      })
    },
    addGroup () {
      if (!this.tempGroups.length) this.tempGroups = [...this.groups]
      var newGroup = {
        gid: Math.max.apply(null, this.groups.map(g => g.gid)) + 1,
        name: ''
      }
      this.groups.push(newGroup)
    },
    removeGroup (group) {
      if (!this.tempGroups.length) this.tempGroups = [...this.groups]
      const index = this.groups.indexOf(group)
      this.groups.splice(index, 1)
    },
    updateGroups () {
      const gids = this.groups.map(group => group.gid)
      this.iptvList = this.iptvList.filter(channel => gids.includes(channel.gid))
      iptv.clear()
      this.iptvList.forEach(channel => iptv.add(channel))
      channelGroups.clear()
      // groups.add({ gid: 0, name: '待设定'})
      this.groups.forEach(group => channelGroups.add(group))
      this.editGroupDialogVisible = false
      this.tempGroups = []
      this.getChannels()
      this.getGroups()
      this.$message.success('调整分组相关操作已完成！')
    },
    batchSet () {
      this.multipleSelection.forEach(channel => {
        iptv.remove(channel.id)
        channel.gid = this.batchConfigGroup
        iptv.add(channel)
      })
      this.batchSetDialogVisible = false
      this.batchSetGroup = 0
      this.$message.success('批量设置完成！')
      this.getChannels()
    },
    removeEvent (e) {
      iptv.remove(e.id).then(res => {
        this.getChannels()
      }).catch(err => {
        this.$message.warning('删除频道失败, 错误信息: ' + err)
      })
    },
    exportChannels () {
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
      const options = {
        filters: [
          { name: 'm3u file', extensions: ['m3u', 'm3u8'] }
        ],
        properties: ['openFile', 'multiSelections']
      }
      remote.dialog.showOpenDialog(options).then(result => {
        if (!result.canceled) {
          var docs = this.iptvList
          var id = docs.length
          result.filePaths.forEach(file => {
            const parser = require('iptv-playlist-parser')
            const playlist = fs.readFileSync(file, { encoding: 'utf-8' })
            const result = parser.parse(playlist)
            result.items.forEach(ele => {
              if (ele.name && ele.url && ele.url.includes('.m3u8')) {
                var doc = {
                  id: id,
                  name: ele.name,
                  url: ele.url,
                  gid: 0
                }
                id += 1
                docs.push(doc)
              }
            })
          })
          // 获取url不重复的列表
          const uniqueList = [...new Map(docs.map(item => [item.url, item])).values()]
          iptv.clear().then(res => {
            iptv.bulkAdd(uniqueList).then(e => {
              this.getChannels()
              this.$message.success('导入成功')
            })
          })
        }
      })
    },
    resetChannelsEvent () {
      this.resetChannels(defaultChannels)
      channelGroups.clear().then(channelGroups.bulkAdd(defaultGroups).then(this.getGroups()))
      this.searchResult = this.iptvList
    },
    resetChannels (newChannels) {
      this.resetId(newChannels)
      iptv.clear().then(iptv.bulkAdd(newChannels).then(this.getChannels()))
    },
    removeAllChannels () {
      iptv.clear().then(res => {
        this.getChannels()
      })
    },
    getChannels () {
      iptv.all().then(res => {
        this.iptvList = res
        this.searchEvent()
      })
    },
    moveToTopEvent (i) {
      this.iptvList.sort(function (x, y) { return (x.name === i.name && x.url === i.url) ? -1 : (y.name === i.name && y.url === i.url) ? 1 : 0 })
      this.updateDatabase(this.iptvList)
    },
    updateDatabase (data) {
      iptv.clear().then(res => {
        this.resetId(data)
        iptv.bulkAdd(data).then(this.getChannels())
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
      const tbody = document.getElementById('iptv-table').querySelector('.el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd ({ newIndex, oldIndex }) {
          const currRow = _this.iptvList.splice(oldIndex, 1)[0]
          _this.iptvList.splice(newIndex, 0, currRow)
          _this.updateDatabase(_this.iptvList)
        }
      })
    }
  },
  mounted () {
    this.rowDrop()
  },
  created () {
    this.getChannels()
    this.getGroups()
    this.getSearchRecordList()
  }
}
</script>
