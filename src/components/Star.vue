<template>
  <div class="detail">
    <div class="detail-content">
      <div class="detail-header">
        <div class="zy-select">
          <div class="vs-placeholder vs-noAfter" @click="exportFavoritesEvent">
            导出
          </div>
        </div>
        <div class="zy-select">
          <div class="vs-placeholder vs-noAfter" @click="importFavoritesEvent">
            导入
          </div>
        </div>
        <div class="zy-select">
          <div class="vs-placeholder vs-noAfter" @click="clearFavoritesEvent">
            清空
          </div>
        </div>
        <div class="zy-select">
          <div class="vs-placeholder vs-noAfter" @click="updateAllEvent">
            同步所有收藏
          </div>
        </div>
      </div>
      <div class="detail-body zy-scroll">
        <div class="zy-table" id="star-table">
          <div class="tBody zy-scroll">
            <el-table
              :data="list"
              height="100%"
              row-key="id"
              :row-style="highlightHasUpdate"
              @row-click="detailEvent"
              style="width: 100%">
              <el-table-column
                sortable
                prop="name"
                label="片名">
              </el-table-column>
              <el-table-column
                sortable
                prop="type"
                label="类型">
              </el-table-column>
              <el-table-column
                sortable
                prop="year"
                label="上映"
                align="center">
              </el-table-column>
              <el-table-column
                sortable
                prop="site"
                label="片源">
                <template slot-scope="scope">
                  <span>{{ getSiteName(scope.row.key) }}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="list.some(e => e.note)"
                sortable
                prop="note"
                label="备注">
              </el-table-column>
              <el-table-column v-if="list.some(e => e.index >= 0)"
                sortable
                prop="index"
                label="观看至">
                <template slot-scope="scope">
                  <span>{{ getHistoryNote(scope.row.index) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                header-align="center"
                align="right">
                <template slot-scope="scope">
                  <el-button @click.stop="playEvent(scope.row)" type="text">播放</el-button>
                  <el-button @click.stop="shareEvent(scope.row)" type="text">分享</el-button>
                  <el-button @click.stop="updateEvent(scope.row)" type="text">同步</el-button>
                  <el-button @click.stop="downloadEvent(scope.row)" type="text">下载</el-button>
                  <el-button @click.stop="deleteEvent(scope.row)" type="text">删除</el-button>
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
import { star, history, sites } from '../lib/dexie'
import zy from '../lib/site/tools'
import { remote } from 'electron'
import fs from 'fs'

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
    highlightHasUpdate (e) {
      const stylejson = {}
      stylejson.backgroundColor = 'var(--highlight-color)'
      if (e.hasUpdate) {
        return stylejson
      }
      return ''
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
          key: e.key,
          id: e.id,
          ids: res.id,
          last: res.last,
          name: res.name,
          type: res.type,
          year: res.year,
          note: res.note
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
          this.highlightHasUpdate(e)
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
      const str = JSON.stringify(arr, null, 4)
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
        this.$message.success('清空所有收藏成功')
      })
    }
  },
  created () {
    this.getFavorites()
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
    height: calc(100% - 50px);
    overflow-y: auto;
  }
}
</style>
