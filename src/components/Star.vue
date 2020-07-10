<template>
  <div class="star">
    <div class="body zy-scroll">
      <div class="zy-table">
        <div class="tBody">
          <ul>
            <li v-for="(i, j) in list" :key="j" @click="detailEvent(i)">
              <span class="name">{{i.name}}</span>
              <span class="type">{{i.type}}</span>
              <span class="time">{{i.year}}</span>
              <span class="from">{{i.site}}</span>
              <span class="operate" style="width: 220px">
                <span class="btn" @click.stop="playEvent(i)">播放</span>
                <span class="btn" @click.stop="deleteEvent(i)">删除</span>
                <span class="btn" @click.stop="shareEvent(i)">分享</span>
                <span class="btn" @click.stop="updateEvent(i)">同步</span>
                <span class="btn" @click.stop="downloadEvent(i)">下载</span>
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
import { star, history } from '../lib/dexie'
import zy from '../lib/site/tools'
const { clipboard } = require('electron')
export default {
  name: 'star',
  data () {
    return {
      list: []
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
      this.getStarList()
    }
  },
  methods: {
    ...mapMutations(['SET_VIEW', 'SET_DETAIL', 'SET_VIDEO', 'SET_SHARE']),
    detailEvent (e) {
      this.detail = {
        show: true,
        key: e.site,
        info: e
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
    deleteEvent (e) {
      star.remove(e.id).then(res => {
        if (res) {
          this.$message.warning('删除失败')
        } else {
          this.$message.success('删除成功')
        }
        this.getStarList()
      })
    },
    shareEvent (e) {
      this.share = {
        show: true,
        key: e.site,
        info: e
      }
    },
    updateEvent (e) {
      zy.detail(e.site, e.ids).then(res => {
        if (e.last === res.last) {
          this.$message.info('同步成功, 未查询到更新。')
        } else {
          const doc = {
            id: e.id,
            ids: res.id,
            last: res.last,
            name: res.name,
            site: e.site,
            type: res.type,
            year: res.year
          }
          star.update(e.id, doc).then(res => {
            this.$message.success('同步成功, 检查到更新.')
          })
        }
      }).catch(err => {
        this.$message.warning('同步失败, 请重试', err)
      })
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
    getStarList () {
      star.all().then(res => {
        this.list = res.reverse()
      })
    }
  },
  created () {
    this.getStarList()
  }
}
</script>
<style lang="scss" scoped>
.star{
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
    overflow: auto;
  }
}
</style>
