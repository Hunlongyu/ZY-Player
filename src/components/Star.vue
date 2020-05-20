<template>
  <div class="star">
    <div class="zy-table">
      <div class="tHead">
        <span class="name">{{$t('videoName')}}</span>
        <span class="type">{{$t('type')}}</span>
        <span class="time">{{$t('time')}}</span>
        <span class="from">{{$t('from')}}</span>
        <span class="operate" style="width: 220px">{{$t('operate')}}</span>
      </div>
      <div class="tBody zy-scroll">
        <ul v-show="!loading">
          <li v-for="(i, j) in data" :key="j" @click="detailEvent(i)">
            <span class="name">{{i.name}}</span>
            <span class="type">{{i.type}}</span>
            <span class="time">{{i.time}}</span>
            <span class="from">{{i.site | ftSite}}</span>
            <span class="operate" style="width: 220px">
              <span class="btn" @click.stop="playEvent(i)">{{$t('play')}}</span>
              <span class="btn" @click.stop="deleteEvent(i)">{{$t('delete')}}</span>
              <span class="btn" @click.stop="shareEvent(i)">{{$t('share')}}</span>
              <span class="btn" @click.stop="updateEvent(i)">{{$t('sync')}}</span>
              <span class="btn" @click.stop="downloadEvent(i)">{{$t('download')}}</span>
            </span>
          </li>
        </ul>
        <div class="tBody-mask" v-show="loading">
          <div class="loader"></div>
        </div>
      </div>
      <div class="tFooter">
        <span class="tFooter-span">{{data.length}} {{$t('total')}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import tools from '../lib/site/tools'
import video from '../lib/dexie/video'
import { sites, getSite } from '../lib/site/sites'
const { clipboard } = require('electron')
export default {
  name: 'star',
  data () {
    return {
      sites: sites,
      data: [],
      loading: true,
      checkFlag: false
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
    detail: {
      get () {
        return this.$store.getters.getDetail
      },
      set (val) {
        this.SET_DETAIL(val)
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
    share: {
      get () {
        return this.$store.getters.getShare
      },
      set (val) {
        this.SET_SHARE(val)
      }
    }
  },
  filters: {
    ftSite (e) {
      const name = getSite(e).name
      return name
    }
  },
  watch: {
    view () {
      this.getAllStar()
    }
  },
  methods: {
    ...mapMutations(['SET_VIEW', 'SET_DETAIL', 'SET_VIDEO', 'SET_SHARE']),
    detailEvent (e) {
      this.detail = {
        show: true,
        v: e
      }
    },
    playEvent (e) {
      this.video = e
      this.view = 'Play'
    },
    deleteEvent (e) {
      video.remove(e.id).then(res => {
        if (res) {
          this.$m.warning(this.$t('delete_failed'))
        } else {
          this.$m.success(this.$t('delete_success'))
        }
        this.getAllStar()
      })
    },
    shareEvent (e) {
      this.share = {
        show: true,
        v: e
      }
    },
    updateEvent (e) {
      tools.detail_get(e.site, e.detail).then(res => {
        const nameOne = e.name.replace(/\s*/g, '')
        const nameTwo = res.name.replace(/\s*/g, '')
        if (nameOne === nameTwo) {
          this.$m.info(this.$t('async_failed'))
        } else {
          const h = e
          h.name = res.name
          video.update(h.id, h).then(res => {
            this.$m.success(this.$t('async_success'))
          })
        }
      })
    },
    downloadEvent (e) {
      tools.detail_get(e.site, e.detail).then(res => {
        if (res.mp4_urls.length > 0) {
          const urls = [...res.mp4_urls]
          let txt = `${e.name}\n`
          for (const i of urls) {
            const name = i.split('$')[0]
            const url = encodeURI(i.split('$')[1])
            txt += (name + ': ' + url + '\n')
          }
          clipboard.writeText(txt)
          this.$m.success('〖MP4〗: ' + this.$t('copy_success'))
          return false
        }
        if (res.m3u8_urls.length > 0) {
          const urls = [...res.m3u8_urls]
          let txt = `${e.name}\n`
          for (const i of urls) {
            const name = i.split('$')[0]
            const url = encodeURI(i.split('$')[1])
            txt += (name + ': ' + url + '\n')
          }
          clipboard.writeText(txt)
          this.$m.success('〖M3U8〗: ' + this.$t('copy_success'))
        }
      })
    },
    getAllStar () {
      video.all().then(res => {
        this.data = res.reverse()
        this.loading = false
      })
    }
  },
  created () {
    this.getAllStar()
  }
}
</script>
<style lang="scss" scoped>
.star{
  height: calc(100% - 40px);
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
}
</style>
