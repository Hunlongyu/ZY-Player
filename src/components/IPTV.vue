<template>
  <div class="iptv">
    <div class="body zy-scroll">
      <div class="zy-table">
        <div class="tBody zy-scroll">
          <ul>
            <li v-for="(i, j) in iptv" :key="j" @click="playEvent(i)">
              <span class="name">{{i.name}}</span>
              <span class="operate">
                <span class="btn" @click.stop="playEvent(i)">播放</span>
                <span class="btn" @click.stop="deleteEvent(i)">删除</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { iptv } from '../lib/dexie'
export default {
  name: 'iptv',
  data () {
    return {
      iptv: []
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
    deleteEvent (e) {
      iptv.remove(e.id).then(res => {
        this.getAllIptv()
      }).catch(err => {
        this.$message.warning('删除频道失败, 错误信息: ' + err)
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
.iptv{
  position: relative;
  height: calc(100% - 40px);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  .body{
    width: 100%;
    height: 100%;
  }
}
</style>
