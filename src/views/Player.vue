<template>
  <Row class="player">
    <div class="title">{{ video.name }} -- {{ info }}</div>
    <div class="playerBox" id="xg"></div>
    <div class="list">
      <Button v-for="(i, j) in video.urls" :key="j" @click="playBtn(i, j, video)">{{i | ftLink}}</Button>
    </div>
  </Row>
</template>
<script>
import 'xgplayer'
import Hls from 'xgplayer-hls.js'
import zy from '@/lib/util.zy'
// import haku from '@/lib/util.666zy'
export default {
  name: 'player',
  data () {
    return {
      data: {},
      url: null,
      xg: null,
      info: '',
      config: {
        id: 'xg',
        url: null,
        fluid: true,
        autoplay: true,
        keyShortcut: 'on',
        defaultPlaybackRate: 1,
        playbackRate: [0.5, 0.75, 1, 1.5, 2]
      }
    }
  },
  filters: {
    ftLink (e) {
      let name = e.split('$')[0]
      return name
    }
  },
  computed: {
    video () {
      return this.$store.getters.getVideo
    }
  },
  methods: {
    init () {
      if (this.video.check) {
        let url = this.video.urls[this.video.index].split('$')[1]
        this.info = this.video.urls[this.video.index].split('$')[0]
        this.$nextTick(() => {
          this.playEvent(url)
        })
      } else {
        this.getDetail()
      }
    },
    async getDetail () {
      let d = this.video.detail
      let index = this.video.index
      this.data = await zy.detail(d)
      let urls = this.data.urls
      this.video.urls = urls
      this.video.check = true
      let playUrl = urls[index].split('$')[1]
      this.info = urls[index].split('$')[0]
      this.$nextTick(() => {
        this.playEvent(playUrl)
      })
    },
    playEvent (e) {
      this.config.url = e
      this.xg = new Hls(this.config)
    },
    playBtn (i, j, e) {
      this.video.index = j
      let url = this.video.urls[this.video.index].split('$')[1]
      this.info = this.video.urls[this.video.index].split('$')[0]
      this.xg.src = url
    }
  },
  created () {
    this.init()
  },
  destroyed () {
    this.xg.destroy()
  }
}
</script>
<style lang="scss" scoped>
.player{
  padding: 10px;
  .title{
    margin-bottom: 8px;
    font-size: 18px;
  }
  .playerBox{
    width: 100%;
    max-width: 600px;
  }
  .list{
    margin-top: 10px;
    button{
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
}
</style>
