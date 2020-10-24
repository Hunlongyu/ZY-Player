<template>
  <div class="listpage" id="history">
    <div class="listpage-content">
      <div class="listpage-header">
        <el-button @click.stop="exportHistory" icon="el-icon-upload2">导出</el-button>
        <el-button @click.stop="importHistory" icon="el-icon-download">导入</el-button>
        <el-button @click.stop="clearAllHistory" icon="el-icon-delete-solid">清空</el-button>
      </div>
      <div class="listpage-body" id="history-table">
        <el-table size="mini" fit height="100%" :data="history" row-key="id" @row-click="detailEvent">
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
            width="120"
            label="观看至">
            <template slot-scope="scope">
              <span>第{{ scope.row.index + 1 }}集</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            header-align="right"
            align="right">
            <template slot-scope="scope">
              <el-button @click.stop="playEvent(scope.row)" type="text">播放</el-button>
              <el-button @click.stop="shareEvent(scope.row)" type="text">分享</el-button>
              <el-button @click.stop="downloadEvent(scope.row)" type="text">下载</el-button>
              <el-button @click.stop="removeHistoryItem(scope.row)" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { history, sites } from '../lib/dexie'
import zy from '../lib/site/tools'
import Sortable from 'sortablejs'
import { remote } from 'electron'
import fs from 'fs'
const { clipboard } = require('electron')

export default {
  name: 'history',
  data () {
    return {
      history: [],
      sites: []
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
    }
  },
  watch: {
    view () {
      this.getAllhistory()
      this.getAllsites()
    }
  },
  methods: {
    ...mapMutations(['SET_VIEW', 'SET_DETAIL', 'SET_VIDEO', 'SET_SHARE']),
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
    playEvent (e) {
      history.find({ site: e.site, ids: e.ids }).then(res => {
        if (res) {
          this.video = { key: res.site, info: { id: res.ids, name: res.name, index: res.index } }
        } else {
          this.video = { key: e.site, info: { id: e.ids, name: e.name, index: 0 } }
        }
      })
      this.view = 'Play'
    },
    shareEvent (e) {
      this.share = {
        show: true,
        key: e.site,
        info: e
      }
    },
    downloadEvent (e) {
      zy.download(e.site, e.ids).then(res => {
        if (res && res.dl && res.dl.dd) {
          const text = res.dl.dd._t
          if (text) {
            const list = text.split('#')
            let downloadUrl = ''
            for (const i of list) {
              const url = encodeURI(i.split('$')[1])
              downloadUrl += (url + '\n')
            }
            clipboard.writeText(downloadUrl)
            this.$message.success('『MP4』格式的链接已复制, 快去下载吧!')
          } else {
            this.$message.warning('没有查询到下载链接.')
          }
        } else {
          var m3u8List = {}
          zy.detail(e.site, e.ids).then(res => {
            const dd = res.dl.dd
            const type = Object.prototype.toString.call(dd)
            if (type === '[object Array]') {
              for (const i of dd) {
                if (i._flag.indexOf('m3u8') >= 0) {
                  m3u8List = i._t.split('#')
                }
              }
            } else {
              m3u8List = dd._t.split('#')
            }
            const list = [...m3u8List]
            let downloadUrl = ''
            for (const i of list) {
              const url = encodeURI(i.split('$')[1])
              downloadUrl += (url + '\n')
            }
            clipboard.writeText(downloadUrl)
            this.$message.success('『M3U8』格式的链接已复制, 快去下载吧!')
          })
        }
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
            var str = fs.readFileSync(file)
            const json = JSON.parse(str)
            history.bulkAdd(json).then(res => {
              this.$message.success('导入成功')
              this.getAllhistory()
            })
          })
        }
      })
    },
    clearAllHistory () {
      history.clear().then(res => {
        this.history = []
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
      var site = this.sites.find(e => e.key === key)
      if (site) {
        return site.name
      }
    },
    removeHistoryItem (e) {
      history.remove(e.id).then(res => {
        this.getAllhistory()
      }).catch(err => {
        this.$message.warning('删除历史记录失败, 错误信息: ' + err)
      })
    },
    updateDatabase (data) {
      history.clear().then(res => {
        var id = length
        data.forEach(ele => {
          ele.id = id
          id -= 1
          history.add(ele)
        })
      })
    },
    rowDrop () {
      const tbody = document.getElementById('history-table').querySelector('.el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd ({ newIndex, oldIndex }) {
          const currRow = _this.history.splice(oldIndex, 1)[0]
          _this.history.splice(newIndex, 0, currRow)
          _this.updateDatabase(_this.history)
        }
      })
    }
  },
  mounted () {
    this.rowDrop()
  },
  created () {
    this.getAllhistory()
  }
}
</script>
