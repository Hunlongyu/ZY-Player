<template>
  <div class="detail">
    <div class="detail-content">
      <div class="detail-header">
        <div class="zy-select">
            <div class="vs-placeholder vs-noAfter" @click="openAddSite">添加新源</div>
        </div>
      </div>
      <div class="detail-body zy-scroll">
        <div class="zy-table">
          <div class="tBody zy-scroll">
            <div class="iptv-box zy-scroll" v-show="showAddSite">
              <ul>
                <li >
                  <span class="name">频道名</span>
                  <span class="name">m3u8接口</span>
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
                  <span class="operate">
                    <span class="btn" @click="addNewSite">添加</span>
                    <span class="btn" @click="closeAddSite">关闭</span>
                  </span>
                 </li>
                 <li ></li>
               </ul>
             </div>
            <ul>
              <draggable v-model="iptv" @change="listUpdatedEvent">
                <transition-group>
                  <li v-for="(i, j) in iptv" :key="j">
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
export default {
  name: 'iptv',
  data () {
    return {
      iptv: [],
      showAddSite: false,
      newSite:
      {
        name: '',
        site: ''
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
    }
  },
  watch: {
    view () {
      this.getAllIptv()
    }
  },
  methods: {
    ...mapMutations(['SET_VIEW', 'SET_DETAIL', 'SET_VIDEO', 'SET_SHARE']),
    playEvent (e) {
      var m3u8Link = e.site
      const fs = require('fs')
      var externalPlayer = this.setting.externalPlayer
      if (!fs.existsSync(externalPlayer)) {
        this.$message.error('请设置第三方播放器路径')
        // 在线播放该视频
        var link = 'https://www.m3u8play.com/?play=' + m3u8Link
        const open = require('open')
        open(link)
      } else {
        var exec = require('child_process').execFile
        exec(externalPlayer, [m3u8Link])
      }
    },
    removeEvent (e) {
      iptv.remove(e.id).then(res => {
        this.getAllIptv()
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
      if (!this.newSite.name || !this.newSite.site) {
        this.$message.error('名称和API接口不能为空。')
        return
      }
      var doc = {
        name: this.newSite.name,
        site: this.newSite.site
      }
      iptv.add(doc).then(res => {
        this.newSite = {
          name: '',
          site: ''
        }
        this.$message.success('添加新源成功！')
        this.getAllIptv()
      })
    },
    listUpdatedEvent () {
      iptv.clear().then(res1 => {
        // 重新排序
        var id = 1
        this.iptv.forEach(element => {
          element.id = id
          iptv.add(element)
          id += 1
        })
      })
    },
    getAllIptv () {
      iptv.all().then(res => {
        this.iptv = res
      })
    }
  },
  created () {
    this.getAllIptv()
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
