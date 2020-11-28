<template>
  <div class="listpage" id="history">
    <div class="listpage-header" id="history-header">
        <el-switch v-model="viewMode" active-text="海报" active-value="picture" inactive-text="列表" inactive-value="table" @change="updateViewMode"></el-switch>
        <el-button @click.stop="exportHistory" icon="el-icon-upload2">导出</el-button>
        <el-button @click.stop="importHistory" icon="el-icon-download">导入</el-button>
        <el-button @click.stop="clearAllHistory" icon="el-icon-delete-solid">清空</el-button>
    </div>
    <div class="listpage-body" id="history-body">
      <div class="show-table" id="history-table" v-show="viewMode === 'table'">
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
            width="180"
            label="观看至">
            <template slot-scope="scope">
              <span v-if="scope.row.detail && scope.row.detail.m3u8List && scope.row.detail.m3u8List.length > 1">
                第{{ scope.row.index + 1 }}集(共{{scope.row.detail.m3u8List.length}}集)
              </span>
            </template>
          </el-table-column>
          <el-table-column v-if="history.some(e => e.time)"
            width="150"
            label="时间进度">
            <template slot-scope="scope">
               <span v-if="scope.row.time && scope.row.duration">{{fmtMSS(scope.row.time.toFixed(0))}}/{{fmtMSS(scope.row.duration.toFixed(0))}}</span>
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
      <div class="show-picture" id="star-picture" v-show="viewMode === 'picture'">
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
                  <span v-if="props.data.detail && props.data.detail.m3u8List !== undefined && props.data.detail.m3u8List.length > 1">
                    第{{ props.data.index + 1 }}集(共{{props.data.detail.m3u8List.length}}集)
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
import Sortable from 'sortablejs'
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
      viewMode: setting.historyViewMode
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
    }
  },
  watch: {
    view () {
      this.getAllhistory()
      this.getAllsites()
      if (this.$refs.historyWaterfall) {
        this.$refs.historyWaterfall.refresh()
      }
    }
  },
  methods: {
    ...mapMutations(['SET_VIEW', 'SET_DETAIL', 'SET_VIDEO', 'SET_SHARE']),
    fmtMSS (s) {
      return (s - (s %= 60)) / 60 + (s > 9 ? ':' : ':0') + s
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
      zy.detail(e.site, e.ids).then(detailRes => {
        this.video.detail = detailRes
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
        if (res && res.m3u8List) {
          const list = res.m3u8List.split('#')
          let downloadUrl = ''
          for (const i of list) {
            const url = encodeURI(i.split('$')[1])
            downloadUrl += (url + '\n')
          }
          clipboard.writeText(downloadUrl)
          this.$message.success('『MP4』格式的链接已复制, 快去下载吧!')
        } else {
          zy.detail(e.site, e.ids).then(res => {
            const list = [...res.m3u8List]
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
    deleteEvent (e) {
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
    },
    getViewMode () {
      setting.find().then(res => {
        this.viewMode = res.historyViewMode
      })
    },
    updateViewMode () {
      setting.find().then(res => {
        res.historyViewMode = this.viewMode
        setting.update(res)
      })
    }
  },
  mounted () {
    this.rowDrop()
    window.addEventListener('resize', () => {
      if (this.$refs.historyWaterfall && this.view === 'History') {
        this.$refs.historyWaterfall.resize()
        this.$refs.historyWaterfall.refresh()
        setTimeout(() => {
          this.$refs.historyWaterfall.refresh()
        }, 500)
      }
    }, false)
  },
  created () {
    this.getAllhistory()
    this.getViewMode()
  }
}
</script>
