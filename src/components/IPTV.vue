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
          <div class="vs-placeholder vs-noAfter" @click="resetSites">重置</div>
        </div>
        <div class="zy-select">
        </div>
      </div>
      <div class="detail-header">
        <div>
          <div class="vs-placeholder vs-noAfter" @click="exportSites">总频道数:{{iptvList.length}}</div>
        </div>
        <div class="zy-select" @mouseleave="show.search = false">
          <div class="vs-input" @click="show.search = true"><input v-model.trim="searchTxt" type="text" placeholder="搜索" @keyup.enter="searchEvent(searchTxt)"></div>
          <div class="vs-options" v-show="show.search">
            <ul class="zy-scroll" style="max-height: 600px">
              <li v-for="(i, j) in searchList" :key="j" @click="searchEvent(i.keywords)">{{i.keywords}}</li>
              <li v-show="searchList.length >= 1" @click="clearSearch">清空历史记录</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="detail-body zy-scroll">
        <div class="zy-table">
          <div class="tBody zy-scroll">
            <ul>
              <draggable v-model="iptvList" @change="listUpdatedEvent">
                <transition-group>
                  <li v-for="(i, j) in iptvList" :key="j" @click.stop="playEvent(i)" v-show="containsearchTxt(i)">
                    <span class="name">{{i.name}}</span>
                    <span class="operate">
                      <span class="btn" @click.stop="playEvent(i)">播放</span>
                      <span class="btn" @click.stop="removeEvent(i)">删除</span>
                    </span>
                  </li>
                </transition-group>
              </draggable>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { iptv, iptvSearch } from '../lib/dexie'
import draggable from 'vuedraggable'
import { iptv as defaultSites } from '../lib/dexie/initData'
import { remote } from 'electron'
import fs from 'fs'
export default {
  name: 'iptv',
  data () {
    return {
      iptvList: [],
      searchTxt: '',
      searchList: [],
      show: {
        search: false
      }
    }
  },
  components: {
    draggable
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
    },
    searchTxt () {
    }
  },
  methods: {
    ...mapMutations(['SET_VIEW', 'SET_DETAIL', 'SET_VIDEO', 'SET_SHARE']),
    playEvent (e) {
      this.video = { iptv: { name: e.name, url: e.url } }
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
      iptv.remove(e.id).then(res => {
        this.getAllSites()
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
              if (ele.name && ele.url && ele.url.endsWith('m3u8')) {
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
    resetSites () {
      iptv.clear()
      iptv.bulkAdd(defaultSites).then(e => {
        this.getAllSites()
      })
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
    getAllSearch () {
      iptvSearch.all().then(res => {
        this.searchList = res.reverse()
      })
    },
    clearSearch () {
      iptvSearch.clear().then(res => {
        this.getAllSearch()
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
          this.getAllSearch()
        })
      }
    }
  },
  created () {
    this.getAllSites()
    this.getAllSearch()
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
