<template>
  <div class="detail">
    <div class="detail-content">
      <div class="detail-header">
        <div class="zy-select">
            <div class="vs-placeholder vs-noAfter" @click="openAddSite">添加新源</div>
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
        <span class="detail-close zy-svg" @click="close">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="closeIconTitle">
            <title id="closeIconTitle">关闭</title>
            <path d="M6.34314575 6.34314575L17.6568542 17.6568542M6.34314575 17.6568542L17.6568542 6.34314575"></path>
          </svg>
        </span>
      </div>
      <div class="detail-body zy-scroll">
        <div class="zy-table">
          <div class="tBody zy-scroll">
            <div class="addSites-box zy-scroll" v-show="showAddSite">
              <ul>
                <li >
                  <span class="name">源名称</span>
                  <span class="name">API接口</span>
                  <span class="name">DOWNLOAD接口</span>
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
                    <input style="height: 30px" v-model="newSite.api">
                  </span>
                   <span class="name" style="display:inline-block;vertical-align:middle">
                     <input style="height: 30px" v-model="newSite.download" placeholder="可以为空">
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
              <draggable v-model="sites" @change="listUpdatedEvent">
                <transition-group>
                  <li v-for="(i, j) in sites" :key="j">
                    <span class="name">{{i.name}}</span>
                    <span class="operate">
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
import { sites, setting } from '../lib/dexie'
import draggable from 'vuedraggable'
import { remote } from 'electron'
import { sites as defaultSites } from '../lib/dexie/initData'
import fs from 'fs'
export default {
  name: 'editSites',
  data () {
    return {
      show: false,
      sites: [],
      showAddSite: false,
      newSite: {
        name: '',
        api: '',
        download: ''
      }
    }
  },
  components: {
    draggable
  },
  computed: {
    setting: {
      get () {
        return this.$store.getters.getSetting
      },
      set (val) {
        this.SET_SETTING(val)
      }
    },
    editSites: {
      get () {
        return this.$store.getters.getEditSites
      },
      set (val) {
        this.SET_EDITSITES(val)
      }
    }
  },
  methods: {
    ...mapMutations(['SET_SETTING', 'SET_EDITSITES']),
    close () {
      this.editSites.show = false
    },
    getSites () {
      sites.all().then(res => {
        this.sites = res
      })
    },
    removeEvent (e) {
      sites.remove(e.id).then(res => {
        this.getSites()
      }).catch(err => {
        this.$message.warning('删除源失败, 错误信息: ' + err)
      })
    },
    listUpdatedEvent () {
      sites.clear().then(res1 => {
        // 重新排序
        var id = 1
        this.sites.forEach(element => {
          element.id = id
          sites.add(element)
          id += 1
        })
      })
    },
    openAddSite () {
      this.showAddSite = true
    },
    closeAddSite () {
      this.showAddSite = false
    },
    addNewSite () {
      if (!this.newSite.name || !this.newSite.api) {
        this.$message.error('名称和API接口不能为空。')
        return
      }
      var randomstring = require('randomstring')
      var doc = {
        key: randomstring.generate(6),
        id: this.sites[this.sites.length - 1].id + 1,
        name: this.newSite.name,
        api: this.newSite.api,
        download: this.newSite.download
      }
      sites.add(doc).then(res => {
        this.newSite = {
          name: '',
          api: '',
          download: ''
        }
        this.$message.success('添加新源成功！')
        this.getSites()
      })
    },
    exportSites () {
      this.getSites()
      const arr = [...this.sites]
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
    importSites () {
      const options = {
        filters: [
          { name: 'JSON file', extensions: ['json'] },
          { name: 'Normal text file', extensions: ['txt'] },
          { name: 'All types', extensions: ['*'] }
        ],
        properties: ['openFile']
      }
      remote.dialog.showOpenDialog(options).then(result => {
        if (!result.canceled) {
          sites.clear()
          result.filePaths.forEach(file => {
            var str = fs.readFileSync(file)
            const json = JSON.parse(str)
            sites.bulkAdd(json).then(e => {
              this.getSites()
              this.d.site = json[0].key
              setting.update(this.d).then(res => {
                this.setting = this.d
              })
            })
            this.$message.success('导入成功')
          }).catch(err => {
            this.$message.error(err)
          })
        }
      })
    },
    resetSites () {
      sites.clear()
      sites.bulkAdd(defaultSites).then(e => {
        this.getSites()
        this.$message.success('重置源成功')
      })
    }
  },
  created () {
    this.getSites()
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
