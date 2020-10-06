<template>
  <div class="detail">
    <div class="detail-content">
      <div class="detail-header">
        <div class="zy-select">
            <div class="vs-placeholder vs-noAfter" @click="openAddSite">添加</div>
        </div>
        <div class="zy-select">
          <div class="vs-placeholder vs-noAfter" @click="exportSites">导出</div>
        </div>
        <div class="zy-select">
          <div class="vs-placeholder vs-noAfter" @click="importSites">导入</div>
        </div>
        <div class="zy-select">
          <div class="vs-placeholder vs-noAfter" @click="resetSites">重置</div>
        </div>
        <div class="zy-select">
          <div class="vs-input"><input v-model="searchkeyword" type="text" placeholder="搜索"></div>
        </div>
      </div>
      <div class="detail-body zy-scroll">
        <div class="zy-table">
          <div class="tBody zy-scroll">
            <div class="iptv-box zy-scroll" v-show="showAddSite">
              <ul>
                <li >
                  <span class="name">频道名</span>
                  <span class="name">Url</span>
                  <span class="operate">
                    <span class="btn"></span>
                    <span class="btn"></span>
                  </span>
                 </li>
                 <li>
                  <span class="name" style="display:inline-block;vertical-align:middle">
                    <input style="height: 30px" v-model="newSite.name">
                  </span>
                  <span class="name" style="display:inline-block;vertical-align:middle">
                    <input style="height: 30px" v-model="newSite.url">
                  </span>
                  <span class="operate">
                    <span class="btn" @click="addNewSite">添加</span>
                    <span class="btn" @click="closeAddSite">关闭</span>
                  </span>
                 </li>
                 <li ></li>
               </ul>
             </div>
            <ul>
              <draggable v-model="iptvList" @change="listUpdatedEvent">
                <transition-group>
                  <li v-for="(i, j) in iptvList" :key="j" @click.stop="playEvent(i)" v-show="containSearchKeyword(i)">
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
import { iptv } from '../lib/dexie'
import draggable from 'vuedraggable'
import { iptv as defaultSites } from '../lib/dexie/initData'
import { remote } from 'electron'
import fs from 'fs'
export default {
  name: 'iptv',
  data () {
    return {
      iptvList: [],
      showAddSite: false,
      newSite:
      {
        name: '',
        site: ''
      },
      searchkeyword: ''
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
    }
  },
  methods: {
    ...mapMutations(['SET_VIEW', 'SET_DETAIL', 'SET_VIDEO', 'SET_SHARE']),
    playEvent (e) {
      this.video = { info: { url: e.url } }
      this.view = 'Play'
    },
    containSearchKeyword (i) {
      if (this.searchkeyword) {
        return i.name.toLowerCase().includes(this.searchkeyword.toLowerCase())
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
    closeAddSite () {
      this.showAddSite = false
    },
    openAddSite () {
      this.showAddSite = true
    },
    addNewSite () {
      if (!this.newSite.name || !this.newSite.url) {
        this.$message.error('名称和API接口不能为空。')
        return
      }
      var doc = {
        name: this.newSite.name,
        url: this.newSite.url
      }
      iptv.add(doc).then(res => {
        this.newSite = {
          name: '',
          url: ''
        }
        this.$message.success('添加新源成功！')
        this.getAllSites()
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
          { name: 'm3u file', extensions: ['m3u'] }
        ]
      }
      remote.dialog.showSaveDialog(options).then(result => {
        if (!result.canceled) {
          var writer = require('m3u').extendedWriter()
          this.iptvList.forEach(e => {
            writer.file(e.url, -1, e.name)
          })
          fs.writeFileSync(result.filePath, writer.toString())
          this.$message.success('已保存成功')
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    importSites () {
      const options = {
        filters: [
          { name: 'm3u file', extensions: ['m3u'] }
        ],
        properties: ['openFile']
      }
      remote.dialog.showOpenDialog(options).then(result => {
        if (!result.canceled) {
          result.filePaths.forEach(file => {
            if (file.endsWith('json')) {
              var str = fs.readFileSync(file)
              const json = JSON.parse(str)
              iptv.clear().then(res => {
                iptv.bulkAdd(json).then(e => {
                  this.getAllSites()
                  this.$message.success('导入成功')
                })
              })
            } else if (file.endsWith('m3u')) {
              const parser = require('iptv-playlist-parser')
              const playlist = fs.readFileSync(file, { encoding: 'utf-8' })
              const result = parser.parse(playlist)
              var docs = []
              result.items.forEach(ele => {
                if (ele.name && ele.url && ele.url.endsWith('m3u8')) {
                  var doc = {
                    name: ele.name,
                    url: ele.url
                  }
                  docs.push(doc)
                }
              })
              if (docs) {
                iptv.clear().then(res => {
                  iptv.bulkAdd(docs).then(e => {
                    this.getAllSites()
                    this.$message.success('导入成功')
                  })
                })
              } else {
                this.$message.error('m3u文件没有读取到可用源数据')
              }
            }
          })
        }
      })
    },
    resetSites () {
      iptv.clear()
      iptv.bulkAdd(defaultSites).then(e => {
        this.getAllSites()
        this.$message.success('重置成功')
      })
    },
    getAllSites () {
      iptv.all().then(res => {
        this.iptvList = res
      })
    }
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
    height: calc(100% - 50px);
    overflow-y: auto;
  }
}
</style>
