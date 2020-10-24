<template>
  <div class="listpage" id="IPTV">
    <div class="listpage-content">
      <div class="listpage-header" v-show="!enableBatchEdit">
        <el-switch v-model="enableBatchEdit" active-text="批处理分组"></el-switch>
        <el-button @click.stop="exportChannels" icon="el-icon-upload2" >导出</el-button>
        <el-button @click.stop="importChannels" icon="el-icon-download">导入</el-button>
        <el-button @click.stop="removeAllChannels" icon="el-icon-delete-solid">清空</el-button>
        <el-button @click.stop="resetChannelsEvent" icon="el-icon-refresh-left">重置</el-button>
      </div>
      <div class="listpage-header" v-show="enableBatchEdit">
        <el-switch v-model="enableBatchEdit" active-text="批处理分组"></el-switch>
        <el-input placeholder="新组名" v-model="batchGroupName"></el-input>
        <el-button type="primary" icon="el-icon-edit" @click.stop="saveBatchEdit">保存</el-button>
      </div>
      <div class="listpage-body" id="iptv-table">
        <el-table
          ref="iptvTable"
          size="mini" fit height="100%" row-key="id"
          :data="filteredTableData"
          @row-click="playEvent"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            v-if="enableBatchEdit">
          </el-table-column>
          <el-table-column
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
            prop="group"
            label="分组"
            :filters="getFilters"
            :filter-method="filterHandle"
            filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-button type="text">{{scope.row.group}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            header-align="right"
            align="right">
            <template #header>
              <span>总频道数:{{ iptvList.length }}</span>
            </template>
            <template slot-scope="scope">
              <el-button @click.stop="moveToTopEvent(scope.row)" type="text">置顶</el-button>
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
import { iptv, iptvSearch } from '../lib/dexie'
import { iptv as defaultSites } from '../lib/dexie/initData'
import { remote } from 'electron'
import fs from 'fs'
import Sortable from 'sortablejs'
export default {
  name: 'iptv',
  data () {
    return {
      iptvList: [],
      searchTxt: '',
      searchRecordList: [],
      enableBatchEdit: false,
      batchGroupName: '',
      multipleSelection: [],
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
        return this.iptvList.filter(x => x.name.toLowerCase().includes(this.searchTxt.toLowerCase()))
      } else {
        return this.iptvList
      }
    },
    getFilters () {
      const groups = [...new Set(this.iptvList.map(iptv => iptv.group))]
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
      this.getChannels()
    },
    searchTxt () {
    }
  },
  methods: {
    ...mapMutations(['SET_VIEW', 'SET_DETAIL', 'SET_VIDEO', 'SET_SHARE']),
    handleSelectionChange (rows) {
      this.multipleSelection = rows
    },
    saveBatchEdit () {
      if (this.multipleSelection && this.batchGroupName) {
        this.multipleSelection.forEach(ele => {
          ele.group = this.batchGroupName
        })
      }
      this.updateDatabase()
    },
    playEvent (e) {
      this.video = { iptv: { name: e.name, url: e.url } }
      this.view = 'Play'
    },
    filterHandle (value, row) {
      return row.group === value
    },
    containsearchTxt (i) {
      if (this.searchTxt) {
        return i.name.toLowerCase().includes(this.searchTxt.toLowerCase())
      } else {
        return true
      }
    },
    removeEvent (e) {
      iptv.remove(e.id).then(res => {
        this.getChannels()
      }).catch(err => {
        this.$message.warning('删除频道失败, 错误信息: ' + err)
      })
    },
    listUpdatedEvent () {
      iptv.clear().then(res1 => {
        // 重新排序
        var id = 1
        this.iptvList.forEach(element => {
          element.id = id
          iptv.add(element)
          id += 1
        })
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
          { name: 'm3u file', extensions: ['m3u', 'm3u8'] },
          { name: 'JSON file', extensions: ['json'] }
        ],
        properties: ['openFile', 'multiSelections']
      }
      remote.dialog.showOpenDialog(options).then(result => {
        if (!result.canceled) {
          var docs = this.iptvList
          var id = docs.length
          result.filePaths.forEach(file => {
            if (file.endsWith('m3u')) {
              const parser = require('iptv-playlist-parser')
              const playlist = fs.readFileSync(file, { encoding: 'utf-8' })
              const result = parser.parse(playlist)
              result.items.forEach(ele => {
                if (ele.name && ele.url && ele.url.includes('.m3u8')) {
                  var doc = {
                    id: id,
                    name: ele.name,
                    url: ele.url,
                    group: this.determineGroup(ele.group, ele.name)
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
                if (ele.name && ele.url && ele.url.includes('.m3u8')) {
                  var doc = {
                    id: id,
                    name: ele.name,
                    url: ele.url,
                    group: ele.group === undefined ? this.determineGroup(ele.group, ele.name) : ele.group
                  }
                  id += 1
                  docs.push(doc)
                }
              })
            }
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
    determineGroup (group, name) {
      if (!group) {
        return group
      } else if (name.toLowerCase().includes('cctv')) {
        return '央视'
      } else if (name.includes('卫视')) {
        return '卫视'
      } else {
        return '其他'
      }
    },
    resetChannelsEvent () {
      this.resetChannels(defaultSites)
    },
    resetChannels (newSites) {
      this.resetId(newSites)
      iptv.clear().then(iptv.bulkAdd(newSites).then(this.getChannels()))
    },
    removeAllChannels () {
      iptv.clear().then(res => {
        this.getChannels()
      })
    },
    getChannels () {
      iptv.all().then(res => {
        this.iptvList = res
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
      this.iptvList.sort(function (x, y) { return (x.name === i.name && x.url === i.url) ? -1 : (y.name === i.name && y.url === i.url) ? 1 : 0 })
      this.updateDatabase()
    },
    updateDatabase () {
      iptv.clear().then(res => {
        this.resetId(this.iptvList)
        iptv.bulkAdd(this.iptvList).then(this.getChannels())
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
          _this.updateDatabase()
        }
      })
    }
  },
  mounted () {
    this.rowDrop()
  },
  created () {
    this.getChannels()
    this.getSearchRecordList()
  }
}
</script>
