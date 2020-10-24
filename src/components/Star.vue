<template>
  <div class="listpage" id="star">
    <div class="listpage-content">
      <div class="listpage-header">
        <el-button @click.stop="exportFavoritesEvent" icon="el-icon-upload2">导出</el-button>
        <el-button @click.stop="importFavoritesEvent" icon="el-icon-download">导入</el-button>
        <el-button @click.stop="clearFavoritesEvent" icon="el-icon-delete-solid">清空</el-button>
        <el-button @click.stop="updateAllEvent" icon="el-icon-refresh">同步所有收藏</el-button>
      </div>
      <div class="listpage-body" id="star-table">
        <el-table size="mini" fit height="100%" row-key="id" :data="list" :cell-class-name="checkUpdate" @row-click="detailEvent">
          <el-table-column
            sortable
            :sort-method="sortByName"
            prop="name"
            label="片名">
          </el-table-column>
          <el-table-column
            :sort-by="['type', 'name']"
            sortable
            :sort-method="sortByType"
            prop="type"
            label="类型"
            width="100">
          </el-table-column>
          <el-table-column
            sortable
            :sort-by="['year', 'name']"
            prop="year"
            label="上映"
            width="100"
            align="center">
          </el-table-column>
          <el-table-column
            :sort-by="['site', 'name']"
            sortable
            :sort-method="sortBySite"
            prop="site"
            width="120"
            label="片源">
            <template slot-scope="scope">
              <span>{{ getSiteName(scope.row.key) }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="list.some(e => e.note)"
            prop="note"
            width="120"
            label="备注">
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
            header-align="right"
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
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { star, history, sites } from '../lib/dexie'
import zy from '../lib/site/tools'
import { remote } from 'electron'
import fs from 'fs'
import Sortable from 'sortablejs'
const { clipboard } = require('electron')
export default {
  name: 'star',
  data () {
    return {
      list: [],
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
      this.getFavorites()
      this.getAllsites()
    }
  },
  methods: {
    ...mapMutations(['SET_VIEW', 'SET_DETAIL', 'SET_VIDEO', 'SET_SHARE']),
    sortByName (a, b) {
      return a.name.localeCompare(b.name, 'zh')
    },
    sortByType (a, b) {
      return a.type.localeCompare(b.type)
    },
    sortBySite (a, b) {
      const siteA = this.getSiteName(a.key)
      if (!siteA) {
        return -1
      } else {
        return siteA.localeCompare(this.getSiteName(b.key))
      }
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
    playEvent (e) {
      history.find({ site: e.key, ids: e.ids }).then(res => {
        if (res) {
          this.video = { key: e.key, info: { id: res.ids, name: res.name, index: res.index } }
        } else {
          this.video = { key: e.key, info: { id: e.ids, name: e.name, index: 0 } }
        }
      })
      if (e.hasUpdate) {
        this.clearHasUpdateFlag(e)
      }
      this.view = 'Play'
    },
    deleteEvent (e) {
      star.remove(e.id).then(res => {
        if (res) {
          this.$message.warning('删除失败')
        } else {
          this.$message.success('删除成功')
        }
        this.getFavorites()
      })
    },
    shareEvent (e) {
      this.share = {
        show: true,
        key: e.key,
        info: e
      }
    },
    checkUpdate ({ row, rowIndex }) {
      if (this.list[rowIndex].hasUpdate) {
        return 'highlight'
      }
    },
    clearHasUpdateFlag (e) {
      star.find({ id: e.id }).then(res => {
        res.hasUpdate = false
        star.update(e.id, res)
        this.getFavorites()
      })
    },
    updateEvent (e) {
      zy.detail(e.key, e.ids).then(res => {
        var doc = {
          id: e.id,
          key: e.key,
          ids: res.id,
          site: res.site,
          name: res.name,
          type: res.type,
          year: res.year,
          note: res.note,
          index: res.index,
          last: res.last,
          hasUpdate: res.hasUpdate
        }
        star.get(e.id).then(resStar => {
          doc.hasUpdate = resStar.hasUpdate
          var msg = ''
          if (e.last === res.last) {
            msg = `同步"${e.name}"成功, 未查询到更新。`
            this.$message.info(msg)
          } else {
            doc.hasUpdate = true
            msg = `同步"${e.name}"成功, 检查到更新。`
            this.$message.success(msg)
          }
          star.update(e.id, doc)
          this.getFavorites()
        })
      }).catch(err => {
        var msg = `同步"${e.name}"失败, 请重试。`
        this.$message.warning(msg, err)
      })
    },
    updateAllEvent () {
      this.list.forEach(e => {
        this.updateEvent(e)
      })
    },
    downloadEvent (e) {
      zy.download(e.key, e.ids).then(res => {
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
          zy.detail(e.key, e.ids).then(res => {
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
    getSiteName (key) {
      var site = this.sites.find(e => e.key === key)
      if (site) {
        return site.name
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
        this.list = res.reverse()
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
          { name: 'JSON file', extensions: ['json'] },
          { name: 'Normal text file', extensions: ['txt'] },
          { name: 'All types', extensions: ['*'] }
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
    importFavoritesEvent () {
      const options = {
        filters: [
          { name: 'JSON file', extensions: ['json'] },
          { name: 'Normal text file', extensions: ['txt'] },
          { name: 'All types', extensions: ['*'] }
        ],
        properties: ['openFile', 'multiSelections']
      }
      remote.dialog.showOpenDialog(options).then(result => {
        if (!result.canceled) {
          result.filePaths.forEach(file => {
            var str = fs.readFileSync(file)
            const json = JSON.parse(str)
            json.forEach(ele => {
              if (ele.site === undefined) {
                ele.site = this.sites.find(x => x.key === ele.key)
              }
            })
            star.bulkAdd(json).then(e => {
              this.getFavorites()
            })
            this.upgradeFavorites()
          })
          this.$message.success('导入收藏成功')
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    upgradeFavorites () {
      star.all().then(res => {
        res.forEach(element => {
          const docs = {
            key: element.key,
            ids: element.ids,
            name: element.name,
            type: element.type,
            year: element.year,
            last: element.last,
            note: element.note
          }
          star.find({ key: element.key, ids: element.ids }).then(res => {
            if (!res) {
              star.add(docs)
            }
          })
        })
        this.getFavorites()
      })
    },
    clearFavoritesEvent () {
      star.clear().then(e => {
        this.getFavorites()
      })
    },
    updateDatabase (data) {
      star.clear().then(res => {
        var id = length
        data.forEach(ele => {
          ele.id = id
          id -= 1
        })
        star.bulkAdd(data)
      })
    },
    rowDrop () {
      const tbody = document.getElementById('star-table').querySelector('.el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd ({ newIndex, oldIndex }) {
          const currRow = _this.list.splice(oldIndex, 1)[0]
          _this.list.splice(newIndex, 0, currRow)
          _this.updateDatabase(_this.list)
        }
      })
    }
  },
  mounted () {
    this.rowDrop()
  },
  created () {
    this.getFavorites()
  }
}
</script>
