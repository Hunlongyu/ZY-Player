<template>
  <div class="detail">
    <div class="detail-content">
      <div class="detail-header">
        <div class="zy-select">
          <div class="vs-placeholder vs-noAfter" @click="exportSites">导出</div>
        </div>
        <div class="zy-select">
          <div class="vs-placeholder vs-noAfter" @click="importSites">导入</div>
        </div>
        <div class="zy-select">
          <div class="vs-placeholder vs-noAfter" @click="removeAllSites">清空</div>
        </div>
        <div class="zy-select">
          <div class="vs-placeholder vs-noAfter" @click="resetSitesEvent">重置</div>
        </div>
      </div>
      <div class="detail-body zy-scroll">
        <div class="zy-table" id="iptv-table">
          <div class="tBody zy-scroll">
             <el-table
              :data="iptvList.filter(data => !searchTxt || data.name.toLowerCase().includes(searchTxt.toLowerCase()))"
              row-key="id"
              height="100%"
              :border="tableBorder"
              @header-click="tableBorder = !tableBorder"
              style="width: 100%">
              <el-table-column
                prop="name">
                <template #header>
                  <span>总频道数:{{ iptvList.length }}</span>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                align="center">
                <template #header>
                  <el-input
                    v-model.trim="searchTxt"
                    size="mini"
                    clearable
                    placeholder="搜索"/>
                </template>
                <template slot-scope="scope">
                  <el-button @click.stop="moveToTopEvent(scope.row)" type="text">置顶</el-button>
                  <el-button @click.stop="playEvent(scope.row)" type="text">播放</el-button>
                  <el-button @click.stop="removeEvent(scope.row)" type="text">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { iptv } from '../lib/dexie'
import Sortable from 'sortablejs'
import { iptv as defaultSites } from '../lib/dexie/initData'
import { remote } from 'electron'
import fs from 'fs'
export default {
  name: 'iptv',
  data () {
    return {
      iptvList: [],
      searchTxt: '',
      tableBorder: false
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
    }
  },
  watch: {
    view () {
      this.getAllSites()
    }
  },
  methods: {
    ...mapMutations(['SET_VIEW', 'SET_DETAIL', 'SET_VIDEO', 'SET_SHARE']),
    playEvent (e) {
      this.video = { iptv: { name: e.name, url: e.url } }
      this.view = 'Play'
    },
    removeEvent (e) {
      iptv.remove(e.id).then(res => {
        this.getAllSites()
      }).catch(err => {
        this.$message.warning('删除频道失败, 错误信息: ' + err)
      })
    },
    exportSites () {
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
            const str = JSON.stringify(arr, null, 4)
            fs.writeFileSync(result.filePath, str)
            this.$message.success('已保存成功')
          }
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    importSites () {
      const options = {
        filters: [
          { name: 'm3u file', extensions: ['m3u', 'm3u8'] }
        ],
        properties: ['openFile', 'multiSelections']
      }
      remote.dialog.showOpenDialog(options).then(result => {
        if (!result.canceled) {
          var docs = this.iptvList
          result.filePaths.forEach(file => {
            const parser = require('iptv-playlist-parser')
            const playlist = fs.readFileSync(file, { encoding: 'utf-8' })
            const result = parser.parse(playlist)
            result.items.forEach(ele => {
              if (ele.name && ele.url && ele.url.includes('.m3u8')) {
                var doc = {
                  name: ele.name,
                  url: ele.url
                }
                docs.push(doc)
              }
            })
          })
          // 获取url不重复的列表
          const uniqueList = [...new Map(docs.map(item => [item.url, item])).values()]
          iptv.clear().then(res => {
            iptv.bulkAdd(uniqueList).then(e => {
              this.getAllSites()
              this.$message.success('导入成功')
            })
          })
        }
      })
    },
    resetSitesEvent () {
      this.resetSites(defaultSites)
    },
    resetSites (newSites) {
      this.resetId(newSites)
      iptv.clear().then(iptv.bulkAdd(newSites).then(this.getAllSites()))
    },
    removeAllSites () {
      iptv.clear().then(res => {
        this.getAllSites()
      })
    },
    getAllSites () {
      iptv.all().then(res => {
        this.iptvList = res
      })
    },
    moveToTopEvent (i) {
      this.iptvList.sort(function (x, y) { return (x.name === i.name && x.url === i.url) ? -1 : (y.name === i.name && y.url === i.url) ? 1 : 0 })
      this.resetSites(this.iptvList)
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
      const res = new Sortable(tbody, {
        onEnd ({ newIndex, oldIndex }) {
          const currRow = _this.iptvList.splice(oldIndex, 1)[0]
          _this.iptvList.splice(newIndex, 0, currRow)
          _this.resetSites(_this.iptvList)
        }
      })
      console.log(res)
    }
  },
  mounted () {
    this.rowDrop()
  },
  created () {
    this.getAllSites()
  }
}
</script>
<style lang="scss" scoped>
.detail{
  position: absolute;
  left: 80px;
  right: 20px;
  bottom: 0;
  width: calc(100% - 100px);
  height: calc(100% - 40px);
  z-index: 888;
  .detail-content{
    height: calc(100% - 10px);
    padding: 0 60px;
    position: relative;
    .detail-header{
      width: 100%;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .detail-title{
        font-size: 16px;
      }
      .detail-close{
        cursor: pointer;
      }
    }
  }
  .detail-body{
    height: calc(100% - 100px);
    overflow-y: auto;
  }
}
</style>
