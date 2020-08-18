<template>
  <div class="history">
    <div class="body zy-scroll">
      <div class="zy-table">
        <div class="tHeader">
          <span class="btn" @click="clearAllHistory">清空</span>
        </div>
        <div class="tBody zy-scroll">
          <ul>
            <li v-show="this.history.length === 0">无数据</li>
            <li v-for="(i, j) in history" :key="j" @click="historyItemEvent(i)">
              <span class="name" @click.stop="playEvent(i)">{{i.name}}</span>
              <span class="site">{{getSiteName(i.site)}}</span>
              <span class="index">第{{i.index+1}}集</span>
              <span class="operate" style="width: 220px">
                <span class="btn" @click.stop="playEvent(i)">播放</span>
                <span class="btn" @click.stop="downloadEvent(i)">下载</span>
                <span class="btn" @click.stop="removeHistoryItem(i)">删除</span>
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
import { history, sites } from '../lib/dexie'
import zy from '../lib/site/tools'
const { clipboard } = require('electron')
export default {
  name: 'history',
  data () {
    return {
      history: history,
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
    downloadEvent (e) {
      zy.download(e.site, e.ids).then(res => {
        if (res) {
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
          const list = [...this.m3u8List]
          let downloadUrl = ''
          for (const i of list) {
            const url = encodeURI(i.split('$')[1])
            downloadUrl += (url + '\n')
          }
          clipboard.writeText(downloadUrl)
          this.$message.success('『M3U8』格式的链接已复制, 快去下载吧!')
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
    historyItemEvent (e) {
      this.video = {
        key: e.site,
        info: {
          id: e.ids,
          name: e.name,
          type: e.type,
          year: e.year,
          index: e.index,
          time: e.time
        }
      }
    },
    removeHistoryItem (e) {
      history.remove(e.id).then(res => {
        this.getAllhistory()
      }).catch(err => {
        this.$message.warning('删除历史记录失败, 错误信息: ' + err)
      })
    }
  },
  created () {
    this.getAllhistory()
  }
}
</script>
<style lang="scss" scoped>
.history{
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
